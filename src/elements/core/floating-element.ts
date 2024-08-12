import { omitObjectProperties, rv, tcp, wf } from '@aracna/core'
import { setImmutableElementAttribute } from '@aracna/web'
import {
  type AutoUpdateOptions,
  type ComputePositionConfig,
  type ComputePositionReturn,
  type Middleware,
  type Placement,
  type Platform,
  type Strategy,
  arrow,
  autoUpdate,
  computePosition
} from '@floating-ui/dom'
import type { PropertyDeclarations } from 'lit'
import type { FloatingElementEventMap } from '../../definitions/events.js'
import { AracnaBaseElement as BaseElement } from './base-element.js'

class FloatingElement<E extends FloatingElementEventMap = FloatingElementEventMap> extends BaseElement<E> {
  protected _arrowElement?: HTMLElement
  protected _referenceElement?: HTMLElement

  /**
   * Properties
   */
  ancestorScroll?: boolean
  ancestorResize?: boolean
  animationFrame?: boolean
  arrowPadding?: number
  elementResize?: boolean
  middlewares?: Middleware[]
  placement?: Placement
  platform?: Platform
  strategy?: Strategy

  /**
   * Internals
   */
  cleanup?: Function

  connectedCallback(): void {
    super.connectedCallback()
    setImmutableElementAttribute(this, 'floating-element', '')

    wf(() => this.referenceElement, 4).then(() => this.computePosition())
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()

    if (this.cleanup) {
      this.cleanup()
    }
  }

  attributeChangedCallback(name: string, _old: string | null, value: string | null): void {
    super.attributeChangedCallback(name, _old, value)
    this.computePosition()
  }

  computePosition = async (): Promise<void> => {
    let position: ComputePositionReturn | Error

    if (this.cleanup) {
      this.cleanup()
      this.cleanup = undefined

      return
    }

    position = await tcp(() => computePosition(this.referenceElement as HTMLElement, this, this.computePositionConfig))
    if (position instanceof Error) return

    this.style.left = position.x + 'px'
    this.style.top = position.y + 'px'

    if (this.arrowElement && position.middlewareData.arrow) {
      let side: string | undefined

      this.arrowElement.style.left = position.middlewareData.arrow.x + 'px'
      this.arrowElement.style.top = position.middlewareData.arrow.y + 'px'

      side = this.getArrowStaticSide(position)
      if (!side) return

      this.arrowElement.style[side as any] = '-4px'
    }

    if (this.referenceElement) {
      this.cleanup = autoUpdate(this.referenceElement, this, () => rv(this.computePosition), this.autoUpdateOptions)
    }
  }

  onSlotChange(): void {
    super.onSlotChange()
    this.computePosition()
  }

  getArrowStaticSide(position: ComputePositionReturn): string | undefined {
    switch (position.placement.split('-')[0]) {
      case 'bottom':
        return 'top'
      case 'left':
        return 'left'
      case 'right':
        return 'left'
      case 'top':
        return 'bottom'
    }
  }

  get autoUpdateOptions(): Partial<AutoUpdateOptions> {
    let options: Partial<AutoUpdateOptions>

    options = {
      ancestorResize: this.ancestorResize,
      ancestorScroll: this.ancestorScroll,
      animationFrame: this.animationFrame,
      elementResize: this.elementResize
    }

    return omitObjectProperties(options, (_, __, value: unknown) => typeof value === 'undefined')
  }

  get computePositionConfig(): Partial<ComputePositionConfig> {
    let options: Partial<ComputePositionConfig>

    options = {
      middleware: this.middlewares ?? [],
      placement: this.placement,
      platform: this.platform,
      strategy: this.strategy
    }

    if (this.arrowElement) {
      options.middleware = options.middleware ?? []
      options.middleware.push(arrow({ element: this.arrowElement, padding: this.arrowPadding }))
    }

    return omitObjectProperties(options, (_, __, value: unknown) => typeof value === 'undefined')
  }

  get arrowElement(): HTMLElement | undefined {
    return this._arrowElement
  }

  set arrowElement(element: HTMLElement | undefined) {
    this._arrowElement = element
    this.computePosition()
  }

  get referenceElement(): HTMLElement | undefined {
    return this._referenceElement
  }

  set referenceElement(element: HTMLElement | undefined) {
    this._referenceElement = element
    this.computePosition()
  }

  static properties: PropertyDeclarations = {
    ancestorScroll: {
      type: Boolean,
      attribute: 'ancestor-scroll',
      reflect: true
    },
    ancestorResize: {
      type: Boolean,
      attribute: 'ancestor-resize',
      reflect: true
    },
    animationFrame: {
      type: Boolean,
      attribute: 'animation-frame',
      reflect: true
    },
    arrowPadding: { type: Number, attribute: 'arrow-padding', reflect: true },
    elementResize: {
      type: Boolean,
      attribute: 'element-resize',
      reflect: true
    },
    middlewares: { type: Array },
    placement: { type: String, reflect: true },
    platform: { type: Object },
    strategy: { type: String, reflect: true }
  }
}

export { FloatingElement as AracnaFloatingElement }
