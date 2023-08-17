import { defineCustomElement } from '@aracna/web'
import { css, CSSResultGroup, html, LitElement } from 'lit'
import '../../../../src/elements/data/icon-element'
import '../../../../src/elements/input/check-box-element'

export default class CheckBox extends LitElement {
  protected render(): unknown {
    return html`
      <aracna-checkbox>
        <div>
          <aracna-icon
            fill="none"
            size="16"
            src="https://raw.githubusercontent.com/feathericons/feather/master/icons/check.svg"
            stroke="black"
            stroke-width="2"
          ></aracna-icon>
        </div>
      </aracna-checkbox>
    `
  }

  static styles?: CSSResultGroup | undefined = css`
    * {
      box-sizing: border-box;
    }

    aracna-checkbox > div {
      width: 24px;
      height: 24px;

      display: flex;
      justify-content: center;
      align-items: center;

      border: 1px solid gray;
      border-radius: 4px;
    }

    aracna-checkbox:not([checked]) aracna-icon {
      opacity: 0;
    }
  `
}

defineCustomElement('my-checkbox', CheckBox)
