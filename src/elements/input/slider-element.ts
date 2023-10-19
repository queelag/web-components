import { parseNumber } from '@aracna/core'
import {
  DEFAULT_SLIDER_MAX,
  DEFAULT_SLIDER_MIN,
  DEFAULT_SLIDER_STEP,
  DEFAULT_SLIDER_THUMB_VALUE,
  ElementName,
  QueryDeclarations,
  SliderElementEventMap,
  SliderThumbElementEventMap,
  WebElementLogger,
  defineCustomElement
} from '@aracna/web'
import { CSSResultGroup, css } from 'lit'
import { html } from 'lit-html'
import { AriaSliderElement, AriaSliderThumbElement } from '../aria/aria-slider-element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-slider': SliderElement
    'aracna-slider-thumb': SliderThumbElement
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

  static queries: QueryDeclarations = {
    inputElement: { selector: 'input', shadow: true },
    thumbElements: { selector: 'aracna-slider-thumb', all: true }
  }

  static styles: CSSResultGroup = [
    super.styles,
    css`
      :host([native]) input {
        all: inherit;
      }
    `
  ]
}

export class SliderThumbElement<E extends SliderThumbElementEventMap = SliderThumbElementEventMap> extends AriaSliderThumbElement<E> {
  get name(): ElementName {
    return ElementName.SLIDER_THUMB
  }

  static queries: QueryDeclarations = {
    rootElement: { selector: 'aracna-slider', closest: true }
  }
}

defineCustomElement('aracna-slider', SliderElement)
defineCustomElement('aracna-slider-thumb', SliderThumbElement)
