import { css, CSSResultGroup, html, LitElement } from 'lit'
import '../../../../src/elements/navigation/breadcrumb.element'

export default class Breadcrumb extends LitElement {
  protected render(): unknown {
    return html`
      <aracna-breadcrumb>
        <aracna-breadcrumb-list>
          <aracna-breadcrumb-item>
            <a href="#" target="_blank">Breadcrumb</a>
          </aracna-breadcrumb-item>
          <span>/</span>
          <aracna-breadcrumb-item>
            <a href="#" target="_blank">Shop</a>
          </aracna-breadcrumb-item>
          <span>/</span>
          <aracna-breadcrumb-item current>
            <a href="#" target="_blank">Article</a>
          </aracna-breadcrumb-item>
        </aracna-breadcrumb-list>
      </aracna-breadcrumb>
    `
  }

  static styles?: CSSResultGroup | undefined = css`
    * {
      box-sizing: border-box;
    }

    aracna-breadcrumb {
      display: flex;
      padding: 4px 8px;

      border: 1px solid gray;
      border-radius: 4px;
    }

    aracna-breadcrumb-list {
      display: flex;
      align-items: center;
      gap: 8px;

      font-size: 12px;
      font-weight: 500;
    }

    aracna-breadcrumb-item:hover {
      text-decoration: underline;
    }
  `
}

defineCustomElement('my-breadcrumb', Breadcrumb)
