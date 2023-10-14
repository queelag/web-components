import { defineCustomElement, ElementName, ListElementEventMap, ListItemElementEventMap } from '@aracna/web'
import { AriaListController, AriaListItemController } from '../../controllers/aria-list-controller.js'
import { BaseElement } from '../core/base-element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-aria-list': AriaListElement
    'aracna-aria-list-item': AriaListItemElement
  }
}

export class AriaListElement<E extends ListElementEventMap = ListElementEventMap> extends BaseElement<E> {
  protected aria: AriaListController = new AriaListController(this)

  get name(): ElementName {
    return ElementName.ARIA_LIST
  }
}

export class AriaListItemElement<E extends ListItemElementEventMap = ListItemElementEventMap> extends BaseElement<E> {
  protected aria: AriaListItemController = new AriaListItemController(this)

  get name(): ElementName {
    return ElementName.ARIA_LIST_ITEM
  }
}

defineCustomElement('aracna-aria-list', AriaListElement)
defineCustomElement('aracna-aria-list-item', AriaListItemElement)
