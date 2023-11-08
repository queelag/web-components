import { AriaCheckBoxElementEventMap, defineCustomElement, ElementName, KeyboardEventKey, WebElementLogger } from '@aracna/web'
import { css, CSSResultGroup, PropertyDeclarations } from 'lit'
import { AriaCheckBoxController } from '../../controllers/aria-check.box-controller.js'
import { FormFieldElement } from '../core/form-field-element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-aria-checkbox': AriaCheckBoxElement
  }
}

export class AriaCheckBoxElement<E extends AriaCheckBoxElementEventMap = AriaCheckBoxElementEventMap> extends FormFieldElement<E> {
  protected aria: AriaCheckBoxController = new AriaCheckBoxController(this)

  /**
   * INTERNAL
   */
  protected _checked?: boolean

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
    if (this.native) {
      return
    }

    if (this.disabled || this.readonly) {
      return WebElementLogger.warn(this.uid, 'onClick', `The checkbox is disabled or readonly.`)
    }

    this.checked = !this.checked
    WebElementLogger.verbose(this.uid, 'onClick', `The checkbox has been ${this.checked ? 'checked' : 'unchecked'}.`)

    this.touch()
  }

  onKeyDown(event: KeyboardEvent): void {
    if (this.native) {
      return
    }

    if (event.key !== KeyboardEventKey.SPACE) {
      return
    }

    event.preventDefault()
    event.stopPropagation()

    this.onClick()
  }

  get checked(): boolean | undefined {
    if (this.target && typeof this.path === 'string') {
      return super.value
    }

    return this._checked
  }

  set checked(checked: boolean | undefined) {
    let old: boolean | undefined

    old = this._checked
    this._checked = checked

    this.requestUpdate('checked', old)

    super.value = checked
  }

  get name(): ElementName {
    return ElementName.ARIA_CHECKBOX
  }

  get value(): boolean | undefined {
    return super.value
  }

  set value(value: boolean | undefined) {
    super.value = value
  }

  static properties: PropertyDeclarations = {
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

defineCustomElement('aracna-aria-checkbox', AriaCheckBoxElement)
