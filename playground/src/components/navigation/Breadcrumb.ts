import { css, CSSResultGroup, html, LitElement } from 'lit'
import '../../../../src/elements/navigation/breadcrumb.element'

export default class Breadcrumb extends LitElement {
  protected render(): unknown {
    return html`
      <q-breadcrumb>
        <q-breadcrumb-list>
          <q-breadcrumb-item>
            <a href="#" target="_blank">Breadcrumb</a>
          </q-breadcrumb-item>
          <span>/</span>
          <q-breadcrumb-item>
            <a href="#" target="_blank">Shop</a>
          </q-breadcrumb-item>
          <span>/</span>
          <q-breadcrumb-item current>
            <a href="#" target="_blank">Article</a>
          </q-breadcrumb-item>
        </q-breadcrumb-list>
      </q-breadcrumb>
    `
  }

  static styles?: CSSResultGroup | undefined = css`
    * {
      box-sizing: border-box;
    }

    q-breadcrumb {
      display: flex;
      padding: 4px 8px;

      border: 1px solid gray;
      border-radius: 4px;
    }

    q-breadcrumb-list {
      display: flex;
      align-items: center;
      gap: 8px;

      font-size: 12px;
      font-weight: 500;
    }

    q-breadcrumb-item:hover {
      text-decoration: underline;
    }
  `
}

customElements.define('my-breadcrumb', Breadcrumb)
