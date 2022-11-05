import { sleep } from '@queelag/core'
import type { ButtonClickEvent } from '@queelag/web'
import { css, CSSResultGroup, html, LitElement } from 'lit'
import '../../../../src/elements/input/button.element'

export default class Button extends LitElement {
  async onClick(event: ButtonClickEvent): Promise<void> {
    await sleep(1000)
    event.detail?.finalize()
  }

  protected render(): unknown {
    return html`
      <q-button @button-click=${this.onClick} async native>
        <span class="idle">button</span>
        <span class="spinning">spinning</span>
      </q-button>
    `
  }

  static styles?: CSSResultGroup | undefined = css`
    q-button[spinning] span.idle {
      display: none;
    }

    q-button:not([spinning]) span.spinning {
      display: none;
    }
  `
}

customElements.define('my-button', Button)
