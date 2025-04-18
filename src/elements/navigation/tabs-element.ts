import { defineCustomElement } from '@aracna/web'
import type { PropertyDeclarations } from 'lit'
import { ElementSlug } from '../../definitions/enums.js'
import type { TabsElementEventMap, TabsPanelElementEventMap, TabsTabElementEventMap } from '../../definitions/events.js'
import type { QueryDeclarations } from '../../definitions/interfaces.js'
import {
  AracnaAriaTabsElement as AriaTabsElement,
  AracnaAriaTabsPanelElement as AriaTabsPanelElement,
  AracnaAriaTabsTabElement as AriaTabsTabElement
} from '../aria/aria-tabs-element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-tabs': TabsElement
    'aracna-tabs-panel': TabsPanelElement
    'aracna-tabs-tab': TabsTabElement
  }
}

class TabsElement<E extends TabsElementEventMap = TabsElementEventMap, T = any> extends AriaTabsElement<E> {
  /**
   * Properties
   */
  /** */
  tabs?: T[]

  get slug(): ElementSlug {
    return ElementSlug.TABS
  }

  static properties: PropertyDeclarations = {
    tabs: { type: Array }
  }

  static queries: QueryDeclarations = {
    focusedTabElement: { selector: 'aracna-tabs-tab:focus' },
    panelElements: { selector: 'aracna-tabs-panel', all: true },
    selectedTabElement: { selector: 'aracna-tabs-tab[selected]' },
    tabElements: { selector: 'aracna-tabs-tab', all: true }
  }
}

class TabsTabElement<E extends TabsTabElementEventMap = TabsTabElementEventMap> extends AriaTabsTabElement<E> {
  get slug(): ElementSlug {
    return ElementSlug.TABS_TAB
  }

  static queries: QueryDeclarations = {
    rootElement: { selector: 'aracna-tabs', closest: true }
  }
}

class TabsPanelElement<E extends TabsPanelElementEventMap = TabsPanelElementEventMap> extends AriaTabsPanelElement<E> {
  get slug(): ElementSlug {
    return ElementSlug.TABS_PANEL
  }

  static queries: QueryDeclarations = {
    rootElement: { selector: 'aracna-tabs', closest: true }
  }
}

defineCustomElement('aracna-tabs', TabsElement)
defineCustomElement('aracna-tabs-tab', TabsTabElement)
defineCustomElement('aracna-tabs-panel', TabsPanelElement)

export { TabsElement as AracnaTabsElement, TabsPanelElement as AracnaTabsPanelElement, TabsTabElement as AracnaTabsTabElement }
