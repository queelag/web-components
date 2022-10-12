import { ButtonElementAttributes, ElementName } from '@queelag/web'
import { BaseElement } from './core/base.element'

export class ButtonGroupElement extends BaseElement {
  buttons?: ButtonElementAttributes[]

  get name(): ElementName {
    return ElementName.BUTTON_GROUP
  }
}
