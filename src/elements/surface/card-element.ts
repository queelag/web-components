import { defineCustomElement } from '@aracna/web'
import type { PropertyDeclarations } from 'lit'
import { ElementName } from '../../definitions/enums.js'
import type { CardElementEventMap } from '../../definitions/events.js'
import { AracnaBaseElement as BaseElement } from '../core/base-element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-card': CardElement
  }
}

class CardElement<E extends CardElementEventMap = CardElementEventMap, T = any> extends BaseElement<E> {
  /**
   * Properties
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

export { CardElement as AracnaCardElement }
