import { CardElementEventMap, ElementName, defineCustomElement } from '@aracna/web'
import { PropertyDeclarations } from 'lit'
import { BaseElement } from '../core/base-element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-card': CardElement
  }
}

export class CardElement<E extends CardElementEventMap = CardElementEventMap, T = any> extends BaseElement<E> {
  /**
   * PROPERTIES
   */
  buttons?: T[]
  headline?: string
  image?: string
  subhead?: string
  text?: string

  get name(): ElementName {
    return ElementName.CARD
  }

  static properties: PropertyDeclarations = {
    buttons: { type: Array },
    headline: { type: String, reflect: true },
    image: { type: String, reflect: true },
    subhead: { type: String, reflect: true },
    text: { type: String, reflect: true }
  }
}

defineCustomElement('aracna-card', CardElement)
