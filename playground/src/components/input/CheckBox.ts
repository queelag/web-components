import { css, CSSResultGroup, html, LitElement } from 'lit'
import '../../../../src/elements/data/icon.element'
import '../../../../src/elements/input/check.box.element'

export default class CheckBox extends LitElement {
  protected render(): unknown {
    return html`
      <q-checkbox>
        <div>
          <q-icon
            fill="none"
            size="16"
            src="https://raw.githubusercontent.com/feathericons/feather/master/icons/check.svg"
            stroke="black"
            stroke-width="2"
          ></q-icon>
        </div>
      </q-checkbox>
    `
  }

  static styles?: CSSResultGroup | undefined = css`
    * {
      box-sizing: border-box;
    }

    q-checkbox > div {
      width: 24px;
      height: 24px;

      display: flex;
      justify-content: center;
      align-items: center;

      border: 1px solid gray;
      border-radius: 4px;
    }

    q-checkbox:not([checked]) q-icon {
      opacity: 0;
    }
  `
}

defineCustomElement('my-checkbox', CheckBox)
