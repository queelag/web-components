import { DialogDescriptionElementEventMap, DialogElementEventMap, DialogLabelElementEventMap, ElementName, QueryDeclarations } from '@queelag/web'
import { PropertyDeclarations } from 'lit'
import { AriaDialogDescriptionElement, AriaDialogElement, AriaDialogLabelElement } from '../aria/aria.dialog.element'

declare global {
  interface HTMLElementTagNameMap {
    'q-dialog': DialogElement
    'q-dialog-description': DialogDescriptionElement
    'q-dialog-label': DialogLabelElement
  }
}

export class DialogElement<E extends DialogElementEventMap = DialogElementEventMap> extends AriaDialogElement<E> {
  description?: string
  label?: string

  get name(): ElementName {
    return ElementName.DIALOG
  }

  static properties: PropertyDeclarations = {
    description: { type: String, reflect: true },
    label: { type: String, reflect: true }
  }

  static queries: QueryDeclarations = {
    descriptionElement: { selector: 'q-dialog-description' },
    labelElement: { selector: 'q-dialog-label' }
  }
}

export class DialogLabelElement<E extends DialogLabelElementEventMap = DialogElementEventMap> extends AriaDialogLabelElement<E> {
  get name(): ElementName {
    return ElementName.DIALOG_LABEL
  }
}

export class DialogDescriptionElement<E extends DialogDescriptionElementEventMap = DialogElementEventMap> extends AriaDialogDescriptionElement<E> {
  get name(): ElementName {
    return ElementName.DIALOG_DESCRIPTION
  }
}

customElements.define('q-dialog', DialogElement)
customElements.define('q-dialog-description', DialogDescriptionElement)
customElements.define('q-dialog-label', DialogLabelElement)
