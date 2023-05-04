import { defineCustomElement, SwitchElementEventMap, WebElementLogger } from '@aracna/web'
import { css, CSSResult, CSSResultGroup } from 'lit'
import { html } from 'lit-html'
import { AriaSwitchElement } from '../aria/aria.switch.element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-switch': SwitchElement
  }
}

export class SwitchElement<E extends SwitchElementEventMap = SwitchElementEventMap> extends AriaSwitchElement<E> {
  private onChange(event: Event): void {
    // @ts-ignore
    this.value = event.target.value === '1'
    WebElementLogger.verbose(this.uid, 'onChange', `The switch has been turned ${this.value ? 'on' : 'off'}.`)
  }

  onClick(): void {
    super.onClick()

    if (this.disabled || this.readonly) {
      return WebElementLogger.warn(this.id, 'onClick', `Execution stopped, disabled is truthy.`)
    }

    this.value = !this.value
    WebElementLogger.verbose(this.uid, 'onClick', `The switch has been turned ${this.value ? 'on' : 'off'}.`)
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
