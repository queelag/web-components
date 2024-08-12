import { parseNumber } from '@aracna/core'
import { defineCustomElement } from '@aracna/web'
import { type CSSResultGroup, type PropertyDeclarations, css, html } from 'lit'
import { DEFAULT_SLIDER_MAX, DEFAULT_SLIDER_MIN, DEFAULT_SLIDER_STEP, DEFAULT_SLIDER_THUMB_VALUE } from '../../definitions/constants.js'
import { ElementName } from '../../definitions/enums.js'
import type { SliderElementEventMap, SliderThumbElementEventMap } from '../../definitions/events.js'
import type { QueryDeclarations } from '../../definitions/interfaces.js'
import { ElementLogger } from '../../loggers/element-logger.js'
import { AracnaAriaSliderElement as AriaSliderElement, AracnaAriaSliderThumbElement as AriaSliderThumbElement } from '../aria/aria-slider-element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-slider': SliderElement
    'aracna-slider-thumb': SliderThumbElement
  }
}

class SliderElement<E extends SliderElementEventMap = SliderElementEventMap, T = any> extends AriaSliderElement<E> {
  /**
   * Properties
   */
  /** */
  inputElement!: HTMLInputElement
  thumbs?: T[]

  onInput(): void {
    if (this.disabled || this.readonly) {
      return ElementLogger.warn(this.uid, 'onInput', `The slider is disabled or readonly.`)
    }

    ElementLogger.verbose(this.uid, 'onInput', `Setting the value.`)
    this.setValue(this.inputElement.value ? parseNumber(this.inputElement.value) : DEFAULT_SLIDER_THUMB_VALUE)
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

  static properties: PropertyDeclarations = {
    thumbs: { type: Array }
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

class SliderThumbElement<E extends SliderThumbElementEventMap = SliderThumbElementEventMap> extends AriaSliderThumbElement<E> {
  get name(): ElementName {
    return ElementName.SLIDER_THUMB
  }

  static queries: QueryDeclarations = {
    rootElement: { selector: 'aracna-slider', closest: true }
  }
}

defineCustomElement('aracna-slider', SliderElement)
defineCustomElement('aracna-slider-thumb', SliderThumbElement)

export { SliderElement as AracnaSliderElement, SliderThumbElement as AracnaSliderThumbElement }
