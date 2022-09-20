import { KeyboardEventKey, WebElementLogger } from '@queelag/web'
import { css, CSSResult, CSSResultGroup, PropertyDeclarations } from 'lit'
import { html } from 'lit-html'
import { FormFieldElement } from './core/form.field.element'

declare global {
  interface HTMLElementTagNameMap {
    'q-switch': SwitchElement
  }
}

export class SwitchElement extends FormFieldElement {
  /**
   * PROPERTIES
   */
  native?: boolean

  private onChange(event: Event): void {
    // @ts-ignore
    this.value = event.target.value === '1'
    WebElementLogger.verbose(this.uid, 'onChange', `The switch has been turned ${this.value ? 'on' : 'off'}.`)
  }

  private onClick = (): void => {
    if (this.disabled || this.readonly) {
      return WebElementLogger.warn(this.id, 'onClick', `Execution stopped, disabled is truthy.`)
    }

    this.value = !this.value
    WebElementLogger.verbose(this.uid, 'onClick', `The switch has been turned ${this.value ? 'on' : 'off'}.`)
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
      return html`<input
        @change=${this.onChange}
        ?disabled=${this.disabled}
        min="0"
        max="1"
        ?readonly=${this.readonly}
        step="1"
        type="range"
        value=${this.on ? 1 : 0}
      />`
    }

    return html`
      <div
        aria-checked=${String(this.on) as any}
        aria-disabled=${String(this.disabled) as any}
        aria-readonly=${String(this.readonly) as any}
        @click=${this.onClick}
        @keydown=${this.onKeyDown}
        role="switch"
        style=${this.styleMap}
        tabindex="0"
      >
        <slot></slot>
      </div>
      ${this.shapeHTML}
    `
  }

  get on(): boolean {
    return this.value === true
  }

  get off(): boolean {
    return this.value !== true
  }

  static properties: PropertyDeclarations = {
    ...super.properties,
    native: { type: Boolean, reflect: true }
  }

  static styles: CSSResultGroup = [
    super.styles as CSSResult,
    css`
      * {
        cursor: pointer;
      }

      div {
        display: inline-flex;
        height: 100%;
        width: 100%;
      }

      input {
        height: 100%;
        width: 100%;
      }
    `
  ]
}

customElements.define('q-switch', SwitchElement)
