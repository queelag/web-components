import {
  AlertDialogDescriptionElementEventMap,
  AlertDialogElementEventMap,
  AlertDialogLabelElementEventMap,
  defineCustomElement,
  ElementName,
  QueryDeclarations
} from '@queelag/web'
import { PropertyDeclarations } from 'lit'
import { AriaAlertDialogDescriptionElement, AriaAlertDialogElement, AriaAlertDialogLabelElement } from '../aria/aria.alert.dialog.element'

declare global {
  interface HTMLElementTagNameMap {
    'q-alert-dialog': AlertDialogElement
    'q-alert-dialog-description': AlertDialogDescriptionElement
    'q-alert-dialog-label': AlertDialogLabelElement
  }
}

export class AlertDialogElement<E extends AlertDialogElementEventMap = AlertDialogElementEventMap> extends AriaAlertDialogElement<E> {
  description?: string
  label?: string

  get name(): ElementName {
    return ElementName.ALERT_DIALOG
  }

  static properties: PropertyDeclarations = {
    description: { type: String, reflect: true },
    label: { type: String, reflect: true }
  }

  static queries: QueryDeclarations = {
    descriptionElement: { selector: 'q-alert-dialog-description' },
    labelElement: { selector: 'q-alert-dialog-label' }
  }
}

export class AlertDialogLabelElement<E extends AlertDialogLabelElementEventMap = AlertDialogLabelElementEventMap> extends AriaAlertDialogLabelElement<E> {
  get name(): ElementName {
    return ElementName.ALERT_DIALOG_LABEL
  }
}

export class AlertDialogDescriptionElement<
  E extends AlertDialogDescriptionElementEventMap = AlertDialogDescriptionElementEventMap
> extends AriaAlertDialogDescriptionElement<E> {
  get name(): ElementName {
    return ElementName.ALERT_DIALOG_DESCRIPTION
  }
}

defineCustomElement('q-alert-dialog', AlertDialogElement)
defineCustomElement('q-alert-dialog-description', AlertDialogDescriptionElement)
defineCustomElement('q-alert-dialog-label', AlertDialogLabelElement)
