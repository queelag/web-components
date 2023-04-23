import {
  AriaBreadcrumbElementEventMap,
  AriaBreadcrumbItemElementEventMap,
  AriaBreadcrumbListElementEventMap,
  defineCustomElement,
  ElementName,
  QueryDeclarations
} from '@aracna/web'
import { PropertyDeclarations } from 'lit'
import { AriaBreadcrumbController, AriaBreadcrumbItemController, AriaBreadcrumbListController } from '../../controllers/aria.breadcrumb.controller'
import { BaseElement } from '../core/base.element'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-aria-breadcrumb': AriaBreadcrumbElement
    'aracna-aria-breadcrumb-item': AriaBreadcrumbItemElement
    'aracna-aria-breadcrumb-list': AriaBreadcrumbListElement
  }
}

export class AriaBreadcrumbElement<E extends AriaBreadcrumbElementEventMap = AriaBreadcrumbElementEventMap> extends BaseElement<E> {
  protected aria: AriaBreadcrumbController = new AriaBreadcrumbController(this)

  get name(): ElementName {
    return ElementName.ARIA_BREADCRUMB
  }
}

export class AriaBreadcrumbListElement<E extends AriaBreadcrumbListElementEventMap = AriaBreadcrumbListElementEventMap> extends BaseElement<E> {
  protected aria: AriaBreadcrumbListController = new AriaBreadcrumbListController(this)

  get name(): ElementName {
    return ElementName.ARIA_BREADCRUMB_LIST
  }
}

export class AriaBreadcrumbItemElement<E extends AriaBreadcrumbItemElementEventMap = AriaBreadcrumbItemElementEventMap> extends BaseElement<E> {
  protected aria: AriaBreadcrumbItemController = new AriaBreadcrumbItemController(this)

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

defineCustomElement('aracna-aria-breadcrumb', AriaBreadcrumbElement)
defineCustomElement('aracna-aria-breadcrumb-item', AriaBreadcrumbItemElement)
defineCustomElement('aracna-aria-breadcrumb-list', AriaBreadcrumbListElement)
