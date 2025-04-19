import { tcp, wf } from '@aracna/core'
import { defineCustomElement } from '@aracna/web'
import { type PropertyDeclarations } from 'lit'
import { ElementSlug } from '../../definitions/enums.js'
import type { ButtonElementEventMap } from '../../definitions/events.js'
import { QueryDeclarations } from '../../definitions/interfaces.js'
import type { ButtonClickCallbackFn, ButtonType, ButtonVariant } from '../../definitions/types.js'
import { ButtonClickEvent } from '../../events/button-click-event.js'
import { ElementLogger } from '../../loggers/element-logger.js'
import { AracnaAriaButtonElement as AriaButtonElement } from '../aria/aria-button-element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-button': ButtonElement
  }
}

class ButtonElement<E extends ButtonElementEventMap = ButtonElementEventMap> extends AriaButtonElement<E> {
  /**
   * Properties
   */
  /** */
  async?: boolean
  icon?: string
  spinning?: boolean
  text?: string
  type?: ButtonType
  variant?: ButtonVariant

  connectedCallback(): void {
    super.connectedCallback()
    wf(() => this.buttonElement, 4).then(this.setButtonElementAttributes)
  }

  attributeChangedCallback(name: string, _old: string | null, value: string | null): void {
    super.attributeChangedCallback(name, _old, value)

    if (Object.is(_old, value)) {
      return
    }

    if (['disabled', 'label', 'pressed', 'text', 'type'].includes(name)) {
      this.setButtonElementAttributes()
    }
  }

  setButtonElementAttributes = (): void => {
    if (!this.buttonElement) {
      return
    }

    this.buttonElement.ariaLabel = this.label ?? null
    this.buttonElement.ariaPressed = this.pressed ?? null
    this.buttonElement.disabled = Boolean(this.disabled)

    if (typeof this.type === 'string') {
      this.buttonElement.type = this.type as any
    }
  }

  blur(): void {
    if (!this.buttonElement) {
      return super.blur()
    }

    this.buttonElement.blur()
    ElementLogger.verbose(this.uid, 'blur', 'The button element has been blurred.')
  }

  click(): void {
    if (this.spinning) {
      return ElementLogger.warn(this.uid, 'click', `The button is spinning.`)
    }

    super.click()
  }

  focus(options?: FocusOptions): void {
    if (!this.buttonElement) {
      return super.focus(options)
    }

    this.buttonElement.focus(options)
    ElementLogger.verbose(this.uid, 'focus', 'The button element has been focused.')
  }

  onClick = (): void => {
    if (this.disabled || this.spinning) {
      return ElementLogger.warn(this.uid, 'onClick', `The button is disabled or spinning.`)
    }

    if (this.async) {
      this.disabled = true
      this.spinning = true

      ElementLogger.verbose(this.uid, 'onClick', `The disabled and spinning properties have been set to true.`)
    }

    this.dispatchEvent(new ButtonClickEvent(this.callback))
    ElementLogger.verbose(this.uid, 'onClick', `The "button-click" event has been dispatched.`)
  }

  callback = async (fn?: ButtonClickCallbackFn): Promise<void> => {
    if (fn) {
      await tcp(() => fn())
    }

    if (this.async) {
      this.disabled = false
      this.spinning = false

      ElementLogger.verbose(this.uid, 'callback', `The disabled and spinning properties have been set to false.`)
    }
  }

  get label(): string | undefined {
    return super.label ?? this.text
  }

  set label(label: string | undefined) {
    super.label = label
  }

  get slug(): ElementSlug {
    return ElementSlug.BUTTON
  }

  static properties: PropertyDeclarations = {
    async: { type: Boolean, reflect: true },
    icon: { type: String, reflect: true },
    spinning: { type: Boolean, reflect: true },
    text: { type: String, reflect: true },
    type: { type: String, reflect: true },
    variant: { type: String, reflect: true }
  }

  static queries: QueryDeclarations = {
    buttonElement: { selector: 'button' }
  }
}

defineCustomElement('aracna-button', ButtonElement)

export { ButtonElement as AracnaButtonElement }
