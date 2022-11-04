import { css, CSSResultGroup, html, LitElement } from 'lit'
import { createRef, ref, Ref } from 'lit/directives/ref.js'
import type { NavigationBarElement } from '../../../src'
import '../../../src/elements/navigation/navigation.bar.element'

export default class NavigationBar extends LitElement {
  ref: Ref<NavigationBarElement> = createRef()

  onAttributeChange(): void {
    this.requestUpdate()
  }

  protected render(): unknown {
    return html`
      <q-navigation-bar ${ref(this.ref)} active-item="Home" @attribute-change=${this.onAttributeChange}>
        <q-navigation-bar-item ?active=${this.ref.value?.isItemActive('Discover')} @click=${() => this.ref.value?.activateItem('Discover')}>
          Discover
        </q-navigation-bar-item>
        <q-navigation-bar-item ?active=${this.ref.value?.isItemActive('Home') ?? true} @click=${() => this.ref.value?.activateItem('Home')}>
          Home
        </q-navigation-bar-item>
        <q-navigation-bar-item ?active=${this.ref.value?.isItemActive('Settings')} @click=${() => this.ref.value?.activateItem('Settings')}>
          Settings
        </q-navigation-bar-item>
      </q-navigation-bar>
    `
  }

  static styles?: CSSResultGroup | undefined = css`
    q-navigation-bar {
      display: flex;

      border-radius: 4px;
      border: 1px solid gray;
    }

    q-navigation-bar > * + * {
      border-left: 1px solid gray;
    }

    q-navigation-bar-item {
      cursor: pointer;
      padding: 4px 8px;

      font-size: 12px;
      font-weight: 500;
    }

    q-navigation-bar-item[active] {
      background: lightgray;
    }
  `
}

customElements.define('my-navigation-bar', NavigationBar)
