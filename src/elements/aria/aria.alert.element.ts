import { AriaAlertElementEventMap, defineCustomElement, ElementName } from '@queelag/web'
import { AriaAlertController } from '../../controllers/aria.alert.controller'
import { BaseElement } from '../core/base.element'

declare global {
  interface HTMLElementTagNameMap {
    'q-aria-alert': AriaAlertElement
  }
}

export class AriaAlertElement<E extends AriaAlertElementEventMap = AriaAlertElementEventMap> extends BaseElement<E> {
  protected aria: AriaAlertController = new AriaAlertController(this)

  get name(): ElementName {
    return ElementName.ARIA_ALERT
  }
}

defineCustomElement('q-aria-alert', AriaAlertElement)
