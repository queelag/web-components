import { BreadcrumbElementEventMap, BreadcrumbItemElementEventMap, BreadcrumbListElementEventMap, defineCustomElement, ElementName } from '@aracna/web'
import { PropertyDeclarations } from 'lit'
import { AriaBreadcrumbElement, AriaBreadcrumbItemElement, AriaBreadcrumbListElement } from '../aria/aria-breadcrumb-element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-breadcrumb': BreadcrumbElement
    'aracna-breadcrumb-item': BreadcrumbItemElement
    'aracna-breadcrumb-list': BreadcrumbListElement
  }
}

export class BreadcrumbElement<E extends BreadcrumbElementEventMap = BreadcrumbElementEventMap, T = any> extends AriaBreadcrumbElement<E> {
  items?: T[]

  get name(): ElementName {
    return ElementName.BREADCRUMB
  }

  static properties: PropertyDeclarations = {
    items: { type: Array }
  }
}

export class BreadcrumbListElement<E extends BreadcrumbListElementEventMap = BreadcrumbListElementEventMap> extends AriaBreadcrumbListElement<E> {
  get name(): ElementName {
    return ElementName.BREADCRUMB_LIST
  }
}

export class BreadcrumbItemElement<E extends BreadcrumbItemElementEventMap = BreadcrumbItemElementEventMap> extends AriaBreadcrumbItemElement<E> {
  get name(): ElementName {
    return ElementName.BREADCRUMB_ITEM
  }
}

defineCustomElement('aracna-breadcrumb', BreadcrumbElement)
defineCustomElement('aracna-breadcrumb-item', BreadcrumbItemElement)
defineCustomElement('aracna-breadcrumb-list', BreadcrumbListElement)
