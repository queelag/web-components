import { defineCustomElement } from '@aracna/web'
import { css, CSSResultGroup, html, LitElement } from 'lit'
import '../../../../src/elements/data/icon-element'

const SRC: string = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-compass"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>`
// const SRC: string = `https://raw.githubusercontent.com/feathericons/feather/master/icons/compass.svg`

export default class Icon extends LitElement {
  protected render(): unknown {
    return html`<aracna-icon fill="none" size="24" src=${SRC} stroke="black" stroke-width="1"></aracna-icon>`
  }

  static styles?: CSSResultGroup | undefined = css`
    * {
      box-sizing: border-box;
    }
  `
}

defineCustomElement('my-icon', Icon)
