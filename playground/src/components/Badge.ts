import { css, CSSResultGroup, html, LitElement } from 'lit'
import '../../../src/elements/data/avatar.element'
import '../../../src/elements/data/badge.element'

export default class Badge extends LitElement {
  protected render(): unknown {
    return html`
      <q-avatar background="lightgray" shape="square" shape-square-radius="4" size="32">JD</q-avatar>
      <q-badge background="red" shape="circle" size="14" value="7"></q-badge>
    `
  }

  static styles?: CSSResultGroup | undefined = css`
    :host {
      position: relative;
    }

    q-avatar {
      font-size: 12px;
      font-weight: 500;
    }

    q-badge {
      display: flex;
      align-items: center;
      justify-content: center;

      color: white;
      font-size: 8px;
      font-weight: 500;

      position: absolute;
      right: -3px;
      top: -3px;
    }
  `
}

customElements.define('my-badge', Badge)
