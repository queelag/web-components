import { parseNumber } from '@queelag/core'
import {
  DEFAULT_SLIDER_MAX,
  DEFAULT_SLIDER_MIN,
  DEFAULT_SLIDER_STEP,
  DEFAULT_SLIDER_THUMB_VALUE,
  ElementName,
  QueryDeclarations,
  SliderElementEventMap,
  SliderThumbElementEventMap,
  WebElementLogger
} from '@queelag/web'
import { html } from 'lit-html'
import { AriaSliderElement, AriaSliderThumbElement } from '../aria/aria.slider.element'

declare global {
  interface HTMLElementTagNameMap {
    'q-slider': SliderElement
    'q-slider-thumb': SliderThumbElement
  }
}

export class SliderElement<E extends SliderElementEventMap = SliderElementEventMap> extends AriaSliderElement<E> {
  inputElement!: HTMLInputElement

  onInput(): void {
    if (this.disabled || this.readonly) {
      return WebElementLogger.warn(this.uid, 'onInput', `The slider is disabled or readonly.`)
    }

    this.value = this.inputElement.value ? parseNumber(this.inputElement.value) : DEFAULT_SLIDER_THUMB_VALUE
  }

  render() {
    if (this.native) {
      return html`
        <input
          @input=${this.onInput}
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
    inputElement: { selector: 'input', shadow: true },
    thumbElements: { selector: 'q-slider-thumb', all: true }
  }
}

export class SliderThumbElement<E extends SliderThumbElementEventMap = SliderThumbElementEventMap> extends AriaSliderThumbElement<E> {
  get name(): ElementName {
    return ElementName.SLIDER_THUMB
  }

  setValue(value: number): void {
    super.setValue(value)

    if (this.rootElement.hasMultipleThumbs) {
      this.rootElement.value = this.rootElement.value || this.rootElement.values
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
