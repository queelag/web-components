import { ButtonElementAttributes, ButtonGroupElementEventMap, defineCustomElement, ElementName } from '@aracna/web'
import { PropertyDeclarations } from 'lit'
import { BaseElement } from '../core/base.element'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-button-group': ButtonGroupElement
  }
}

export class ButtonGroupElement<E extends ButtonGroupElementEventMap = ButtonGroupElementEventMap> extends BaseElement<E> {
  buttons?: ButtonElementAttributes[]

  get name(): ElementName {
    return ElementName.BUTTON_GROUP
  }

  static properties: PropertyDeclarations = {
    buttons: { type: Array }
  }
}

defineCustomElement('aracna-button-group', ButtonGroupElement)
