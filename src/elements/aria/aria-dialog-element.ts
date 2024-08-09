import { defineCustomElement } from '@aracna/web'
import type { PropertyDeclarations } from 'lit'
import { AriaDialogController, AriaDialogDescriptionController, AriaDialogLabelController } from '../../controllers/aria-dialog-controller.js'
import { ElementName } from '../../definitions/enums.js'
import type { AriaDialogDescriptionElementEventMap, AriaDialogElementEventMap, AriaDialogLabelElementEventMap } from '../../definitions/events.js'
import type { QueryDeclarations } from '../../definitions/interfaces.js'
import { DialogCloseEvent } from '../../events/dialog-close-event.js'
import { DialogOpenEvent } from '../../events/dialog-open-event.js'
import { ElementLogger } from '../../loggers/element-logger.js'
import { AracnaBaseElement as BaseElement } from '../core/base-element.js'
import { AracnaFocusTrapElement as FocusTrapElement } from '../core/focus-trap-element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-aria-dialog': AriaDialogElement
    'aracna-aria-dialog-description': AriaDialogDescriptionElement
    'aracna-aria-dialog-label': AriaDialogLabelElement
  }
}

class AriaDialogElement<E extends AriaDialogElementEventMap = AriaDialogElementEventMap> extends FocusTrapElement<E> {
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

    if (Object.is(_old, value)) {
      return
    }

    if (name === 'visible' && typeof value === 'string') {
      this.activateFocusTrap()
      this.setBodyStyle()
    }

    if (name === 'visible' && value === null) {
      this.deactivateFocusTrap()
      this.removeBodyStyle()
    }
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

    this.dispatchEvent(new DialogOpenEvent())
    ElementLogger.verbose(this.uid, 'onFocusTrapPostActivate', `The dialog-open event has been dispatched.`)
  }

  onFocusTrapPostDeactivate(): void {
    super.onFocusTrapPostDeactivate()

    this.dispatchEvent(new DialogCloseEvent())
    ElementLogger.verbose(this.uid, 'onFocusTrapPostDeactivate', `The dialog-close event has been dispatched.`)
  }

  get name(): ElementName {
    return ElementName.ARIA_DIALOG
  }

  static properties: PropertyDeclarations = {
    lockBodyScroll: {
      type: Boolean,
      attribute: 'lock-body-scroll',
      reflect: true
    },
    visible: { type: Boolean, reflect: true }
  }

  static queries: QueryDeclarations = {
    descriptionElement: { selector: 'aracna-aria-dialog-description' },
    labelElement: { selector: 'aracna-aria-dialog-label' }
  }
}

class AriaDialogDescriptionElement<E extends AriaDialogDescriptionElementEventMap = AriaDialogDescriptionElementEventMap> extends BaseElement<E> {
  protected aria: AriaDialogDescriptionController = new AriaDialogDescriptionController(this)

  get name(): ElementName {
    return ElementName.ARIA_DIALOG_DESCRIPTION
  }
}

class AriaDialogLabelElement<E extends AriaDialogLabelElementEventMap = AriaDialogLabelElementEventMap> extends BaseElement<E> {
  protected aria: AriaDialogLabelController = new AriaDialogLabelController(this)

  get name(): ElementName {
    return ElementName.ARIA_DIALOG_LABEL
  }
}

defineCustomElement('aracna-aria-dialog', AriaDialogElement)
defineCustomElement('aracna-aria-dialog-description', AriaDialogDescriptionElement)
defineCustomElement('aracna-aria-dialog-label', AriaDialogLabelElement)

export {
  AriaDialogDescriptionElement as AracnaAriaDialogDescriptionElement,
  AriaDialogElement as AracnaAriaDialogElement,
  AriaDialogLabelElement as AracnaAriaDialogLabelElement
}
