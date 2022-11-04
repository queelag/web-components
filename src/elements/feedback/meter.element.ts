import { getNumberPercentage } from '@queelag/core'
import { DEFAULT_METER_MAX, DEFAULT_METER_MIN, StateChangeEvent, WebElementLogger } from '@queelag/web'
import { PropertyDeclarations } from 'lit'
import { html } from 'lit-html'
import { ifdef } from '../../directives/if.defined'
import { AriaMeterElement } from '../aria/aria.meter.element'

declare global {
  interface HTMLElementTagNameMap {
    'q-meter': MeterElement
  }
}

export class MeterElement extends AriaMeterElement {
  /**
   * PROPERTIES
   */
  low?: number
  high?: number
  optimum?: number
  percentage?: number
  round?: boolean

  attributeChangedCallback(name: string, _old: string | null, value: string | null) {
    super.attributeChangedCallback(name, _old, value)

    if (Object.is(_old, value)) {
      return
    }

    switch (name) {
      case 'max':
      case 'min':
      case 'value':
        let old: number | undefined = this.percentage

        this.percentage = getNumberPercentage(this.value, this.min ?? DEFAULT_METER_MIN, this.max ?? DEFAULT_METER_MAX, this.round)
        WebElementLogger.verbose(this.uid, 'attributeChangedCallback', `The percentage has been calculated.`)

        this.dispatchEvent(new StateChangeEvent('percentage', old, this.percentage))
        WebElementLogger.verbose(this.uid, 'attributeChangedCallback', `The state change event has been dispatched for the percentage.`)

        break
    }
  }

  render() {
    if (this.native) {
      return html`
        <meter
          min=${ifdef(this.min)}
          max=${ifdef(this.max)}
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

  static properties: PropertyDeclarations = {
    low: { type: Number, reflect: true },
    high: { type: Number, reflect: true },
    optimum: { type: Number, reflect: true },
    percentage: { type: Number, state: true },
    round: { type: Boolean, reflect: true }
  }
}

customElements.define('q-meter', MeterElement)
