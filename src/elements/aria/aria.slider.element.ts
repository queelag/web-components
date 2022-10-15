import { getLimitedNumber, isNumberMultipleOf, toFixedNumber } from '@queelag/core'
import {
  AriaSliderChangeEvent,
  AriaSliderThumbMoveEvent,
  DEFAULT_SLIDER_DECIMALS,
  DEFAULT_SLIDER_MAX,
  DEFAULT_SLIDER_MIN,
  DEFAULT_SLIDER_MIN_DISTANCE,
  DEFAULT_SLIDER_ORIENTATION,
  DEFAULT_SLIDER_STEP,
  DEFAULT_SLIDER_THUMB_VALUE,
  ElementName,
  getSliderThumbElementPercentage,
  getSliderThumbElementStyleLeft,
  getSliderThumbElementStyleTop,
  KeyboardEventKey,
  Orientation,
  QueryDeclarations,
  WebElementLogger
} from '@queelag/web'
import { css, CSSResultGroup, html, PropertyDeclarations } from 'lit'
import { AriaSliderController, AriaSliderThumbController } from '../../controllers/aria.slider.controller'
import { BaseElement } from '../core/base.element'
import { FormFieldElement } from '../core/form.field.element'

declare global {
  interface HTMLElementTagNameMap {
    'q-aria-slider': AriaSliderElement
    'q-aria-slider-thumb': AriaSliderThumbElement
  }
}

export class AriaSliderElement extends FormFieldElement {
  protected aria: AriaSliderController = new AriaSliderController(this)

  /**
   * PROPERTIES
   */
  decimals?: number
  disableSwap?: boolean
  max?: number
  min?: number
  minDistance?: number
  orientation?: Orientation
  step?: number

  /**
   * QUERIES
   */
  thumbElements!: AriaSliderThumbElement[]

  connectedCallback(): void {
    super.connectedCallback()

    if (this.native) {
      return
    }

    this.addEventListener('click', this.onClick)
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()

    if (this.native) {
      return
    }

    this.removeEventListener('click', this.onClick)
  }

  onClick = (event: MouseEvent): void => {
    if (this.disabled || this.readonly) {
      return WebElementLogger.warn(this.uid, 'onClick', `The slider is disabled or readonly.`)
    }

    if (this.hasMultipleThumbs) {
      return
    }

    this.thumbElements[0].setValueByCoordinates(event.clientX, event.clientY, true)
    WebElementLogger.verbose(this.uid, 'onClick', `The value has been set through the coordinates.`, [
      event.clientX,
      event.clientY,
      this.thumbElements[0].value
    ])

    this.thumbElements[0].focus()
    WebElementLogger.verbose(this.uid, 'onClick', `The thumb has been focused.`)

    this.thumbElements[0].computePosition()

    this.dispatchEvent(new AriaSliderThumbMoveEvent(this.thumbElements[0].value, this.thumbElements[0].percentage))
    this.dispatchEvent(new AriaSliderChangeEvent(this.values, this.percentages))
  }

  get name(): ElementName {
    return ElementName.ARIA_SLIDER
  }

  get percentages(): number[] {
    return this.thumbElements.map((thumb: AriaSliderThumbElement) => thumb.percentage)
  }

  get values(): number[] {
    return this.thumbElements.map((thumb: AriaSliderThumbElement) => thumb.value ?? thumb.defaultValue ?? DEFAULT_SLIDER_THUMB_VALUE)
  }

  get hasSingleThumb(): boolean {
    return this.thumbElements.length === 1
  }

  get hasMultipleThumbs(): boolean {
    return this.thumbElements.length > 1
  }

  get isOrientationHorizontal(): boolean {
    return this.orientation !== 'vertical'
  }

  get isOrientationVertical(): boolean {
    return this.orientation === 'vertical'
  }

  static properties: PropertyDeclarations = {
    decimals: { type: Number, reflect: true },
    disableSwap: { type: Boolean, attribute: 'disable-swap', reflect: true },
    max: { type: Number, reflect: true },
    min: { type: Number, reflect: true },
    minDistance: { type: Number, attribute: 'min-distance', reflect: true },
    orientation: { type: String, reflect: true },
    step: { type: Number, reflect: true }
  }

  static queries: QueryDeclarations = {
    thumbElements: { selector: 'q-aria-slider-thumb', all: true }
  }

  static styles: CSSResultGroup = [
    super.styles,
    css`
      :host {
        position: relative;
      }
    `
  ]
}

export class AriaSliderThumbElement extends BaseElement {
  protected aria: AriaSliderThumbController = new AriaSliderThumbController(this)

  /**
   * PROPERTIES
   */
  defaultValue?: number
  disableComputePosition?: boolean
  movable?: boolean

  /**
   * QUERIES
   */
  rootElement!: AriaSliderElement

  /**
   * INTERNAL
   */
  private _value?: number

  connectedCallback(): void {
    super.connectedCallback()

    this.addEventListener('keydown', this.onKeyDown)
    this.addEventListener('mousedown', this.onMouseDown)
    this.addEventListener('touchend', this.onTouchEnd)
    this.addEventListener('touchmove', this.onTouchMove, { passive: true })
    this.addEventListener('touchstart', this.onTouchStart, { passive: true })
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()

    this.removeEventListener('keydown', this.onKeyDown)
    this.removeEventListener('mousedown', this.onMouseDown)
    this.removeEventListener('touchend', this.onTouchEnd)
    this.removeEventListener('touchmove', this.onTouchMove)
    this.removeEventListener('touchstart', this.onTouchStart)
  }

  onKeyDown = (event: KeyboardEvent): void => {
    switch (event.key) {
      case KeyboardEventKey.ARROW_LEFT:
      case KeyboardEventKey.ARROW_DOWN:
      case KeyboardEventKey.ARROW_RIGHT:
      case KeyboardEventKey.ARROW_UP:
      case KeyboardEventKey.PAGE_DOWN:
      case KeyboardEventKey.PAGE_UP:
      case KeyboardEventKey.HOME:
      case KeyboardEventKey.END:
        event.preventDefault()
        event.stopPropagation()
    }

    if (this.rootElement.disabled || this.rootElement.readonly) {
      return WebElementLogger.warn(this.uid, 'onKeyDown', `The slider is disabled or readonly.`)
    }

    switch (event.key) {
      case KeyboardEventKey.ARROW_LEFT:
      case KeyboardEventKey.ARROW_UP:
        this.value = getLimitedNumber(
          (this.value ?? DEFAULT_SLIDER_THUMB_VALUE) - (this.rootElement.step ?? DEFAULT_SLIDER_STEP),
          this.rootElement.min ?? DEFAULT_SLIDER_MIN,
          this.rootElement.max ?? DEFAULT_SLIDER_MAX
        )
        WebElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_LEFT or ARROW_DOWN', `The value has been decreased.`, [this.value])

        break
      case KeyboardEventKey.ARROW_RIGHT:
      case KeyboardEventKey.ARROW_DOWN:
        this.value = getLimitedNumber(
          (this.value ?? DEFAULT_SLIDER_THUMB_VALUE) + (this.rootElement.step ?? DEFAULT_SLIDER_STEP),
          this.rootElement.min ?? DEFAULT_SLIDER_MIN,
          this.rootElement.max ?? DEFAULT_SLIDER_MAX
        )
        WebElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_RIGHT or ARROW_UP', `The value has been increased.`, [this.value])

        break
      case KeyboardEventKey.PAGE_DOWN:
        this.value = getLimitedNumber(
          (this.value ?? DEFAULT_SLIDER_THUMB_VALUE) - (this.rootElement.step ?? DEFAULT_SLIDER_STEP) * 10,
          this.rootElement.min ?? DEFAULT_SLIDER_MIN,
          this.rootElement.max ?? DEFAULT_SLIDER_MAX
        )
        WebElementLogger.verbose(this.uid, 'onKeyDown', 'PAGE_DOWN', `The value has been decreased.`, [this.value])

        break
      case KeyboardEventKey.PAGE_UP:
        this.value = getLimitedNumber(
          (this.value ?? DEFAULT_SLIDER_THUMB_VALUE) + (this.rootElement.step ?? DEFAULT_SLIDER_STEP) * 10,
          this.rootElement.min ?? DEFAULT_SLIDER_MIN,
          this.rootElement.max ?? DEFAULT_SLIDER_MAX
        )
        WebElementLogger.verbose(this.uid, 'onKeyDown', 'PAGE_UP', `The value has been increased.`, [this.value])

        break
      case KeyboardEventKey.HOME:
        this.value = this.rootElement.min ?? DEFAULT_SLIDER_MIN
        WebElementLogger.verbose(this.uid, 'onKeyDown', 'HOME', `The value has been set to the min.`, [this.value])

        break
      case KeyboardEventKey.END:
        this.value = this.rootElement.max ?? DEFAULT_SLIDER_MAX
        WebElementLogger.verbose(this.uid, 'onKeyDown', 'HOME', `The value has been set to the max.`, [this.value])

        break
    }

    switch (event.key) {
      case KeyboardEventKey.ARROW_LEFT:
      case KeyboardEventKey.ARROW_DOWN:
      case KeyboardEventKey.ARROW_RIGHT:
      case KeyboardEventKey.ARROW_UP:
      case KeyboardEventKey.PAGE_DOWN:
      case KeyboardEventKey.PAGE_UP:
      case KeyboardEventKey.HOME:
      case KeyboardEventKey.END:
        this.computePosition()

        this.dispatchEvent(new AriaSliderThumbMoveEvent(this.value ?? DEFAULT_SLIDER_THUMB_VALUE, this.percentage))
        this.rootElement.dispatchEvent(new AriaSliderChangeEvent(this.rootElement.values, this.rootElement.percentages))
    }
  }

  onMouseDown = (): void => {
    if (this.rootElement.disabled || this.rootElement.readonly) {
      return WebElementLogger.warn(this.uid, 'onMouseDown', `The slider is disabled or readonly.`)
    }

    this.movable = true
    WebElementLogger.verbose(this.uid, 'onMouseDown', `The thumb has been unlocked.`)

    document.addEventListener('mousemove', this.onMouseMove)
    document.addEventListener('mouseup', this.onMouseUp)

    WebElementLogger.verbose(this.uid, 'onMouseDown', `The mousemove and mouseup listeners have been registered.`)
  }

  onTouchStart = (): void => {
    if (this.rootElement.disabled || this.rootElement.readonly) {
      return WebElementLogger.warn(this.uid, 'onTouchStart', `The slider is disabled or readonly.`)
    }

    this.movable = true
    WebElementLogger.debug(this.uid, 'onTouchStart', `The thumb has been unlocked.`)
  }

  onTouchMove = (event: TouchEvent): void => {
    this.onMouseMoveOrTouchMove(event.touches[0].clientX, event.touches[0].clientY)
  }

  onTouchEnd = (): void => {
    this.onMouseUpOrTouchEnd()
  }

  onMouseMove = (event: MouseEvent): void => {
    this.onMouseMoveOrTouchMove(event.clientX, event.clientY)
  }

  onMouseUp = (): void => {
    this.onMouseUpOrTouchEnd()
  }

  onMouseMoveOrTouchMove(x: number, y: number): void {
    if (!this.movable) {
      WebElementLogger.verbose(this.uid, 'onMouseMoveOrTouchMove', `The thumb is not movable.`)
      return
    }

    this.setValueByCoordinates(x, y)
    this.computePosition()

    this.dispatchEvent(new AriaSliderThumbMoveEvent(this.value ?? DEFAULT_SLIDER_THUMB_VALUE, this.percentage))
    this.rootElement.dispatchEvent(new AriaSliderChangeEvent(this.rootElement.values, this.rootElement.percentages))
  }

  onMouseUpOrTouchEnd(): void {
    if (this.rootElement.disabled || this.rootElement.readonly) {
      return WebElementLogger.warn(this.uid, 'onMouseUpOrTouchEnd', `The slider is disabled or readonly.`)
    }

    WebElementLogger.verbose(this.uid, 'onMouseUpOrTouchEnd', `The value has been set.`, [this.value])

    this.movable = false
    WebElementLogger.verbose(this.uid, 'onMouseUpOrTouchEnd', `The thumb has been locked.`)

    document.removeEventListener('mousemove', this.onMouseMove)
    document.removeEventListener('mouseup', this.onMouseUp)

    WebElementLogger.verbose(this.uid, 'onMouseUpOrTouchEnd', `The mousemove and mouseup document listeners have been removed.`)
  }

  computePosition(): void {
    if (this.disableComputePosition) {
      return
    }

    this.style.left = getSliderThumbElementStyleLeft(this.percentage, this.rootElement.orientation)
    this.style.top = getSliderThumbElementStyleTop(this.percentage, this.rootElement.orientation)
  }

  setValueByCoordinates(x: number, y: number, round: boolean = false): void {
    let percentage: number

    percentage = this.getPercentageByCoordinates(x, y, round)
    if (percentage < 0) return

    this.setValueByPercentage(percentage)
  }

  setValueByPercentage(percentage: number): void {
    let decimals: number, max: number, min: number, step: number, value: number

    decimals = this.rootElement.decimals ?? DEFAULT_SLIDER_DECIMALS
    max = this.rootElement.max ?? DEFAULT_SLIDER_MAX
    min = this.rootElement.min ?? DEFAULT_SLIDER_MIN
    step = this.rootElement.step ?? DEFAULT_SLIDER_STEP

    value = getLimitedNumber(toFixedNumber(((max - min) * percentage) / 100 + min, decimals), min, max)
    if (!isNumberMultipleOf(value, step)) return

    this.value = value
  }

  getPercentageByCoordinates(x: number, y: number, round: boolean = false): number {
    let decimals: number, orientation: Orientation, rect: DOMRect, step: number, percentage: number

    decimals = this.rootElement.decimals ?? DEFAULT_SLIDER_DECIMALS
    orientation = this.rootElement.orientation ?? DEFAULT_SLIDER_ORIENTATION
    rect = this.rootElement.getBoundingClientRect()
    step = this.rootElement.step ?? DEFAULT_SLIDER_STEP

    switch (orientation) {
      case 'horizontal':
        percentage = ((x - rect.left) / rect.width) * 100
        break
      case 'vertical':
        percentage = ((y - rect.top) / rect.height) * 100
        break
    }

    percentage = getLimitedNumber(toFixedNumber(percentage, decimals), 0, 100)
    if (!isNumberMultipleOf(percentage, step) && !round) return -1

    if (round) {
      percentage = getLimitedNumber(toFixedNumber(Math[percentage > this.percentage ? 'floor' : 'ceil'](percentage / step) * step, decimals), 0, 100)
    }

    return percentage
  }

  render() {
    return html`
      <div style=${this.styleMap}></div>
      ${this.shapeHTML}
    `
  }

  get index(): number {
    return this.rootElement.thumbElements.indexOf(this)
  }

  get name(): ElementName {
    return ElementName.ARIA_SLIDER_THUMB
  }

  get percentage(): number {
    return getSliderThumbElementPercentage(this.value, this.rootElement.min, this.rootElement.max, this.rootElement.decimals)
  }

  get value(): number | undefined {
    return this._value ?? this.defaultValue
  }

  set value(value: number | undefined) {
    let old: number | undefined

    if (this.rootElement.disableSwap && this.rootElement.hasMultipleThumbs) {
      let pthumb: AriaSliderThumbElement | undefined, nthumb: AriaSliderThumbElement | undefined, svalue: number, mdistance: number

      pthumb = this.rootElement.thumbElements[this.index - 1]
      nthumb = this.rootElement.thumbElements[this.index + 1]
      svalue = value ?? DEFAULT_SLIDER_THUMB_VALUE
      mdistance = this.rootElement.minDistance ?? DEFAULT_SLIDER_MIN_DISTANCE

      if (pthumb && svalue < (pthumb.value ?? Number.MIN_SAFE_INTEGER) + mdistance) {
        return
      }

      if (nthumb && svalue > (nthumb.value ?? Number.MAX_SAFE_INTEGER) - mdistance) {
        return
      }
    }

    old = this._value
    this._value = value

    this.requestUpdate('value', old)
  }

  static properties: PropertyDeclarations = {
    defaultValue: { type: Number, attribute: 'default-value', reflect: true },
    disableComputePosition: { type: Boolean, attribute: 'disable-compute-position', reflect: true },
    movable: { type: Boolean, reflect: true },
    value: { type: Number, reflect: true }
  }

  static queries: QueryDeclarations = {
    rootElement: { selector: 'q-aria-slider', closest: true }
  }

  static styles: CSSResultGroup = [
    super.styles,
    css`
      :host {
        cursor: pointer;
        left: 0;
        position: absolute;
        top: 0;
        touch-action: none;
        user-select: none;
        z-index: 1;
      }

      :host([aria-orientation='horizontal']) {
        transform: translateX(-50%);
      }

      :host([aria-orientation='vertical']) {
        transform: translateY(-50%);
      }

      div {
        display: inline-flex;
        height: 100%;
        width: 100%;
      }
    `
  ]
}

customElements.define('q-aria-slider', AriaSliderElement)
customElements.define('q-aria-slider-thumb', AriaSliderThumbElement)
