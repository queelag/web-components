import {
  AlertDialogDescriptionElementEventMap,
  AlertDialogElementEventMap,
  AlertDialogLabelElementEventMap,
  defineCustomElement,
  ElementName,
  QueryDeclarations
} from '@aracna/web'
import { PropertyDeclarations } from 'lit'
import { AriaAlertDialogDescriptionElement, AriaAlertDialogElement, AriaAlertDialogLabelElement } from '../aria/aria.alert.dialog.element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-alert-dialog': AlertDialogElement
    'aracna-alert-dialog-description': AlertDialogDescriptionElement
    'aracna-alert-dialog-label': AlertDialogLabelElement
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
    descriptionElement: { selector: 'aracna-alert-dialog-description' },
    labelElement: { selector: 'aracna-alert-dialog-label' }
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

defineCustomElement('aracna-alert-dialog', AlertDialogElement)
defineCustomElement('aracna-alert-dialog-description', AlertDialogDescriptionElement)
defineCustomElement('aracna-alert-dialog-label', AlertDialogLabelElement)
