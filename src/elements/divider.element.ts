import { Orientation } from '@queelag/web'
import { PropertyDeclarations } from 'lit'
import { html } from 'lit-html'
import { choose } from '../directives/choose'
import { BaseElement } from './core/base.element'

declare global {
  interface HTMLElementTagNameMap {
    'q-divider': DividerElement
  }
}

export class DividerElement extends BaseElement {
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

customElements.define('q-divider', DividerElement)
