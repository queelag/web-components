import { defineCustomElement, QueryDeclarations, SwitchElementEventMap, WebElementLogger } from '@aracna/web'
import { css, CSSResult, CSSResultGroup, html } from 'lit'
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

  render() {
    if (this.native) {
      return html`
        <input @change=${this.onChange} ?disabled=${this.disabled} min="0" max="1" ?readonly=${this.readonly} step="1" type="range" value=${this.on ? 1 : 0} />
      `
    }

    return super.render()
  }

  static queries: QueryDeclarations = {
    inputElement: { selector: 'input', shadow: true }
  }

  static styles: CSSResultGroup = [
    super.styles as CSSResult,
    css`
      :host([native]) input {
        all: inherit;
        height: 100%;
        width: 100%;
      }
    `
  ]
}

defineCustomElement('aracna-switch', SwitchElement)
