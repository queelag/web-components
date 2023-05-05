import {
  defineCustomElement,
  ElementName,
  QueryDeclarations,
  RadioButton,
  RadioButtonElementEventMap,
  RadioGroupElementEventMap,
  WebElementLogger
} from '@aracna/web'
import { html, PropertyDeclarations } from 'lit'
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

  private onChange(event: InputEvent): void {
    let button: RadioButton | undefined

    if (this.disabled || this.readonly) {
      return WebElementLogger.warn(this.uid, 'onChange', `The radiogroup is disabled or readonly.`)
    }

    // @ts-ignore
    button = this.findButtonByValue(event.target.value)
    if (!button) return

    this.value = button.value
  }

  render() {
    if (this.native) {
      return map(
        this.buttons || [],
        (button: RadioButton) => html`
          <div>
            <input
              @change=${this.onChange}
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

  clear(): void {
    super.clear()
    this.checkedButtonElement?.uncheck()
  }

  findButtonByValue(value: any): RadioButton | undefined {
    return this.buttons?.find((option: RadioButton) => option.value === value)
  }

  get name(): ElementName {
    return ElementName.RADIO_GROUP
  }

  get value(): any | undefined {
    return super.value
  }

  set value(value: any | undefined) {
    super.value = value
  }

  static properties: PropertyDeclarations = {
    buttons: { type: Array }
  }

  static queries: QueryDeclarations = {
    buttonElements: { selector: 'aracna-radio-button', all: true },
    checkedButtonElement: { selector: 'aracna-radio-button[checked]' },
    focusedButtonElement: { selector: 'aracna-radio-button:focus' }
  }
}

export class RadioButtonElement<E extends RadioButtonElementEventMap = RadioButtonElementEventMap> extends AriaRadioButtonElement<E> {
  label?: string
  value?: any

  check(): void {
    super.check()

    this.rootElement.value = this.value
    WebElementLogger.verbose(this.uid, 'check', `The radio group value has been set.`, [this.value])
  }

  get name(): ElementName {
    return ElementName.RADIO_BUTTON
  }

  static properties: PropertyDeclarations = {
    label: { type: String, reflect: true },
    value: {}
  }

  static queries: QueryDeclarations = {
    rootElement: { selector: 'aracna-radio-group', closest: true }
  }
}

defineCustomElement('aracna-radio-group', RadioGroupElement)
defineCustomElement('aracna-radio-button', RadioButtonElement)