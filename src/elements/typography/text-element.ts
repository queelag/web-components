import type { Localization, LocalizationVariables } from '@aracna/core'
import { defineCustomElement } from '@aracna/web'
import { css, PropertyValues, type CSSResultGroup, type PropertyDeclarations } from 'lit'
import { ElementSlug } from '../../definitions/enums.js'
import type { TextElementEventMap } from '../../definitions/events.js'
import type { QueryDeclarations, TextElementSanitizeConfig } from '../../definitions/interfaces.js'
import { renderTextElement } from '../../utils/text-element-utils.js'
import { AracnaBaseElement as BaseElement } from '../core/base-element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-text': TextElement
  }
}

class TextElement<E extends TextElementEventMap = TextElementEventMap> extends BaseElement<E> {
  /**
   * Properties
   */
  /** */
  localization?: Localization
  path?: string
  renderHTML?: boolean
  sanitize?: boolean
  sanitizeConfig?: TextElementSanitizeConfig
  variables?: LocalizationVariables

  /**
   * Queries
   */
  /** */
  elements!: Element[]

  updated(_changedProperties: PropertyValues): void {
    super.updated(_changedProperties)

    for (let element of this.elements) {
      if (element.hasAttribute('part')) {
        continue
      }

      element.setAttribute('part', element.tagName.toLowerCase())
    }
  }

  render() {
    return renderTextElement.bind(this)()
  }

  get slug(): ElementSlug {
    return ElementSlug.TEXT
  }

  static properties: PropertyDeclarations = {
    localization: { type: Object },
    path: { type: String, reflect: true },
    renderHTML: { type: Boolean, attribute: 'render-html' },
    sanitize: { type: Boolean, reflect: true },
    sanitizeConfig: { type: Object, attribute: 'sanitize-config' },
    variables: { type: Object }
  }

  static queries: QueryDeclarations = {
    elements: { selector: 'slot *', shadow: true, all: true }
  }

  static styles: CSSResultGroup = [
    css`
      :host {
        display: inline;
      }
    `
  ]
}

defineCustomElement('aracna-text', TextElement)

export { TextElement as AracnaTextElement }
