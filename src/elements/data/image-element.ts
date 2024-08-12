import { sleep } from '@aracna/core'
import { CACHE_IMAGES, type CanvasDataURLType, defineCustomElement, getElementStyleCompatibleValue, getImageElementBase64 } from '@aracna/web'
import { css, type CSSResultGroup, html, type PropertyDeclarations } from 'lit'
import type { DirectiveResult } from 'lit/directive.js'
import type { StyleMapDirective } from 'lit/directives/style-map.js'
import { DEFAULT_IMAGE_SIZE, DEFAULT_IMAGE_SRC, FETCHING_IMAGES } from '../../definitions/constants.js'
import { ElementName } from '../../definitions/enums.js'
import type { ImageElementEventMap } from '../../definitions/events.js'
import type { QueryDeclarations } from '../../definitions/interfaces.js'
import type { ImageElementCrossOrigin } from '../../definitions/types.js'
import { ifdef } from '../../directives/if-defined.js'
import { styleMap } from '../../directives/style-map.js'
import { ImageLoadErrorEvent } from '../../events/image-load-error-event.js'
import { ImageLoadEvent } from '../../events/image-load-event.js'
import { ElementLogger } from '../../loggers/element-logger.js'
import { AracnaBaseElement as BaseElement } from '../core/base-element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-image': ImageElement
  }
}

class ImageElement<E extends ImageElementEventMap = ImageElementEventMap> extends BaseElement<E> {
  /**
   * Properties
   */
  /** */
  alt?: string
  cache?: boolean
  cacheQuality?: number
  cacheType?: CanvasDataURLType
  crossOrigin?: ImageElementCrossOrigin
  eager?: boolean
  lazy?: boolean

  /**
   * Queries
   */
  /** */
  imgElement!: HTMLImageElement

  /**
   * Internals
   */
  /** */
  protected _placeholder?: string
  protected _src?: string

  /**
   * States
   */
  /** */
  imgElementSrc: string = this.placeholder

  connectedCallback(): void {
    super.connectedCallback()

    ElementLogger.verbose(this.uid, 'connectedCallback', `Loading.`, [this.src])
    this.load(this.src)
  }

  attributeChangedCallback(name: string, _old: string | null, value: string | null): void {
    super.attributeChangedCallback(name, _old, value)

    if (Object.is(_old, value)) {
      return
    }

    if (['cache-quality', 'cache-type'].includes(name) && typeof this.src === 'string') {
      CACHE_IMAGES.delete(this.src)
      ElementLogger.verbose(this.uid, 'attributeChangedCallback', `The cache has been deleted.`, [this.src])
    }

    if (['cache', 'cache-quality', 'cache-type'].includes(name)) {
      ElementLogger.verbose(this.uid, 'attributeChangedCallback', `Loading.`, [this.src])
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
      return ElementLogger.warn(this.uid, 'load', `The source is not defined.`, [src])
    }

    if (FETCHING_IMAGES.has(src)) {
      await sleep(100)
      ElementLogger.verbose(this.uid, 'load', `The source is already being fetched, retrying in 100ms.`, [src])

      ElementLogger.verbose(this.uid, 'load', `Retrying to load.`, [src])
      return this.load(src)
    }

    if (this.cache && CACHE_IMAGES.has(src)) {
      cache = CACHE_IMAGES.get(src)
      ElementLogger.verbose(this.uid, 'load', `Cache found.`, [src, cache])
    }

    if (typeof cache === 'undefined') {
      FETCHING_IMAGES.add(src)
      ElementLogger.verbose(this.uid, 'load', `The source has been marked as fetching.`, [src])
    }

    this.imgElementSrc = cache ?? src
    ElementLogger.verbose(this.uid, 'load', `The image element src has been set.`, [this.imgElementSrc])
  }

  onError(event: ErrorEvent): void {
    ElementLogger.error(this.uid, 'onError', `Failed to load the source.`, [this.src], event)

    if (typeof this.src === 'string') {
      FETCHING_IMAGES.delete(this.src)
      ElementLogger.verbose(this.uid, 'onError', `The source has been unmarked as fetching.`, [this.src])
    }

    this.imgElementSrc = this.placeholder
    ElementLogger.error(this.uid, 'onError', `Falling back to the placeholder image.`, [this.imgElementSrc])

    this.dispatchEvent(new ImageLoadErrorEvent(this.src, event))
  }

  onLoad(): void {
    let base64: string | Error | undefined

    ElementLogger.verbose(this.uid, 'onLoad', `The source has been loaded.`, [this.src])

    if (typeof this.src !== 'string') {
      return ElementLogger.warn(this.uid, 'onLoad', `The source is not defined.`, [this.src])
    }

    FETCHING_IMAGES.delete(this.src)
    ElementLogger.verbose(this.uid, 'onLoad', `The source has been unmarked as fetching.`, [this.src])

    if (this.isCacheable) {
      base64 = getImageElementBase64(this.imgElement, {
        quality: this.cacheQuality,
        type: this.cacheType
      })
      if (base64 instanceof Error || !base64) return ElementLogger.warn(this.uid, 'onLoad', `Failed to get the image base64.`, this.imgElement, [base64])

      CACHE_IMAGES.set(this.src, base64)
      ElementLogger.verbose(this.uid, 'onLoad', `The image has been cached.`, [this.src, base64])

      this.imgElementSrc = base64
      ElementLogger.verbose(this.uid, 'onLoad', `The image element src has been set to the base64.`, [this.imgElementSrc])
    }

    this.dispatchEvent(new ImageLoadEvent(this.src, base64 instanceof Error ? undefined : base64))
    ElementLogger.verbose(this.uid, 'onLoad', `The "image-load" event has been dispatched.`)
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

  get isCacheable(): boolean {
    return typeof this.src === 'string' && this.cache === true && CACHE_IMAGES.has(this.src) === false && this.src !== this.placeholder
  }

  get imgElementCrossOrigin(): ImageElementCrossOrigin | undefined {
    if (this.crossOrigin) {
      return this.crossOrigin
    }

    if (this.cache) {
      return 'anonymous'
    }

    return undefined
  }

  get imgElementLoading(): 'eager' | 'lazy' | undefined {
    if (this.eager) {
      return 'eager'
    }

    if (this.lazy) {
      return 'lazy'
    }

    return undefined
  }

  get imgElementStyle(): DirectiveResult<typeof StyleMapDirective> {
    return styleMap({
      ...this.shapeStyleInfo,
      height: getElementStyleCompatibleValue(this.height ?? this.size ?? DEFAULT_IMAGE_SIZE),
      maxHeight: getElementStyleCompatibleValue(this.height ?? this.size),
      maxWidth: getElementStyleCompatibleValue(this.width ?? this.size),
      minHeight: getElementStyleCompatibleValue(this.height ?? this.size),
      minWidth: getElementStyleCompatibleValue(this.width ?? this.size),
      width: getElementStyleCompatibleValue(this.width ?? this.size ?? DEFAULT_IMAGE_SIZE)
    })
  }

  get name(): ElementName {
    return ElementName.IMAGE
  }

  get placeholder(): string {
    return this._placeholder ?? DEFAULT_IMAGE_SRC
  }

  set placeholder(placeholder: string) {
    let old: string | undefined

    old = this._placeholder
    this._placeholder = placeholder

    this.requestUpdate('placeholder', old)
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

export { ImageElement as AracnaImageElement }
