import { ElementName, QueryDeclarations } from '@queelag/web'
import { PropertyDeclarations } from 'lit'
import { AriaBreadcrumbController, AriaBreadcrumbListController, AriaBreadcrumbListItemController } from '../../controllers/aria.breadcrumb.controller'
import { BaseElement } from '../core/base.element'

declare global {
  interface HTMLElementTagNameMap {
    'q-aria-breadcrumb': AriaBreadcrumbElement
    'q-aria-breadcrumb-item': AriaBreadcrumbItemElement
    'q-aria-breadcrumb-list': AriaBreadcrumbListElement
  }
}

export class AriaBreadcrumbElement extends BaseElement {
  protected aria: AriaBreadcrumbController = new AriaBreadcrumbController(this)

  get name(): ElementName {
    return ElementName.ARIA_BREADCRUMB
  }
}

export class AriaBreadcrumbListElement extends BaseElement {
  protected aria: AriaBreadcrumbListController = new AriaBreadcrumbListController(this)

  get name(): ElementName {
    return ElementName.ARIA_BREADCRUMB_LIST
  }
}

export class AriaBreadcrumbItemElement extends BaseElement {
  protected aria: AriaBreadcrumbListItemController = new AriaBreadcrumbListItemController(this)

  /**
   * PROPERTIES
   */
  current?: boolean

  /**
   * QUERIES
   */
  anchorElement!: HTMLAnchorElement

  get name(): ElementName {
    return ElementName.ARIA_BREADCRUMB_ITEM
  }

  static queries: QueryDeclarations = {
    anchorElement: { selector: 'a' }
  }

  static properties: PropertyDeclarations = {
    current: { type: Boolean, reflect: true }
  }
}

customElements.define('q-aria-breadcrumb', AriaBreadcrumbElement)
customElements.define('q-aria-breadcrumb-item', AriaBreadcrumbItemElement)
customElements.define('q-aria-breadcrumb-list', AriaBreadcrumbListElement)
