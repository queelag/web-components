import { ChipElementEventMap, ChipElementVariant, defineCustomElement, ElementName } from '@aracna/web'
import { PropertyDeclarations } from 'lit'
import { BaseElement } from '../core/base-element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-chip': ChipElement
  }
}

export class ChipElement<E extends ChipElementEventMap = ChipElementEventMap> extends BaseElement<E> {
  /**
   * PROPERTIES
   */
  leadingIcon?: string
  leadingImage?: string
  leadingText?: string
  text?: string
  trailingIcon?: string
  trailingImage?: string
  trailingText?: string
  variant?: ChipElementVariant

  get name(): ElementName {
    return ElementName.CHIP
  }

  static properties: PropertyDeclarations = {
    leadingIcon: { type: String, attribute: 'leading-icon', reflect: true },
    leadingImage: { type: String, attribute: 'leading-image', reflect: true },
    leadingText: { type: String, attribute: 'leading-text', reflect: true },
    text: { type: String, reflect: true },
    trialingIcon: { type: String, attribute: 'trailing-icon', reflect: true },
    trialingImage: { type: String, attribute: 'trailing-image', reflect: true },
    trialingText: { type: String, attribute: 'trailing-text', reflect: true },
    variant: { type: String, reflect: true }
  }
}

defineCustomElement('aracna-chip', ChipElement)
