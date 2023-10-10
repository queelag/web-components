import { removeArrayItems } from '@aracna/core'
import {
  defineCustomElement,
  ElementName,
  QueryDeclarations,
  SelectButtonElementEventMap,
  SelectElementEventMap,
  SelectGroupElementEventMap,
  SelectInputElementEventMap,
  SelectListElementEventMap,
  SelectOption,
  SelectOptionElementEventMap,
  WebElementLogger
} from '@aracna/web'
import { PropertyDeclarations } from 'lit'
import { html } from 'lit-html'
import { map } from '../../directives/map.js'
import {
  AriaComboBoxButtonElement,
  AriaComboBoxElement,
  AriaComboBoxGroupElement,
  AriaComboBoxInputElement,
  AriaComboBoxListElement,
  AriaComboBoxOptionElement
} from '../aria/aria-combo-box-element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-select': SelectElement
    'aracna-select-button': SelectButtonElement
    'aracna-select-group': SelectGroupElement
    'aracna-select-input': SelectInputElement
    'aracna-select-list': SelectListElement
    'aracna-select-option': SelectOptionElement
  }
}

export class SelectElement<E extends SelectElementEventMap = SelectElementEventMap> extends AriaComboBoxElement<E> {
  /**
   * PROPERTIES
   */
  options?: SelectOption[]

  onChange(event: InputEvent): void {
    let option: SelectOption | undefined

    if (this.multiple && this.native) {
      return WebElementLogger.warn(this.uid, 'onChange', `The multiple and native properties are not supported together.`)
    }

    // @ts-ignore
    option = this.findOptionByValue(event.target.value)
    if (!option) return

    if (this.multiple) {
      this.value = this.value || []
      this.value = this.value.includes(option.value) ? removeArrayItems(this.value, [option.value]) : [...this.value, option.value]

      return
    }

    this.value = option.value
    WebElementLogger.verbose(this.uid, 'onChange', `The value has been set.`, option, this.value)
  }

  removeOption(option: SelectOption): void {
    if (this.single) {
      return
    }

    this.value = this.value || []
    this.value = removeArrayItems(this.value, [option.value])

    WebElementLogger.verbose(this.uid, 'removeOption', `The option has been removed.`, option, this.value)
  }

  clear(): void {
    // this.searchValue = ''
    this.selectedOptionElement?.unselect()
    this.value = this.multiple ? [] : undefined
  }

  findOptionLabelByValue(value: any): string | undefined {
    return this.findOptionByValue(value)?.label
  }

  findOptionByValue(value: any): SelectOption | undefined {
    return this.options?.find((option: SelectOption) => option.value === value)
  }

  render() {
    if (this.native) {
      return html`
        <select @change=${this.onChange} ?disabled=${this.disabled || this.readonly}>
          ${map(
            this.options || [],
            (option: SelectOption) => html`<option ?selected=${option.value === this.value} value=${option.value}>${option.label || option.value}</option>`
          )}
        </select>
      `
    }

    return html`<slot></slot>`
  }

  get name(): ElementName {
    return ElementName.SELECT
  }

  get selectedOption(): SelectOption | undefined {
    return this.findOptionByValue(this.value)
  }

  get single(): boolean {
    return !this.multiple
  }

  static properties: PropertyDeclarations = {
    options: { type: Array }
  }

  static queries: QueryDeclarations = {
    buttonElement: { selector: 'aracna-select-button' },
    groupElement: { selector: 'aracna-select-group' },
    inputElement: { selector: 'aracna-select-input' },
    listElement: { selector: 'aracna-select-list' },
    focusedOptionElement: { selector: 'aracna-select-option[focused]' },
    optionElements: { selector: 'aracna-select-option', all: true },
    selectedOptionElement: { selector: 'aracna-select-option[selected]' }
  }
}

export class SelectGroupElement<E extends SelectGroupElementEventMap = SelectGroupElementEventMap> extends AriaComboBoxGroupElement<E> {
  get name(): ElementName {
    return ElementName.SELECT_GROUP
  }
}

export class SelectButtonElement<E extends SelectButtonElementEventMap = SelectButtonElementEventMap> extends AriaComboBoxButtonElement<E> {
  get name(): ElementName {
    return ElementName.SELECT_BUTTON
  }

  static queries: QueryDeclarations = {
    rootElement: { selector: 'aracna-select', closest: true }
  }
}

export class SelectInputElement<E extends SelectInputElementEventMap = SelectInputElementEventMap> extends AriaComboBoxInputElement<E> {
  clear(): void {
    super.clear()
    this.rootElement.clear()
  }

  get name(): ElementName {
    return ElementName.SELECT_INPUT
  }

  static queries: QueryDeclarations = {
    inputElement: { selector: 'input' },
    rootElement: { selector: 'aracna-select', closest: true }
  }
}

export class SelectListElement<E extends SelectListElementEventMap = SelectListElementEventMap> extends AriaComboBoxListElement<E> {
  get name(): ElementName {
    return ElementName.SELECT_LIST
  }

  static queries: QueryDeclarations = {
    rootElement: { selector: 'aracna-select', closest: true }
  }
}

export class SelectOptionElement<E extends SelectOptionElementEventMap = SelectOptionElementEventMap> extends AriaComboBoxOptionElement<E> {
  label?: string

  onClick(): void {
    super.onClick()

    if (this.rootElement.disabled || this.rootElement.readonly) {
      return
    }

    if (this.rootElement.multiple) {
      this.rootElement.value = this.rootElement.value || []
      this.rootElement.value = this.rootElement.value.includes(this.value)
        ? removeArrayItems(this.rootElement.value, [this.value])
        : [...this.rootElement.value, this.value]

      return
    }

    this.rootElement.value = this.value
  }

  get name(): ElementName {
    return ElementName.SELECT_OPTION
  }

  static properties: PropertyDeclarations = {
    label: { type: String, reflect: true }
  }

  static queries: QueryDeclarations = {
    listElement: { selector: 'aracna-select-list', closest: true },
    rootElement: { selector: 'aracna-select', closest: true }
  }
}

defineCustomElement('aracna-select', SelectElement)
defineCustomElement('aracna-select-button', SelectButtonElement)
defineCustomElement('aracna-select-group', SelectGroupElement)
defineCustomElement('aracna-select-input', SelectInputElement)
defineCustomElement('aracna-select-list', SelectListElement)
defineCustomElement('aracna-select-option', SelectOptionElement)
