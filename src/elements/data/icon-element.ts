import { Environment, Fetch, FetchResponse, isStringURL, rvp, sleep, tcp } from '@aracna/core'
import {
  CACHE_ICONS,
  Color,
  DEFAULT_ICON_SANITIZE_CONFIG,
  DEFAULT_ICON_SVG_STRING,
  ElementName,
  IconElementEventMap,
  IconElementSanitizeConfig,
  SVG_NAMESPACE_URI,
  WebElementLogger,
  defineCustomElement,
  getElementStyleCompatibleValue,
  isStringSVG
} from '@aracna/web'
import DOMPurify from 'dompurify'
import { PropertyDeclarations, TemplateResult, html, svg } from 'lit'
import { DirectiveResult } from 'lit-html/directive.js'
import { StyleMapDirective } from 'lit-html/directives/style-map.js'
import { AriaIconController } from '../../controllers/aria-icon-controller.js'
import { ifdef } from '../../directives/if-defined.js'
import { styleMap } from '../../directives/style-map.js'
import { unsafeSVG } from '../../directives/unsafe-svg.js'
import { BaseElement } from '../core/base-element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-icon': IconElement
  }
}

export class IconElement<E extends IconElementEventMap = IconElementEventMap> extends BaseElement<E> {
  protected aria: AriaIconController = new AriaIconController(this)

  /**
   * PROPERTIES
   */
  cache?: boolean
  color?: Color
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

    if (['cache', 'sanitize', 'sanitize-config'].includes(name)) {
      this.generateSVGElement(value ?? undefined)
    }
  }

  async generateSVGElement(src: string | undefined): Promise<void> {
    if (typeof src !== 'string') {
      return
    }

    if (isStringURL(src)) {
      WebElementLogger.verbose(this.uid, 'generateSVGElement', `The src property is an URL, will try to fetch.`, [src])
      return this.fetchSource(src)
    }

    if (isStringSVG(src)) {
      WebElementLogger.verbose(this.uid, 'generateSVGElement', `The src property is a SVG, will try to parse.`, [src])
      return this.parseSVGString(src)
    }

    WebElementLogger.warn(this.uid, 'generateSVGElement', `The value is nor URL nor SVG, falling back to empty SVG.`, [src])
    this.parseSVGString(DEFAULT_ICON_SVG_STRING)
  }

  async fetchSource(src?: string): Promise<void> {
    let cache: string | undefined, response: FetchResponse<string> | Error, text: string | Error

    if (typeof src !== 'string') {
      return
    }

    // if (FETCHING_ICONS.has(src)) {
    //   WebElementLogger.verbose(this.uid, 'fetchSource', `The src is already being fetched, will try again in 100ms.`, [src])
    //   await sleep(100)

    //   return this.fetchSource()
    // }

    cache = CACHE_ICONS.get(src)
    if (this.cache && cache) {
      WebElementLogger.verbose(this.uid, 'fetchSource', `Cached SVG found for this src, will parse.`, [src, cache])
      return this.parseSVGString(cache)
    }

    // FETCHING_ICONS.add(src)
    // WebElementLogger.verbose(this.uid, 'fetchSource', `The src has been marked as fetching.`, [src])

    response = await Fetch.get(src, { parse: false })
    if (response instanceof Error) return
    // if (response instanceof Error) return rvp(() => FETCHING_ICONS.delete(src))

    // FETCHING_ICONS.delete(src)
    // WebElementLogger.verbose(this.uid, 'fetchSource', `The src has been unmarked as fetching.`, [src])

    text = await tcp(() => (response as FetchResponse).text())
    if (text instanceof Error) return rvp(() => CACHE_ICONS.delete(src))

    if (this.cache) {
      CACHE_ICONS.set(src, text)
      WebElementLogger.verbose(this.uid, 'fetchSource', `The icon has been cached.`, [src, text])
    }

    this.parseSVGString(text)
  }

  async parseSVGString(string: string): Promise<void> {
    let sanitized: string | undefined, parser: DOMParser, document: Document, element: SVGSVGElement | null

    /**
     * Fixes SSR
     */
    await sleep(1)

    if (Environment.isWindowNotDefined) {
      return
    }

    if (this.sanitize) {
      sanitized = DOMPurify.sanitize(string, { ...DEFAULT_ICON_SANITIZE_CONFIG, ...this.sanitizeConfig })
      WebElementLogger.verbose(this.uid, 'parseSVGString', `The string has been sanitized.`, [sanitized])
    }

    parser = new DOMParser()
    document = parser.parseFromString(sanitized ?? string, 'text/html')

    element = document.querySelector('svg')
    if (!element) return WebElementLogger.error(this.uid, 'parseSVGString', `Failed to find the svg element.`, document)

    this.svgElement = element
    WebElementLogger.verbose(this.uid, 'parseSVGString', `The svg element has been set.`, this.svgElement)
  }

  render() {
    return html`<svg
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
    </svg>`
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
    strokeLineJoin: { type: String, reflect: true, attribute: 'stroke-linejoin' },
    strokeWidth: { type: String, attribute: 'stroke-width', reflect: true },
    svgElement: { state: true }
  }
}

defineCustomElement('aracna-icon', IconElement)
