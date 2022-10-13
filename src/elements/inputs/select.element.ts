import { removeArrayItems } from '@queelag/core'
import { ElementName, QueryDeclarations, SelectOption, StateChangedEvent, WebElementLogger } from '@queelag/web'
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

export class SelectElement extends AriaComboBoxElement {
  /**
   * PROPERTIES
   */
  options?: SelectOption[]

  /**
   * STATES
   */
  private searchValue: string = ''

  private onChange(event: InputEvent): void {
    let option: SelectOption | undefined

    if (this.multiple && this.native) {
      return WebElementLogger.warn(this.uid, 'onChange', `The multiple and native properties are not supported together.`)
    }

    // @ts-ignore
    option = this.findOptionByValue(event.target.value)
    if (!option) return

    this.onClickOption(option)
  }

  onClickOption(option: SelectOption): void {
    this.searchValue = ''

    if (this.multiple) {
      this.value = this.value || []
      this.value = this.value.includes(option.value) ? removeArrayItems(this.value, [option.value]) : [...this.value, option.value]

      WebElementLogger.verbose(
        this.uid,
        'onClickOption',
        `The option has been ${this.value.includes(option.value) ? 'pushed to' : 'removed from'} the value.`,
        option,
        this.value
      )

      return
    }

    this.value = option.value
    WebElementLogger.verbose(this.uid, 'onClickOption', `The value has been set.`, option, this.value)
  }

  onClickRemoveOption(option: SelectOption): void {
    if (this.multiple) {
      this.value = this.value || []
      this.value = removeArrayItems(this.value, [option])
      WebElementLogger.verbose(this.uid, 'onClickRemoveOption', `The option has been removed.`, option, this.value)

      return
    }

    WebElementLogger.warn(this.uid, 'onClickRemoveOption', `This method does not work without the multiple property.`)
  }

  onCollapse(): void {
    this.searchValue = ''
    WebElementLogger.verbose(this.uid, 'onCollapse', `The search value has been reset.`)
  }

  onEscape(): void {
    this.searchValue = ''
    WebElementLogger.verbose(this.uid, 'onEscape', `The search value has been reset.`)
  }

  onSearchInput = (event: Event): void => {
    let old: string = this.searchValue

    // @ts-ignore
    this.searchValue = event.target.value
    WebElementLogger.verbose(this.uid, 'onSearchInput', `The search value has been set.`, [this.searchValue])

    this.dispatchEvent(new StateChangedEvent('searchValue', old, this.searchValue))
  }

  clear(): void {
    this.searchValue = ''
    this.value = this.multiple ? [] : ''
  }

  findOptionLabelByValue(value: any): string | undefined {
    return this.findOptionByValue(value)?.label
  }

  findOptionByValue(value: any): SelectOption | undefined {
    return this.options?.find((option: SelectOption) => option.value === value)
  }

  filterOptionsBySearchValue(options?: SelectOption[]): SelectOption[] | undefined {
    return options?.filter((option: SelectOption) => String(option.label).includes(this.searchValue) || String(option.value).includes(this.searchValue))
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

  get optionsFilteredBySearchValue(): SelectOption[] | undefined {
    return this.filterOptionsBySearchValue(this.options)
  }

  get selectedOption(): SelectOption | undefined {
    return this.findOptionByValue(this.value)
  }

  get value(): any | any[] {
    return super.value
  }

  set value(value: any | any[]) {
    super.value = value
  }

  static properties: PropertyDeclarations = {
    options: { type: Array },
    searchValue: { state: true }
  }

  static queries: QueryDeclarations = {
    buttonElement: { selector: 'q-select-button' },
    groupElement: { selector: 'q-select-group' },
    inputElement: { selector: 'q-select-input' },
    listElement: { selector: 'q-select-list' },
    focusedOptionElement: { selector: 'q-select-option[focused]' },
    optionElements: { selector: 'q-select-option', all: true },
    selectOptionElement: { selector: 'q-select-option[selected]' }
  }
}

export class SelectGroupElement extends AriaComboBoxGroupElement {
  get name(): ElementName {
    return ElementName.SELECT_GROUP
  }
}

export class SelectButtonElement extends AriaComboBoxButtonElement {
  get name(): ElementName {
    return ElementName.SELECT_BUTTON
  }

  static queries: QueryDeclarations = {
    rootElement: { selector: 'q-select', closest: true }
  }
}

export class SelectInputElement extends AriaComboBoxInputElement {
  get name(): ElementName {
    return ElementName.SELECT_INPUT
  }

  static queries: QueryDeclarations = {
    inputElement: { selector: 'input' },
    rootElement: { selector: 'q-select', closest: true }
  }
}

export class SelectListElement extends AriaComboBoxListElement {
  get name(): ElementName {
    return ElementName.SELECT_LIST
  }

  static queries: QueryDeclarations = {
    rootElement: { selector: 'q-select', closest: true }
  }
}

export class SelectOptionElement extends AriaComboBoxOptionElement {
  label?: string
  value?: any

  onClick = (): void => {
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
    label: { type: String, reflect: true },
    value: {}
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
