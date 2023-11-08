import { defineCustomElement, ElementName, QueryDeclarations, TabsElementEventMap, TabsPanelElementEventMap, TabsTabElementEventMap } from '@aracna/web'
import { PropertyDeclarations } from 'lit'
import { AriaTabsElement, AriaTabsPanelElement, AriaTabsTabElement } from '../aria/aria-tabs-element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-tabs': TabsElement
    'aracna-tabs-panel': TabsPanelElement
    'aracna-tabs-tab': TabsTabElement
  }
}

export class TabsElement<E extends TabsElementEventMap = TabsElementEventMap, T = any> extends AriaTabsElement<E> {
  tabs?: T[]

  get name(): ElementName {
    return ElementName.TABS
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

export class TabsTabElement<E extends TabsTabElementEventMap = TabsTabElementEventMap> extends AriaTabsTabElement<E> {
  get name(): ElementName {
    return ElementName.TABS_TAB
  }

  static queries: QueryDeclarations = {
    rootElement: { selector: 'aracna-tabs', closest: true }
  }
}

export class TabsPanelElement<E extends TabsPanelElementEventMap = TabsPanelElementEventMap> extends AriaTabsPanelElement<E> {
  get name(): ElementName {
    return ElementName.TABS_PANEL
  }

  static queries: QueryDeclarations = {
    rootElement: { selector: 'aracna-tabs', closest: true }
  }
}

defineCustomElement('aracna-tabs', TabsElement)
defineCustomElement('aracna-tabs-tab', TabsTabElement)
defineCustomElement('aracna-tabs-panel', TabsPanelElement)
