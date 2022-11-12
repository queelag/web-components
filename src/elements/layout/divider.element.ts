import { defineCustomElement, DividerElementEventMap, Orientation } from '@queelag/web'
import { PropertyDeclarations } from 'lit'
import { html } from 'lit-html'
import { choose } from '../../directives/choose'
import { BaseElement } from '../core/base.element'

declare global {
  interface HTMLElementTagNameMap {
    'q-divider': DividerElement
  }
}

export class DividerElement<E extends DividerElementEventMap = DividerElementEventMap> extends BaseElement<E> {
  /**
   * PROPERTIES
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

defineCustomElement('q-divider', DividerElement)
