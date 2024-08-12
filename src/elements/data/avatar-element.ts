import { defineCustomElement } from '@aracna/web'
import { css, type CSSResultGroup, type PropertyDeclarations } from 'lit'
import { ElementName } from '../../definitions/enums.js'
import type { AvatarElementEventMap } from '../../definitions/events.js'
import { AracnaBaseElement as BaseElement } from '../core/base-element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-avatar': AvatarElement
  }
}

class AvatarElement<E extends AvatarElementEventMap = AvatarElementEventMap> extends BaseElement<E> {
  /**
   * Properties
   */
  icon?: string
  image?: string
  text?: string

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
      :host {
        align-items: center;
        justify-content: center;
        overflow: hidden;
      }
    `
  ]
}

defineCustomElement('aracna-avatar', AvatarElement)

export { AvatarElement as AracnaAvatarElement }
