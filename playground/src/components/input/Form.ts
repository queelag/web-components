import { sleep } from '@aracna/core'
import type { FormSubmitEvent } from '@aracna/web'
import { css, CSSResultGroup, html, LitElement } from 'lit'
import '../../../../src/elements/input/form.element'
import '../../../../src/elements/input/input.element'

export default class Form extends LitElement {
  async onSubmit(event: FormSubmitEvent): Promise<void> {
    await sleep(1000)
    event.detail?.finalize()
  }

  protected render(): unknown {
    return html`
      <aracna-form @form-submit=${this.onSubmit} async>
        <aracna-input placeholder="input inside form" type="text"></aracna-input>
      </aracna-form>
    `
  }

  static styles?: CSSResultGroup | undefined = css`
    * {
      box-sizing: border-box;
    }
  `
}

defineCustomElement('my-form', Form)
