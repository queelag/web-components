import { defineCustomElement } from '@aracna/web'
import type { PropertyDeclarations } from 'lit'
import { ElementName } from '../../definitions/enums.js'
import type { ChipElementEventMap } from '../../definitions/events.js'
import type { ChipElementVariant } from '../../definitions/types.js'
import { AracnaBaseElement as BaseElement } from '../core/base-element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-chip': ChipElement
  }
}

class ChipElement<E extends ChipElementEventMap = ChipElementEventMap> extends BaseElement<E> {
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
    trailingIcon: { type: String, attribute: 'trailing-icon', reflect: true },
    trailingImage: { type: String, attribute: 'trailing-image', reflect: true },
    trailingText: { type: String, attribute: 'trailing-text', reflect: true },
    variant: { type: String, reflect: true }
  }
}

defineCustomElement('aracna-chip', ChipElement)

export { ChipElement as AracnaChipElement }
