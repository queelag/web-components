import {
  defineCustomElement,
  DialogDescriptionElementEventMap,
  DialogElementEventMap,
  DialogLabelElementEventMap,
  ElementName,
  QueryDeclarations
} from '@aracna/web'
import { PropertyDeclarations } from 'lit'
import { AriaDialogDescriptionElement, AriaDialogElement, AriaDialogLabelElement } from '../aria/aria.dialog.element'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-dialog': DialogElement
    'aracna-dialog-description': DialogDescriptionElement
    'aracna-dialog-label': DialogLabelElement
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
    descriptionElement: { selector: 'aracna-dialog-description' },
    labelElement: { selector: 'aracna-dialog-label' }
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

defineCustomElement('aracna-dialog', DialogElement)
defineCustomElement('aracna-dialog-description', DialogDescriptionElement)
defineCustomElement('aracna-dialog-label', DialogLabelElement)
