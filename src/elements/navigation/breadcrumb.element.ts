import { ElementName } from '@queelag/web'
import { AriaBreadcrumbElement, AriaBreadcrumbItemElement, AriaBreadcrumbListElement } from '../aria/aria.breadcrumb.element'

declare global {
  interface HTMLElementTagNameMap {
    'q-breadcrumb': BreadcrumbElement
    'q-breadcrumb-item': BreadcrumbItemElement
    'q-breadcrumb-list': BreadcrumbListElement
  }
}

export class BreadcrumbElement extends AriaBreadcrumbElement {
  get name(): ElementName {
    return ElementName.BREADCRUMB
  }
}

export class BreadcrumbListElement extends AriaBreadcrumbListElement {
  get name(): ElementName {
    return ElementName.BREADCRUMB_LIST
  }
}

export class BreadcrumbItemElement extends AriaBreadcrumbItemElement {
  get name(): ElementName {
    return ElementName.BREADCRUMB_ITEM
  }
}

customElements.define('q-breadcrumb', BreadcrumbElement)
customElements.define('q-breadcrumb-item', BreadcrumbItemElement)
customElements.define('q-breadcrumb-list', BreadcrumbListElement)
