import { getNumberPercentage } from '@queelag/core'
import type { StateChangeEvent } from '@queelag/web'
import { css, CSSResultGroup, html, LitElement, PropertyDeclarations } from 'lit'
import '../../../../src/elements/feedback/meter.element'

export default class Meter extends LitElement {
  percentage: number = getNumberPercentage(50, 0, 100)
  value: number = 50

  onStateChange(event: StateChangeEvent<number>): void {
    if (event.detail?.name === 'percentage') {
      this.percentage = event.detail?.value ?? 0
    }
  }

  protected render(): unknown {
    return html`
      <q-meter @state-change=${this.onStateChange} height="16" min="0" max="100" value=${this.value} width="256">
        <div class="background">
          <div class="fill" style="width: ${this.percentage ?? 0}%"></div>
        </div>
      </q-meter>
    `
  }

  static properties: PropertyDeclarations = {
    percentage: { type: Number, state: true },
    value: { type: Number, state: true }
  }

  static styles?: CSSResultGroup | undefined = css`
    * {
      box-sizing: border-box;
    }

    div.background {
      width: 100%;
      height: 100%;

      border-radius: 4px;
      overflow: hidden;
      background: lightgray;
    }

    div.fill {
      height: 100%;
      background: green;
    }
  `
}

customElements.define('my-meter', Meter)
