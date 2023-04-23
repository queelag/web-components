import type { TabsSelectionChangeEvent } from '@aracna/web'
import { css, CSSResultGroup, html, LitElement, PropertyDeclarations } from 'lit'
import '../../../../src/elements/navigation/tabs.element'
import type { TabsTabElement } from '../../../../src/elements/navigation/tabs.element'

const TABS: number[] = [1, 2, 3]

export default class Tabs extends LitElement {
  index: number = 0

  onSelectionChange(event: TabsSelectionChangeEvent<TabsTabElement>): void {
    this.index = event.detail?.selectedTabIndex ?? 0
  }

  protected render(): unknown {
    return html`
      <aracna-tabs @selection-change=${this.onSelectionChange}>
        <div>
          <aracna-tabs-tab selected>ARIA Tab 1</aracna-tabs-tab>
          <aracna-tabs-tab>ARIA Tab 2</aracna-tabs-tab>
          <aracna-tabs-tab>ARIA Tab 3</aracna-tabs-tab>
        </div>
        <aracna-tabs-panel>Content of ARIA Tab ${TABS[this.index]}</aracna-tabs-panel>
      </aracna-tabs>
    `
  }

  static properties: PropertyDeclarations = {
    index: { type: Number, state: true }
  }

  static styles?: CSSResultGroup | undefined = css`
    * {
      box-sizing: border-box;
    }

    aracna-tabs {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }

    aracna-tabs > div {
      display: flex;

      border: 1px solid gray;
    }

    aracna-tabs > div > * + * {
      border-left: 1px solid gray;
    }

    aracna-tabs-panel {
      width: 384px;
      height: 128px;
      padding: 8px;

      border: 1px solid gray;

      font-size: 12px;
    }

    aracna-tabs-tab {
      padding: 8px 12px;

      font-size: 12px;
      font-weight: 500;
    }

    aracna-tabs-tab[selected] {
      background: lightgray;
    }
  `
}

defineCustomElement('my-tabs', Tabs)
