import { Localization, LocalizationVariables } from '@aracna/core'
import { defineCustomElement } from '@aracna/web'
import { html, nothing, PropertyDeclarations } from 'lit'
import { ElementName } from '../../definitions/enums.js'
import { TextElementEventMap } from '../../definitions/events.js'
import { AracnaBaseElement as BaseElement } from '../core/base-element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-text': TextElement
  }
}

class TextElement<E extends TextElementEventMap = TextElementEventMap> extends BaseElement<E> {
  localization?: Localization
  path?: string
  variables?: LocalizationVariables

  render() {
    return html`
      ${super.render()}
      <slot>${this.path ? this.localization?.get(this.path, this.variables) : nothing}</slot>
    `
  }

  get name(): ElementName {
    return ElementName.TEXT
  }

  static properties: PropertyDeclarations = {
    localization: { type: Object },
    path: { type: String, reflect: true },
    variables: { type: Object }
  }
}

defineCustomElement('aracna-text', TextElement)

export { TextElement as AracnaTextElement }
