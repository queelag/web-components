import { Fetch, type FetchResponse, isStringURL, isWindowNotDefined, rvp, sleep, tcp } from '@aracna/core'
import { defineCustomElement, getElementStyleCompatibleValue, isStringSVG } from '@aracna/web'
import DOMPurify from 'dompurify'
import { type PropertyDeclarations, type TemplateResult, html, svg } from 'lit'
import type { DirectiveResult } from 'lit/directive.js'
import type { StyleMapDirective } from 'lit/directives/style-map.js'
import { AriaIconController } from '../../controllers/aria-icon-controller.js'
import { CACHE_ICONS, DEFAULT_ICON_SANITIZE_CONFIG, DEFAULT_ICON_SVG_STRING, FETCHING_ICONS, SVG_NAMESPACE_URI } from '../../definitions/constants.js'
import { ElementName } from '../../definitions/enums.js'
import type { IconElementEventMap } from '../../definitions/events.js'
import type { IconElementSanitizeConfig } from '../../definitions/interfaces.js'
import { ifdef } from '../../directives/if-defined.js'
import { styleMap } from '../../directives/style-map.js'
import { unsafeSVG } from '../../directives/unsafe-svg.js'
import { ElementLogger } from '../../loggers/element-logger.js'
import { AracnaBaseElement as BaseElement } from '../core/base-element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-icon': IconElement
  }
}

class IconElement<E extends IconElementEventMap = IconElementEventMap> extends BaseElement<E> {
  protected aria: AriaIconController = new AriaIconController(this)

  /**
   * PROPERTIES
   */
  cache?: boolean
  color?: string
  fill?: string
  sanitize?: boolean
  sanitizeConfig?: IconElementSanitizeConfig
  stroke?: string
  strokeLineCap?: string
  strokeLineJoin?: string
  strokeWidth?: string

  /**
   * INTERNAL
   */
  protected _src?: string

  /**
   * STATES
   */
  svgElement?: SVGSVGElement

  connectedCallback(): void {
    super.connectedCallback()
    this.generateSVGElement(this.src)
  }

  attributeChangedCallback(name: string, _old: string | null, value: string | null): void {
    super.attributeChangedCallback(name, _old, value)

    if (Object.is(_old, value)) {
      return
    }

    if (['sanitize', 'sanitize-config'].includes(name) && typeof this.src === 'string') {
      CACHE_ICONS.delete(this.src)
      ElementLogger.verbose(this.uid, 'attributeChangedCallback', `The icon cache has been deleted.`, [this.src])
    }

    if (['cache', 'sanitize', 'sanitize-config'].includes(name)) {
      this.generateSVGElement(this.src)
    }
  }

  async generateSVGElement(src: string | undefined): Promise<void> {
    if (typeof src !== 'string') {
      return
    }

    if (isStringURL(src)) {
      ElementLogger.verbose(this.uid, 'generateSVGElement', `The src property is an URL, will try to fetch.`, [src])
      return this.fetchSource(src)
    }

    if (isStringSVG(src)) {
      ElementLogger.verbose(this.uid, 'generateSVGElement', `The src property is a SVG, will try to parse.`, [src])
      return this.parseSVGString(src)
    }

    ElementLogger.warn(this.uid, 'generateSVGElement', `The value is nor URL nor SVG, falling back to empty SVG.`, [src])
    this.parseSVGString(DEFAULT_ICON_SVG_STRING)
  }

  async fetchSource(src?: string): Promise<void> {
    let response: FetchResponse<string> | Error, text: string | Error

    if (typeof src !== 'string') {
      return
    }

    if (FETCHING_ICONS.has(src)) {
      ElementLogger.verbose(this.uid, 'fetchSource', `The src is already being fetched, will try again in 100ms.`, [src])
      await sleep(100)

      return this.fetchSource(src)
    }

    if (this.cache && CACHE_ICONS.has(src)) {
      return this.parseSVGString(src)
    }

    FETCHING_ICONS.add(src)
    ElementLogger.verbose(this.uid, 'fetchSource', `The src has been marked as fetching.`, [src])

    response = await Fetch.get(src, { parse: false })
    if (response instanceof Error) return rvp(() => FETCHING_ICONS.delete(src))

    FETCHING_ICONS.delete(src)
    ElementLogger.verbose(this.uid, 'fetchSource', `The src has been unmarked as fetching.`, [src])

    text = await tcp(() => (response as FetchResponse).text())
    if (text instanceof Error) return

    this.parseSVGString(text)
  }

  async parseSVGString(string: string): Promise<void> {
    let cache: string | undefined, sanitized: string | undefined, parser: DOMParser, document: Document, element: SVGSVGElement | null

    /**
     * Fixes SSR
     */
    await sleep(1)

    if (isWindowNotDefined()) {
      return
    }

    if (this.cache && typeof this.src === 'string' && CACHE_ICONS.has(this.src)) {
      cache = CACHE_ICONS.get(this.src)
      ElementLogger.verbose(this.uid, 'parseSVGString', `Cached SVG found for this src.`, [this.src, cache])
    }

    if (this.sanitize) {
      sanitized = DOMPurify.sanitize(string, {
        ...DEFAULT_ICON_SANITIZE_CONFIG,
        ...this.sanitizeConfig
      })
      ElementLogger.verbose(this.uid, 'parseSVGString', `The string has been sanitized.`, [sanitized])
    }

    if (this.cache && typeof this.src === 'string') {
      CACHE_ICONS.set(this.src, sanitized ?? string)
      ElementLogger.verbose(this.uid, 'parseSVGString', `The icon has been cached.`, [this.src, sanitized ?? string])
    }

    parser = new DOMParser()
    document = parser.parseFromString(cache ?? sanitized ?? string, 'text/html')

    element = document.querySelector('svg')
    if (!element) return ElementLogger.error(this.uid, 'parseSVGString', `Failed to find the svg element.`, document)

    this.svgElement = element
    ElementLogger.verbose(this.uid, 'parseSVGString', `The svg element has been set.`, this.svgElement)
  }

  render() {
    return html`
      <svg
        fill=${ifdef(this.fill)}
        stroke=${ifdef(this.stroke)}
        stroke-linecap=${ifdef(this.strokeLineCap)}
        stroke-linejoin=${ifdef(this.strokeLineJoin)}
        stroke-width=${ifdef(this.strokeWidth)}
        style=${this.svgElementStyle}
        viewBox=${ifdef(this.svgElementViewBox)}
        xmlns=${SVG_NAMESPACE_URI}
      >
        ${this.svgElementTemplate}
      </svg>
    `
  }

  get name(): ElementName {
    return ElementName.ICON
  }

  get src(): string | undefined {
    return this._src
  }

  set src(src: string | undefined) {
    let old: string | undefined

    old = this._src
    this._src = src

    this.requestUpdate('src', old)
    this.generateSVGElement(src)
  }

  get svgElementInnerHTML(): string {
    return this.svgElement?.innerHTML ?? ''
  }

  get svgElementStyle(): DirectiveResult<typeof StyleMapDirective> {
    return styleMap({
      height: getElementStyleCompatibleValue(this.height ?? this.size),
      maxHeight: getElementStyleCompatibleValue(this.height ?? this.size),
      maxWidth: getElementStyleCompatibleValue(this.width ?? this.size),
      minHeight: getElementStyleCompatibleValue(this.height ?? this.size),
      minWidth: getElementStyleCompatibleValue(this.width ?? this.size),
      width: getElementStyleCompatibleValue(this.width ?? this.size)
    })
  }

  get svgElementTemplate(): TemplateResult {
    return svg`${unsafeSVG(this.svgElementInnerHTML)}`
  }

  get svgElementViewBox(): string | undefined {
    return this.svgElement?.getAttribute('viewbox') ?? this.svgElement?.getAttribute('viewBox') ?? undefined
  }

  static properties: PropertyDeclarations = {
    cache: { type: Boolean, reflect: true },
    color: { type: String, reflect: true },
    fill: { type: String, reflect: true },
    sanitize: { type: Boolean, reflect: true },
    sanitizeConfig: { type: Object, attribute: 'sanitize-config' },
    src: { type: String, reflect: true },
    stroke: { type: String, reflect: true },
    strokeLineCap: { type: String, reflect: true, attribute: 'stroke-linecap' },
    strokeLineJoin: {
      type: String,
      reflect: true,
      attribute: 'stroke-linejoin'
    },
    strokeWidth: { type: String, attribute: 'stroke-width', reflect: true },
    svgElement: { state: true }
  }
}

defineCustomElement('aracna-icon', IconElement)

export { IconElement as AracnaIconElement }
