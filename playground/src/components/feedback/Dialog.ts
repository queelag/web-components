import { css, CSSResultGroup, html, LitElement, PropertyDeclarations } from 'lit'
import '../../../../src/elements/feedback/dialog.element'
import '../../../../src/elements/input/button.element'
import '../../../../src/elements/input/input.element'

export default class Dialog extends LitElement {
  visible?: boolean

  open(): void {
    this.visible = true
  }

  close(): void {
    this.visible = false
  }

  protected render(): unknown {
    return html`
      <q-button @click=${() => this.open()} native>Open ARIA Dialog</q-button>
      <q-dialog @close=${() => this.close()} ?visible=${this.visible} click-outside-deactivates>
        <q-dialog-label>ARIA Dialog</q-dialog-label>
        <q-dialog-description>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </q-dialog-description>
        <q-input placeholder="input inside dialog" type="text"></q-input>
        <div class="buttons">
          <q-button @click=${() => this.close()} native>Close</q-button>
          <q-button @click=${() => this.close()} native>Ok</q-button>
        </div>
      </q-dialog>
    `
  }

  static properties: PropertyDeclarations = {
    visible: { state: true }
  }

  static styles?: CSSResultGroup | undefined = css`
    * {
      box-sizing: border-box;
    }

    q-dialog {
      width: 256px;

      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 8px;

      background: white;
      border: 1px solid lightgray;
      border-radius: 4px;

      position: fixed;
      top: 256px;
      left: 50%;
      z-index: 40;

      transform: translateX(-50%);
    }

    q-dialog:not([visible]) {
      display: none;
    }

    q-dialog div.buttons {
      display: flex;
      align-self: flex-end;
      gap: 8px;
    }
  `
}

defineCustomElement('my-dialog', Dialog)
