import { defineCustomElement } from '@aracna/web'
import { AriaListController, AriaListItemController } from '../../controllers/aria-list-controller.js'
import { ElementSlug } from '../../definitions/enums.js'
import type { ListElementEventMap, ListItemElementEventMap } from '../../definitions/events.js'
import { AracnaBaseElement as BaseElement } from '../core/base-element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-aria-list': AriaListElement
    'aracna-aria-list-item': AriaListItemElement
  }
}

class AriaListElement<E extends ListElementEventMap = ListElementEventMap> extends BaseElement<E> {
  protected aria: AriaListController = new AriaListController(this)

  get slug(): ElementSlug {
    return ElementSlug.ARIA_LIST
  }
}

class AriaListItemElement<E extends ListItemElementEventMap = ListItemElementEventMap> extends BaseElement<E> {
  protected aria: AriaListItemController = new AriaListItemController(this)

  get slug(): ElementSlug {
    return ElementSlug.ARIA_LIST_ITEM
  }
}

defineCustomElement('aracna-aria-list', AriaListElement)
defineCustomElement('aracna-aria-list-item', AriaListItemElement)

export { AriaListElement as AracnaAriaListElement, AriaListItemElement as AracnaAriaListItemElement }
