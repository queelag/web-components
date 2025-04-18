import { getFixedNumber, getLimitedNumber, isArray, isNumberMultipleOf, wf } from '@aracna/core'
import { KeyboardEventKey, defineCustomElement } from '@aracna/web'
import { type CSSResultGroup, type PropertyDeclarations, css } from 'lit'
import { AriaSliderController, AriaSliderThumbController } from '../../controllers/aria-slider-controller.js'
import {
  DEFAULT_SLIDER_DECIMALS,
  DEFAULT_SLIDER_MAX,
  DEFAULT_SLIDER_MIN,
  DEFAULT_SLIDER_MIN_DISTANCE,
  DEFAULT_SLIDER_ORIENTATION,
  DEFAULT_SLIDER_STEP,
  DEFAULT_SLIDER_THUMB_VALUE
} from '../../definitions/constants.js'
import { ElementSlug } from '../../definitions/enums.js'
import type { AriaSliderElementEventMap, AriaSliderThumbElementEventMap } from '../../definitions/events.js'
import type { QueryDeclarations } from '../../definitions/interfaces.js'
import type { Orientation } from '../../definitions/types.js'
import { SliderChangeEvent } from '../../events/slider-change-event.js'
import { SliderThumbMoveEvent } from '../../events/slider-thumb-move-event.js'
import { gkek } from '../../functions/gkek.js'
import { ElementLogger } from '../../loggers/element-logger.js'
import { getSliderThumbElementPercentage, getSliderThumbElementStyleLeft, getSliderThumbElementStyleTop } from '../../utils/slider-element-utils.js'
import { AracnaBaseElement as BaseElement } from '../core/base-element.js'
import { AracnaFormControlElement as FormControlElement } from '../core/form-control-element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-aria-slider': AriaSliderElement
    'aracna-aria-slider-thumb': AriaSliderThumbElement
  }
}

class AriaSliderElement<E extends AriaSliderElementEventMap = AriaSliderElementEventMap> extends FormControlElement<E> {
  protected aria: AriaSliderController = new AriaSliderController(this)

  /**
   * Properties
   */
  /** */
  protected _decimals?: number
  disableSwap?: boolean
  protected _max?: number
  protected _min?: number
  protected _minDistance?: number
  protected _orientation?: Orientation
  protected _step?: number

  /**
   * Queries
   */
  /** */
  inputElement?: HTMLInputElement
  thumbElements!: [AriaSliderThumbElement] | [AriaSliderThumbElement, AriaSliderThumbElement]

  connectedCallback(): void {
    super.connectedCallback()

    if (this.inputElement) {
      return
    }

    this.addEventListener('click', this.onClick)
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()

    if (this.inputElement) {
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
    if (this.inputElement) {
      return
    }

    if (this.disabled || this.readonly) {
      return ElementLogger.warn(this.uid, 'onClick', `The slider is disabled or readonly.`)
    }

    if (this.hasMultipleThumbs) {
      return ElementLogger.verbose(this.uid, 'onClick', `The slider has multiple thumbs.`)
    }

    this.thumbElements[0].setValueByCoordinates(event.clientX, event.clientY)
    ElementLogger.verbose(this.uid, 'onClick', `The value has been set through the coordinates.`, [event.clientX, event.clientY, this.thumbElements[0].value])

    this.thumbElements[0].focus()
    ElementLogger.verbose(this.uid, 'onClick', `The thumb has been focused.`, this.thumbElements[0])

    ElementLogger.verbose(this.uid, 'onClick', `Computing the thumb position.`, this.thumbElements[0])
    this.thumbElements[0].computePosition()
  }

  get slug(): ElementSlug {
    return ElementSlug.ARIA_SLIDER
  }

  get percentage(): number | number[] {
    if (this.hasMultipleThumbs) {
      let value: number[] = [0, 0]

      if (isArray(this.value)) {
        value[0] = this.value[0] ?? this.thumbElements[0]?.defaultValue ?? DEFAULT_SLIDER_THUMB_VALUE
        value[1] = this.value[1] ?? this.thumbElements[1]?.defaultValue ?? DEFAULT_SLIDER_THUMB_VALUE
      }

      return value.map((value: number) =>
        getSliderThumbElementPercentage(value, {
          decimals: this.decimals,
          max: this.max,
          min: this.min
        })
      )
    }

    if (typeof this.value === 'number') {
      return getSliderThumbElementPercentage(this.value, {
        decimals: this.decimals,
        max: this.max,
        min: this.min
      })
    }

    return getSliderThumbElementPercentage(this.thumbElements[0]?.defaultValue ?? DEFAULT_SLIDER_THUMB_VALUE, {
      decimals: this.decimals,
      max: this.max,
      min: this.min
    })
  }

  get decimals(): number {
    return this._decimals ?? DEFAULT_SLIDER_DECIMALS
  }

  set decimals(value: number | undefined) {
    let old: number | undefined

    old = this._decimals
    this._decimals = value

    this.requestUpdate('decimals', old)
  }

  get max(): number {
    return this._max ?? DEFAULT_SLIDER_MAX
  }

  set max(value: number | undefined) {
    let old: number | undefined

    old = this._max
    this._max = value

    this.requestUpdate('max', old)
  }

  get min(): number {
    return this._min ?? DEFAULT_SLIDER_MIN
  }

  set min(value: number | undefined) {
    let old: number | undefined

    old = this._min
    this._min = value

    this.requestUpdate('min', old)
  }

  get minDistance(): number {
    return this._minDistance ?? DEFAULT_SLIDER_MIN_DISTANCE
  }

  set minDistance(value: number | undefined) {
    let old: number | undefined

    old = this._minDistance
    this._minDistance = value

    this.requestUpdate('minDistance', old)
  }

  get orientation(): Orientation {
    return this._orientation ?? DEFAULT_SLIDER_ORIENTATION
  }

  set orientation(value: Orientation | undefined) {
    let old: Orientation | undefined

    old = this._orientation
    this._orientation = value

    this.requestUpdate('orientation', old)
  }

  get step(): number {
    return this._step ?? DEFAULT_SLIDER_STEP
  }

  set step(value: number | undefined) {
    let old: number | undefined

    old = this._step
    this._step = value

    this.requestUpdate('step', old)
  }

  get thumbElementsPercentage(): number[] {
    return this.thumbElements.map((thumb: AriaSliderThumbElement) => thumb.percentage)
  }

  get thumbElementsValue(): number[] {
    return this.thumbElements.map((thumb: AriaSliderThumbElement) => thumb.value ?? thumb.defaultValue ?? DEFAULT_SLIDER_THUMB_VALUE)
  }

  get value(): number | number[] | undefined {
    return super.value
  }

  set value(value: number | number[] | undefined) {
    super.value = value
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

class AriaSliderThumbElement<E extends AriaSliderThumbElementEventMap = AriaSliderThumbElementEventMap> extends BaseElement<E> {
  protected aria: AriaSliderThumbController = new AriaSliderThumbController(this)

  /**
   * Properties
   */
  /** */
  defaultValue?: number
  disableComputePosition?: boolean
  movable?: boolean

  /**
   * Queries
   */
  /** */
  rootElement?: AriaSliderElement

  /**
   * Internals
   */
  /** */
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

  attributeChangedCallback(name: string, _old: string | null, value: string | null): void {
    super.attributeChangedCallback(name, _old, value)

    if (Object.is(_old, value)) {
      return
    }

    if (['default-value', 'value'].includes(name)) {
      wf(() => this.rootElement, 4).then(() => this.computePosition())
    }
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

        break
    }

    if (this.rootElement?.disabled || this.rootElement?.readonly) {
      return ElementLogger.warn(this.uid, 'onKeyDown', `The slider is disabled or readonly.`)
    }

    max = this.rootElement?.max ?? DEFAULT_SLIDER_MAX
    min = this.rootElement?.min ?? DEFAULT_SLIDER_MIN
    step = this.rootElement?.step ?? DEFAULT_SLIDER_STEP
    value = this.value ?? DEFAULT_SLIDER_THUMB_VALUE

    switch (event.key) {
      case KeyboardEventKey.ARROW_LEFT:
      case KeyboardEventKey.ARROW_DOWN:
        ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Decreasing the value.`, [this.value])
        this.setValue(value - step)

        break
      case KeyboardEventKey.ARROW_RIGHT:
      case KeyboardEventKey.ARROW_UP:
        ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Increasing the value.`, [this.value])
        this.setValue(value + step)

        break
      case KeyboardEventKey.PAGE_DOWN:
        ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Decreasing the value.`, [this.value])
        this.setValue(value - step * 10)

        break
      case KeyboardEventKey.PAGE_UP:
        ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Increasing the value.`, [this.value])
        this.setValue(value + step * 10)

        break
      case KeyboardEventKey.HOME:
        ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Setting the value to the min.`, [this.value])
        this.setValue(min)

        break
      case KeyboardEventKey.END:
        ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Setting the value to the max.`, [this.value])
        this.setValue(max)

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
        ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Computing the position.`)
        this.computePosition()

        break
    }
  }

  onMouseDown = (): void => {
    this.onMouseDownOrTouchStart('onMouseDown')

    document.addEventListener('mousemove', this.onMouseMove)
    document.addEventListener('mouseup', this.onMouseUp)

    ElementLogger.verbose(this.uid, 'onMouseDown', `The "mousemove" and "mouseup" listeners have been added.`)
  }

  onTouchStart = (): void => {
    this.onMouseDownOrTouchStart('onTouchStart')
  }

  onTouchMove = (event: TouchEvent): void => {
    if (!event.touches[0]) {
      return
    }

    this.onMouseMoveOrTouchMove('onTouchMove', event.touches[0].clientX, event.touches[0].clientY)
  }

  onTouchEnd = (): void => {
    this.onMouseUpOrTouchEnd('onTouchEnd')
  }

  onMouseDownOrTouchStart = (fn: string): void => {
    if (this.rootElement?.disabled || this.rootElement?.readonly) {
      return ElementLogger.warn(this.uid, fn, `The slider is disabled or readonly.`)
    }

    this.movable = true
    ElementLogger.debug(this.uid, fn, `The thumb has been unlocked.`)
  }

  onMouseMove = (event: MouseEvent): void => {
    this.onMouseMoveOrTouchMove('onMouseMove', event.clientX, event.clientY)
  }

  onMouseUp = (): void => {
    this.onMouseUpOrTouchEnd('onMouseUp')
  }

  onMouseMoveOrTouchMove(fn: string, x: number, y: number): void {
    if (!this.movable) {
      ElementLogger.verbose(this.uid, fn, `The thumb is not movable.`)
      return
    }

    ElementLogger.verbose(this.uid, fn, `Setting the value by the coordinates.`, [x, y])
    this.setValueByCoordinates(x, y)

    ElementLogger.verbose(this.uid, fn, `Computing the position.`)
    this.computePosition()
  }

  onMouseUpOrTouchEnd(fn: string): void {
    if (this.rootElement?.disabled || this.rootElement?.readonly) {
      return ElementLogger.warn(this.uid, fn, `The slider is disabled or readonly.`)
    }

    ElementLogger.verbose(this.uid, fn, `The value has been set.`, [this.value])

    this.movable = false
    ElementLogger.verbose(this.uid, fn, `The thumb has been locked.`)

    document.removeEventListener('mousemove', this.onMouseMove)
    document.removeEventListener('mouseup', this.onMouseUp)

    ElementLogger.verbose(this.uid, fn, `The "mousemove" and "mouseup" listeners have been removed.`)
  }

  computePosition(): void {
    if (this.disableComputePosition) {
      return
    }

    this.style.left = getSliderThumbElementStyleLeft(this.percentage, this.rootElement?.orientation)
    ElementLogger.verbose(this.uid, 'computePosition', `The left style has been set.`, [this.style.left])

    this.style.top = getSliderThumbElementStyleTop(this.percentage, this.rootElement?.orientation)
    ElementLogger.verbose(this.uid, 'computePosition', `The top style has been set.`, [this.style.top])
  }

  setValueByCoordinates(x: number, y: number): void {
    let percentage: number

    percentage = this.getPercentageByCoordinates(x, y)
    if (percentage < 0) return

    ElementLogger.verbose(this.uid, 'setValueByCoordinates', `Setting the value by the percentage.`, [percentage])
    this.setValueByPercentage(percentage)
  }

  setValueByPercentage(percentage: number): void {
    let decimals: number, max: number, min: number, step: number, value: number

    decimals = this.rootElement?.decimals ?? DEFAULT_SLIDER_DECIMALS
    max = this.rootElement?.max ?? DEFAULT_SLIDER_MAX
    min = this.rootElement?.min ?? DEFAULT_SLIDER_MIN
    step = this.rootElement?.step ?? DEFAULT_SLIDER_STEP

    value = getLimitedNumber(getFixedNumber(((max - min) * percentage) / 100 + min, decimals), { min, max })
    if (!isNumberMultipleOf(value * 10 ** decimals, step * 10 ** decimals)) return

    ElementLogger.verbose(this.uid, 'setValueByPercentage', `Setting the value.`, [value])
    this.setValue(value)
  }

  setValue(value: number): void {
    let decimals: number, max: number, min: number, fvalue: number

    decimals = this.rootElement?.decimals ?? DEFAULT_SLIDER_DECIMALS
    max = this.rootElement?.max ?? DEFAULT_SLIDER_MAX
    min = this.rootElement?.min ?? DEFAULT_SLIDER_MIN
    fvalue = getFixedNumber(value, decimals)

    if (this.rootElement?.disableSwap && this.rootElement.hasMultipleThumbs) {
      let pthumb: AriaSliderThumbElement | undefined, nthumb: AriaSliderThumbElement | undefined, mdistance: number

      pthumb = this.rootElement.thumbElements[this.index - 1]
      nthumb = this.rootElement.thumbElements[this.index + 1]
      mdistance = this.rootElement.minDistance

      if (pthumb && fvalue < (pthumb.value ?? pthumb.defaultValue ?? DEFAULT_SLIDER_THUMB_VALUE) + mdistance) {
        return
      }

      if (nthumb && fvalue > (nthumb.value ?? nthumb.defaultValue ?? DEFAULT_SLIDER_THUMB_VALUE) - mdistance) {
        return
      }
    }

    this.value = getLimitedNumber(fvalue, { min, max })

    if (this.rootElement?.hasMultipleThumbs) {
      let array: number[]

      array = isArray(this.rootElement.value) ? this.rootElement.value : []
      array[this.index] = value

      ElementLogger.verbose(this.uid, 'setValue', `Setting the value.`, [this.index, value])
      this.rootElement.setValue(array)
    }

    if (this.rootElement?.hasSingleThumb) {
      ElementLogger.verbose(this.uid, 'setValue', `Setting the value.`)
      this.rootElement.setValue(value)
    }

    ElementLogger.verbose(this.uid, 'setValue', `The value has been set.`, [this.value, this.rootElement?.value])

    if (this.rootElement) {
      ElementLogger.verbose(this.uid, 'setValue', `Touching the slider.`)
      this.rootElement.touch()
    }

    this.dispatchEvent(new SliderThumbMoveEvent(this.value, this.percentage))
    ElementLogger.verbose(this.uid, 'setValue', `The "move" event has been dispatched.`, [this.value, this.percentage])

    if (this.rootElement) {
      this.rootElement.dispatchEvent(new SliderChangeEvent(this.rootElement.value, this.rootElement.percentage))
      ElementLogger.verbose(this.uid, 'setValue', `The "change" event has been dispatched.`, [this.rootElement.value, this.rootElement.percentage])
    }
  }

  getPercentageByCoordinates(x: number, y: number): number {
    let decimals: number, orientation: Orientation, rect: DOMRect, percentage: number

    if (!this.rootElement) {
      return 0
    }

    decimals = this.rootElement.decimals
    orientation = this.rootElement.orientation
    rect = this.rootElement.getBoundingClientRect()

    switch (orientation) {
      case 'horizontal':
        percentage = ((x - rect.left) / rect.width) * 100
        break
      case 'vertical':
        percentage = ((y - rect.top) / rect.height) * 100
        break
    }

    percentage = getLimitedNumber(getFixedNumber(percentage, decimals), {
      min: 0,
      max: 100
    })

    if (orientation === 'vertical') {
      percentage = 100 - percentage
    }

    return percentage
  }

  get index(): number {
    return this.rootElement?.thumbElements.indexOf(this) ?? -1
  }

  get slug(): ElementSlug {
    return ElementSlug.ARIA_SLIDER_THUMB
  }

  get percentage(): number {
    return getSliderThumbElementPercentage(this.value, {
      decimals: this.rootElement?.decimals ?? DEFAULT_SLIDER_DECIMALS,
      max: this.rootElement?.max ?? DEFAULT_SLIDER_MAX,
      min: this.rootElement?.min ?? DEFAULT_SLIDER_MIN
    })
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
    disableComputePosition: {
      type: Boolean,
      attribute: 'disable-compute-position',
      reflect: true
    },
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

export { AriaSliderElement as AracnaAriaSliderElement, AriaSliderThumbElement as AracnaAriaSliderThumbElement }
