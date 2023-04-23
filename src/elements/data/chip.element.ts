import { ChipElementEventMap, ChipElementVariant, defineCustomElement, ElementName } from '@aracna/web'
import { PropertyDeclarations } from 'lit'
import { BaseElement } from '../core/base.element'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-chip': ChipElement
  }
}

export class ChipElement<E extends ChipElementEventMap = ChipElementEventMap> extends BaseElement<E> {
  /**
   * PROPERTIES
   */
  icon?: string
  image?: string
  label?: string
  leadingIcon?: string
  trailingIcon?: string
  variant?: ChipElementVariant

  get name(): ElementName {
    return ElementName.CHIP
  }

  static properties: PropertyDeclarations = {
    icon: { type: String, reflect: true },
    image: { type: String, reflect: true },
    label: { type: String, reflect: true },
    leadingIcon: { type: String, attribute: 'leading-icon', reflect: true },
    trialingIcon: { type: String, attribute: 'trailing-icon', reflect: true },
    variant: { type: String, reflect: true }
  }
}

defineCustomElement('aracna-chip', ChipElement)
