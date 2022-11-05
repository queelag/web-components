import { sleep } from '@queelag/core'
import type { FormSubmitEvent } from '@queelag/web'
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
      <q-form @form-submit=${this.onSubmit} async>
        <q-input placeholder="input inside form" type="text"></q-input>
      </q-form>
    `
  }

  static styles?: CSSResultGroup | undefined = css`
    * {
      box-sizing: border-box;
    }
  `
}

customElements.define('my-form', Form)
