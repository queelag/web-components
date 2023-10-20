import { getLimitedNumber, parseNumber } from '@aracna/core'
import { BadgeElementEventMap, DEFAULT_BADGE_MAX, DEFAULT_BADGE_MIN, defineCustomElement } from '@aracna/web'
import { CSSResultGroup, PropertyDeclarations, css } from 'lit'
import { html } from 'lit-html'
import { BaseElement } from '../core/base-element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-badge': BadgeElement
  }
}

export class BadgeElement<E extends BadgeElementEventMap = BadgeElementEventMap> extends BaseElement<E> {
  /**
   * PROPERTIES
   */
  max?: number
  min?: number
  numeric?: boolean

  /**
   * INTERNAL
   */
  protected _value?: string

  render() {
    return html`
      ${this.styleHTML}
      <slot>${this.value}</slot>
    `
  }

  get value(): string {
    if (this.numeric) {
      return getLimitedNumber(parseNumber(this._value ?? '0'), this.min ?? DEFAULT_BADGE_MIN, this.max ?? DEFAULT_BADGE_MAX).toString()
    }

    return this._value ?? ''
  }

  set value(value: string | undefined) {
    let old: string | undefined

    old = this._value
    this._value = value

    this.requestUpdate('value', old)
  }

  static properties: PropertyDeclarations = {
    max: { type: Number, reflect: true },
    min: { type: Number, reflect: true },
    numeric: { type: Boolean, reflect: true },
    value: { type: String, reflect: true }
  }

  static styles: CSSResultGroup = [
    super.styles,
    css`
      :host {
        align-items: center;
        justify-content: center;
      }
    `
  ]
}

defineCustomElement('aracna-badge', BadgeElement)
