import type { TabsSelectionChangeEvent } from '@queelag/web'
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
      <q-tabs @selection-change=${this.onSelectionChange}>
        <div>
          <q-tabs-tab selected>ARIA Tab 1</q-tabs-tab>
          <q-tabs-tab>ARIA Tab 2</q-tabs-tab>
          <q-tabs-tab>ARIA Tab 3</q-tabs-tab>
        </div>
        <q-tabs-panel>Content of ARIA Tab ${TABS[this.index]}</q-tabs-panel>
      </q-tabs>
    `
  }

  static properties: PropertyDeclarations = {
    index: { type: Number, state: true }
  }

  static styles?: CSSResultGroup | undefined = css`
    * {
      box-sizing: border-box;
    }

    q-tabs {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }

    q-tabs > div {
      display: flex;

      border: 1px solid gray;
    }

    q-tabs > div > * + * {
      border-left: 1px solid gray;
    }

    q-tabs-panel {
      width: 384px;
      height: 128px;
      padding: 8px;

      border: 1px solid gray;

      font-size: 12px;
    }

    q-tabs-tab {
      padding: 8px 12px;

      font-size: 12px;
      font-weight: 500;
    }

    q-tabs-tab[selected] {
      background: lightgray;
    }
  `
}

customElements.define('my-tabs', Tabs)
