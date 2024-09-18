import { wf } from '@aracna/core'
import { defineCustomElement } from '@aracna/web'
import { type PropertyDeclarations } from 'lit'
import type { MeterElementEventMap } from '../../definitions/events.js'
import { QueryDeclarations } from '../../definitions/interfaces.js'
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

  connectedCallback(): void {
    super.connectedCallback()
    wf(() => this.meterElement, 4).then(this.setMeterElementAttributes)
  }

  attributeChangedCallback(name: string, _old: string | null, value: string | null): void {
    super.attributeChangedCallback(name, _old, value)

    if (Object.is(_old, value)) {
      return
    }

    if (['low', 'high', 'max', 'min', 'optimum', 'round'].includes(name)) {
      this.setMeterElementAttributes()
    }
  }

  setMeterElementAttributes = (): void => {
    if (!this.meterElement) {
      return
    }

    if (typeof this.low === 'number') {
      this.meterElement.low = this.low
    }

    if (typeof this.high === 'number') {
      this.meterElement.high = this.high
    }

    this.meterElement.max = this.max
    this.meterElement.min = this.min

    if (typeof this.optimum === 'number') {
      this.meterElement.optimum = this.optimum
    }

    this.meterElement.value = this.value
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

  static queries: QueryDeclarations = {
    meterElement: { selector: 'meter' }
  }
}

defineCustomElement('aracna-meter', MeterElement)

export { MeterElement as AracnaMeterElement }
