import { css, CSSResultGroup, html, LitElement } from 'lit'
import '../../../../src/elements/data/icon.element'
import '../../../../src/elements/input/radio.group.element'

export default class RadioGroup extends LitElement {
  protected render(): unknown {
    return html`
      <q-radio-group className="w-32 flex flex-col gap-1 outline-none">
        <q-radio-button>
          <q-icon
            class="circle"
            fill="none"
            size="14"
            src="https://raw.githubusercontent.com/feathericons/feather/master/icons/circle.svg"
            stroke="black"
            stroke-width="2"
          ></q-icon>
          <q-icon
            class="disc"
            fill="none"
            size="14"
            src="https://raw.githubusercontent.com/feathericons/feather/master/icons/disc.svg"
            stroke="black"
            stroke-width="2"
          ></q-icon>
          <span>Apple</span>
        </q-radio-button>
        <q-radio-button>
          <q-icon
            class="circle"
            fill="none"
            size="14"
            src="https://raw.githubusercontent.com/feathericons/feather/master/icons/circle.svg"
            stroke="black"
            stroke-width="2"
          ></q-icon>
          <q-icon
            class="disc"
            fill="none"
            size="14"
            src="https://raw.githubusercontent.com/feathericons/feather/master/icons/disc.svg"
            stroke="black"
            stroke-width="2"
          ></q-icon>
          <span>Banana</span>
        </q-radio-button>
        <q-radio-button>
          <q-icon
            class="circle"
            fill="none"
            size="14"
            src="https://raw.githubusercontent.com/feathericons/feather/master/icons/circle.svg"
            stroke="black"
            stroke-width="2"
          ></q-icon>
          <q-icon
            class="disc"
            fill="none"
            size="14"
            src="https://raw.githubusercontent.com/feathericons/feather/master/icons/disc.svg"
            stroke="black"
            stroke-width="2"
          ></q-icon>
          <span>Cherry</span>
        </q-radio-button>
      </q-radio-group>
    `
  }

  static styles?: CSSResultGroup | undefined = css`
    * {
      box-sizing: border-box;
    }

    q-radio-group {
      width: 256px;

      display: flex;
      flex-direction: column;
      gap: 4px;

      outline: none;
    }

    q-radio-button {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px;

      border: 1px solid gray;
      border-radius: 4px;
    }

    /* q-radio-button[focused] {
      box-shadow: 0 0 0 1px white, 0 0 0 2px green;
    } */

    q-radio-button span {
      font-size: 12px;
      font-weight: 500;
    }

    q-radio-button[checked] q-icon.circle {
      display: none;
    }

    q-radio-button:not([checked]) q-icon.disc {
      display: none;
    }
  `
}

customElements.define('my-radiogroup', RadioGroup)
