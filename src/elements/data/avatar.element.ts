import { ElementName } from '@queelag/web'
import { css, CSSResultGroup, PropertyDeclarations } from 'lit'
import { html } from 'lit-html'
import { BaseElement } from '../core/base.element'

declare global {
  interface HTMLElementTagNameMap {
    'q-avatar': AvatarElement
  }
}

export class AvatarElement extends BaseElement {
  /**
   * PROPERTIES
   */
  icon?: string
  image?: string
  text?: string

  render() {
    return html`
      <div style=${this.styleMap}>
        <slot></slot>
      </div>
      ${this.shapeHTML}
    `
  }

  get name(): ElementName {
    return ElementName.AVATAR
  }

  static properties: PropertyDeclarations = {
    icon: { type: String, reflect: true },
    image: { type: String, reflect: true },
    text: { type: String, reflect: true }
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

customElements.define('q-avatar', AvatarElement)
