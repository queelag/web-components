import { removeArrayItems } from '@queelag/core'
import { ElementName, SelectOption, StateChangedEvent, WebElementLogger } from '@queelag/web'
import { PropertyDeclarations } from 'lit'
import { html } from 'lit-html'
import { map } from '../directives/map'
import { FormFieldElement } from './core/form.field.element'

declare global {
  interface HTMLElementTagNameMap {
    'q-select': SelectElement
  }
}

export class SelectElement extends FormFieldElement {
  /**
   * PROPERTIES
   */
  multiple?: boolean
  native?: boolean
  normalized?: boolean
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
            (option: SelectOption) => html` <option ?selected=${option.value === this.value} value=${option.value}>${option.label || option.value}</option> `
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
    ...super.properties,
    multiple: { type: Boolean, reflect: true },
    native: { type: Boolean, reflect: true },
    normalized: { type: Boolean, reflect: true },
    options: { type: Array },
    searchValue: { state: true }
  }
}

customElements.define('q-select', SelectElement)
