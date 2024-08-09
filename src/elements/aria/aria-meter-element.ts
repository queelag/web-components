import { defineCustomElement } from '@aracna/web'
import type { PropertyDeclarations } from 'lit'
import { AriaMeterController } from '../../controllers/aria-meter-controller.js'
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
    native: { type: Boolean, reflect: true },
    value: { type: Number, reflect: true }
  }
}

defineCustomElement('aracna-aria-meter', AriaMeterElement)

export { AriaMeterElement as AracnaAriaMeterElement }
