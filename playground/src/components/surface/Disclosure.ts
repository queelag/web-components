import { css, CSSResultGroup, html, LitElement } from 'lit'
import '../../../../src/elements/data/icon.element'
import '../../../../src/elements/surface/disclosure.element'

export default class Disclosure extends LitElement {
  protected render(): unknown {
    return html`
      <aracna-disclosure>
        <aracna-disclosure-section>
          <aracna-disclosure-button>
            <span>Disclosure Section 1</span>
            <aracna-icon
              class="down"
              fill="none"
              src="https://raw.githubusercontent.com/feathericons/feather/master/icons/chevron-down.svg"
              size="16"
              stroke="black"
              stroke-width="2"
            ></aracna-icon>
            <aracna-icon
              class="up"
              fill="none"
              src="https://raw.githubusercontent.com/feathericons/feather/master/icons/chevron-up.svg"
              size="16"
              stroke="black"
              stroke-width="2"
            ></aracna-icon>
          </aracna-disclosure-button>
          <aracna-disclosure-panel>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</aracna-disclosure-panel>
        </aracna-disclosure-section>
        <aracna-disclosure-section>
          <aracna-disclosure-button>
            <span>Disclosure Section 2</span>
            <aracna-icon
              class="down"
              fill="none"
              src="https://raw.githubusercontent.com/feathericons/feather/master/icons/chevron-down.svg"
              size="16"
              stroke="black"
              stroke-width="2"
            ></aracna-icon>
            <aracna-icon
              class="up"
              fill="none"
              src="https://raw.githubusercontent.com/feathericons/feather/master/icons/chevron-up.svg"
              size="16"
              stroke="black"
              stroke-width="2"
            ></aracna-icon>
          </aracna-disclosure-button>
          <aracna-disclosure-panel>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</aracna-disclosure-panel>
        </aracna-disclosure-section>
        <aracna-disclosure-section>
          <aracna-disclosure-button>
            <span>Disclosure Section 3</span>
            <aracna-icon
              class="down"
              fill="none"
              src="https://raw.githubusercontent.com/feathericons/feather/master/icons/chevron-down.svg"
              size="16"
              stroke="black"
              stroke-width="2"
            ></aracna-icon>
            <aracna-icon
              class="up"
              fill="none"
              src="https://raw.githubusercontent.com/feathericons/feather/master/icons/chevron-up.svg"
              size="16"
              stroke="black"
              stroke-width="2"
            ></aracna-icon>
          </aracna-disclosure-button>
          <aracna-disclosure-panel>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</aracna-disclosure-panel>
        </aracna-disclosure-section>
      </aracna-disclosure>
    `
  }

  static styles?: CSSResultGroup | undefined = css`
    * {
      box-sizing: border-box;
    }

    aracna-disclosure {
      width: 256px;

      display: flex;
      flex-direction: column;

      border: 1px solid gray;
      border-radius: 4px;
    }

    aracna-disclosure > * + * {
      border-top: 1px solid gray;
    }

    aracna-disclosure-section {
      display: flex;
      flex-direction: column;
      padding: 8px 0;
      gap: 4px;

      font-size: 12px;
      font-weight: 500;
    }

    aracna-disclosure-button {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 8px;
    }

    aracna-disclosure-section[expanded] aracna-icon.down {
      display: none;
    }

    aracna-disclosure-section:not([expanded]) aracna-icon.up {
      display: none;
    }

    aracna-disclosure-panel {
      padding: 8px;
      padding-bottom: 0;

      border-top: 1px solid lightgray;

      color: gray;
    }

    aracna-disclosure-section:not([expanded]) aracna-disclosure-panel {
      display: none;
    }
  `
}

defineCustomElement('my-disclosure', Disclosure)
