import { getLimitedNumber, isArray, isNumberMultipleOf, toFixedNumber, wf } from '@aracna/core'
import {
  AriaSliderElementEventMap,
  AriaSliderThumbElementEventMap,
  DEFAULT_SLIDER_DECIMALS,
  DEFAULT_SLIDER_MAX,
  DEFAULT_SLIDER_MIN,
  DEFAULT_SLIDER_MIN_DISTANCE,
  DEFAULT_SLIDER_ORIENTATION,
  DEFAULT_SLIDER_STEP,
  DEFAULT_SLIDER_THUMB_VALUE,
  ElementName,
  KeyboardEventKey,
  Orientation,
  QueryDeclarations,
  SliderChangeEvent,
  SliderThumbMoveEvent,
  WebElementLogger,
  defineCustomElement,
  getSliderThumbElementPercentage,
  getSliderThumbElementStyleLeft,
  getSliderThumbElementStyleTop
} from '@aracna/web'
import { CSSResultGroup, PropertyDeclarations, css } from 'lit'
import { AriaSliderController, AriaSliderThumbController } from '../../controllers/aria-slider-controller.js'
import { BaseElement } from '../core/base-element.js'
import { FormControlElement } from '../core/form-control-element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-aria-slider': AriaSliderElement
    'aracna-aria-slider-thumb': AriaSliderThumbElement
  }
}

export class AriaSliderElement<E extends AriaSliderElementEventMap = AriaSliderElementEventMap> extends FormControlElement<E> {
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
  thumbElements!: [AriaSliderThumbElement] | [AriaSliderThumbElement, AriaSliderThumbElement]

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

  attributeChangedCallback(name: string, _old: string | null, value: string | null): void {
    super.attributeChangedCallback(name, _old, value)

    if (Object.is(_old, value)) {
      return
    }

    if (['decimals', 'max', 'min', 'orientation'].includes(name)) {
      wf(() => this.thumbElements[0], 4).then(() => this.thumbElements[0]?.computePosition())
      wf(() => this.thumbElements[1], 4).then(() => this.thumbElements[1]?.computePosition())
    }
  }

  onClick(event: MouseEvent): void {
    if (this.native) {
      return
    }

    if (this.disabled || this.readonly) {
      return WebElementLogger.warn(this.uid, 'onClick', `The slider is disabled or readonly.`)
    }

    if (this.hasMultipleThumbs) {
      return
    }

    this.thumbElements[0].setValueByCoordinates(event.clientX, event.clientY)
    WebElementLogger.verbose(this.uid, 'onClick', `The value has been set through the coordinates.`, [
      event.clientX,
      event.clientY,
      this.thumbElements[0].value
    ])

    this.thumbElements[0].focus()
    WebElementLogger.verbose(this.uid, 'onClick', `The thumb has been focused.`)

    this.thumbElements[0].computePosition()
  }

  get name(): ElementName {
    return ElementName.ARIA_SLIDER
  }

  get percentage(): number | number[] {
    if (this.hasMultipleThumbs) {
      let value: number[] = [0, 0]

      if (isArray(this.value)) {
        value[0] = this.value[0] ?? this.thumbElements[0]?.defaultValue ?? DEFAULT_SLIDER_THUMB_VALUE
        value[1] = this.value[1] ?? this.thumbElements[1]?.defaultValue ?? DEFAULT_SLIDER_THUMB_VALUE
      }

      return value.map((value: number) => getSliderThumbElementPercentage(value, this.min, this.max, this.decimals))
    }

    if (typeof this.value === 'number') {
      return getSliderThumbElementPercentage(this.value, this.min, this.max, this.decimals)
    }

    return getSliderThumbElementPercentage(this.thumbElements[0]?.defaultValue ?? DEFAULT_SLIDER_THUMB_VALUE, this.min, this.max, this.decimals)
  }

  get value(): number | number[] | undefined {
    return super.value
  }

  set value(value: number | number[] | undefined) {
    super.value = value
  }

  get thumbElementsPercentage(): number[] {
    return this.thumbElements.map((thumb: AriaSliderThumbElement) => thumb.percentage)
  }

  get thumbElementsValue(): number[] {
    return this.thumbElements.map((thumb: AriaSliderThumbElement) => thumb.value ?? thumb.defaultValue ?? DEFAULT_SLIDER_THUMB_VALUE)
  }

  get hasMultipleThumbs(): boolean {
    return this.thumbElements.length > 1
  }

  get hasSingleThumb(): boolean {
    return this.thumbElements.length === 1
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
    thumbElements: { selector: 'aracna-aria-slider-thumb', all: true }
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

export class AriaSliderThumbElement<E extends AriaSliderThumbElementEventMap = AriaSliderThumbElementEventMap> extends BaseElement<E> {
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
  protected _value?: number

  connectedCallback(): void {
    super.connectedCallback()

    this.addEventListener('keydown', this.onKeyDown)
    this.addEventListener('mousedown', this.onMouseDown)
    this.addEventListener('touchend', this.onTouchEnd)
    this.addEventListener('touchmove', this.onTouchMove, { passive: true })
    this.addEventListener('touchstart', this.onTouchStart, { passive: true })

    wf(() => this.rootElement, 4).then(() => this.computePosition())
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()

    this.removeEventListener('keydown', this.onKeyDown)
    this.removeEventListener('mousedown', this.onMouseDown)
    this.removeEventListener('touchend', this.onTouchEnd)
    this.removeEventListener('touchmove', this.onTouchMove)
    this.removeEventListener('touchstart', this.onTouchStart)
  }

  attributeChangedCallback(name: string, _old: string | null, value: string | null): void {
    super.attributeChangedCallback(name, _old, value)

    if (Object.is(_old, value)) {
      return
    }

    if (['default-value', 'value'].includes(name)) {
      wf(() => this.rootElement, 4).then(() => this.computePosition())
    }
  }

  onKeyDown = (event: KeyboardEvent): void => {
    let max: number, min: number, step: number, value: number

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

    max = this.rootElement.max ?? DEFAULT_SLIDER_MAX
    min = this.rootElement.min ?? DEFAULT_SLIDER_MIN
    step = this.rootElement.step ?? DEFAULT_SLIDER_STEP
    value = this.value ?? DEFAULT_SLIDER_THUMB_VALUE

    switch (event.key) {
      case KeyboardEventKey.ARROW_LEFT:
      case KeyboardEventKey.ARROW_DOWN:
        this.setValue(value - step)
        WebElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_LEFT or ARROW_DOWN', `The value has been decreased.`, [this.value])

        break
      case KeyboardEventKey.ARROW_RIGHT:
      case KeyboardEventKey.ARROW_UP:
        this.setValue(value + step)
        WebElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_RIGHT or ARROW_UP', `The value has been increased.`, [this.value])

        break
      case KeyboardEventKey.PAGE_DOWN:
        this.setValue(value - step * 10)
        WebElementLogger.verbose(this.uid, 'onKeyDown', 'PAGE_DOWN', `The value has been decreased.`, [this.value])

        break
      case KeyboardEventKey.PAGE_UP:
        this.setValue(value + step * 10)
        WebElementLogger.verbose(this.uid, 'onKeyDown', 'PAGE_UP', `The value has been increased.`, [this.value])

        break
      case KeyboardEventKey.HOME:
        this.setValue(min)
        WebElementLogger.verbose(this.uid, 'onKeyDown', 'HOME', `The value has been set to the min.`, [this.value])

        break
      case KeyboardEventKey.END:
        this.setValue(max)
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
        break
    }
  }

  onMouseDown = (): void => {
    this.onMouseDownOrTouchStart()

    document.addEventListener('mousemove', this.onMouseMove)
    document.addEventListener('mouseup', this.onMouseUp)

    WebElementLogger.verbose(this.uid, 'onMouseDown', `The mousemove and mouseup listeners have been registered.`)
  }

  onTouchStart = (): void => {
    this.onMouseDownOrTouchStart()
  }

  onTouchMove = (event: TouchEvent): void => {
    if (!event.touches[0]) {
      return
    }

    this.onMouseMoveOrTouchMove(event.touches[0].clientX, event.touches[0].clientY)
  }

  onTouchEnd = (): void => {
    this.onMouseUpOrTouchEnd()
  }

  onMouseDownOrTouchStart = (): void => {
    if (this.rootElement.disabled || this.rootElement.readonly) {
      return WebElementLogger.warn(this.uid, 'onMouseDownOrTouchStart', `The slider is disabled or readonly.`)
    }

    this.movable = true
    WebElementLogger.debug(this.uid, 'onMouseDownOrTouchStart', `The thumb has been unlocked.`)
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

  setValueByCoordinates(x: number, y: number): void {
    let percentage: number

    percentage = this.getPercentageByCoordinates(x, y)
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
    if (!isNumberMultipleOf(value * 10 ** decimals, step * 10 ** decimals)) return

    this.setValue(value)
  }

  setValue(value: number): void {
    let decimals: number, max: number, min: number, fvalue: number

    decimals = this.rootElement.decimals ?? DEFAULT_SLIDER_DECIMALS
    max = this.rootElement.max ?? DEFAULT_SLIDER_MAX
    min = this.rootElement.min ?? DEFAULT_SLIDER_MIN
    fvalue = toFixedNumber(value, decimals)

    if (this.rootElement.disableSwap && this.rootElement.hasMultipleThumbs) {
      let pthumb: AriaSliderThumbElement | undefined, nthumb: AriaSliderThumbElement | undefined, mdistance: number

      pthumb = this.rootElement.thumbElements[this.index - 1]
      nthumb = this.rootElement.thumbElements[this.index + 1]
      mdistance = this.rootElement.minDistance ?? DEFAULT_SLIDER_MIN_DISTANCE

      if (pthumb && fvalue < (pthumb.value ?? pthumb.defaultValue ?? DEFAULT_SLIDER_THUMB_VALUE) + mdistance) {
        return
      }

      if (nthumb && fvalue > (nthumb.value ?? nthumb.defaultValue ?? DEFAULT_SLIDER_THUMB_VALUE) - mdistance) {
        return
      }
    }

    this.value = getLimitedNumber(fvalue, min, max)
    this.dispatchEvent(new SliderThumbMoveEvent(this.value, this.percentage))

    if (this.rootElement.hasMultipleThumbs) {
      this.rootElement.value = isArray(this.rootElement.value) ? this.rootElement.value : []
      this.rootElement.value[this.index] = value
    }

    if (this.rootElement.hasSingleThumb) {
      this.rootElement.value = value
    }

    this.rootElement.dispatchEvent(new SliderChangeEvent(this.rootElement.value, this.rootElement.percentage))
    this.rootElement.touch()
  }

  getPercentageByCoordinates(x: number, y: number): number {
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
    // if (!isNumberMultipleOf(percentage, step)) return -1

    if (orientation === 'vertical') {
      percentage = 100 - percentage
    }

    return percentage
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

    old = this._value
    this._value = value

    this.requestUpdate('value', old)
    this.computePosition()
  }

  static properties: PropertyDeclarations = {
    defaultValue: { type: Number, attribute: 'default-value', reflect: true },
    disableComputePosition: { type: Boolean, attribute: 'disable-compute-position', reflect: true },
    movable: { type: Boolean, reflect: true },
    value: { type: Number, reflect: true }
  }

  static queries: QueryDeclarations = {
    rootElement: { selector: 'aracna-aria-slider', closest: true }
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
    `
  ]
}

defineCustomElement('aracna-aria-slider', AriaSliderElement)
defineCustomElement('aracna-aria-slider-thumb', AriaSliderThumbElement)
