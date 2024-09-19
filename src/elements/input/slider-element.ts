import { parseNumber, wf } from '@aracna/core'
import { defineCustomElement } from '@aracna/web'
import { type PropertyDeclarations } from 'lit'
import { DEFAULT_SLIDER_THUMB_VALUE } from '../../definitions/constants.js'
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
  thumbs?: T[]

  connectedCallback(): void {
    super.connectedCallback()

    wf(() => this.inputElement, 4).then(() => {
      this.setInputElementAttributes()
      this.inputElement?.addEventListener('input', this.onInput)
    })
  }

  attributeChangedCallback(name: string, _old: string | null, value: string | null): void {
    super.attributeChangedCallback(name, _old, value)

    if (Object.is(_old, value)) {
      return
    }

    if (['disabled', 'max', 'min', 'readonly', 'step'].includes(name)) {
      this.setInputElementAttributes()
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()
    this.inputElement?.removeEventListener('input', this.onInput)
  }

  setInputElementAttributes = (): void => {
    if (!this.inputElement) {
      return
    }

    this.inputElement.disabled = Boolean(this.disabled)
    this.inputElement.max = this.max.toString()
    this.inputElement.min = this.min.toString()
    this.inputElement.readOnly = Boolean(this.readonly)
    this.inputElement.step = this.step.toString()
    this.inputElement.type = 'range'
  }

  onInput = (): void => {
    if (this.disabled || this.readonly) {
      return ElementLogger.warn(this.uid, 'onInput', `The slider is disabled or readonly.`)
    }

    if (this.inputElement) {
      ElementLogger.verbose(this.uid, 'onInput', `Setting the value.`)
      this.setValue(this.inputElement.value ? parseNumber(this.inputElement.value) : DEFAULT_SLIDER_THUMB_VALUE)
    }
  }

  get name(): ElementName {
    return ElementName.SLIDER
  }

  get value(): number | number[] | undefined {
    return super.value
  }

  set value(value: number | number[] | undefined) {
    super.value = value

    if (this.inputElement) {
      this.inputElement.value = value?.toString() ?? DEFAULT_SLIDER_THUMB_VALUE.toString()
    }
  }

  static properties: PropertyDeclarations = {
    thumbs: { type: Array }
  }

  static queries: QueryDeclarations = {
    inputElement: { selector: 'input' },
    thumbElements: { selector: 'aracna-slider-thumb', all: true }
  }
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
