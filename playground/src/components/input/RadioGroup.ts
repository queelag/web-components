import { defineCustomElement } from '@aracna/web'
import { css, CSSResultGroup, html, LitElement } from 'lit'
import '../../../../src/elements/data/icon.element'
import '../../../../src/elements/input/radio.group.element'

export default class RadioGroup extends LitElement {
  protected render(): unknown {
    return html`
      <aracna-radio-group className="w-32 flex flex-col gap-1 outline-none">
        <aracna-radio-button>
          <aracna-icon
            class="circle"
            fill="none"
            size="14"
            src="https://raw.githubusercontent.com/feathericons/feather/master/icons/circle.svg"
            stroke="black"
            stroke-width="2"
          ></aracna-icon>
          <aracna-icon
            class="disc"
            fill="none"
            size="14"
            src="https://raw.githubusercontent.com/feathericons/feather/master/icons/disc.svg"
            stroke="black"
            stroke-width="2"
          ></aracna-icon>
          <span>Apple</span>
        </aracna-radio-button>
        <aracna-radio-button>
          <aracna-icon
            class="circle"
            fill="none"
            size="14"
            src="https://raw.githubusercontent.com/feathericons/feather/master/icons/circle.svg"
            stroke="black"
            stroke-width="2"
          ></aracna-icon>
          <aracna-icon
            class="disc"
            fill="none"
            size="14"
            src="https://raw.githubusercontent.com/feathericons/feather/master/icons/disc.svg"
            stroke="black"
            stroke-width="2"
          ></aracna-icon>
          <span>Banana</span>
        </aracna-radio-button>
        <aracna-radio-button>
          <aracna-icon
            class="circle"
            fill="none"
            size="14"
            src="https://raw.githubusercontent.com/feathericons/feather/master/icons/circle.svg"
            stroke="black"
            stroke-width="2"
          ></aracna-icon>
          <aracna-icon
            class="disc"
            fill="none"
            size="14"
            src="https://raw.githubusercontent.com/feathericons/feather/master/icons/disc.svg"
            stroke="black"
            stroke-width="2"
          ></aracna-icon>
          <span>Cherry</span>
        </aracna-radio-button>
      </aracna-radio-group>
    `
  }

  static styles?: CSSResultGroup | undefined = css`
    * {
      box-sizing: border-box;
    }

    aracna-radio-group {
      width: 256px;

      display: flex;
      flex-direction: column;
      gap: 4px;

      outline: none;
    }

    aracna-radio-button {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px;

      border: 1px solid gray;
      border-radius: 4px;
    }

    /* aracna-radio-button[focused] {
      box-shadow: 0 0 0 1px white, 0 0 0 2px green;
    } */

    aracna-radio-button span {
      font-size: 12px;
      font-weight: 500;
    }

    aracna-radio-button[checked] aracna-icon.circle {
      display: none;
    }

    aracna-radio-button:not([checked]) aracna-icon.disc {
      display: none;
    }
  `
}

defineCustomElement('my-radiogroup', RadioGroup)
