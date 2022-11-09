import { AriaRadioButtonElementEventMap, AriaRadioGroupElementEventMap, ElementName, KeyboardEventKey, QueryDeclarations, WebElementLogger } from '@queelag/web'
import { css, CSSResultGroup, PropertyDeclarations } from 'lit'
import { AriaRadioButtonController, AriaRadioGroupController } from '../../controllers/aria.radio.group.controller'
import { BaseElement } from '../core/base.element'
import { FormFieldElement } from '../core/form.field.element'

declare global {
  interface HTMLElementTagNameMap {
    'q-aria-radio-button': AriaRadioButtonElement
    'q-aria-radio-group': AriaRadioGroupElement
  }
}

export class AriaRadioGroupElement<E extends AriaRadioGroupElementEventMap = AriaRadioGroupElementEventMap> extends FormFieldElement<E> {
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
      return WebElementLogger.warn(this.uid, 'onKeyDown', `The group is disabled or readonly.`)
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
          WebElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_DOWN or ARROW_RIGHT', `The first button has been checked and focused.`)

          return
        }

        this.buttonElements[this.focusedButtonElementIndex + 1]?.check()
        this.buttonElements[this.focusedButtonElementIndex + 1]?.focus()
        WebElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_DOWN or ARROW_RIGHT', `The next button has been checked and focused.`)

        break
      case KeyboardEventKey.ARROW_UP:
      case KeyboardEventKey.ARROW_LEFT:
        if (this.focusedButtonElementIndex <= 0) {
          this.buttonElements[this.buttonElements.length - 1]?.check()
          this.buttonElements[this.buttonElements.length - 1]?.focus()
          WebElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_UP or ARROW_LEFT', `The last button has been checked and focused.`)

          return
        }

        this.buttonElements[this.focusedButtonElementIndex - 1]?.click()
        WebElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_UP or ARROW_LEFT', `The previous button has been checked and focused.`)

        break
      case KeyboardEventKey.SPACE:
        this.focusedButtonElement?.check()
        WebElementLogger.verbose(this.uid, 'onKeyDown', 'SPACE', `The focused button has been checked.`)

        break
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

  static queries: QueryDeclarations = {
    buttonElements: { selector: 'q-aria-radio-button', all: true },
    checkedButtonElement: { selector: 'q-aria-radio-button[checked]' },
    focusedButtonElement: { selector: 'q-aria-radio-button:focus' }
  }
}

export class AriaRadioButtonElement<E extends AriaRadioButtonElementEventMap = AriaRadioButtonElementEventMap> extends BaseElement<E> {
  protected aria: AriaRadioButtonController = new AriaRadioButtonController(this)

  /**
   * PROPERTIES
   */
  checked?: boolean

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
      return WebElementLogger.warn(this.uid, 'onClick', `The group is disabled or readonly.`)
    }

    this.rootElement.checkedButtonElement?.uncheck()

    this.check()
    WebElementLogger.verbose(this.uid, 'onClick', `The button has been checked.`)

    this.rootElement.focusedButtonElement?.blur()

    this.focus()
    WebElementLogger.verbose(this.uid, 'onClick', `The button has been focused.`)
  }

  check(): void {
    this.checked = true
  }

  uncheck(): void {
    this.checked = false
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
    checked: { type: Boolean, reflect: true }
  }

  static queries: QueryDeclarations = {
    rootElement: { selector: 'q-aria-radio-group', closest: true }
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

customElements.define('q-aria-radio-group', AriaRadioGroupElement)
customElements.define('q-aria-radio-button', AriaRadioButtonElement)
