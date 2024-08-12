import { defineCustomElement } from '@aracna/web'
import { html, type PropertyDeclarations } from 'lit'
import type { MeterElementEventMap } from '../../definitions/events.js'
import { ifdef } from '../../directives/if-defined.js'
import { getMeterElementPercentage } from '../../utils/meter-element-utils.js'
import { AracnaAriaMeterElement as AriaMeterElement } from '../aria/aria-meter-element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-meter': MeterElement
  }
}

class MeterElement<E extends MeterElementEventMap = MeterElementEventMap> extends AriaMeterElement<E> {
  /**
   * Properties
   */
  /** */
  low?: number
  high?: number
  optimum?: number
  round?: boolean

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

    return super.render()
  }

  get percentage(): number {
    return getMeterElementPercentage(this.value, {
      max: this.max,
      min: this.min,
      round: this.round
    })
  }

  static properties: PropertyDeclarations = {
    low: { type: Number, reflect: true },
    high: { type: Number, reflect: true },
    optimum: { type: Number, reflect: true },
    round: { type: Boolean, reflect: true }
  }
}

defineCustomElement('aracna-meter', MeterElement)

export { MeterElement as AracnaMeterElement }
