import { CheckBoxElementEventMap, defineCustomElement, ElementName, WebElementLogger } from '@aracna/web'
import { css, CSSResultGroup } from 'lit'
import { html } from 'lit-html'
import { AriaCheckBoxElement } from '../aria/aria-check-box-element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-checkbox': CheckBoxElement
  }
}

export class CheckBoxElement<E extends CheckBoxElementEventMap = CheckBoxElementEventMap> extends AriaCheckBoxElement<E> {
  onChange(): void {
    this.checked = !this.checked
    WebElementLogger.verbose(this.uid, 'onChange', `The checkbox has been ${this.checked ? 'checked' : 'unchecked'}.`)

    this.touch()
  }

  render() {
    if (this.native) {
      return html`<input @change=${this.onChange} ?checked=${this.value} ?disabled=${this.disabled} ?readonly=${this.readonly} type="checkbox" />`
    }

    return super.render()
  }

  get name(): ElementName {
    return ElementName.CHECKBOX
  }

  static styles: CSSResultGroup = [
    super.styles,
    css`
      * {
        cursor: pointer;
      }

      :host(:not([native])) {
        align-items: center;
        justify-content: center;
      }

      :host([native]) input {
        all: inherit;
      }

      :host([native][normalized]) input {
        margin: none;
      }
    `
  ]
}

defineCustomElement('aracna-checkbox', CheckBoxElement)
