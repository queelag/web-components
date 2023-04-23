import {
  AriaAlertDialogDescriptionElementEventMap,
  AriaAlertDialogElementEventMap,
  AriaAlertDialogLabelElementEventMap,
  defineCustomElement,
  ElementName,
  QueryDeclarations
} from '@aracna/web'
import { AriaDialogController } from '../../controllers/aria.dialog.controller'
import { AriaDialogDescriptionElement, AriaDialogElement, AriaDialogLabelElement } from './aria.dialog.element'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-aria-alert-dialog': AriaAlertDialogElement
    'aracna-aria-alert-dialog-description': AriaAlertDialogDescriptionElement
    'aracna-aria-alert-dialog-label': AriaAlertDialogLabelElement
  }
}

export class AriaAlertDialogElement<E extends AriaAlertDialogElementEventMap = AriaAlertDialogElementEventMap> extends AriaDialogElement<E> {
  constructor() {
    super()
    this.aria = new AriaDialogController(this, true)
  }

  get name(): ElementName {
    return ElementName.ARIA_ALERT_DIALOG
  }

  static queries: QueryDeclarations = {
    descriptionElement: { selector: 'aracna-aria-alert-dialog-description' },
    labelElement: { selector: 'aracna-aria-alert-dialog-label' }
  }
}

export class AriaAlertDialogDescriptionElement<
  E extends AriaAlertDialogDescriptionElementEventMap = AriaAlertDialogDescriptionElementEventMap
> extends AriaDialogDescriptionElement<E> {
  get name(): ElementName {
    return ElementName.ARIA_ALERT_DIALOG_DESCRIPTION
  }
}

export class AriaAlertDialogLabelElement<
  E extends AriaAlertDialogLabelElementEventMap = AriaAlertDialogLabelElementEventMap
> extends AriaDialogLabelElement<E> {
  get name(): ElementName {
    return ElementName.ARIA_ALERT_DIALOG_LABEL
  }
}

defineCustomElement('aracna-aria-alert-dialog', AriaAlertDialogElement)
defineCustomElement('aracna-aria-alert-dialog-description', AriaAlertDialogDescriptionElement)
defineCustomElement('aracna-aria-alert-dialog-label', AriaAlertDialogLabelElement)
