import { defineCustomElement } from '@aracna/web'
import { css, CSSResultGroup, html, LitElement, PropertyDeclarations } from 'lit'
import '../../../../src/elements/feedback/alert-dialog-element'
import '../../../../src/elements/input/button-element'
import '../../../../src/elements/input/input-element'

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
      <aracna-button @click=${() => this.open()} native>Open ARIA Alert Dialog</aracna-button>
      <aracna-alert-dialog @close=${() => this.close()} ?visible=${this.visible} click-outside-deactivates>
        <aracna-alert-dialog-label>ARIA Alert Dialog</aracna-alert-dialog-label>
        <aracna-alert-dialog-description>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </aracna-alert-dialog-description>
        <div class="buttons">
          <aracna-button @click=${() => this.close()} native>Close</aracna-button>
          <aracna-button @click=${() => this.close()} native>Ok</aracna-button>
        </div>
      </aracna-alert-dialog>
    `
  }

  static properties: PropertyDeclarations = {
    visible: { state: true }
  }

  static styles?: CSSResultGroup | undefined = css`
    * {
      box-sizing: border-box;
    }

    aracna-alert-dialog {
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

    aracna-alert-dialog:not([visible]) {
      display: none;
    }

    aracna-alert-dialog div.buttons {
      display: flex;
      align-self: flex-end;
      gap: 8px;
    }
  `
}

defineCustomElement('my-alert-dialog', AlertDialog)
