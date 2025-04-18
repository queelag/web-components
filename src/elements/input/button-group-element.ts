import { defineCustomElement } from '@aracna/web'
import type { PropertyDeclarations } from 'lit'
import { ElementSlug } from '../../definitions/enums.js'
import type { ButtonGroupElementEventMap } from '../../definitions/events.js'
import { AracnaBaseElement as BaseElement } from '../core/base-element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-button-group': ButtonGroupElement
  }
}

class ButtonGroupElement<E extends ButtonGroupElementEventMap = ButtonGroupElementEventMap, T = any> extends BaseElement<E> {
  /**
   * Properties
   */
  /** */
  buttons?: T[]

  get slug(): ElementSlug {
    return ElementSlug.BUTTON_GROUP
  }

  static properties: PropertyDeclarations = {
    buttons: { type: Array }
  }
}

defineCustomElement('aracna-button-group', ButtonGroupElement)

export { ButtonGroupElement as AracnaButtonGroupElement }
