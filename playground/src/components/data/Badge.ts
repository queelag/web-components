import { defineCustomElement } from '@aracna/web'
import { css, CSSResultGroup, html, LitElement } from 'lit'
import '../../../../src/elements/data/avatar.element'
import '../../../../src/elements/data/badge.element'

export default class Badge extends LitElement {
  protected render(): unknown {
    return html`
      <aracna-avatar background="lightgray" shape="square" shape-square-radius="4" size="32">JD</aracna-avatar>
      <aracna-badge background="red" shape="circle" size="14" value="7"></aracna-badge>
    `
  }

  static styles?: CSSResultGroup | undefined = css`
    * {
      box-sizing: border-box;
    }

    :host {
      position: relative;
    }

    aracna-avatar {
      font-size: 12px;
      font-weight: 500;
    }

    aracna-badge {
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

defineCustomElement('my-badge', Badge)
