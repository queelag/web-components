import {
  defineCustomElement,
  ElementName,
  QueryDeclarations,
  RadioButton,
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

export class RadioGroupElement<E extends RadioGroupElementEventMap = RadioGroupElementEventMap> extends AriaRadioGroupElement<E> {
  /**
   * PROPERTIES
   */
  buttons?: RadioButton[]

  onChange(button: RadioButton): void {
    if (this.disabled || this.readonly) {
      return WebElementLogger.warn(this.uid, 'onChange', `The radiogroup is disabled or readonly.`)
    }

    this.value = button.value
  }

  render() {
    if (this.native) {
      return map(
        this.buttons || [],
        (button: RadioButton) => html`
          <div class="button">
            <input
              @change=${() => this.onChange(button)}
              ?checked=${button.value === this.value}
              ?disabled=${this.disabled}
              name=${this.uid}
              ?readonly=${this.readonly}
              type="radio"
              value=${button.value}
            />
            <label for=${button.value}>${button.value}</label>
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
    buttons: { type: Array }
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
  get name(): ElementName {
    return ElementName.RADIO_BUTTON
  }

  static queries: QueryDeclarations = {
    rootElement: { selector: 'aracna-radio-group', closest: true }
  }
}

defineCustomElement('aracna-radio-group', RadioGroupElement)
defineCustomElement('aracna-radio-button', RadioButtonElement)
