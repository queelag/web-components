import { defineCustomElement } from '@aracna/web'
import { html, type PropertyDeclarations } from 'lit'
import type { DividerElementEventMap } from '../../definitions/events.js'
import type { Orientation } from '../../definitions/types.js'
import { choose } from '../../directives/choose.js'
import { AracnaBaseElement as BaseElement } from '../core/base-element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-divider': DividerElement
  }
}

class DividerElement<E extends DividerElementEventMap = DividerElementEventMap> extends BaseElement<E> {
  /**
   * Properties
   */
  orientation?: Orientation

  render() {
    return choose(
      this.orientation,
      [
        ['horizontal', () => html`<slot name="horizontal"></slot>`],
        ['vertical', () => html`<slot name="vertical"></slot>`]
      ],
      () => html`<slot></slot>`
    )
  }

  static properties: PropertyDeclarations = {
    orientation: { type: String, reflect: true }
  }
}

defineCustomElement('aracna-divider', DividerElement)

export { DividerElement as AracnaDividerElement }
