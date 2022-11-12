import { css, CSSResultGroup, html, LitElement } from 'lit'
import '../../../../src/elements/input/text.area.element'

export default class TextArea extends LitElement {
  protected render(): unknown {
    return html`<q-textarea placeholder="textarea"></q-textarea>`
  }

  static styles?: CSSResultGroup | undefined = css`
    * {
      box-sizing: border-box;
    }
  `
}

defineCustomElement('my-textarea', TextArea)
