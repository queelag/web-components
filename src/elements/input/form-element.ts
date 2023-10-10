import { defineCustomElement, ElementName, FormElementEventMap, FormSubmitEvent, KeyboardEventKey, QueryDeclarations, WebElementLogger } from '@aracna/web'
import { css, CSSResultGroup, PropertyDeclarations } from 'lit'
import { html } from 'lit-html'
import { ifdef } from '../../directives/if-defined.js'
import { BaseElement } from '../core/base-element.js'
import type { FormFieldElement } from '../core/form-field-element.js'
import type { CheckBoxElement } from './check-box-element.js'
import type { InputElement } from './input-element.js'
import type { InputFileElement } from './input-file-element.js'
import type { RadioGroupElement } from './radio-group-element.js'
import type { SelectElement } from './select-element.js'
import type { SliderElement } from './slider-element.js'
import type { SwitchElement } from './switch-element.js'
import type { TextAreaElement } from './text-area-element.js'

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
  formElement!: HTMLFormElement
  checkBoxElements!: CheckBoxElement[]
  inputElements!: InputElement[]
  inputFileElements!: InputFileElement[]
  radioGroupElements!: RadioGroupElement[]
  selectElements!: SelectElement[]
  sliderElements!: SliderElement[]
  switchElements!: SwitchElement[]
  textAreaElements!: TextAreaElement[]

  onKeyDown(event: KeyboardEvent): void {
    if (event.key !== KeyboardEventKey.ENTER) {
      return
    }

    this.formElement.requestSubmit()
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

  get fieldElements(): FormFieldElement[] {
    return [
      ...this.checkBoxElements,
      ...this.inputElements,
      ...this.inputFileElements,
      ...this.radioGroupElements,
      ...this.selectElements,
      ...this.sliderElements,
      ...this.switchElements,
      ...this.textAreaElements
    ]
  }

  static properties: PropertyDeclarations = {
    async: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
    spinning: { type: Boolean, reflect: true }
  }

  static queries: QueryDeclarations = {
    formElement: { selector: 'form', shadow: true },
    checkBoxElements: { selector: 'aracna-checkbox', all: true },
    inputElements: { selector: 'aracna-input', all: true },
    inputFileElements: { selector: 'aracna-input-file', all: true },
    radioGroupElements: { selector: 'aracna-radio-group', all: true },
    selectElements: { selector: 'aracna-select', all: true },
    sliderElements: { selector: 'aracna-slider', all: true },
    switchElements: { selector: 'aracna-switch', all: true },
    textAreaElements: { selector: 'aracna-textarea', all: true }
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
