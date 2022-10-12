import { DEFAULT_SLIDER_MAX, DEFAULT_SLIDER_MIN, DEFAULT_SLIDER_STEP, ElementName } from '@queelag/web'
import { html } from 'lit-html'
import { FormFieldElement } from '../core/form.field.element'

declare global {
  interface HTMLElementTagNameMap {
    'q-slider': SliderElement
  }
}

export class SliderElement extends FormFieldElement {
  max?: number
  min?: number
  native?: boolean
  step?: number

  render() {
    if (this.native) {
      return html`
        <input
          max=${this.max ?? DEFAULT_SLIDER_MAX}
          min=${this.min ?? DEFAULT_SLIDER_MIN}
          step=${this.step ?? DEFAULT_SLIDER_STEP}
          type="range"
          value=${this.value as number}
        />
      `
    }

    return html`<slot></slot>`
  }

  get name(): ElementName {
    return ElementName.SLIDER
  }

  get value(): number | number[] {
    return super.value
  }
}

customElements.define('q-slider', SliderElement)
