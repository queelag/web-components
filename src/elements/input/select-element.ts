import { isArray, removeArrayItems } from '@aracna/core'
import { defineCustomElement } from '@aracna/web'
import { type CSSResultGroup, type PropertyDeclarations, css, html } from 'lit'
import { DEFAULT_GET_SELECT_OPTION_LABEL, DEFAULT_GET_SELECT_OPTION_VALUE } from '../../definitions/constants.js'
import { ElementName } from '../../definitions/enums.js'
import type {
  SelectButtonElementEventMap,
  SelectElementEventMap,
  SelectGroupElementEventMap,
  SelectInputElementEventMap,
  SelectListElementEventMap,
  SelectOptionElementEventMap
} from '../../definitions/events.js'
import type { QueryDeclarations } from '../../definitions/interfaces.js'
import type { GetSelectOptionLabel, GetSelectOptionValue } from '../../definitions/types.js'
import { map } from '../../directives/map.js'
import { ElementLogger } from '../../loggers/element-logger.js'
import { findSelectOptionByValue } from '../../utils/select-element-utils.js'
import {
  AracnaAriaComboBoxButtonElement as AriaComboBoxButtonElement,
  AracnaAriaComboBoxElement as AriaComboBoxElement,
  AracnaAriaComboBoxGroupElement as AriaComboBoxGroupElement,
  AracnaAriaComboBoxInputElement as AriaComboBoxInputElement,
  AracnaAriaComboBoxListElement as AriaComboBoxListElement,
  AracnaAriaComboBoxOptionElement as AriaComboBoxOptionElement
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

class SelectElement<E extends SelectElementEventMap = SelectElementEventMap, T = any> extends AriaComboBoxElement<E> {
  /**
   * Properties
   */
  getOptionLabel: GetSelectOptionLabel<T> = DEFAULT_GET_SELECT_OPTION_LABEL
  getOptionValue: GetSelectOptionValue<T> = DEFAULT_GET_SELECT_OPTION_VALUE
  options?: T[]
  selectElement?: HTMLSelectElement

  onChange(): void {
    let option: T | undefined

    if (this.multiple && this.native) {
      return ElementLogger.warn(this.uid, 'onChange', `The multiple and native properties are not supported together.`)
    }

    option = findSelectOptionByValue(this.options ?? [], this.selectElement?.value)
    if (!option) return

    if (this.multiple) {
      this.value = isArray(this.value) ? this.value : []
      this.value = this.value.includes(this.getOptionValue(option))
        ? removeArrayItems(this.value, [this.getOptionValue(option)])
        : [...this.value, this.getOptionValue(option)]

      return
    }

    this.value = this.getOptionValue(option)
    ElementLogger.verbose(this.uid, 'onChange', `The value has been set.`, option, this.value)
  }

  removeOption(option: T): void {
    super.removeOption(this.getOptionValue(option))
  }

  render() {
    if (this.native) {
      return html`
        <select @change=${this.onChange} ?disabled=${this.disabled ?? this.readonly}>
          ${map(
            this.options ?? [],
            (option: T) =>
              html`<option ?selected=${this.getOptionValue(option) === this.value} value=${this.getOptionValue(option)}>${this.getOptionLabel(option)}</option>`
          )}
        </select>
      `
    }

    return html`<slot></slot>`
  }

  get name(): ElementName {
    return ElementName.SELECT
  }

  static properties: PropertyDeclarations = {
    getOptionLabel: { type: Function, attribute: 'get-option-label' },
    getOptionValue: { type: Function, attribute: 'get-option-value' },
    options: { type: Array }
  }

  static queries: QueryDeclarations = {
    buttonElement: { selector: 'aracna-select-button' },
    groupElement: { selector: 'aracna-select-group' },
    inputElement: { selector: 'aracna-select-input' },
    listElement: { selector: 'aracna-select-list' },
    focusedOptionElement: { selector: 'aracna-select-option[focused]' },
    optionElements: { selector: 'aracna-select-option', all: true },
    selectElement: { selector: 'select', shadow: true },
    selectedOptionElement: { selector: 'aracna-select-option[selected]' },
    selectedOptionElements: {
      selector: 'aracna-select-option[selected]',
      all: true
    }
  }

  static styles: CSSResultGroup = [
    super.styles,
    css`
      :host([native]) select {
        width: 100%;
      }
    `
  ]
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

defineCustomElement('aracna-select', SelectElement)
defineCustomElement('aracna-select-button', SelectButtonElement)
defineCustomElement('aracna-select-group', SelectGroupElement)
defineCustomElement('aracna-select-input', SelectInputElement)
defineCustomElement('aracna-select-list', SelectListElement)
defineCustomElement('aracna-select-option', SelectOptionElement)

export {
  SelectButtonElement as AracnaSelectButtonElement,
  SelectElement as AracnaSelectElement,
  SelectGroupElement as AracnaSelectGroupElement,
  SelectInputElement as AracnaSelectInputElement,
  SelectListElement as AracnaSelectListElement,
  SelectOptionElement as AracnaSelectOptionElement
}
