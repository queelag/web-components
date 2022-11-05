import { css, CSSResultGroup, html, LitElement } from 'lit'
import '../../../../src/elements/feedback/alert.element'

export default class Alert extends LitElement {
  protected render(): unknown {
    return html` <q-alert>Alert</q-alert> `
  }

  static styles?: CSSResultGroup | undefined = css`
    * {
      box-sizing: border-box;
    }

    q-alert {
      width: 256px;

      padding: 4px 8px;
      background: blue;
      color: white;

      border-radius: 4px;

      font-size: 12px;
      font-weight: 500;
    }
  `
}

customElements.define('my-alert', Alert)
