import { css, CSSResultGroup, html, LitElement } from 'lit'
import '../../../../src/elements/layout/divider.element'

export default class Divider extends LitElement {
  protected render(): unknown {
    return html`
      <q-divider orientation="horizontal">
        <div className="w-full h-px bg-gray-200" slot="horizontal"></div>
        <div className="w-px h-full bg-gray-200" slot="vertical"></div>
      </q-divider>
    `
  }

  static styles?: CSSResultGroup | undefined = css`
    :host,
    q-divider {
      width: 100%;
    }

    div[slot='horizontal'] {
      width: 100%;
      height: 1px;
      background: lightgray;
    }

    div[slot='vertical'] {
      width: 1px;
      height: 100%;
      background: lightgray;
    }
  `
}

customElements.define('my-divider', Divider)
