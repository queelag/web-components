import { css, CSSResultGroup, html, LitElement, PropertyDeclarations } from 'lit'
import '../../../../src/elements/feedback/alert.dialog.element'
import '../../../../src/elements/input/button.element'
import '../../../../src/elements/input/input.element'

export default class AlertDialog extends LitElement {
  visible?: boolean

  open(): void {
    this.visible = true
  }

  close(): void {
    this.visible = false
  }

  protected render(): unknown {
    return html`
      <q-button @click=${() => this.open()} native>Open ARIA Alert Dialog</q-button>
      <q-alert-dialog @close=${() => this.close()} ?visible=${this.visible} click-outside-deactivates>
        <q-alert-dialog-label>ARIA Alert Dialog</q-alert-dialog-label>
        <q-alert-dialog-description>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </q-alert-dialog-description>
        <div class="buttons">
          <q-button @click=${() => this.close()} native>Close</q-button>
          <q-button @click=${() => this.close()} native>Ok</q-button>
        </div>
      </q-alert-dialog>
    `
  }

  static properties: PropertyDeclarations = {
    visible: { state: true }
  }

  static styles?: CSSResultGroup | undefined = css`
    * {
      box-sizing: border-box;
    }

    q-alert-dialog {
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

    q-alert-dialog:not([visible]) {
      display: none;
    }

    q-alert-dialog div.buttons {
      display: flex;
      align-self: flex-end;
      gap: 8px;
    }
  `
}

defineCustomElement('my-alert-dialog', AlertDialog)
