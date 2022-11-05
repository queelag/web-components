import { css, CSSResultGroup, html, LitElement } from 'lit'
import '../../../../src/elements/data/chip.element'
import '../../../../src/elements/data/icon.element'

export default class Chip extends LitElement {
  protected render(): unknown {
    return html`
      <q-chip>
        <span>chip</span>
        <q-icon
          className="mt-px cursor-pointer"
          fill="none"
          size="12"
          src="https://raw.githubusercontent.com/feathericons/feather/master/icons/x.svg"
          stroke="black"
          stroke-width="2"
        ></q-icon>
      </q-chip>
    `
  }

  static styles?: CSSResultGroup | undefined = css`
    * {
      box-sizing: border-box;
    }

    q-chip {
      display: flex;
      align-items: center;
      gap: 4px;

      background: lightgray;
      border-radius: 4px;
      padding: 4px 8px;
    }

    span {
      font-size: 12px;
      font-weight: 500;
    }

    q-icon {
      cursor: pointer;
    }
  `
}

customElements.define('my-chip', Chip)
