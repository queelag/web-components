import { BreadcrumbElementEventMap, BreadcrumbItemElementEventMap, BreadcrumbListElementEventMap, defineCustomElement, ElementName } from '@queelag/web'
import { AriaBreadcrumbElement, AriaBreadcrumbItemElement, AriaBreadcrumbListElement } from '../aria/aria.breadcrumb.element'

declare global {
  interface HTMLElementTagNameMap {
    'q-breadcrumb': BreadcrumbElement
    'q-breadcrumb-item': BreadcrumbItemElement
    'q-breadcrumb-list': BreadcrumbListElement
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

defineCustomElement('q-breadcrumb', BreadcrumbElement)
defineCustomElement('q-breadcrumb-item', BreadcrumbItemElement)
defineCustomElement('q-breadcrumb-list', BreadcrumbListElement)
