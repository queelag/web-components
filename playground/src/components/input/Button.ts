import { sleep } from '@aracna/core'
import type { ButtonClickEvent } from '@aracna/web'
import { defineCustomElement } from '@aracna/web'
import { css, CSSResultGroup, html, LitElement } from 'lit'
import '../../../../src/elements/input/button.element'

export default class Button extends LitElement {
  async onClick(event: ButtonClickEvent): Promise<void> {
    await sleep(1000)
    event.detail?.finalize()
  }

  protected render(): unknown {
    return html`
      <aracna-button @button-click=${this.onClick} async native>
        <span class="idle">button</span>
        <span class="spinning">spinning</span>
      </aracna-button>
    `
  }

  static styles?: CSSResultGroup | undefined = css`
    * {
      box-sizing: border-box;
    }

    aracna-button[spinning] span.idle {
      display: none;
    }

    aracna-button:not([spinning]) span.spinning {
      display: none;
    }
  `
}

defineCustomElement('my-button', Button)
