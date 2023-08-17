import { defineCustomElement } from '@aracna/web'
import { css, CSSResultGroup, html, LitElement } from 'lit'
import '../../../../src/elements/input/text-area-element'

export default class TextArea extends LitElement {
  protected render(): unknown {
    return html`<aracna-textarea placeholder="textarea" autosize></aracna-textarea>`
  }

  static styles?: CSSResultGroup | undefined = css`
    * {
      box-sizing: border-box;
    }
  `
}

defineCustomElement('my-textarea', TextArea)
