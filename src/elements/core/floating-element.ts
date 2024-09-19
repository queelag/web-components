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
import { FloatingComputePositionEvent } from '../../events/floating-compute-position-event.js'
import { ElementLogger } from '../../loggers/element-logger.js'
import { AracnaBaseElement as BaseElement } from './base-element.js'

class FloatingElement<E extends FloatingElementEventMap = FloatingElementEventMap> extends BaseElement<E> {
  protected _arrowElement?: HTMLElement
  protected _referenceElement?: HTMLElement

  /**
   * Properties
   */
  /** */
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
  /** */
  cleanup?: Function

  connectedCallback(): void {
    super.connectedCallback()
    setImmutableElementAttribute(this, 'floating-element', '')

    ElementLogger.verbose(this.uid, 'connectedCallback', `Computing position.`)
    wf(() => this.referenceElement, 4).then(() => this.computePosition())
  }

  attributeChangedCallback(name: string, _old: string | null, value: string | null): void {
    super.attributeChangedCallback(name, _old, value)

    if (Object.is(_old, value)) {
      return
    }

    ElementLogger.verbose(this.uid, 'attributeChangedCallback', `Computing position.`)
    this.computePosition()
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()

    if (this.cleanup) {
      this.cleanup()
      ElementLogger.verbose(this.uid, 'disconnectedCallback', `Cleaned up.`)
    }
  }

  computePosition = async (): Promise<void> => {
    let position: ComputePositionReturn | Error

    if (!this.referenceElement) {
      return ElementLogger.warn(this.uid, 'computePosition', `The reference element is not defined.`)
    }

    if (this.cleanup) {
      this.cleanup()
      ElementLogger.verbose(this.uid, 'computePosition', `Cleaned up.`)

      this.cleanup = undefined

      return
    }

    position = await tcp(() => computePosition(this.referenceElement as HTMLElement, this, this.computePositionConfig))
    if (position instanceof Error) return

    this.style.left = position.x + 'px'
    this.style.top = position.y + 'px'

    ElementLogger.verbose(this.uid, 'computePosition', `The left and top styles have been set.`, [this.style.left, this.style.top])

    if (this.arrowElement && position.middlewareData.arrow) {
      let side: string | undefined

      this.arrowElement.style.left = position.middlewareData.arrow.x + 'px'
      this.arrowElement.style.top = position.middlewareData.arrow.y + 'px'

      ElementLogger.verbose(this.uid, 'computePosition', `The arrow left and top styles have been set.`, [
        this.arrowElement.style.left,
        this.arrowElement.style.top
      ])

      side = this.getArrowStaticSide(position)

      if (side) {
        this.arrowElement.style[side as any] = '-4px'
        ElementLogger.verbose(this.uid, 'computePosition', `The arrow ${side} style has been set.`, [this.arrowElement.style[side as any]])
      }
    }

    this.cleanup = autoUpdate(this.referenceElement, this, () => rv(this.computePosition), this.autoUpdateOptions)
    ElementLogger.verbose(this.uid, 'computePosition', `The cleanup function has been set.`)

    this.dispatchEvent(new FloatingComputePositionEvent())
    ElementLogger.verbose(this.uid, 'computePosition', `The "floating-compute-position" event has been dispatched.`)
  }

  onSlotChange(): void {
    super.onSlotChange()

    ElementLogger.verbose(this.uid, 'onSlotChange', `Computing position.`)
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
