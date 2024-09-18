import { defineCustomElement } from '@aracna/web'
import type { PropertyDeclarations } from 'lit'
import { AriaMeterController } from '../../controllers/aria-meter-controller.js'
import { DEFAULT_METER_MAX, DEFAULT_METER_MIN } from '../../definitions/constants.js'
import type { AriaMeterElementEventMap } from '../../definitions/events.js'
import { getMeterElementValue } from '../../utils/meter-element-utils.js'
import { AracnaBaseElement as BaseElement } from '../core/base-element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-aria-meter': AriaMeterElement
  }
}

class AriaMeterElement<E extends AriaMeterElementEventMap = AriaMeterElementEventMap> extends BaseElement<E> {
  protected aria: AriaMeterController = new AriaMeterController(this)

  /**
   * Properties
   */
  /** */
  protected _max?: number
  protected _min?: number

  /**
   * Internals
   */
  /** */
  protected _value?: number

  /**
   * Queries
   */
  /** */
  meterElement?: HTMLMeterElement

  get max(): number {
    return this._max ?? DEFAULT_METER_MAX
  }

  set max(value: number | undefined) {
    let old: number | undefined

    old = this._max
    this._max = value

    this.requestUpdate('max', old)
  }

  get min(): number {
    return this._min ?? DEFAULT_METER_MIN
  }

  set min(value: number | undefined) {
    let old: number | undefined

    old = this._min
    this._min = value

    this.requestUpdate('min', old)
  }

  get value(): number {
    return getMeterElementValue(this._value, { max: this.max, min: this.min })
  }

  set value(value: number | undefined) {
    let old: number | undefined

    old = this._value
    this._value = value

    this.requestUpdate('value', old)
  }

  static properties: PropertyDeclarations = {
    max: { type: Number, reflect: true },
    min: { type: Number, reflect: true },
    value: { type: Number, reflect: true }
  }
}

defineCustomElement('aracna-aria-meter', AriaMeterElement)

export { AriaMeterElement as AracnaAriaMeterElement }
