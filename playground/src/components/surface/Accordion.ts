import { css, CSSResultGroup, html, LitElement } from 'lit'
import '../../../../src/elements/data/icon.element'
import '../../../../src/elements/surface/accordion.element'

export default class Accordion extends LitElement {
  protected render(): unknown {
    return html`
      <aracna-accordion allow-only-one-expanded-section>
        <aracna-accordion-section>
          <aracna-accordion-header>
            <aracna-accordion-button>
              <span>Accordion Section 1</span>
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
            </aracna-accordion-button>
          </aracna-accordion-header>
          <aracna-accordion-panel>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</aracna-accordion-panel>
        </aracna-accordion-section>
        <aracna-accordion-section>
          <aracna-accordion-header>
            <aracna-accordion-button>
              <span>Accordion Section 2</span>
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
            </aracna-accordion-button>
          </aracna-accordion-header>
          <aracna-accordion-panel>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</aracna-accordion-panel>
        </aracna-accordion-section>
        <aracna-accordion-section noncollapsible>
          <aracna-accordion-header>
            <aracna-accordion-button>
              <span>Accordion Section 3</span>
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
            </aracna-accordion-button>
          </aracna-accordion-header>
          <aracna-accordion-panel>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</aracna-accordion-panel>
        </aracna-accordion-section>
      </aracna-accordion>
    `
  }

  static styles?: CSSResultGroup | undefined = css`
    * {
      box-sizing: border-box;
    }

    aracna-accordion {
      width: 256px;

      display: flex;
      flex-direction: column;

      border: 1px solid gray;
      border-radius: 4px;
    }

    aracna-accordion > * + * {
      border-top: 1px solid gray;
    }

    aracna-accordion-section {
      display: flex;
      flex-direction: column;
      padding: 8px 0;
      gap: 4px;

      font-size: 12px;
      font-weight: 500;
    }

    aracna-accordion-button {
      width: 100%;

      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 8px;
    }

    aracna-accordion-section[expanded] aracna-icon.down {
      display: none;
    }

    aracna-accordion-section:not([expanded]) aracna-icon.up {
      display: none;
    }

    aracna-accordion-panel {
      padding: 8px;
      padding-bottom: 0;

      border-top: 1px solid lightgray;

      color: gray;
    }

    aracna-accordion-section:not([expanded]) aracna-accordion-panel {
      display: none;
    }
  `
}

defineCustomElement('my-accordion', Accordion)
