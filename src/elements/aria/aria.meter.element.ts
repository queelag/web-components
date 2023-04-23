import { getLimitedNumber } from '@aracna/core'
import { AriaMeterElementEventMap, DEFAULT_METER_MAX, DEFAULT_METER_MIN, DEFAULT_METER_VALUE, defineCustomElement } from '@aracna/web'
import { PropertyDeclarations } from 'lit'
import { AriaMeterController } from '../../controllers/aria.meter.controller'
import { BaseElement } from '../core/base.element'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-aria-meter': AriaMeterElement
  }
}

export class AriaMeterElement<E extends AriaMeterElementEventMap = AriaMeterElementEventMap> extends BaseElement<E> {
  protected aria: AriaMeterController = new AriaMeterController(this)

  /**
   * PROPERTIES
   */
  max?: number
  min?: number
  native?: boolean

  /**
   * INTERNAL
   */
  protected _value?: number

  get value(): number {
    return getLimitedNumber(this._value ?? DEFAULT_METER_VALUE, this.min ?? DEFAULT_METER_MIN, this.max ?? DEFAULT_METER_MAX)
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
    native: { type: Boolean, reflect: true },
    value: { type: Number, reflect: true }
  }
}

defineCustomElement('aracna-aria-meter', AriaMeterElement)
