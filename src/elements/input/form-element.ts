import { wf } from '@aracna/core'
import {
  ButtonClickEvent,
  defineCustomElement,
  ElementName,
  FormElementEventMap,
  FormSubmitEvent,
  KeyboardEventKey,
  QueryDeclarations,
  WebElementLogger
} from '@aracna/web'
import { css, CSSResultGroup, PropertyDeclarations } from 'lit'
import { html } from 'lit-html'
import { ifdef } from '../../directives/if-defined.js'
import { BaseElement } from '../core/base-element.js'
import type { FormFieldElement } from '../core/form-field-element.js'
import type { ButtonElement } from './button-element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-form': FormElement
  }
}

export class FormElement<E extends FormElementEventMap = FormElementEventMap> extends BaseElement<E> {
  /**
   * PROPERTIES
   */
  async?: boolean
  disabled?: boolean
  spinning?: boolean

  /**
   * QUERIES
   */
  buttonElement?: ButtonElement
  fieldElements!: FormFieldElement[]
  formElement!: HTMLFormElement

  connectedCallback(): void {
    super.connectedCallback()
    wf(() => this.buttonElement).then(() => this.buttonElement?.addEventListener('button-click', this.onButtonClick))
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()
    this.buttonElement?.removeEventListener('button-click', this.onButtonClick)
  }

  onButtonClick = (event: ButtonClickEvent): void => {
    this.formElement.dispatchEvent(new SubmitEvent('submit'))
    event.detail?.finalize()
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key !== KeyboardEventKey.ENTER) {
      return
    }

    this.formElement.dispatchEvent(new SubmitEvent('submit'))
  }

  onSubmit(event: SubmitEvent): void {
    let valid: boolean = true

    event.preventDefault()
    event.stopPropagation()

    if (this.disabled || this.spinning) {
      return WebElementLogger.warn(this.uid, 'onSubmit', `The form is disabled or spinning.`)
    }

    for (let element of this.fieldElements) {
      element.touch()
      valid = valid && element.isValid
    }

    if (!valid) {
      return WebElementLogger.warn(this.uid, 'onSubmit', `The form is not valid.`)
    }

    if (this.async) {
      this.disabled = true
      this.spinning = true
      WebElementLogger.verbose(this.uid, 'onSubmit', `The disabled and spinning properties has been set to true.`)
    }

    this.dispatchEvent(new FormSubmitEvent(this.finalize))
    WebElementLogger.verbose(this.uid, 'onSubmit', `The "form-submit" event has been dispatched.`)
  }

  finalize = (): void => {
    this.disabled = false
    this.spinning = false
    WebElementLogger.verbose(this.uid, 'finalize', `The disabled and spinning properties have been set to false.`)
  }

  render() {
    return html`
      <form aria-disabled=${ifdef(this.disabled)} @keydown=${this.onKeyDown} @submit=${this.onSubmit} novalidate>
        <slot></slot>
      </form>
    `
  }

  get name(): ElementName {
    return ElementName.FORM
  }

  static properties: PropertyDeclarations = {
    async: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
    spinning: { type: Boolean, reflect: true }
  }

  static queries: QueryDeclarations = {
    buttonElement: { selector: 'aracna-button[type="submit"]' },
    fieldElements: { selector: '[form-field-element]', all: true },
    formElement: { selector: 'form', shadow: true }
  }

  static styles: CSSResultGroup = [
    super.styles,
    css`
      form {
        height: 100%;
        width: 100%;
      }
    `
  ]
}

defineCustomElement('aracna-form', FormElement)
