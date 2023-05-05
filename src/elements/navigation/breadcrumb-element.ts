import { BreadcrumbElementEventMap, BreadcrumbItemElementEventMap, BreadcrumbListElementEventMap, defineCustomElement, ElementName } from '@aracna/web'
import { AriaBreadcrumbElement, AriaBreadcrumbItemElement, AriaBreadcrumbListElement } from '../aria/aria-breadcrumb-element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-breadcrumb': BreadcrumbElement
    'aracna-breadcrumb-item': BreadcrumbItemElement
    'aracna-breadcrumb-list': BreadcrumbListElement
  }
}

export class BreadcrumbElement<E extends BreadcrumbElementEventMap = BreadcrumbElementEventMap> extends AriaBreadcrumbElement<E> {
  get name(): ElementName {
    return ElementName.BREADCRUMB
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
