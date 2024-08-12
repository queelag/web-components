import { defineCustomElement } from '@aracna/web'
import type { PropertyDeclarations } from 'lit'
import { AriaBreadcrumbController, AriaBreadcrumbItemController, AriaBreadcrumbListController } from '../../controllers/aria-breadcrumb-controller.js'
import { ElementName } from '../../definitions/enums.js'
import type { AriaBreadcrumbElementEventMap, AriaBreadcrumbItemElementEventMap, AriaBreadcrumbListElementEventMap } from '../../definitions/events.js'
import type { QueryDeclarations } from '../../definitions/interfaces.js'
import { AracnaBaseElement as BaseElement } from '../core/base-element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-aria-breadcrumb': AriaBreadcrumbElement
    'aracna-aria-breadcrumb-item': AriaBreadcrumbItemElement
    'aracna-aria-breadcrumb-list': AriaBreadcrumbListElement
  }
}

class AriaBreadcrumbElement<E extends AriaBreadcrumbElementEventMap = AriaBreadcrumbElementEventMap> extends BaseElement<E> {
  protected aria: AriaBreadcrumbController = new AriaBreadcrumbController(this)

  get name(): ElementName {
    return ElementName.ARIA_BREADCRUMB
  }
}

class AriaBreadcrumbListElement<E extends AriaBreadcrumbListElementEventMap = AriaBreadcrumbListElementEventMap> extends BaseElement<E> {
  protected aria: AriaBreadcrumbListController = new AriaBreadcrumbListController(this)

  get name(): ElementName {
    return ElementName.ARIA_BREADCRUMB_LIST
  }
}

class AriaBreadcrumbItemElement<E extends AriaBreadcrumbItemElementEventMap = AriaBreadcrumbItemElementEventMap> extends BaseElement<E> {
  protected aria: AriaBreadcrumbItemController = new AriaBreadcrumbItemController(this)

  /**
   * Properties
   */
  /** */
  current?: boolean

  /**
   * Queries
   */
  /** */
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

export {
  AriaBreadcrumbElement as AracnaAriaBreadcrumbElement,
  AriaBreadcrumbItemElement as AracnaAriaBreadcrumbItemElement,
  AriaBreadcrumbListElement as AracnaAriaBreadcrumbListElement
}
