import { Localization } from '@aracna/core'
import { html, nothing, type TemplateResult } from 'lit'
import type { AracnaTextElement as TextElement } from '../elements/typography/text-element.js'
import { renderLocalizationStringToHTML } from './localization-utils.js'

export function renderTextElement(this: TextElement): TemplateResult {
  return html`
    ${this.styleHTML}
    <slot>
      ${this.localization instanceof Localization && typeof this.path === 'string'
        ? this.renderHTML !== false
          ? renderLocalizationStringToHTML(this.localization, this.path, this.variables, this.sanitize, this.sanitizeConfig)
          : this.localization.get(this.path, this.variables)
        : nothing}
    </slot>
  `
}
