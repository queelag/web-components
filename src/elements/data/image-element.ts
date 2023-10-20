import { sleep } from '@aracna/core'
import {
  CACHE_IMAGES,
  DEFAULT_IMAGE_SIZE,
  DEFAULT_IMAGE_SRC,
  defineCustomElement,
  ElementName,
  FETCHING_IMAGES,
  getElementStyleCompatibleValue,
  getImageElementBase64,
  ImageElementCacheType,
  ImageElementCrossOrigin,
  ImageElementEventMap,
  QueryDeclarations,
  WebElementLogger
} from '@aracna/web'
import { css, CSSResultGroup, PropertyDeclarations } from 'lit'
import { html } from 'lit-html'
import { DirectiveResult } from 'lit-html/directive.js'
import { StyleMapDirective } from 'lit-html/directives/style-map.js'
import { ifdef } from '../../directives/if-defined.js'
import { styleMap } from '../../directives/style-map.js'
import { BaseElement } from '../core/base-element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-image': ImageElement
  }
}

export class ImageElement<E extends ImageElementEventMap = ImageElementEventMap> extends BaseElement<E> {
  /**
   * PROPERTIES
   */
  alt?: string
  cache?: boolean
  cacheQuality?: number
  cacheType?: ImageElementCacheType
  crossOrigin?: ImageElementCrossOrigin
  eager?: boolean
  lazy?: boolean
  placeholder?: string

  /**
   * QUERIES
   */
  imgElement!: HTMLImageElement

  /**
   * INTERNAL
   */
  protected _src?: string

  /**
   * STATES
   */
  imgElementSrc: string = this.placeholder ?? DEFAULT_IMAGE_SRC

  connectedCallback(): void {
    super.connectedCallback()
    this.load(this.src)
  }

  attributeChangedCallback(name: string, _old: string | null, value: string | null): void {
    super.attributeChangedCallback(name, _old, value)

    if (Object.is(_old, value)) {
      return
    }

    if (['cache-quality', 'cache-type'].includes(name) && typeof this.src === 'string') {
      CACHE_IMAGES.delete(this.src)
      WebElementLogger.verbose(this.uid, 'attributeChangedCallback', `The image cache has been deleted.`, [this.src])
    }

    if (['cache', 'cache-quality', 'cache-type'].includes(name)) {
      this.load(this.src)
    }
  }

  async load(src: string | undefined): Promise<void> {
    let cache: string | undefined

    /**
     * Fixes SSR
     */
    await sleep(1)

    if (typeof src !== 'string') {
      return
    }

    if (FETCHING_IMAGES.has(src)) {
      await sleep(100)
      WebElementLogger.verbose(this.uid, 'load', `The src is already being fetched, will try again in 100ms.`, [src])

      return this.load(src)
    }

    if (this.cache && CACHE_IMAGES.has(src)) {
      cache = CACHE_IMAGES.get(src)
      WebElementLogger.verbose(this.uid, 'load', `Cached base64 found for this src.`, [src, cache])
    }

    if (typeof cache === 'undefined') {
      FETCHING_IMAGES.add(src)
      WebElementLogger.verbose(this.uid, 'load', `The src has been marked as fetching.`, [src])
    }

    this.imgElementSrc = cache ?? src
    WebElementLogger.verbose(this.uid, 'load', `Loading the src.`, [src])
  }

  onError(event: ErrorEvent): void {
    if (typeof this.src === 'string') {
      FETCHING_IMAGES.delete(this.src)
      WebElementLogger.verbose(this.uid, 'onError', `The src has been unmarked as fetching.`, [this.src])
    }

    this.imgElementSrc = this.placeholder ?? DEFAULT_IMAGE_SRC
    WebElementLogger.error(this.uid, 'onError', `Falling back to the placeholder image.`, event)
  }

  onLoad(): void {
    let base64: string | Error

    WebElementLogger.verbose(this.uid, 'onLoad', `The src has been loaded.`, [this.src])

    if (typeof this.src !== 'string') {
      return
    }

    FETCHING_IMAGES.delete(this.src)
    WebElementLogger.verbose(this.uid, 'onLoad', `The src has been unmarked as fetching.`, [this.src])

    if (!this.cache || CACHE_IMAGES.has(this.src)) {
      return
    }

    if (this.src === this.placeholder ?? DEFAULT_IMAGE_SRC) {
      return
    }

    base64 = getImageElementBase64(this.imgElement, { quality: this.cacheQuality, type: this.cacheType })
    if (base64 instanceof Error || !base64) return WebElementLogger.warn(this.uid, 'onLoad', `Failed to get the image base64 or it is empty.`, [base64])

    CACHE_IMAGES.set(this.src, base64)
    WebElementLogger.verbose(this.uid, 'onLoad', `The image has been cached.`, [this.src, base64])

    this.imgElementSrc = base64
    WebElementLogger.verbose(this.uid, 'onLoad', `The element src has been set to the cached base64.`, [this.src, base64])
  }

  render() {
    return html`
      ${this.styleHTML}
      <img
        alt=${ifdef(this.alt)}
        crossorigin=${ifdef(this.imgElementCrossOrigin)}
        @error=${this.onError}
        @load=${this.onLoad}
        loading=${ifdef(this.imgElementLoading)}
        src=${this.imgElementSrc}
        style=${this.imgElementStyle}
      />
    `
  }

  get imgElementCrossOrigin(): ImageElementCrossOrigin | undefined {
    if (this.crossOrigin) {
      return this.crossOrigin
    }

    if (this.cache) {
      return 'anonymous'
    }
  }

  get imgElementLoading(): 'eager' | 'lazy' | undefined {
    if (this.eager) {
      return 'eager'
    }

    if (this.lazy) {
      return 'lazy'
    }
  }

  get imgElementStyle(): DirectiveResult<typeof StyleMapDirective> {
    return styleMap({
      ...this.shapeStyleInfo,
      height: getElementStyleCompatibleValue(this.height || this.size || DEFAULT_IMAGE_SIZE),
      maxHeight: getElementStyleCompatibleValue(this.height || this.size),
      maxWidth: getElementStyleCompatibleValue(this.width || this.size),
      minHeight: getElementStyleCompatibleValue(this.height || this.size),
      minWidth: getElementStyleCompatibleValue(this.width || this.size),
      width: getElementStyleCompatibleValue(this.width || this.size || DEFAULT_IMAGE_SIZE)
    })
  }

  get name(): ElementName {
    return ElementName.IMAGE
  }

  get src(): string | undefined {
    return this._src
  }

  set src(src: string | undefined) {
    let old: string | undefined

    old = this._src
    this._src = src

    this.requestUpdate('src', old)
    this.load(src)
  }

  static properties: PropertyDeclarations = {
    alt: { type: String, reflect: true },
    cache: { type: Boolean, reflect: true },
    cacheQuality: { type: Number, attribute: 'cache-quality', reflect: true },
    cacheType: { type: String, attribute: 'cache-type', reflect: true },
    crossOrigin: { type: String, attribute: 'cross-origin', reflect: true },
    eager: { type: Boolean, reflect: true },
    imgElementSrc: { type: String, state: true },
    lazy: { type: Boolean, reflect: true },
    placeholder: { type: String, reflect: true },
    src: { type: String, reflect: true }
  }

  static queries: QueryDeclarations = {
    imgElement: { selector: 'img', shadow: true }
  }

  static styles: CSSResultGroup = [
    super.styles,
    css`
      :host {
        overflow: hidden;
      }

      img {
        background: transparent;
      }
    `
  ]
}

defineCustomElement('aracna-image', ImageElement)
