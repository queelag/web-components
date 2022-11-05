import { css, CSSResultGroup, html, LitElement } from 'lit'
import '../../../../src/elements/data/icon.element'
import '../../../../src/elements/surface/disclosure.element'

export default class Disclosure extends LitElement {
  protected render(): unknown {
    return html`
      <q-disclosure>
        <q-disclosure-section>
          <q-disclosure-button>
            <span>Disclosure Section 1</span>
            <q-icon
              class="down"
              fill="none"
              src="https://raw.githubusercontent.com/feathericons/feather/master/icons/chevron-down.svg"
              size="16"
              stroke="black"
              stroke-width="2"
            ></q-icon>
            <q-icon
              class="up"
              fill="none"
              src="https://raw.githubusercontent.com/feathericons/feather/master/icons/chevron-up.svg"
              size="16"
              stroke="black"
              stroke-width="2"
            ></q-icon>
          </q-disclosure-button>
          <q-disclosure-panel>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</q-disclosure-panel>
        </q-disclosure-section>
        <q-disclosure-section>
          <q-disclosure-button>
            <span>Disclosure Section 2</span>
            <q-icon
              class="down"
              fill="none"
              src="https://raw.githubusercontent.com/feathericons/feather/master/icons/chevron-down.svg"
              size="16"
              stroke="black"
              stroke-width="2"
            ></q-icon>
            <q-icon
              class="up"
              fill="none"
              src="https://raw.githubusercontent.com/feathericons/feather/master/icons/chevron-up.svg"
              size="16"
              stroke="black"
              stroke-width="2"
            ></q-icon>
          </q-disclosure-button>
          <q-disclosure-panel>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</q-disclosure-panel>
        </q-disclosure-section>
        <q-disclosure-section>
          <q-disclosure-button>
            <span>Disclosure Section 3</span>
            <q-icon
              class="down"
              fill="none"
              src="https://raw.githubusercontent.com/feathericons/feather/master/icons/chevron-down.svg"
              size="16"
              stroke="black"
              stroke-width="2"
            ></q-icon>
            <q-icon
              class="up"
              fill="none"
              src="https://raw.githubusercontent.com/feathericons/feather/master/icons/chevron-up.svg"
              size="16"
              stroke="black"
              stroke-width="2"
            ></q-icon>
          </q-disclosure-button>
          <q-disclosure-panel>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</q-disclosure-panel>
        </q-disclosure-section>
      </q-disclosure>
    `
  }

  static styles?: CSSResultGroup | undefined = css`
    * {
      box-sizing: border-box;
    }

    q-disclosure {
      width: 256px;

      display: flex;
      flex-direction: column;

      border: 1px solid gray;
      border-radius: 4px;
    }

    q-disclosure > * + * {
      border-top: 1px solid gray;
    }

    q-disclosure-section {
      display: flex;
      flex-direction: column;
      padding: 8px 0;
      gap: 4px;

      font-size: 12px;
      font-weight: 500;
    }

    q-disclosure-button {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 8px;
    }

    q-disclosure-section[expanded] q-icon.down {
      display: none;
    }

    q-disclosure-section:not([expanded]) q-icon.up {
      display: none;
    }

    q-disclosure-panel {
      padding: 8px;
      padding-bottom: 0;

      border-top: 1px solid lightgray;

      color: gray;
    }

    q-disclosure-section:not([expanded]) q-disclosure-panel {
      display: none;
    }
  `
}

customElements.define('my-disclosure', Disclosure)
