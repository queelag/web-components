import { defineCustomElement } from '@aracna/web'
import { css, CSSResultGroup, html, LitElement } from 'lit'
import { createRef, ref, Ref } from 'lit/directives/ref.js'
import type { NavigationBarElement } from '../../../../src'
import '../../../../src/elements/navigation/navigation-bar-element'

export default class NavigationBar extends LitElement {
  ref: Ref<NavigationBarElement> = createRef()

  onAttributeChange(): void {
    this.requestUpdate()
  }

  protected render(): unknown {
    return html`
      <aracna-navigation-bar ${ref(this.ref)} active-item="Home" @attribute-change=${this.onAttributeChange}>
        <aracna-navigation-bar-item ?active=${this.ref.value?.isItemActive('Discover')} @click=${() => this.ref.value?.activateItem('Discover')}>
          Navigation
        </aracna-navigation-bar-item>
        <aracna-navigation-bar-item ?active=${this.ref.value?.isItemActive('Home') ?? true} @click=${() => this.ref.value?.activateItem('Home')}>
          Bar
        </aracna-navigation-bar-item>
        <aracna-navigation-bar-item ?active=${this.ref.value?.isItemActive('Settings')} @click=${() => this.ref.value?.activateItem('Settings')}>
          Demo
        </aracna-navigation-bar-item>
      </aracna-navigation-bar>
    `
  }

  static styles?: CSSResultGroup | undefined = css`
    * {
      box-sizing: border-box;
    }

    aracna-navigation-bar {
      display: flex;

      border-radius: 4px;
      border: 1px solid gray;
    }

    aracna-navigation-bar > * + * {
      border-left: 1px solid gray;
    }

    aracna-navigation-bar-item {
      cursor: pointer;
      padding: 4px 8px;

      font-size: 12px;
      font-weight: 500;
    }

    aracna-navigation-bar-item[active] {
      background: lightgray;
    }
  `
}

defineCustomElement('my-navigation-bar', NavigationBar)
