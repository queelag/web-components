import { defineCustomElement } from '@aracna/web'
import { css, type CSSResultGroup, html } from 'lit'
import { ElementName } from '../../definitions/enums.js'
import type { CheckBoxElementEventMap } from '../../definitions/events.js'
import { ElementLogger } from '../../loggers/element-logger.js'
import { AracnaAriaCheckBoxElement as AriaCheckBoxElement } from '../aria/aria-check-box-element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-checkbox': CheckBoxElement
  }
}

class CheckBoxElement<E extends CheckBoxElementEventMap = CheckBoxElementEventMap> extends AriaCheckBoxElement<E> {
  onChange(): void {
    ElementLogger.verbose(this.uid, 'onChange', `${this.checked ? 'Checking' : 'Unchecking'} the checkbox.`)
    this.toggle()
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

export { CheckBoxElement as AracnaCheckBoxElement }
