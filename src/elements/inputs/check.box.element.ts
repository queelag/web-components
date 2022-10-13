import { ElementName, WebElementLogger } from '@queelag/web'
import { css, CSSResultGroup } from 'lit'
import { html } from 'lit-html'
import { AriaCheckBoxElement } from '../aria/aria.check.box.element'

declare global {
  interface HTMLElementTagNameMap {
    'q-checkbox': CheckBoxElement
  }
}

export class CheckBoxElement extends AriaCheckBoxElement {
  private onChange(): void {
    this.value = !this.value
    this.touch()
  }

  onClick(): void {
    super.onClick()

    if (this.disabled || this.readonly) {
      return WebElementLogger.warn(this.id, 'onClick', `Execution stopped, disabled is truthy.`)
    }

    this.value = !this.value
    WebElementLogger.verbose(this.uid, 'onClick', `The checkbox has been ${this.value ? 'checked' : 'unchecked'}.`)

    this.touch()
  }

  render() {
    if (this.native) {
      return html`<input @change=${this.onChange} ?checked=${this.value} ?disabled=${this.disabled} ?readonly=${this.readonly} type="checkbox" />`
    }

    return html`
      <div @click=${this.onClick} style=${this.styleMap}>
        <slot></slot>
      </div>
      ${this.shapeHTML}
    `
  }

  get name(): ElementName {
    return ElementName.CHECKBOX
  }

  get value(): boolean | undefined {
    return super.value
  }

  set value(value: boolean | undefined) {
    super.value = value
  }

  static styles: CSSResultGroup = [
    super.styles,
    css`
      * {
        cursor: pointer;
      }

      :host([normalized]) input {
        margin: 0;
      }

      div {
        display: inline-flex;
        height: 100%;
        width: 100%;
      }
    `
  ]
}

customElements.define('q-checkbox', CheckBoxElement)
