import { defineCustomElement } from '@aracna/web'
import type { PropertyDeclarations } from 'lit'
import { ElementSlug } from '../../definitions/enums.js'
import type { DialogDescriptionElementEventMap, DialogElementEventMap, DialogLabelElementEventMap } from '../../definitions/events.js'
import type { QueryDeclarations } from '../../definitions/interfaces.js'
import {
  AracnaAriaDialogDescriptionElement as AriaDialogDescriptionElement,
  AracnaAriaDialogElement as AriaDialogElement,
  AracnaAriaDialogLabelElement as AriaDialogLabelElement
} from '../aria/aria-dialog-element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-dialog': DialogElement
    'aracna-dialog-description': DialogDescriptionElement
    'aracna-dialog-label': DialogLabelElement
  }
}

class DialogElement<E extends DialogElementEventMap = DialogElementEventMap> extends AriaDialogElement<E> {
  /**
   * Properties
   */
  /** */
  headline?: string
  icon?: string
  text?: string

  get slug(): ElementSlug {
    return ElementSlug.DIALOG
  }

  static properties: PropertyDeclarations = {
    headline: { type: String, reflect: true },
    icon: { type: String, reflect: true },
    text: { type: String, reflect: true }
  }

  static queries: QueryDeclarations = {
    descriptionElement: { selector: 'aracna-dialog-description' },
    labelElement: { selector: 'aracna-dialog-label' }
  }
}

class DialogLabelElement<E extends DialogLabelElementEventMap = DialogElementEventMap> extends AriaDialogLabelElement<E> {
  get slug(): ElementSlug {
    return ElementSlug.DIALOG_LABEL
  }
}

class DialogDescriptionElement<E extends DialogDescriptionElementEventMap = DialogElementEventMap> extends AriaDialogDescriptionElement<E> {
  get slug(): ElementSlug {
    return ElementSlug.DIALOG_DESCRIPTION
  }
}

defineCustomElement('aracna-dialog', DialogElement)
defineCustomElement('aracna-dialog-description', DialogDescriptionElement)
defineCustomElement('aracna-dialog-label', DialogLabelElement)

export {
  AriaDialogDescriptionElement as AracnaDialogDescriptionElement,
  AriaDialogElement as AracnaDialogElement,
  AriaDialogLabelElement as AracnaDialogLabelElement
}
