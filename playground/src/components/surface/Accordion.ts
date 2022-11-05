import { css, CSSResultGroup, html, LitElement } from 'lit'
import '../../../../src/elements/data/icon.element'
import '../../../../src/elements/surface/accordion.element'

export default class Accordion extends LitElement {
  protected render(): unknown {
    return html`
      <q-accordion allow-only-one-expanded-section>
        <q-accordion-section>
          <q-accordion-header>
            <q-accordion-button>
              <span>Accordion Section 1</span>
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
            </q-accordion-button>
          </q-accordion-header>
          <q-accordion-panel>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</q-accordion-panel>
        </q-accordion-section>
        <q-accordion-section>
          <q-accordion-header>
            <q-accordion-button>
              <span>Accordion Section 2</span>
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
            </q-accordion-button>
          </q-accordion-header>
          <q-accordion-panel>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</q-accordion-panel>
        </q-accordion-section>
        <q-accordion-section noncollapsible>
          <q-accordion-header>
            <q-accordion-button>
              <span>Accordion Section 3</span>
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
            </q-accordion-button>
          </q-accordion-header>
          <q-accordion-panel>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</q-accordion-panel>
        </q-accordion-section>
      </q-accordion>
    `
  }

  static styles?: CSSResultGroup | undefined = css`
    * {
      box-sizing: border-box;
    }

    q-accordion {
      width: 256px;

      display: flex;
      flex-direction: column;

      border: 1px solid gray;
      border-radius: 4px;
    }

    q-accordion > * + * {
      border-top: 1px solid gray;
    }

    q-accordion-section {
      display: flex;
      flex-direction: column;
      padding: 8px 0;
      gap: 4px;

      font-size: 12px;
      font-weight: 500;
    }

    q-accordion-button {
      width: 100%;

      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 8px;
    }

    q-accordion-section[expanded] q-icon.down {
      display: none;
    }

    q-accordion-section:not([expanded]) q-icon.up {
      display: none;
    }

    q-accordion-panel {
      padding: 8px;
      padding-bottom: 0;

      border-top: 1px solid lightgray;

      color: gray;
    }

    q-accordion-section:not([expanded]) q-accordion-panel {
      display: none;
    }
  `
}

customElements.define('my-accordion', Accordion)
