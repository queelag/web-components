import { defineCustomElement } from '@aracna/web'
import { css, CSSResultGroup, html, LitElement } from 'lit'
import '../../../../src/elements/input/switch-element'

export default class Switch extends LitElement {
  protected render(): unknown {
    return html`
      <aracna-switch>
        <div class="slider">
          <div class="thumb"></div>
        </div>
      </aracna-switch>
    `
  }

  static styles?: CSSResultGroup | undefined = css`
    * {
      box-sizing: border-box;
    }

    aracna-switch {
      width: 64px;
      height: 32px;
    }

    aracna-switch div.slider {
      width: 100%;
      padding: 1px;

      border: 1px solid gray;
      border-radius: 64px;
    }

    aracna-switch div.thumb {
      width: 50%;
      height: 100%;

      border-radius: 64px;
      background: lightgray;
    }

    aracna-switch[on] div.thumb {
      transform: translateX(100%);
      background: green;
    }
  `
}

defineCustomElement('my-switch', Switch)
