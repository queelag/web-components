import { ChipElementVariant, ElementName } from '@queelag/web'
import { PropertyDeclarations } from 'lit'
import { BaseElement } from '../core/base.element'

declare global {
  interface HTMLElementTagNameMap {
    'q-chip': ChipElement
  }
}

export class ChipElement extends BaseElement {
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

customElements.define('q-chip', ChipElement)
