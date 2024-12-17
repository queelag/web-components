import { wf } from '@aracna/core'
import { defineCustomElement } from '@aracna/web'
import { type PropertyDeclarations } from 'lit'
import { ElementName } from '../../definitions/enums.js'
import type { FormElementEventMap } from '../../definitions/events.js'
import type { QueryDeclarations } from '../../definitions/interfaces.js'
import { ButtonClickEvent } from '../../events/button-click-event.js'
import { FormSubmitEvent } from '../../events/form-submit-event.js'
import { ElementLogger } from '../../loggers/element-logger.js'
import { AracnaBaseElement as BaseElement } from '../core/base-element.js'
import type { AracnaFormControlElement as FormControlElement } from '../core/form-control-element.js'
import type { AracnaButtonElement as ButtonElement } from './button-element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-form': FormElement
  }
}

class FormElement<E extends FormElementEventMap = FormElementEventMap, T = any> extends BaseElement<E> {
  /**
   * Properties
   */
  /** */
  async?: boolean
  disabled?: boolean
  fields?: T[]
  spinning?: boolean

  /**
   * Queries
   */
  /** */
  buttonElement?: ButtonElement
  fieldElements!: FormControlElement[]
  formElement?: HTMLFormElement

  connectedCallback(): void {
    super.connectedCallback()

    wf(() => this.buttonElement, 4).then(() => {
      this.buttonElement?.addEventListener('button-click', this.onButtonClick)
    })

    wf(() => this.formElement, 4).then(() => {
      this.setFormElementAttributes()
      this.formElement?.addEventListener('submit', this.onSubmit)
    })
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()

    this.buttonElement?.removeEventListener('button-click', this.onButtonClick)
    this.formElement?.removeEventListener('submit', this.onSubmit)
  }

  setFormElementAttributes = (): void => {
    if (!this.formElement) {
      return
    }

    this.formElement.ariaDisabled = this.disabled ? 'true' : 'false'
    this.formElement.noValidate = true
  }

  onButtonClick = (event: ButtonClickEvent): void => {
    if (typeof this.formElement?.requestSubmit === 'function') {
      ElementLogger.verbose(this.uid, 'onButtonClick', `Requesting submit.`)
      this.formElement.requestSubmit()

      return event.detail?.finalize()
    }

    if (this.formElement) {
      let input: HTMLInputElement

      input = document.createElement('input')
      input.type = 'submit'

      this.formElement.appendChild(input)
      input.click()
      this.formElement.removeChild(input)
    }

    event.detail?.finalize()
  }

  onSubmit = (event: SubmitEvent): void => {
    let valid: boolean = true

    event.preventDefault()
    event.stopPropagation()

    if (this.disabled || this.spinning) {
      return ElementLogger.warn(this.uid, 'onSubmit', `The form is disabled or spinning.`)
    }

    for (let element of this.fieldElements) {
      ElementLogger.verbose(this.uid, 'onSubmit', `Touching an element...`, element)
      element.touch()

      ElementLogger.verbose(this.uid, 'onSubmit', `Validating an element...`, element)
      element.validate()

      valid = valid && element.isValid
    }

    if (!valid) {
      return ElementLogger.warn(this.uid, 'onSubmit', `The form is not valid.`)
    }

    if (this.async) {
      this.disabled = true
      this.spinning = true

      ElementLogger.verbose(this.uid, 'onSubmit', `The disabled and spinning properties has been set to true.`)
    }

    this.dispatchEvent(new FormSubmitEvent(this.finalize))
    ElementLogger.verbose(this.uid, 'onSubmit', `The "form-submit" event has been dispatched.`)
  }

  finalize = (): void => {
    this.disabled = false
    this.spinning = false

    ElementLogger.verbose(this.uid, 'finalize', `The disabled and spinning properties have been set to false.`)
  }

  get name(): ElementName {
    return ElementName.FORM
  }

  static properties: PropertyDeclarations = {
    async: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
    fields: { type: Array },
    spinning: { type: Boolean, reflect: true }
  }

  static queries: QueryDeclarations = {
    buttonElement: { selector: '[type="submit"]' },
    fieldElements: { selector: '[form-field-element]', all: true },
    formElement: { selector: 'form' }
  }
}

defineCustomElement('aracna-form', FormElement)

export { FormElement as AracnaFormElement }
