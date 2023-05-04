import { AriaAlertElementEventMap, defineCustomElement, ElementName } from '@aracna/web'
import { AriaAlertController } from '../../controllers/aria.alert.controller.js'
import { BaseElement } from '../core/base.element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-aria-alert': AriaAlertElement
  }
}

export class AriaAlertElement<E extends AriaAlertElementEventMap = AriaAlertElementEventMap> extends BaseElement<E> {
  protected aria: AriaAlertController = new AriaAlertController(this)

  get name(): ElementName {
    return ElementName.ARIA_ALERT
  }
}

defineCustomElement('aracna-aria-alert', AriaAlertElement)
