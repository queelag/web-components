import { BreadcrumbElementEventMap, BreadcrumbItemElementEventMap, BreadcrumbListElementEventMap, ElementName } from '@queelag/web'
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

customElements.define('q-breadcrumb', BreadcrumbElement)
customElements.define('q-breadcrumb-item', BreadcrumbItemElement)
customElements.define('q-breadcrumb-list', BreadcrumbListElement)
