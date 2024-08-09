import { defineCustomElement } from '@aracna/web'
import { AriaDialogController } from '../../controllers/aria-dialog-controller.js'
import { ElementName } from '../../definitions/enums.js'
import type {
  AriaAlertDialogDescriptionElementEventMap,
  AriaAlertDialogElementEventMap,
  AriaAlertDialogLabelElementEventMap
} from '../../definitions/events.js'
import type { QueryDeclarations } from '../../definitions/interfaces.js'
import {
  AracnaAriaDialogDescriptionElement as AriaDialogDescriptionElement,
  AracnaAriaDialogElement as AriaDialogElement,
  AracnaAriaDialogLabelElement as AriaDialogLabelElement
} from './aria-dialog-element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-aria-alert-dialog': AriaAlertDialogElement
    'aracna-aria-alert-dialog-description': AriaAlertDialogDescriptionElement
    'aracna-aria-alert-dialog-label': AriaAlertDialogLabelElement
  }
}

class AriaAlertDialogElement<E extends AriaAlertDialogElementEventMap = AriaAlertDialogElementEventMap> extends AriaDialogElement<E> {
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

class AriaAlertDialogDescriptionElement<
  E extends AriaAlertDialogDescriptionElementEventMap = AriaAlertDialogDescriptionElementEventMap
> extends AriaDialogDescriptionElement<E> {
  get name(): ElementName {
    return ElementName.ARIA_ALERT_DIALOG_DESCRIPTION
  }
}

class AriaAlertDialogLabelElement<E extends AriaAlertDialogLabelElementEventMap = AriaAlertDialogLabelElementEventMap> extends AriaDialogLabelElement<E> {
  get name(): ElementName {
    return ElementName.ARIA_ALERT_DIALOG_LABEL
  }
}

defineCustomElement('aracna-aria-alert-dialog', AriaAlertDialogElement)
defineCustomElement('aracna-aria-alert-dialog-description', AriaAlertDialogDescriptionElement)
defineCustomElement('aracna-aria-alert-dialog-label', AriaAlertDialogLabelElement)

export {
  AriaAlertDialogDescriptionElement as AracnaAriaAlertDialogDescriptionElement,
  AriaAlertDialogElement as AracnaAriaAlertDialogElement,
  AriaAlertDialogLabelElement as AracnaAriaAlertDialogLabelElement
}
