import { isArray, removeArrayItems, wf } from '@aracna/core'
import { defineCustomElement } from '@aracna/web'
import { type PropertyDeclarations } from 'lit'
import { DEFAULT_GET_SELECT_OPTION_LABEL, DEFAULT_GET_SELECT_OPTION_VALUE } from '../../definitions/constants.js'
import { ElementName } from '../../definitions/enums.js'
import type {
  SelectButtonElementEventMap,
  SelectClearElementEventMap,
  SelectElementEventMap,
  SelectGroupElementEventMap,
  SelectInputElementEventMap,
  SelectListElementEventMap,
  SelectOptionElementEventMap,
  SelectOptionRemoveElementEventMap
} from '../../definitions/events.js'
import type { QueryDeclarations } from '../../definitions/interfaces.js'
import type { GetSelectOptionLabel, GetSelectOptionValue } from '../../definitions/types.js'
import { ElementLogger } from '../../loggers/element-logger.js'
import { findSelectOptionByValue } from '../../utils/select-element-utils.js'
import {
  AracnaAriaComboBoxButtonElement as AriaComboBoxButtonElement,
  AracnaAriaComboBoxClearElement as AriaComboBoxClearElement,
  AracnaAriaComboBoxElement as AriaComboBoxElement,
  AracnaAriaComboBoxGroupElement as AriaComboBoxGroupElement,
  AracnaAriaComboBoxInputElement as AriaComboBoxInputElement,
  AracnaAriaComboBoxListElement as AriaComboBoxListElement,
  AracnaAriaComboBoxOptionElement as AriaComboBoxOptionElement,
  AracnaAriaComboBoxOptionRemoveElement as AriaComboBoxOptionRemoveElement
} from '../aria/aria-combo-box-element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-select': SelectElement
    'aracna-select-button': SelectButtonElement
    'aracna-select-clear': SelectClearElement
    'aracna-select-group': SelectGroupElement
    'aracna-select-input': SelectInputElement
    'aracna-select-list': SelectListElement
    'aracna-select-option': SelectOptionElement
    'aracna-select-option-remove': SelectOptionRemoveElement
  }
}

class SelectElement<E extends SelectElementEventMap = SelectElementEventMap, T = any> extends AriaComboBoxElement<E> {
  /**
   * Properties
   */
  /** */
  getOptionLabel: GetSelectOptionLabel<T> = DEFAULT_GET_SELECT_OPTION_LABEL
  getOptionValue: GetSelectOptionValue<T> = DEFAULT_GET_SELECT_OPTION_VALUE
  options?: T[]
  placeholder?: string

  /**
   * Queries
   */
  selectOptionElements!: HTMLOptionElement[]

  connectedCallback(): void {
    super.connectedCallback()

    wf(() => this.selectElement, 4).then(() => {
      this.setSelectElementAttributes()
      this.selectElement?.addEventListener('change', this.onChange)
    })
  }

  attributeChangedCallback(name: string, _old: string | null, value: string | null): void {
    super.attributeChangedCallback(name, _old, value)

    if (Object.is(_old, value)) {
      return
    }

    if (['disabled', 'readonly'].includes(name)) {
      this.setSelectElementAttributes()
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()
    this.selectElement?.removeEventListener('change', this.onChange)
  }

  setSelectElementAttributes = (): void => {
    if (!this.selectElement) {
      return
    }

    if (typeof this.disabled === 'boolean') {
      this.selectElement.disabled = this.disabled
    } else if (typeof this.readonly === 'boolean') {
      this.selectElement.disabled = this.readonly
    }
  }

  onChange = (): void => {
    let option: T | undefined

    if (this.multiple && this.selectElement) {
      return ElementLogger.warn(this.uid, 'onChange', `The multiple property is not supported when the select element is defined.`)
    }

    option = findSelectOptionByValue<any>(this.options ?? this.selectOptionElements, this.selectElement?.value)
    if (!option) return ElementLogger.warn(this.uid, 'onChange', `Failed to find the option.`)

    if (this.multiple) {
      let value: unknown[]

      value = isArray(this.value) ? this.value : []
      value = value.includes(this.getOptionValue(option))
        ? removeArrayItems(this.value, [this.getOptionValue(option)])
        : [...this.value, this.getOptionValue(option)]

      ElementLogger.verbose(this.uid, 'onChange', `Adding the option to the value.`, option)
      this.setValue(value)

      return
    }

    ElementLogger.verbose(this.uid, 'onChange', `Setting the value.`, option)
    this.setValue(this.getOptionValue(option))
  }

  clear(): void {
    super.clear()

    if (this.selectElement) {
      this.selectElement.value = ''
    }
  }

  removeOption(option: T): void {
    super.removeOption(this.getOptionValue(option))
  }

  get name(): ElementName {
    return ElementName.SELECT
  }

  static properties: PropertyDeclarations = {
    getOptionLabel: { type: Function, attribute: 'get-option-label' },
    getOptionValue: { type: Function, attribute: 'get-option-value' },
    options: { type: Array },
    placeholder: { type: String, reflect: true }
  }

  static queries: QueryDeclarations = {
    buttonElement: { selector: 'aracna-select-button' },
    groupElement: { selector: 'aracna-select-group' },
    inputElement: { selector: 'aracna-select-input' },
    listElement: { selector: 'aracna-select-list' },
    focusedOptionElement: { selector: 'aracna-select-option[focused]' },
    optionElements: { selector: 'aracna-select-option', all: true },
    selectElement: { selector: 'select' },
    selectOptionElements: { selector: 'option', all: true },
    selectedOptionElement: { selector: 'aracna-select-option[selected]' },
    selectedOptionElements: {
      selector: 'aracna-select-option[selected]',
      all: true
    }
  }
}

class SelectGroupElement<E extends SelectGroupElementEventMap = SelectGroupElementEventMap> extends AriaComboBoxGroupElement<E> {
  get name(): ElementName {
    return ElementName.SELECT_GROUP
  }
}

class SelectButtonElement<E extends SelectButtonElementEventMap = SelectButtonElementEventMap> extends AriaComboBoxButtonElement<E> {
  get name(): ElementName {
    return ElementName.SELECT_BUTTON
  }

  static queries: QueryDeclarations = {
    rootElement: { selector: 'aracna-select', closest: true }
  }
}

class SelectInputElement<E extends SelectInputElementEventMap = SelectInputElementEventMap> extends AriaComboBoxInputElement<E> {
  get name(): ElementName {
    return ElementName.SELECT_INPUT
  }

  static queries: QueryDeclarations = {
    inputElement: { selector: 'input' },
    rootElement: { selector: 'aracna-select', closest: true }
  }
}

class SelectListElement<E extends SelectListElementEventMap = SelectListElementEventMap> extends AriaComboBoxListElement<E> {
  get name(): ElementName {
    return ElementName.SELECT_LIST
  }

  static queries: QueryDeclarations = {
    rootElement: { selector: 'aracna-select', closest: true }
  }
}

class SelectOptionElement<E extends SelectOptionElementEventMap = SelectOptionElementEventMap> extends AriaComboBoxOptionElement<E> {
  /**
   * Properties
   */
  /** */
  headline?: string
  leadingIcon?: string
  leadingImage?: string
  leadingText?: string
  text?: string
  trailingIcon?: string
  trailingImage?: string
  trailingText?: string

  get label(): string | undefined {
    return this.headline ?? super.label
  }

  set label(label: string | undefined) {
    super.label = label
  }

  get name(): ElementName {
    return ElementName.SELECT_OPTION
  }

  static properties: PropertyDeclarations = {
    headline: { type: String, reflect: true },
    leadingIcon: { type: String, attribute: 'leading-icon', reflect: true },
    leadingImage: { type: String, attribute: 'leading-image', reflect: true },
    leadingText: { type: String, attribute: 'leading-text', reflect: true },
    text: { type: String, reflect: true },
    trailingIcon: { type: String, attribute: 'trailing-icon', reflect: true },
    trailingImage: { type: String, attribute: 'trailing-image', reflect: true },
    trailingText: { type: String, attribute: 'trailing-text', reflect: true }
  }

  static queries: QueryDeclarations = {
    listElement: { selector: 'aracna-select-list', closest: true },
    rootElement: { selector: 'aracna-select', closest: true }
  }
}

class SelectOptionRemoveElement<E extends SelectOptionRemoveElementEventMap = SelectOptionRemoveElementEventMap> extends AriaComboBoxOptionRemoveElement<E> {
  get name(): ElementName {
    return ElementName.SELECT_OPTION_REMOVE
  }

  static queries: QueryDeclarations = {
    rootElement: { selector: 'aracna-select', closest: true }
  }
}

class SelectClearElement<E extends SelectClearElementEventMap = SelectClearElementEventMap> extends AriaComboBoxClearElement<E> {
  get name(): ElementName {
    return ElementName.SELECT_CLEAR
  }

  static queries: QueryDeclarations = {
    rootElement: { selector: 'aracna-select', closest: true }
  }
}

defineCustomElement('aracna-select', SelectElement)
defineCustomElement('aracna-select-button', SelectButtonElement)
defineCustomElement('aracna-select-clear', SelectClearElement)
defineCustomElement('aracna-select-group', SelectGroupElement)
defineCustomElement('aracna-select-input', SelectInputElement)
defineCustomElement('aracna-select-list', SelectListElement)
defineCustomElement('aracna-select-option', SelectOptionElement)
defineCustomElement('aracna-select-option-remove', SelectOptionRemoveElement)

export {
  SelectButtonElement as AracnaSelectButtonElement,
  SelectClearElement as AracnaSelectClearElement,
  SelectElement as AracnaSelectElement,
  SelectGroupElement as AracnaSelectGroupElement,
  SelectInputElement as AracnaSelectInputElement,
  SelectListElement as AracnaSelectListElement,
  SelectOptionElement as AracnaSelectOptionElement,
  SelectOptionRemoveElement as AracnaSelectOptionRemoveElement
}
