import { ButtonElementAttributes, ElementName } from '@queelag/web'
import { PropertyDeclarations } from 'lit'
import { BaseElement } from './core/base.element'

export class ButtonGroupElement extends BaseElement {
  buttons?: ButtonElementAttributes[]

  get name(): ElementName {
    return ElementName.BUTTON_GROUP
  }

  static properties: PropertyDeclarations = {
    buttons: { type: Array }
  }
}
