import { defineCustomElement, KeyboardEventKey } from '@aracna/web'
import { css, type CSSResultGroup, type PropertyDeclarations } from 'lit'
import { AriaRadioButtonController, AriaRadioGroupController } from '../../controllers/aria-radio-group-controller.js'
import { ElementName } from '../../definitions/enums.js'
import type { AriaRadioButtonElementEventMap, AriaRadioGroupElementEventMap } from '../../definitions/events.js'
import type { QueryDeclarations } from '../../definitions/interfaces.js'
import { RadioButtonCheckEvent } from '../../events/radio-button-check-event.js'
import { RadioButtonUncheckEvent } from '../../events/radio-button-uncheck-event.js'
import { gkek } from '../../functions/gkek.js'
import { ElementLogger } from '../../loggers/element-logger.js'
import { AracnaBaseElement as BaseElement } from '../core/base-element.js'
import { AracnaFormControlElement as FormControlElement } from '../core/form-control-element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-aria-radio-button': AriaRadioButtonElement
    'aracna-aria-radio-group': AriaRadioGroupElement
  }
}

class AriaRadioGroupElement<E extends AriaRadioGroupElementEventMap = AriaRadioGroupElementEventMap> extends FormControlElement<E> {
  protected aria: AriaRadioGroupController = new AriaRadioGroupController(this)

  /**
   * Queries
   */
  /** */
  buttonElements!: AriaRadioButtonElement[]
  checkedButtonElement?: AriaRadioButtonElement
  focusedButtonElement?: AriaRadioButtonElement

  connectedCallback(): void {
    super.connectedCallback()

    if (this.native) {
      return
    }

    this.addEventListener('keydown', this.onKeyDown)
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()

    if (this.native) {
      return
    }

    this.removeEventListener('keydown', this.onKeyDown)
  }

  onKeyDown = (event: KeyboardEvent): void => {
    if (this.native) {
      return
    }

    switch (event.key) {
      case KeyboardEventKey.ARROW_DOWN:
      case KeyboardEventKey.ARROW_LEFT:
      case KeyboardEventKey.ARROW_RIGHT:
      case KeyboardEventKey.ARROW_UP:
      case KeyboardEventKey.SPACE:
        event.preventDefault()
        event.stopPropagation()

        break
    }

    if (this.disabled || this.readonly) {
      return ElementLogger.warn(this.uid, 'onKeyDown', `The group is disabled or readonly.`)
    }

    switch (event.key) {
      case KeyboardEventKey.ARROW_DOWN:
      case KeyboardEventKey.ARROW_LEFT:
      case KeyboardEventKey.ARROW_RIGHT:
      case KeyboardEventKey.ARROW_UP:
        if (this.checkedButtonElement) {
          ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Unchecking the checked button.`, this.checkedButtonElement)
          this.checkedButtonElement.uncheck()
        }

        break
    }

    switch (event.key) {
      case KeyboardEventKey.ARROW_DOWN:
      case KeyboardEventKey.ARROW_RIGHT: {
        let button: AriaRadioButtonElement | undefined

        if (this.focusedButtonElementIndex >= this.buttonElements.length - 1) {
          button = this.buttonElements[0]
          if (!button) break

          ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Checking the first button.`, button)
          button.check()

          button.focus()
          ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `The first button has been focused.`, button)

          break
        }

        button = this.buttonElements[this.focusedButtonElementIndex + 1]
        if (!button) break

        ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Checking the next button.`, button)
        button.check()

        button.focus()
        ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `The next button has been focused.`, button)

        break
      }
      case KeyboardEventKey.ARROW_UP:
      case KeyboardEventKey.ARROW_LEFT: {
        let button: AriaRadioButtonElement | undefined

        if (this.focusedButtonElementIndex <= 0) {
          button = this.buttonElements[this.buttonElements.length - 1]
          if (!button) break

          ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Checking the last button.`, button)
          button.check()

          button.focus()
          ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `The last button has been focused.`, button)

          break
        }

        button = this.buttonElements[this.focusedButtonElementIndex - 1]
        if (!button) break

        ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Clicking the last button.`, button)
        button.click()

        break
      }
      case KeyboardEventKey.SPACE:
        if (this.focusedButtonElement) {
          ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Checking the focused button.`, this.focusedButtonElement)
          this.focusedButtonElement.check()
        }

        break
    }
  }

  clear(): void {
    super.clear()

    if (this.checkedButtonElement) {
      ElementLogger.verbose(this.uid, 'clear', `Unchecking the checked button.`, this.checkedButtonElement)
      this.checkedButtonElement.uncheck()
    }
  }

  get checkedButtonElementIndex(): number {
    return this.checkedButtonElement ? this.buttonElements.indexOf(this.checkedButtonElement) : -1
  }

  get focusedButtonElementIndex(): number {
    return this.focusedButtonElement ? this.buttonElements.indexOf(this.focusedButtonElement) : -1
  }

  get name(): ElementName {
    return ElementName.ARIA_RADIO_GROUP
  }

  get value(): any {
    return super.value
  }

  set value(value: any) {
    super.value = value
  }

  static queries: QueryDeclarations = {
    buttonElements: { selector: 'aracna-aria-radio-button', all: true },
    checkedButtonElement: { selector: 'aracna-aria-radio-button[checked]' },
    focusedButtonElement: { selector: 'aracna-aria-radio-button:focus' }
  }
}

class AriaRadioButtonElement<E extends AriaRadioButtonElementEventMap = AriaRadioButtonElementEventMap> extends BaseElement<E> {
  protected aria: AriaRadioButtonController = new AriaRadioButtonController(this)

  /**
   * Properties
   */
  /** */
  checked?: boolean
  value?: any

  /**
   * Queries
   */
  /** */
  rootElement!: AriaRadioGroupElement

  connectedCallback(): void {
    super.connectedCallback()
    this.addEventListener('click', this.onClick)
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()
    this.removeEventListener('click', this.onClick)
  }

  onClick(): void {
    if (this.rootElement.disabled || this.rootElement.readonly) {
      return ElementLogger.warn(this.uid, 'onClick', `The group is disabled or readonly.`)
    }

    if (this.rootElement.checkedButtonElement) {
      ElementLogger.verbose(this.uid, 'onClick', `Unchecking the checked button.`, this.rootElement.checkedButtonElement)
      this.rootElement.checkedButtonElement.uncheck()
    }

    ElementLogger.verbose(this.uid, 'onClick', `Checking the button.`)
    this.check()

    if (this.rootElement.focusedButtonElement) {
      ElementLogger.verbose(this.uid, 'onClick', `Blurring the focused button.`, this.rootElement.focusedButtonElement)
      this.rootElement.focusedButtonElement.blur()
    }

    this.focus()
    ElementLogger.verbose(this.uid, 'onClick', `The button has been focused.`)
  }

  check(): void {
    this.checked = true
    ElementLogger.verbose(this.uid, 'check', `The button has been checked.`)

    ElementLogger.verbose(this.uid, 'check', `Setting the value.`)
    this.rootElement.setValue(this.value)

    ElementLogger.verbose(this.uid, 'check', `Touching the group.`)
    this.rootElement.touch()

    this.dispatchEvent(new RadioButtonCheckEvent(this.value))
    ElementLogger.verbose(this.uid, 'check', `The "check" event has been dispatched.`)
  }

  uncheck(): void {
    this.checked = false
    ElementLogger.verbose(this.uid, 'uncheck', `The button has been unchecked.`)

    ElementLogger.verbose(this.uid, 'uncheck', `Touching the group.`)
    this.rootElement.touch()

    this.dispatchEvent(new RadioButtonUncheckEvent(this.value))
    ElementLogger.verbose(this.uid, 'uncheck', `The "uncheck" event has been dispatched.`)
  }

  get focused(): boolean {
    return this === document.activeElement
  }

  get index(): number {
    return this.rootElement.buttonElements.indexOf(this)
  }

  get name(): ElementName {
    return ElementName.ARIA_RADIO_BUTTON
  }

  static properties: PropertyDeclarations = {
    checked: { type: Boolean, reflect: true },
    value: {}
  }

  static queries: QueryDeclarations = {
    rootElement: { selector: 'aracna-aria-radio-group', closest: true }
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

defineCustomElement('aracna-aria-radio-group', AriaRadioGroupElement)
defineCustomElement('aracna-aria-radio-button', AriaRadioButtonElement)

export { AriaRadioButtonElement as AracnaAriaRadioButtonElement, AriaRadioGroupElement as AracnaAriaRadioGroupElement }
