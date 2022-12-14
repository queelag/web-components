import { sleep } from '@queelag/core'
import {
  CACHE_IMAGES,
  DEFAULT_IMAGE_SIZE,
  DEFAULT_IMAGE_SRC,
  defineCustomElement,
  ElementName,
  getElementStyleCompatibleValue,
  getImageElementBase64,
  ImageElementCacheType,
  ImageElementCrossOrigin,
  ImageElementEventMap,
  QueryDeclarations,
  WebElementLogger
} from '@queelag/web'
import { PropertyDeclarations } from 'lit'
import { html } from 'lit-html'
import { DirectiveResult } from 'lit-html/directive'
import { StyleMapDirective } from 'lit-html/directives/style-map'
import { ifdef } from '../../directives/if.defined'
import { styleMap } from '../../directives/style.map'
import { BaseElement } from '../core/base.element'

declare global {
  interface HTMLElementTagNameMap {
    'q-image': ImageElement
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
  src?: string

  /**
   * QUERIES
   */
  private imgElement!: HTMLImageElement

  /**
   * STATES
   */
  private imgElementSrc: string = this.placeholder ?? DEFAULT_IMAGE_SRC

  connectedCallback(): void {
    super.connectedCallback()
    this.load()
  }

  attributeChangedCallback(name: string, _old: string | null, value: string | null): void {
    super.attributeChangedCallback(name, _old, value)

    if (name !== 'src' || Object.is(_old, value)) {
      return
    }

    this.load()
  }

  private async load(): Promise<void> {
    let cache: string | undefined

    /**
     * Fixes SSR
     */
    await sleep(1)

    if (typeof this.src !== 'string') {
      return
    }

    // if (FETCHING_IMAGES.has(this.src)) {
    //   await sleep(100)
    //   WebElementLogger.verbose(this.uid, 'load', `The src is already being fetched, will try again in 100ms.`, [this.src])

    //   return this.load()
    // }

    cache = CACHE_IMAGES.get(this.src)
    if (this.cache && cache) {
      this.imgElementSrc = cache
      WebElementLogger.verbose(this.uid, 'load', `Cached base64 found for this image, will use it.`, [this.src, cache])

      return
    }

    // FETCHING_IMAGES.add(this.src)
    // WebElementLogger.verbose(this.uid, 'load', `The src has been marked as fetching.`, [this.src])

    this.imgElementSrc = this.src
    WebElementLogger.verbose(this.uid, 'load', `Loading the src.`, [this.src])
  }

  private onError(event: ErrorEvent): void {
    // FETCHING_IMAGES.delete(this.src)
    // WebElementLogger.verbose(this.uid, 'onError', `The src has been unmarked as fetching.`, [this.src])

    this.imgElementSrc = this.placeholder ?? DEFAULT_IMAGE_SRC
    WebElementLogger.error(this.uid, 'onError', `Falling back to the placeholder image.`, event)
  }

  private onLoad(): void {
    let base64: string

    WebElementLogger.verbose(this.uid, 'onLoad', `The src has been loaded.`, [this.src])

    if (typeof this.src !== 'string') {
      return
    }

    // FETCHING_IMAGES.delete(this.src)
    // WebElementLogger.verbose(this.uid, 'onLoad', `The src has been unmarked as fetching.`, [this.src])

    if (!this.cache) {
      return
    }

    if (this.src === this.placeholder ?? DEFAULT_IMAGE_SRC) {
      return
    }

    base64 = getImageElementBase64(this.imgElement, { quality: this.cacheQuality, type: this.cacheType })
    if (!base64) return WebElementLogger.warn(this.uid, 'onLoad', `The base64 is empty.`, [base64])

    CACHE_IMAGES.set(this.src, base64)
    WebElementLogger.verbose(this.uid, 'onLoad', `The image has been cached.`, [this.src, base64])
  }

  render() {
    return html`
      <img
        alt=${ifdef(this.alt)}
        crossorigin=${ifdef(this.imgElementCrossOrigin)}
        @error=${this.onError}
        @load=${this.onLoad}
        loading=${this.imgElementLoading}
        src=${this.imgElementSrc}
        style=${this.imgElementStyle}
      />
      ${this.shapeHTML}
    `
  }

  private get imgElementCrossOrigin(): ImageElementCrossOrigin | undefined {
    if (this.crossOrigin) {
      return this.crossOrigin
    }

    if (this.cache) {
      return 'anonymous'
    }
  }

  private get imgElementLoading(): 'auto' | 'eager' | 'lazy' {
    if (this.eager) {
      return 'eager'
    }

    if (this.lazy) {
      return 'lazy'
    }

    return 'auto'
  }

  private get imgElementStyle(): DirectiveResult<typeof StyleMapDirective> {
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
}

defineCustomElement('q-image', ImageElement)
