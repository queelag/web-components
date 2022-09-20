import { ElementName, KeyboardEventKey, WebElementLogger } from '@queelag/web'
import { css, CSSResultGroup, PropertyDeclarations } from 'lit'
import { html } from 'lit-html'
import { AriaCheckBoxController } from '../controllers/aria.check.box.controller'
import { FormFieldElement } from './core/form.field.element'

declare global {
  interface HTMLElementTagNameMap {
    'q-checkbox': CheckBoxElement
  }
}

export class CheckBoxElement extends FormFieldElement {
  protected aria: AriaCheckBoxController = new AriaCheckBoxController(this)

  /**
   * PROPERTIES
   */
  native?: boolean
  normalized?: boolean

  connectedCallback(): void {
    super.connectedCallback()

    if (this.native) {
      return
    }

    this.addEventListener('click', this.onClick)
    this.addEventListener('keydown', this.onKeyDown)
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()

    if (this.native) {
      return
    }

    this.removeEventListener('click', this.onClick)
    this.removeEventListener('keydown', this.onKeyDown)
  }

  private onChange(): void {
    this.value = !this.value
    this.touch()
  }

  private onClick(): void {
    if (this.disabled || this.readonly) {
      return WebElementLogger.warn(this.id, 'onClick', `Execution stopped, disabled is truthy.`)
    }

    this.value = !this.value
    WebElementLogger.verbose(this.uid, 'onClick', `The checkbox has been ${this.value ? 'checked' : 'unchecked'}.`)

    this.touch()
  }

  private onKeyDown(event: KeyboardEvent): void {
    if (event.key !== KeyboardEventKey.SPACE) {
      return
    }

    event.preventDefault()
    event.stopPropagation()

    this.onClick()
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

  get checked(): boolean {
    return this.value === true
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

  static properties: PropertyDeclarations = {
    ...super.properties,
    native: { type: Boolean, reflect: true },
    normalized: { type: Boolean, reflect: true }
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
