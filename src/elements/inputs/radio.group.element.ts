import { ElementName, RadioButton } from '@queelag/web'
import { html, PropertyDeclarations } from 'lit'
import { map } from '../../directives/map'
import { FormFieldElement } from '../core/form.field.element'

declare global {
  interface HTMLElementTagNameMap {
    'q-radio-group': RadioGroupElement
  }
}

export class RadioGroupElement extends FormFieldElement {
  buttons?: RadioButton[]
  native?: boolean

  private onChange(event: InputEvent): void {
    let button: RadioButton | undefined

    // @ts-ignore
    button = this.findButtonByValue(event.target.value)
    if (!button) return

    this.value = button.value
  }

  render() {
    if (this.native) {
      return map(
        this.buttons,
        (button: RadioButton) => html`
          <div>
            <input @change=${this.onChange} ?checked=${button.value === this.value} name=${this.uid} type="radio" value=${button.value} />
            <label for=${button.value}>${button.value}</label>
          </div>
        `
      )
    }

    return html`<slot></slot>`
  }

  findButtonByValue(value: any): RadioButton | undefined {
    return this.buttons?.find((option: RadioButton) => option.value === value)
  }

  get name(): ElementName {
    return ElementName.RADIO_GROUP
  }

  static properties: PropertyDeclarations = {
    ...super.properties,
    buttons: { type: Array },
    native: { type: Boolean, reflect: true }
  }
}

customElements.define('q-radio-group', RadioGroupElement)
