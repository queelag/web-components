import { defineCustomElement, QueryDeclarations, SwitchElementEventMap, WebElementLogger } from '@aracna/web'
import { css, CSSResult, CSSResultGroup } from 'lit'
import { html } from 'lit-html'
import { AriaSwitchElement } from '../aria/aria-switch-element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-switch': SwitchElement
  }
}

export class SwitchElement<E extends SwitchElementEventMap = SwitchElementEventMap> extends AriaSwitchElement<E> {
  /**
   * QUERIES
   */
  inputElement!: HTMLInputElement

  onChange(): void {
    this.on = this.inputElement.value === '1'
    WebElementLogger.verbose(this.uid, 'onChange', `The switch has been turned ${this.on ? 'on' : 'off'}.`)
  }

  onClick(): void {
    super.onClick()
    this.touch()
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

    return super.render()
  }

  get on(): boolean | undefined {
    if (this.target && typeof this.path === 'string') {
      return super.value
    }

    return super.on
  }

  set on(on: boolean | undefined) {
    super.on = on
    super.value = on
  }

  static queries: QueryDeclarations = {
    ...super.queries,
    inputElement: { selector: 'input', shadow: true }
  }

  static styles: CSSResultGroup = [
    super.styles as CSSResult,
    css`
      input {
        height: 100%;
        width: 100%;
      }
    `
  ]
}

defineCustomElement('aracna-switch', SwitchElement)
