import { css, CSSResultGroup, html, LitElement } from 'lit'
import '../../../../src/elements/data/avatar.element'
import '../../../../src/elements/data/icon.element'
import '../../../../src/elements/data/image.element'

export default class Avatar extends LitElement {
  protected render(): unknown {
    return html`
      <q-avatar background="lightgray" shape="square" shape-square-radius="4" size="32">DS</q-avatar>
      <q-avatar background="lightblue" shape="squircle" size="32">
        <q-icon
          fill="none"
          size="16"
          src="https://raw.githubusercontent.com/feathericons/feather/master/icons/user.svg"
          stroke="white"
          stroke-width="2"
        ></q-icon>
      </q-avatar>
      <q-avatar background="lightgray" shape="circle" size="32">
        <q-image src="https://media.wired.co.uk/photos/60c8730fa81eb7f50b44037e/1:1/w_64,h_64,c_limit/1521-WIRED-Cat.jpeg" lazy></q-image>
      </q-avatar>
    `
  }

  static styles?: CSSResultGroup | undefined = css`
    * {
      box-sizing: border-box;
    }

    :host {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    q-avatar {
      font-size: 12px;
      font-weight: 500;
    }
  `
}

customElements.define('my-avatar', Avatar)
