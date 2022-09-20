import { getLimitedNumber, getNumberPercentage } from '@queelag/core'
import { PropertyDeclarations } from 'lit'
import { html } from 'lit-html'
import { ifdef } from '../directives/if.defined'
import { BaseElement } from './core/base.element'

declare global {
  interface HTMLElementTagNameMap {
    'q-meter': MeterElement
  }
}

export class MeterElement extends BaseElement {
  /**
   * PROPERTIES
   */
  low?: number
  high?: number
  maximum?: number
  minimum?: number
  native?: boolean
  optimum?: number
  round?: boolean

  /**
   * INTERNAL
   */
  private _value?: number

  render() {
    if (this.native) {
      return html`
        <meter
          min=${ifdef(this.minimum)}
          max=${ifdef(this.maximum)}
          low=${ifdef(this.low)}
          high=${ifdef(this.high)}
          optimum=${ifdef(this.optimum)}
          style=${this.styleMap}
          value=${ifdef(this._value)}
        >
          <slot></slot>
        </meter>
      `
    }

    return html`
      <div style=${this.styleMap}>
        <slot></slot>
      </div>
      ${this.shapeHTML}
    `
  }

  get percentage(): number {
    return getNumberPercentage(this.value || 0, this.minimum, this.maximum, this.round)
  }

  get value(): number {
    return getLimitedNumber(this._value || 0, this.minimum, this.maximum)
  }

  set value(value: number | undefined) {
    let old: number | undefined

    old = this._value
    this._value = value

    this.requestUpdate('value', old)
  }

  static properties: PropertyDeclarations = {
    low: { type: Number, reflect: true },
    high: { type: Number, reflect: true },
    maximum: { type: Number, reflect: true },
    minimum: { type: Number, reflect: true },
    native: { type: Boolean, reflect: true },
    optimum: { type: Number, reflect: true },
    round: { type: Boolean, reflect: true },
    value: { type: Number, reflect: true }
  }
}

customElements.define('q-meter', MeterElement)
