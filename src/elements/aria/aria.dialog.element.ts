import { ElementName, QueryDeclarations, WebElementLogger } from '@queelag/web'
import { PropertyDeclarations } from 'lit'
import { AriaDialogController, AriaDialogDescriptionController, AriaDialogLabelController } from '../../controllers/aria.dialog.controller'
import { BaseElement } from '../core/base.element'
import { FocusTrapElement } from '../core/focus.trap.element'

declare global {
  interface HTMLElementTagNameMap {
    'q-aria-dialog': AriaDialogElement
    'q-aria-dialog-description': AriaDialogDescriptionElement
    'q-aria-dialog-label': AriaDialogLabelElement
  }
}

export class AriaDialogElement extends FocusTrapElement {
  protected aria: AriaDialogController = new AriaDialogController(this)

  /**
   * PROPERTIES
   */
  description?: string
  label?: string
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

  private setBodyStyle(): void {
    if (!this.lockBodyScroll) {
      return
    }

    document.body.style.overflow = 'hidden'
  }

  private removeBodyStyle(): void {
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
    description: { type: String, reflect: true },
    label: { type: String, reflect: true },
    lockBodyScroll: { type: Boolean, attribute: 'lock-body-scroll', reflect: true },
    visible: { type: Boolean, reflect: true }
  }

  static queries: QueryDeclarations = {
    descriptionElement: { selector: 'q-aria-dialog-description' },
    labelElement: { selector: 'q-aria-dialog-label' }
  }
}

export class AriaDialogDescriptionElement extends BaseElement {
  protected aria: AriaDialogDescriptionController = new AriaDialogDescriptionController(this)

  get name(): ElementName {
    return ElementName.ARIA_DIALOG_DESCRIPTION
  }
}

export class AriaDialogLabelElement extends BaseElement {
  protected aria: AriaDialogLabelController = new AriaDialogLabelController(this)

  get name(): ElementName {
    return ElementName.ARIA_DIALOG_LABEL
  }
}

customElements.define('q-aria-dialog', AriaDialogElement)
customElements.define('q-aria-dialog-description', AriaDialogDescriptionElement)
customElements.define('q-aria-dialog-label', AriaDialogLabelElement)
