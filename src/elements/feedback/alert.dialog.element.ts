import { ElementName, QueryDeclarations } from '@queelag/web'
import { AriaAlertDialogDescriptionElement, AriaAlertDialogElement, AriaAlertDialogLabelElement } from '../aria/aria.alert.dialog.element'

declare global {
  interface HTMLElementTagNameMap {
    'q-alert-dialog': AlertDialogElement
    'q-alert-dialog-description': AlertDialogDescriptionElement
    'q-alert-dialog-label': AlertDialogLabelElement
  }
}

export class AlertDialogElement extends AriaAlertDialogElement {
  get name(): ElementName {
    return ElementName.ALERT_DIALOG
  }

  static queries: QueryDeclarations = {
    descriptionElement: { selector: 'q-alert-dialog-description' },
    labelElement: { selector: 'q-alert-dialog-label' }
  }
}

export class AlertDialogLabelElement extends AriaAlertDialogLabelElement {
  get name(): ElementName {
    return ElementName.ALERT_DIALOG_LABEL
  }
}

export class AlertDialogDescriptionElement extends AriaAlertDialogDescriptionElement {
  get name(): ElementName {
    return ElementName.ALERT_DIALOG_DESCRIPTION
  }
}

customElements.define('q-alert-dialog', AlertDialogElement)
customElements.define('q-alert-dialog-description', AlertDialogDescriptionElement)
customElements.define('q-alert-dialog-label', AlertDialogLabelElement)
