import { ElementName, QueryDeclarations } from '@queelag/web'
import { AriaTabsElement, AriaTabsPanelElement, AriaTabsTabElement } from '../aria/aria.tabs.element'

declare global {
  interface HTMLElementTagNameMap {
    'q-tabs': TabsElement
    'q-tabs-panel': TabsPanelElement
    'q-tabs-tab': TabsTabElement
  }
}

export class TabsElement extends AriaTabsElement {
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

export class TabsTabElement extends AriaTabsTabElement {
  get name(): ElementName {
    return ElementName.TABS_TAB
  }

  static queries: QueryDeclarations = {
    rootElement: { selector: 'q-tabs', closest: true }
  }
}

export class TabsPanelElement extends AriaTabsPanelElement {
  get name(): ElementName {
    return ElementName.TABS_PANEL
  }

  static queries: QueryDeclarations = {
    rootElement: { selector: 'q-tabs', closest: true }
  }
}

customElements.define('q-tabs', TabsElement)
customElements.define('q-tabs-tab', TabsTabElement)
customElements.define('q-tabs-panel', TabsPanelElement)
