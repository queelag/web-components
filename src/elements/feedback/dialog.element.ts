import { ElementName, QueryDeclarations } from '@queelag/web'
import { AriaDialogDescriptionElement, AriaDialogElement, AriaDialogLabelElement } from '../aria/aria.dialog.element'

declare global {
  interface HTMLElementTagNameMap {
    'q-dialog': DialogElement
    'q-dialog-description': DialogDescriptionElement
    'q-dialog-label': DialogLabelElement
  }
}

export class DialogElement extends AriaDialogElement {
  get name(): ElementName {
    return ElementName.DIALOG
  }

  static queries: QueryDeclarations = {
    descriptionElement: { selector: 'q-dialog-description' },
    labelElement: { selector: 'q-dialog-label' }
  }
}

export class DialogLabelElement extends AriaDialogLabelElement {
  get name(): ElementName {
    return ElementName.DIALOG_LABEL
  }
}

export class DialogDescriptionElement extends AriaDialogDescriptionElement {
  get name(): ElementName {
    return ElementName.DIALOG_DESCRIPTION
  }
}

customElements.define('q-dialog', DialogElement)
customElements.define('q-dialog-description', DialogDescriptionElement)
customElements.define('q-dialog-label', DialogLabelElement)
