import { defineCustomElement, ListBoxElementEventMap, ListBoxOptionElementEventMap, QueryDeclarations } from '@aracna/web'
import { PropertyDeclarations } from 'lit'
import { AriaListBoxElement, AriaListBoxOptionElement } from '../aria/aria-list-box-element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-listbox': ListBoxElement
    'aracna-listbox-option': ListBoxOptionElement
  }
}

export class ListBoxElement<E extends ListBoxElementEventMap = ListBoxElementEventMap, T = any> extends AriaListBoxElement<E> {
  /**
   * PROPERTIES
   */
  options?: T[]

  static properties: PropertyDeclarations = {
    options: { type: Array }
  }

  static queries: QueryDeclarations = {
    focusedOptionElement: { selector: 'aracna-listbox-option[focused]' },
    optionElements: { selector: 'aracna-listbox-option', all: true },
    selectedOptionElement: { selector: 'aracna-listbox-option[selected]' }
  }
}

export class ListBoxOptionElement<E extends ListBoxOptionElementEventMap = ListBoxOptionElementEventMap> extends AriaListBoxOptionElement<E> {
  /**
   * PROPERTIES
   */
  headline?: string
  leadingIcon?: string
  leadingImage?: string
  leadingText?: string
  text?: string
  trailingIcon?: string
  trailingImage?: string
  trailingText?: string

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
    rootElement: { selector: 'aracna-listbox', closest: true }
  }
}

defineCustomElement('aracna-listbox', ListBoxElement)
defineCustomElement('aracna-listbox-option', ListBoxOptionElement)
