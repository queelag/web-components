import { ElementName, KeyboardEventKey, WebElementLogger } from '@queelag/web'
import { css, CSSResultGroup, PropertyDeclarations } from 'lit'
import { AriaCheckBoxController } from '../../controllers/aria.check.box.controller'
import { FormFieldElement } from '../core/form.field.element'

declare global {
  interface HTMLElementTagNameMap {
    'q-aria-checkbox': AriaCheckBoxElement
  }
}

export class AriaCheckBoxElement extends FormFieldElement {
  protected aria: AriaCheckBoxController = new AriaCheckBoxController(this)

  /**
   * PROPERTIES
   */
  checked?: boolean
  disabled?: boolean
  readonly?: boolean

  connectedCallback(): void {
    super.connectedCallback()

    if (this.native) {
      return
    }

    this.addEventListener('click', this.onClick)
    this.addEventListener('keydown', this.onKeyDown)
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()

    if (this.native) {
      return
    }

    this.removeEventListener('click', this.onClick)
    this.removeEventListener('keydown', this.onKeyDown)
  }

  onClick(): void {
    if (this.disabled || this.readonly) {
      return WebElementLogger.warn(this.uid, 'onClick', `The checkbox is disabled or readonly.`)
    }

    this.checked = !this.checked
    WebElementLogger.verbose(this.uid, 'onClick', `The checkbox has been ${this.checked ? 'checked' : 'unchecked'}.`)
  }

  private onKeyDown(event: KeyboardEvent): void {
    if (event.key !== KeyboardEventKey.SPACE) {
      return
    }

    event.preventDefault()
    event.stopPropagation()

    this.onClick()
  }

  get name(): ElementName {
    return ElementName.ARIA_CHECKBOX
  }

  static properties: PropertyDeclarations = {
    ...super.properties,
    checked: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
    readonly: { type: Boolean, reflect: true }
  }

  static styles: CSSResultGroup = [
    super.styles,
    css`
      :host {
        cursor: pointer;
      }
    `
  ]
}

customElements.define('q-aria-checkbox', AriaCheckBoxElement)
