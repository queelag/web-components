import { defineCustomElement } from '@aracna/web'
import type { PropertyDeclarations } from 'lit'
import { ElementSlug } from '../../definitions/enums.js'
import type { BreadcrumbElementEventMap, BreadcrumbItemElementEventMap, BreadcrumbListElementEventMap } from '../../definitions/events.js'
import {
  AracnaAriaBreadcrumbElement as AriaBreadcrumbElement,
  AracnaAriaBreadcrumbItemElement as AriaBreadcrumbItemElement,
  AracnaAriaBreadcrumbListElement as AriaBreadcrumbListElement
} from '../aria/aria-breadcrumb-element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-breadcrumb': BreadcrumbElement
    'aracna-breadcrumb-item': BreadcrumbItemElement
    'aracna-breadcrumb-list': BreadcrumbListElement
  }
}

class BreadcrumbElement<E extends BreadcrumbElementEventMap = BreadcrumbElementEventMap, T = any> extends AriaBreadcrumbElement<E> {
  /**
   * Properties
   */
  /** */
  items?: T[]

  get slug(): ElementSlug {
    return ElementSlug.BREADCRUMB
  }

  static properties: PropertyDeclarations = {
    items: { type: Array }
  }
}

class BreadcrumbListElement<E extends BreadcrumbListElementEventMap = BreadcrumbListElementEventMap> extends AriaBreadcrumbListElement<E> {
  get slug(): ElementSlug {
    return ElementSlug.BREADCRUMB_LIST
  }
}

class BreadcrumbItemElement<E extends BreadcrumbItemElementEventMap = BreadcrumbItemElementEventMap> extends AriaBreadcrumbItemElement<E> {
  /**
   * Properties
   */
  /** */
  headline?: string
  href?: string
  icon?: string

  get slug(): ElementSlug {
    return ElementSlug.BREADCRUMB_ITEM
  }

  static properties: PropertyDeclarations = {
    headline: { type: String, reflect: true },
    href: { type: String, reflect: true },
    icon: { type: String, reflect: true }
  }
}

defineCustomElement('aracna-breadcrumb', BreadcrumbElement)
defineCustomElement('aracna-breadcrumb-item', BreadcrumbItemElement)
defineCustomElement('aracna-breadcrumb-list', BreadcrumbListElement)

export {
  AriaBreadcrumbElement as AracnaBreadcrumbElement,
  AriaBreadcrumbItemElement as AracnaBreadcrumbItemElement,
  AriaBreadcrumbListElement as AracnaBreadcrumbListElement
}
