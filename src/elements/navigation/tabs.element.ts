import { defineCustomElement, ElementName, QueryDeclarations, TabsElementEventMap, TabsPanelElementEventMap, TabsTabElementEventMap } from '@queelag/web'
import { AriaTabsElement, AriaTabsPanelElement, AriaTabsTabElement } from '../aria/aria.tabs.element'

declare global {
  interface HTMLElementTagNameMap {
    'q-tabs': TabsElement
    'q-tabs-panel': TabsPanelElement
    'q-tabs-tab': TabsTabElement
  }
}

export class TabsElement<E extends TabsElementEventMap = TabsElementEventMap> extends AriaTabsElement<E> {
  get name(): ElementName {
    return ElementName.TABS
  }

  static queries: QueryDeclarations = {
    focusedTabElement: { selector: 'q-tabs-tab:focus' },
    panelElements: { selector: 'q-tabs-panel', all: true },
    selectedTabElement: { selector: 'q-tabs-tab[selected]' },
    tabElements: { selector: 'q-tabs-tab', all: true }
  }
}

export class TabsTabElement<E extends TabsTabElementEventMap = TabsTabElementEventMap> extends AriaTabsTabElement<E> {
  get name(): ElementName {
    return ElementName.TABS_TAB
  }

  static queries: QueryDeclarations = {
    rootElement: { selector: 'q-tabs', closest: true }
  }
}

export class TabsPanelElement<E extends TabsPanelElementEventMap = TabsPanelElementEventMap> extends AriaTabsPanelElement<E> {
  get name(): ElementName {
    return ElementName.TABS_PANEL
  }

  static queries: QueryDeclarations = {
    rootElement: { selector: 'q-tabs', closest: true }
  }
}

defineCustomElement('q-tabs', TabsElement)
defineCustomElement('q-tabs-tab', TabsTabElement)
defineCustomElement('q-tabs-panel', TabsPanelElement)
