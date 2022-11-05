import { html, LitElement } from 'lit'
import '../../../../src/elements/input/text.area.element'

export default class TextArea extends LitElement {
  protected render(): unknown {
    return html`<q-textarea placeholder="textarea" autosize></q-textarea>`
  }
}

customElements.define('my-textarea', TextArea)
