import { ButtonElementAttributes, ButtonGroupElementEventMap, defineCustomElement, ElementName } from '@queelag/web'
import { PropertyDeclarations } from 'lit'
import { BaseElement } from '../core/base.element'

declare global {
  interface HTMLElementTagNameMap {
    'q-button-group': ButtonGroupElement
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

defineCustomElement('q-button-group', ButtonGroupElement)
