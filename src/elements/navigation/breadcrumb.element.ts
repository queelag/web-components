import { ElementName } from '@queelag/web'
import { AriaBreadcrumbElement, AriaBreadcrumbItemElement, AriaBreadcrumbListElement } from '../aria/aria.breadcrumb.element'

declare global {
  interface HTMLElementTagNameMap {
    'q-aria-breadcrumb': AriaBreadcrumbElement
    'q-aria-breadcrumb-item': AriaBreadcrumbItemElement
    'q-aria-breadcrumb-list': AriaBreadcrumbListElement
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

customElements.define('q-aria-breadcrumb', AriaBreadcrumbElement)
customElements.define('q-aria-breadcrumb-item', AriaBreadcrumbItemElement)
customElements.define('q-aria-breadcrumb-list', AriaBreadcrumbListElement)
