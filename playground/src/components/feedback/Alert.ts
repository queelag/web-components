import { css, CSSResultGroup, html, LitElement } from 'lit'
import '../../../../src/elements/feedback/alert.element'

export default class Alert extends LitElement {
  protected render(): unknown {
    return html` <aracna-alert>Alert</aracna-alert> `
  }

  static styles?: CSSResultGroup | undefined = css`
    * {
      box-sizing: border-box;
    }

    aracna-alert {
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

defineCustomElement('my-alert', Alert)
