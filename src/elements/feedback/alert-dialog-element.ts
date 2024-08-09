import { defineCustomElement } from '@aracna/web'
import type { PropertyDeclarations } from 'lit'
import { ElementName } from '../../definitions/enums.js'
import type { AlertDialogDescriptionElementEventMap, AlertDialogElementEventMap, AlertDialogLabelElementEventMap } from '../../definitions/events.js'
import type { QueryDeclarations } from '../../definitions/interfaces.js'
import {
  AracnaAriaAlertDialogDescriptionElement as AriaAlertDialogDescriptionElement,
  AracnaAriaAlertDialogElement as AriaAlertDialogElement,
  AracnaAriaAlertDialogLabelElement as AriaAlertDialogLabelElement
} from '../aria/aria-alert-dialog-element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-alert-dialog': AlertDialogElement
    'aracna-alert-dialog-description': AlertDialogDescriptionElement
    'aracna-alert-dialog-label': AlertDialogLabelElement
  }
}

class AlertDialogElement<E extends AlertDialogElementEventMap = AlertDialogElementEventMap> extends AriaAlertDialogElement<E> {
  headline?: string
  icon?: string
  text?: string

  get name(): ElementName {
    return ElementName.ALERT_DIALOG
  }

  static properties: PropertyDeclarations = {
    headline: { type: String, reflect: true },
    icon: { type: String, reflect: true },
    text: { type: String, reflect: true }
  }

  static queries: QueryDeclarations = {
    descriptionElement: { selector: 'aracna-alert-dialog-description' },
    labelElement: { selector: 'aracna-alert-dialog-label' }
  }
}

class AlertDialogLabelElement<E extends AlertDialogLabelElementEventMap = AlertDialogLabelElementEventMap> extends AriaAlertDialogLabelElement<E> {
  get name(): ElementName {
    return ElementName.ALERT_DIALOG_LABEL
  }
}

class AlertDialogDescriptionElement<
  E extends AlertDialogDescriptionElementEventMap = AlertDialogDescriptionElementEventMap
> extends AriaAlertDialogDescriptionElement<E> {
  get name(): ElementName {
    return ElementName.ALERT_DIALOG_DESCRIPTION
  }
}

defineCustomElement('aracna-alert-dialog', AlertDialogElement)
defineCustomElement('aracna-alert-dialog-description', AlertDialogDescriptionElement)
defineCustomElement('aracna-alert-dialog-label', AlertDialogLabelElement)

export {
  AlertDialogDescriptionElement as AracnaAlertDialogDescriptionElement,
  AlertDialogElement as AracnaAlertDialogElement,
  AlertDialogLabelElement as AracnaAlertDialogLabelElement
}
