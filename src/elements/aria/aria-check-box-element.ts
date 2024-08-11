import { defineCustomElement, KeyboardEventKey } from '@aracna/web'
import { css, type CSSResultGroup, type PropertyDeclarations } from 'lit'
import { AriaCheckBoxController } from '../../controllers/aria-check-box-controller.js'
import { ElementName } from '../../definitions/enums.js'
import type { AriaCheckBoxElementEventMap } from '../../definitions/events.js'
import { CheckBoxCheckEvent } from '../../events/check-box-check-event.js'
import { CheckBoxUncheckEvent } from '../../events/check-box-uncheck-event.js'
import { ElementLogger } from '../../loggers/element-logger.js'
import { AracnaFormControlElement as FormControlElement } from '../core/form-control-element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-aria-checkbox': AriaCheckBoxElement
  }
}

class AriaCheckBoxElement<E extends AriaCheckBoxElementEventMap = AriaCheckBoxElementEventMap> extends FormControlElement<E> {
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
      return ElementLogger.warn(this.uid, 'onClick', `The checkbox is disabled or readonly.`)
    }

    ElementLogger.verbose(this.uid, 'onClick', `${this.checked ? 'Unchecking' : 'Checking'} the checkbox.`)
    this.toggle()
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

    if (this.disabled || this.readonly) {
      return ElementLogger.warn(this.uid, 'onKeyDown', `The checkbox is disabled or readonly.`)
    }

    ElementLogger.verbose(this.uid, 'onKeyDown', `Clicking the checkbox.`)
    this.onClick()
  }

  toggle(): void {
    if (this.checked) {
      return this.uncheck()
    }

    this.check()
  }

  check(): void {
    if (this.disabled || this.readonly) {
      return ElementLogger.warn(this.uid, 'check', `The checkbox is disabled or readonly.`)
    }

    this.checked = true
    ElementLogger.verbose(this.uid, 'check', `The checkbox has been checked.`)

    ElementLogger.verbose(this.uid, 'check', `Touching the checkbox.`)
    this.touch()

    this.dispatchEvent(new CheckBoxCheckEvent())
    ElementLogger.verbose(this.uid, 'check', `The "check" event has been dispatched.`)
  }

  uncheck(): void {
    if (this.disabled || this.readonly) {
      return ElementLogger.warn(this.uid, 'uncheck', `The checkbox is disabled or readonly.`)
    }

    this.checked = false
    ElementLogger.verbose(this.uid, 'uncheck', `The checkbox has been unchecked.`)

    ElementLogger.verbose(this.uid, 'uncheck', `Touching the checkbox.`)
    this.touch()

    this.dispatchEvent(new CheckBoxUncheckEvent())
    ElementLogger.verbose(this.uid, 'uncheck', `The "uncheck" event has been dispatched.`)
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

export { AriaCheckBoxElement as AracnaAriaCheckBoxElement }
