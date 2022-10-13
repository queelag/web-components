import { DEFAULT_SLIDER_MAX, DEFAULT_SLIDER_MIN, DEFAULT_SLIDER_STEP, ElementName, QueryDeclarations } from '@queelag/web'
import { html } from 'lit-html'
import { AriaSliderElement, AriaSliderThumbElement } from '../aria/aria.slider.element'

declare global {
  interface HTMLElementTagNameMap {
    'q-slider': SliderElement
    'q-slider-thumb': SliderThumbElement
  }
}

export class SliderElement extends AriaSliderElement {
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

    return super.render()
  }

  get name(): ElementName {
    return ElementName.SLIDER
  }

  get value(): number | number[] | undefined {
    return super.value
  }

  set value(value: number | number[] | undefined) {
    super.value = value
  }

  static queries: QueryDeclarations = {
    thumbElements: { selector: 'q-slider-thumb', all: true }
  }
}

export class SliderThumbElement extends AriaSliderThumbElement {
  get name(): ElementName {
    return ElementName.SLIDER_THUMB
  }

  set value(value: number | undefined) {
    super.value = value

    if (this.rootElement.hasMultipleThumbs) {
      this.rootElement.value = this.rootElement.value || []
      this.rootElement.value[this.index] = value

      return
    }

    this.rootElement.value = value
  }

  static queries: QueryDeclarations = {
    rootElement: { selector: 'q-slider', closest: true }
  }
}

customElements.define('q-slider', SliderElement)
customElements.define('q-slider-thumb', SliderThumbElement)
