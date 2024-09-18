import { getLimitedNumber, parseNumber } from '@aracna/core'
import { defineCustomElement } from '@aracna/web'
import { type CSSResultGroup, type PropertyDeclarations, css, html } from 'lit'
import { DEFAULT_BADGE_MAX, DEFAULT_BADGE_MIN } from '../../definitions/constants.js'
import type { BadgeElementEventMap } from '../../definitions/events.js'
import { AracnaBaseElement as BaseElement } from '../core/base-element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-badge': BadgeElement
  }
}

class BadgeElement<E extends BadgeElementEventMap = BadgeElementEventMap> extends BaseElement<E> {
  /**
   * Properties
   */
  /** */
  protected _max?: number
  protected _min?: number
  numeric?: boolean

  /**
   * Internals
   */
  /** */
  protected _text?: string

  render() {
    return html`
      ${this.styleHTML}
      <slot>${this.text}</slot>
    `
  }

  get max(): number | undefined {
    return this._max ?? DEFAULT_BADGE_MAX
  }

  set max(max: number | undefined) {
    let old: number | undefined

    old = this._max
    this._max = max

    this.requestUpdate('max', old)
  }

  get min(): number | undefined {
    return this._min ?? DEFAULT_BADGE_MIN
  }

  set min(min: number | undefined) {
    let old: number | undefined

    old = this._min
    this._min = min

    this.requestUpdate('min', old)
  }

  get text(): string {
    if (this.numeric) {
      return getLimitedNumber(parseNumber(this._text), { min: this.min, max: this.max }).toString()
    }

    return this._text ?? ''
  }

  set text(text: string | undefined) {
    let old: string | undefined

    old = this._text
    this._text = text

    this.requestUpdate('text', old)
  }

  static properties: PropertyDeclarations = {
    max: { type: Number, reflect: true },
    min: { type: Number, reflect: true },
    numeric: { type: Boolean, reflect: true },
    text: { type: String, reflect: true }
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

export { BadgeElement as AracnaBadgeElement }
