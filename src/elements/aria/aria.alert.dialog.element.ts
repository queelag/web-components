import { ElementName } from '@queelag/web'
import { AriaDialogController } from '../../controllers/aria.dialog.controller'
import { AriaDialogDescriptionElement, AriaDialogElement, AriaDialogLabelElement } from './aria.dialog.element'

declare global {
  interface HTMLElementTagNameMap {
    'q-aria-alert-dialog': AriaAlertDialogElement
    'q-aria-alert-dialog-description': AriaAlertDialogDescriptionElement
    'q-aria-alert-dialog-label': AriaAlertDialogLabelElement
  }
}

export class AriaAlertDialogElement extends AriaDialogElement {
  constructor() {
    super()
    this.aria = new AriaDialogController(this, true)
  }

  get name(): ElementName {
    return ElementName.ALERT_DIALOG
  }
}

export class AriaAlertDialogDescriptionElement extends AriaDialogDescriptionElement {
  get name(): ElementName {
    return ElementName.ALERT_DIALOG_DESCRIPTION
  }
}

export class AriaAlertDialogLabelElement extends AriaDialogLabelElement {
  get name(): ElementName {
    return ElementName.ALERT_DIALOG_LABEL
  }
}

customElements.define('q-aria-alert-dialog', AriaAlertDialogElement)
customElements.define('q-aria-alert-dialog-description', AriaAlertDialogDescriptionElement)
customElements.define('q-aria-alert-dialog-label', AriaAlertDialogLabelElement)
