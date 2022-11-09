import { removeArrayItems } from '@queelag/core'
import {
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
} from '@queelag/web'
import { PropertyDeclarations } from 'lit'
import { html } from 'lit-html'
import { map } from '../../directives/map'
import {
  AriaComboBoxButtonElement,
  AriaComboBoxElement,
  AriaComboBoxGroupElement,
  AriaComboBoxInputElement,
  AriaComboBoxListElement,
  AriaComboBoxOptionElement
} from '../aria/aria.combo.box.element'

declare global {
  interface HTMLElementTagNameMap {
    'q-select': SelectElement
    'q-select-button': SelectButtonElement
    'q-select-group': SelectGroupElement
    'q-select-input': SelectInputElement
    'q-select-list': SelectListElement
    'q-select-option': SelectOptionElement
  }
}

export class SelectElement<E extends SelectElementEventMap = SelectElementEventMap> extends AriaComboBoxElement<E> {
  /**
   * PROPERTIES
   */
  options?: SelectOption[]

  private onChange(event: InputEvent): void {
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

  get value(): any | any[] {
    return super.value
  }

  set value(value: any | any[]) {
    super.value = value
  }

  static properties: PropertyDeclarations = {
    options: { type: Array }
  }

  static queries: QueryDeclarations = {
    buttonElement: { selector: 'q-select-button' },
    groupElement: { selector: 'q-select-group' },
    inputElement: { selector: 'q-select-input' },
    listElement: { selector: 'q-select-list' },
    focusedOptionElement: { selector: 'q-select-option[focused]' },
    optionElements: { selector: 'q-select-option', all: true },
    selectedOptionElement: { selector: 'q-select-option[selected]' }
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
    rootElement: { selector: 'q-select', closest: true }
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
    rootElement: { selector: 'q-select', closest: true }
  }
}

export class SelectListElement<E extends SelectListElementEventMap = SelectListElementEventMap> extends AriaComboBoxListElement<E> {
  get name(): ElementName {
    return ElementName.SELECT_LIST
  }

  static queries: QueryDeclarations = {
    rootElement: { selector: 'q-select', closest: true }
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
    listElement: { selector: 'q-select-list', closest: true },
    rootElement: { selector: 'q-select', closest: true }
  }
}

customElements.define('q-select', SelectElement)
customElements.define('q-select-button', SelectButtonElement)
customElements.define('q-select-group', SelectGroupElement)
customElements.define('q-select-input', SelectInputElement)
customElements.define('q-select-list', SelectListElement)
customElements.define('q-select-option', SelectOptionElement)
