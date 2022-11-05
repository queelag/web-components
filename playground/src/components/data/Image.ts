import { css, CSSResultGroup, html, LitElement } from 'lit'
import '../../../../src/elements/data/image.element'

export default class Image extends LitElement {
  protected render(): unknown {
    return html`
      <q-image
        cache-quality="0"
        cache-type="image/jpeg"
        shape="squircle"
        size="128"
        src="https://media.wired.co.uk/photos/60c8730fa81eb7f50b44037e/1:1/w_256,h_256,c_limit/1521-WIRED-Cat.jpeg"
        eager
      ></q-image>
    `
  }

  static styles?: CSSResultGroup | undefined = css`
    * {
      box-sizing: border-box;
    }
  `
}

customElements.define('my-image', Image)
