import { IsomorphicEvent } from '@aracna/web'

interface Detail<T extends HTMLElement> {
  selectedTab?: T
  selectedTabIndex: number
}

/**
 * @category Event
 */
export class TabsTabSelectionEvent<T extends HTMLElement> extends IsomorphicEvent<Detail<T>> {
  constructor(selectedTab: T | undefined, selectedTabIndex: number) {
    super('tabs-tab-selection', { detail: { selectedTab, selectedTabIndex } })
  }
}
