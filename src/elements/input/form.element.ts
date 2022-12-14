import { defineCustomElement, ElementName, FormElementEventMap, FormSubmitEvent, KeyboardEventKey, QueryDeclarations, WebElementLogger } from '@queelag/web'
import { PropertyDeclarations } from 'lit'
import { html } from 'lit-html'
import { ifdef } from '../../directives/if.defined'
import { BaseElement } from '../core/base.element'
import type { FormFieldElement } from '../core/form.field.element'
import type { CheckBoxElement } from './check.box.element'
import type { InputElement } from './input.element'
import type { InputFileElement } from './input.file.element'
import type { RadioGroupElement } from './radio.group.element'
import type { SelectElement } from './select.element'
import type { SliderElement } from './slider.element'
import type { SwitchElement } from './switch.element'
import type { TextAreaElement } from './text.area.element'

declare global {
  interface HTMLElementTagNameMap {
    'q-form': FormElement
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

  private onKeyDown(event: KeyboardEvent): void {
    if (event.key !== KeyboardEventKey.ENTER) {
      return
    }

    this.formElement.requestSubmit()
  }

  private onSubmit(event: SubmitEvent): void {
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

  private get fieldElements(): FormFieldElement[] {
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
    checkBoxElements: { selector: 'q-checkbox', all: true },
    inputElements: { selector: 'q-input', all: true },
    inputFileElements: { selector: 'q-input-file', all: true },
    radioGroupElements: { selector: 'q-radio-group', all: true },
    selectElements: { selector: 'q-select', all: true },
    sliderElements: { selector: 'q-slider', all: true },
    switchElements: { selector: 'q-switch', all: true },
    textAreaElements: { selector: 'q-textarea', all: true }
  }
}

defineCustomElement('q-form', FormElement)
