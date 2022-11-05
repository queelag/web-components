import { css, CSSResultGroup, html, LitElement } from 'lit'
import '../../../../src/elements/input/switch.element'

export default class Switch extends LitElement {
  protected render(): unknown {
    return html`
      <q-switch>
        <div class="slider">
          <div class="thumb"></div>
        </div>
      </q-switch>
    `
  }

  static styles?: CSSResultGroup | undefined = css`
    * {
      box-sizing: border-box;
    }

    q-switch {
      width: 64px;
      height: 32px;
    }

    q-switch div.slider {
      width: 100%;
      padding: 1px;

      border: 1px solid gray;
      border-radius: 64px;
    }

    q-switch div.thumb {
      width: 50%;
      height: 100%;

      border-radius: 64px;
      background: lightgray;
    }

    q-switch[on] div.thumb {
      transform: translateX(100%);
      background: green;
    }
  `
}

customElements.define('my-switch', Switch)
