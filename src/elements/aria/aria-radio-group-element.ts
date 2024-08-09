import { defineCustomElement, KeyboardEventKey } from '@aracna/web'
import { css, type CSSResultGroup, type PropertyDeclarations } from 'lit'
import { AriaRadioButtonController, AriaRadioGroupController } from '../../controllers/aria-radio-group-controller.js'
import { ElementName } from '../../definitions/enums.js'
import type { AriaRadioButtonElementEventMap, AriaRadioGroupElementEventMap } from '../../definitions/events.js'
import type { QueryDeclarations } from '../../definitions/interfaces.js'
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
   * QUERIES
   */
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
    }

    if (this.disabled || this.readonly) {
      return ElementLogger.warn(this.uid, 'onKeyDown', `The group is disabled or readonly.`)
    }

    switch (event.key) {
      case KeyboardEventKey.ARROW_DOWN:
      case KeyboardEventKey.ARROW_LEFT:
      case KeyboardEventKey.ARROW_RIGHT:
      case KeyboardEventKey.ARROW_UP:
        this.checkedButtonElement?.uncheck()
    }

    switch (event.key) {
      case KeyboardEventKey.ARROW_DOWN:
      case KeyboardEventKey.ARROW_RIGHT:
        if (this.focusedButtonElementIndex >= this.buttonElements.length - 1) {
          this.buttonElements[0]?.check()
          this.buttonElements[0]?.focus()
          ElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_DOWN or ARROW_RIGHT', `The first button has been checked and focused.`)

          return
        }

        this.buttonElements[this.focusedButtonElementIndex + 1]?.check()
        this.buttonElements[this.focusedButtonElementIndex + 1]?.focus()
        ElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_DOWN or ARROW_RIGHT', `The next button has been checked and focused.`)

        break
      case KeyboardEventKey.ARROW_UP:
      case KeyboardEventKey.ARROW_LEFT:
        if (this.focusedButtonElementIndex <= 0) {
          this.buttonElements[this.buttonElements.length - 1]?.check()
          this.buttonElements[this.buttonElements.length - 1]?.focus()
          ElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_UP or ARROW_LEFT', `The last button has been checked and focused.`)

          return
        }

        this.buttonElements[this.focusedButtonElementIndex - 1]?.click()
        ElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_UP or ARROW_LEFT', `The previous button has been checked and focused.`)

        break
      case KeyboardEventKey.SPACE:
        this.focusedButtonElement?.check()
        ElementLogger.verbose(this.uid, 'onKeyDown', 'SPACE', `The focused button has been checked.`)

        break
    }
  }

  clear(): void {
    super.clear()
    this.checkedButtonElement?.uncheck()
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
   * PROPERTIES
   */
  checked?: boolean
  value?: any

  /**
   * QUERIES
   */
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

    this.rootElement.checkedButtonElement?.uncheck()

    this.check()
    ElementLogger.verbose(this.uid, 'onClick', `The button has been checked.`)

    this.rootElement.focusedButtonElement?.blur()

    this.focus()
    ElementLogger.verbose(this.uid, 'onClick', `The button has been focused.`)
  }

  check(): void {
    this.checked = true
    this.rootElement.value = this.value

    this.rootElement.touch()
  }

  uncheck(): void {
    this.checked = false
    this.rootElement.touch()
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
