import { defineCustomElement } from '@aracna/web'
import { type PropertyDeclarations } from 'lit'
import { DEFAULT_GET_RADIO_BUTTON_LABEL, DEFAULT_GET_RADIO_BUTTON_VALUE } from '../../definitions/constants.js'
import { ElementName } from '../../definitions/enums.js'
import type { RadioButtonElementEventMap, RadioGroupElementEventMap } from '../../definitions/events.js'
import type { QueryDeclarations } from '../../definitions/interfaces.js'
import type { GetRadioButtonLabel, GetRadioButtonValue } from '../../definitions/types.js'
import {
  AracnaAriaRadioButtonElement as AriaRadioButtonElement,
  AracnaAriaRadioGroupElement as AriaRadioGroupElement
} from '../aria/aria-radio-group-element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-radio-group': RadioGroupElement
    'aracna-radio-button': RadioButtonElement
  }
}

class RadioGroupElement<E extends RadioGroupElementEventMap = RadioGroupElementEventMap, T = any> extends AriaRadioGroupElement<E> {
  /**
   * Properties
   */
  /** */
  buttons?: T[]
  getButtonLabel: GetRadioButtonLabel<T> = DEFAULT_GET_RADIO_BUTTON_LABEL
  getButtonValue: GetRadioButtonValue<T> = DEFAULT_GET_RADIO_BUTTON_VALUE

  get name(): ElementName {
    return ElementName.RADIO_GROUP
  }

  static properties: PropertyDeclarations = {
    buttons: { type: Array },
    getButtonLabel: { type: Function, attribute: 'get-button-label' },
    getButtonValue: { type: Function, attribute: 'get-button-value' }
  }

  static queries: QueryDeclarations = {
    buttonElements: { selector: 'aracna-radio-button', all: true },
    checkedButtonElement: { selector: 'aracna-radio-button[checked]' },
    focusedButtonElement: { selector: 'aracna-radio-button:focus' }
  }
}

class RadioButtonElement<E extends RadioButtonElementEventMap = RadioButtonElementEventMap> extends AriaRadioButtonElement<E> {
  /**
   * Properties
   */
  /** */
  headline?: string
  icon?: string
  text?: string

  get name(): ElementName {
    return ElementName.RADIO_BUTTON
  }

  static properties: PropertyDeclarations = {
    headline: { type: String, reflect: true },
    icon: { type: String, reflect: true },
    text: { type: String, reflect: true }
  }

  static queries: QueryDeclarations = {
    rootElement: { selector: 'aracna-radio-group', closest: true }
  }
}

defineCustomElement('aracna-radio-group', RadioGroupElement)
defineCustomElement('aracna-radio-button', RadioButtonElement)

export { RadioButtonElement as AracnaRadioButtonElement, RadioGroupElement as AracnaRadioGroupElement }
