import { Fetch, FetchResponse, isStringURL, rvp, tcp } from '@queelag/core'
import {
  CACHE_ICONS,
  Color,
  DEFAULT_ICON_SANITIZE_CONFIG,
  DEFAULT_ICON_SVG_STRING,
  ElementName,
  getElementStyleCompatibleValue,
  IconElementSanitizeConfig,
  isStringSVG,
  SVG_NAMESPACE_URI,
  WebElementLogger
} from '@queelag/web'
import DOMPurify from 'dompurify'
import { html, PropertyDeclarations, svg, TemplateResult } from 'lit'
import { DirectiveResult } from 'lit-html/directive'
import { StyleMapDirective } from 'lit-html/directives/style-map'
import { AriaIconController } from '../controllers/aria.icon.controller'
import { ifdef } from '../directives/if.defined'
import { styleMap } from '../directives/style.map'
import { unsafeSVG } from '../directives/unsafe.svg'
import { BaseElement } from './core/base.element'

declare global {
  interface HTMLElementTagNameMap {
    'q-icon': IconElement
  }
}

export class IconElement extends BaseElement {
  protected aria: AriaIconController = new AriaIconController(this)

  /**
   * PROPERTIES
   */
  cache?: boolean
  color?: Color
  fill?: string
  sanitize?: boolean
  sanitizeConfig?: IconElementSanitizeConfig
  src?: string
  stroke?: string
  strokeWidth?: string

  /**
   * STATES
   */
  private svgElement?: SVGSVGElement

  connectedCallback(): void {
    super.connectedCallback()
    this.generateSVGElement()
  }

  attributeChangedCallback(name: string, _old: string | null, value: string | null): void {
    super.attributeChangedCallback(name, _old, value)

    if (name !== 'src' || Object.is(_old, value)) {
      return
    }

    this.generateSVGElement()
  }

  private async generateSVGElement(): Promise<void> {
    if (typeof this.src !== 'string') {
      return this.parseSVGString(DEFAULT_ICON_SVG_STRING)
    }

    if (isStringURL(this.src)) {
      WebElementLogger.verbose(this.uid, 'generateSVGElement', `The src property is an URL, will try to fetch.`, [this.src])
      return this.fetchSource()
    }

    if (isStringSVG(this.src)) {
      WebElementLogger.verbose(this.uid, 'generateSVGElement', `The src property is a SVG, will try to parse.`, [this.src])
      return this.parseSVGString(this.src)
    }

    WebElementLogger.warn(this.uid, 'generateSVGElement', `The value is nor URL nor SVG, falling back to empty SVG.`, [this.src])
    this.parseSVGString(DEFAULT_ICON_SVG_STRING)
  }

  private async fetchSource(): Promise<void> {
    let cache: string | undefined, response: FetchResponse<string> | Error, text: string | Error

    if (typeof this.src !== 'string') {
      return
    }

    // if (FETCHING_ICONS.has(this.src)) {
    //   WebElementLogger.verbose(this.uid, 'fetchSource', `The src is already being fetched, will try again in 100ms.`, [this.src])
    //   await sleep(100)

    //   return this.fetchSource()
    // }

    cache = CACHE_ICONS.get(this.src)
    if (this.cache && cache) {
      WebElementLogger.verbose(this.uid, 'fetchSource', `Cached SVG found for this src, will parse.`, [this.src, cache])
      return this.parseSVGString(cache)
    }

    // FETCHING_ICONS.add(this.src)
    // WebElementLogger.verbose(this.uid, 'fetchSource', `The src has been marked as fetching.`, [this.src])

    response = await Fetch.get(this.src, { parse: false })
    if (response instanceof Error) return
    // if (response instanceof Error) return rvp(() => FETCHING_ICONS.delete(this.src))

    // FETCHING_ICONS.delete(this.src)
    // WebElementLogger.verbose(this.uid, 'fetchSource', `The src has been unmarked as fetching.`, [this.src])

    text = await tcp(() => (response as FetchResponse).text())
    if (text instanceof Error) return rvp(() => CACHE_ICONS.delete(this.src as string))

    if (this.cache) {
      CACHE_ICONS.set(this.src, text)
      WebElementLogger.verbose(this.uid, 'fetchSource', `The icon has been cached.`, [this.src, text])
    }

    this.parseSVGString(text)
  }

  private parseSVGString(string: string): void {
    let sanitized: string | undefined, parser: DOMParser, document: Document, element: SVGSVGElement | null

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
      stroke-width=${ifdef(this.strokeWidth)}
      style=${this.svgElementStyle}
      viewBox=${this.svgElementViewBox}
      xmlns=${SVG_NAMESPACE_URI}
    >
      ${this.svgElementTemplate}
    </svg>`
  }

  private get svgElementInnerHTML(): string {
    return this.svgElement?.innerHTML || ''
  }

  private get svgElementStyle(): DirectiveResult<typeof StyleMapDirective> {
    return styleMap({
      height: getElementStyleCompatibleValue(this.height || this.size),
      maxHeight: getElementStyleCompatibleValue(this.height || this.size),
      maxWidth: getElementStyleCompatibleValue(this.width || this.size),
      minHeight: getElementStyleCompatibleValue(this.height || this.size),
      minWidth: getElementStyleCompatibleValue(this.width || this.size),
      width: getElementStyleCompatibleValue(this.width || this.size)
    })
  }

  private get svgElementTemplate(): TemplateResult {
    return svg`${unsafeSVG(this.svgElementInnerHTML)}`
  }

  private get svgElementViewBox(): string {
    return this.svgElement?.getAttribute('viewbox') || this.svgElement?.getAttribute('viewBox') || '0 0 0 0'
  }

  get name(): ElementName {
    return ElementName.ICON
  }

  static properties: PropertyDeclarations = {
    cache: { type: Boolean, reflect: true },
    color: { type: String, reflect: true },
    fill: { type: String, reflect: true },
    sanitize: { type: Boolean, reflect: true },
    sanitizeConfig: { type: Object, attribute: 'sanitize-config' },
    src: { type: String, reflect: true },
    stroke: { type: String, reflect: true },
    strokeWidth: { type: String, attribute: 'stroke-width', reflect: true },
    svgElement: { state: true }
  }
}

customElements.define('q-icon', IconElement)
