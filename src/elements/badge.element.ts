import { getLimitedNumber, parseNumber } from '@queelag/core'
import { css, CSSResultGroup, PropertyDeclarations } from 'lit'
import { html } from 'lit-html'
import { BaseElement } from './core/base.element'

declare global {
  interface HTMLElementTagNameMap {
    'q-badge': BadgeElement
  }
}

export class BadgeElement extends BaseElement {
  /**
   * PROPERTIES
   */
  maximum?: number
  minimum?: number
  numeric?: boolean

  /**
   * INTERNAL
   */
  private _value?: string

  render() {
    return html`
      <div style=${this.styleMap}><slot>${this.value}</slot></div>
      ${this.shapeHTML}
    `
  }

  get value(): string {
    if (this.numeric) {
      return getLimitedNumber(parseNumber(this._value || '0'), this.minimum, this.maximum).toString()
    }

    return this._value || ''
  }

  set value(value: string | undefined) {
    let old: string | undefined

    old = this._value
    this._value = value

    this.requestUpdate('value', old)
  }

  static properties: PropertyDeclarations = {
    maximum: { type: Number, reflect: true },
    minimum: { type: Number, reflect: true },
    numeric: { type: Boolean, reflect: true },
    value: { type: String, reflect: true }
  }

  static styles: CSSResultGroup = [
    super.styles,
    css`
      div {
        align-items: center;
        display: inline-flex;
        justify-content: center;
        overflow: hidden;
      }
    `
  ]
}

customElements.define('q-badge', BadgeElement)
