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

  onClick(): void {
    super.onClick()
    this.touch()
  }

  render() {
    if (this.native) {
      return html`<input @change=${this.onChange} ?checked=${this.value} ?disabled=${this.disabled} ?readonly=${this.readonly} type="checkbox" />`
    }

    return html`
      <div style=${this.styleMap}>
        <slot></slot>
      </div>
      ${this.shapeHTML}
    `
  }

  get name(): ElementName {
    return ElementName.CHECKBOX
  }

  get checked(): boolean | undefined {
    if (this.target && typeof this.path === 'string') {
      return super.value
    }

    return super.checked
  }

  set checked(checked: boolean | undefined) {
    super.checked = checked
    super.value = checked
  }

  static styles: CSSResultGroup = [
    super.styles,
    css`
      * {
        cursor: pointer;
      }

      :host([native]) input {
        all: inherit;
      }

      :host([normalized]) input {
        margin: none;
      }

      :host(:not([native])) div {
        align-items: center;
        display: inline-flex;
        height: 100%;
        justify-content: center;
        width: 100%;
      }
    `
  ]
}

defineCustomElement('aracna-checkbox', CheckBoxElement)
