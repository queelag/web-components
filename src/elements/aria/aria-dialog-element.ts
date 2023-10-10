import {
  AriaDialogDescriptionElementEventMap,
  AriaDialogElementEventMap,
  AriaDialogLabelElementEventMap,
  defineCustomElement,
  ElementName,
  QueryDeclarations,
  WebElementLogger
} from '@aracna/web'
import { PropertyDeclarations } from 'lit'
import { AriaDialogController, AriaDialogDescriptionController, AriaDialogLabelController } from '../../controllers/aria-dialog-controller.js'
import { BaseElement } from '../core/base-element.js'
import { FocusTrapElement } from '../core/focus-trap-element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-aria-dialog': AriaDialogElement
    'aracna-aria-dialog-description': AriaDialogDescriptionElement
    'aracna-aria-dialog-label': AriaDialogLabelElement
  }
}

export class AriaDialogElement<E extends AriaDialogElementEventMap = AriaDialogElementEventMap> extends FocusTrapElement<E> {
  protected aria: AriaDialogController = new AriaDialogController(this)

  /**
   * PROPERTIES
   */
  lockBodyScroll?: boolean
  visible?: boolean

  /**
   * QUERIES
   */
  descriptionElement?: AriaDialogDescriptionElement
  labelElement?: AriaDialogLabelElement

  attributeChangedCallback(name: string, _old: string | null, value: string | null): void {
    super.attributeChangedCallback(name, _old, value)

    if (name !== 'visible' || Object.is(_old, value)) {
      return
    }

    if (typeof value === 'string') {
      this.activateFocusTrap()
      this.setBodyStyle()

      return
    }

    this.deactivateFocusTrap()
    this.removeBodyStyle()
  }

  setBodyStyle(): void {
    if (!this.lockBodyScroll) {
      return
    }

    document.body.style.overflow = 'hidden'
  }

  removeBodyStyle(): void {
    if (!this.lockBodyScroll) {
      return
    }

    document.body.style.overflow = ''
  }

  onFocusTrapPostActivate(): void {
    super.onFocusTrapPostActivate()

    this.dispatchEvent(new Event('open'))
    WebElementLogger.verbose(this.uid, 'onFocusTrapPostActivate', `The open event has been dispatched.`)
  }

  onFocusTrapPostDeactivate(): void {
    super.onFocusTrapPostDeactivate()

    this.dispatchEvent(new Event('close'))
    WebElementLogger.verbose(this.uid, 'onFocusTrapPostDeactivate', `The close event has been dispatched.`)
  }

  get name(): ElementName {
    return ElementName.ARIA_DIALOG
  }

  static properties: PropertyDeclarations = {
    lockBodyScroll: { type: Boolean, attribute: 'lock-body-scroll', reflect: true },
    visible: { type: Boolean, reflect: true }
  }

  static queries: QueryDeclarations = {
    descriptionElement: { selector: 'aracna-aria-dialog-description' },
    labelElement: { selector: 'aracna-aria-dialog-label' }
  }
}

export class AriaDialogDescriptionElement<E extends AriaDialogDescriptionElementEventMap = AriaDialogDescriptionElementEventMap> extends BaseElement<E> {
  protected aria: AriaDialogDescriptionController = new AriaDialogDescriptionController(this)

  get name(): ElementName {
    return ElementName.ARIA_DIALOG_DESCRIPTION
  }
}

export class AriaDialogLabelElement<E extends AriaDialogLabelElementEventMap = AriaDialogLabelElementEventMap> extends BaseElement<E> {
  protected aria: AriaDialogLabelController = new AriaDialogLabelController(this)

  get name(): ElementName {
    return ElementName.ARIA_DIALOG_LABEL
  }
}

defineCustomElement('aracna-aria-dialog', AriaDialogElement)
defineCustomElement('aracna-aria-dialog-description', AriaDialogDescriptionElement)
defineCustomElement('aracna-aria-dialog-label', AriaDialogLabelElement)
