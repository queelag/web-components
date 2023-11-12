import {
  DEFAULT_GET_RADIO_BUTTON_LABEL,
  DEFAULT_GET_RADIO_BUTTON_VALUE,
  defineCustomElement,
  ElementName,
  GetRadioButtonLabel,
  GetRadioButtonValue,
  QueryDeclarations,
  RadioButtonElementEventMap,
  RadioGroupElementEventMap,
  WebElementLogger
} from '@aracna/web'
import { css, CSSResultGroup, html, PropertyDeclarations } from 'lit'
import { map } from '../../directives/map.js'
import { AriaRadioButtonElement, AriaRadioGroupElement } from '../aria/aria-radio-group-element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-radio-group': RadioGroupElement
    'aracna-radio-button': RadioButtonElement
  }
}

export class RadioGroupElement<E extends RadioGroupElementEventMap = RadioGroupElementEventMap, T = any> extends AriaRadioGroupElement<E> {
  /**
   * PROPERTIES
   */
  buttons?: T[]
  getButtonLabel: GetRadioButtonLabel<T> = DEFAULT_GET_RADIO_BUTTON_LABEL
  getButtonValue: GetRadioButtonValue<T> = DEFAULT_GET_RADIO_BUTTON_VALUE

  onChange(button: T): void {
    if (this.disabled || this.readonly) {
      return WebElementLogger.warn(this.uid, 'onChange', `The radiogroup is disabled or readonly.`)
    }

    this.value = this.getButtonValue(button)
  }

  render() {
    if (this.native) {
      return map(
        this.buttons || [],
        (button: T) => html`
          <div class="button">
            <input
              @change=${() => this.onChange(button)}
              ?checked=${this.getButtonValue(button) === this.value}
              ?disabled=${this.disabled}
              name=${this.uid}
              ?readonly=${this.readonly}
              type="radio"
              value=${this.getButtonValue(button)}
            />
            <label for=${this.getButtonValue(button)}>${this.getButtonLabel(button)}</label>
          </div>
        `
      )
    }

    return super.render()
  }

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

  static styles: CSSResultGroup = [
    super.styles,
    css`
      :host([native]) div.button {
        align-items: center;
        display: flex;
        justify-content: flex-start;
        width: 100%;
      }

      :host([native]) div.button label {
        all: inherit;
      }
    `
  ]
}

export class RadioButtonElement<E extends RadioButtonElementEventMap = RadioButtonElementEventMap> extends AriaRadioButtonElement<E> {
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
