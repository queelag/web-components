import { Localization, type LocalizationVariables } from '@aracna/core'
import DOMPurify from 'dompurify'
import { unsafeHTML } from 'lit/directives/unsafe-html.js'
import { DEFAULT_RENDER_LOCALIZATION_STRING_TO_HTML_SANITIZE_CONFIG } from '../definitions/constants.js'
import type { RenderLocalizationStringToHTMLSanitizeConfig } from '../definitions/interfaces.js'

export function renderLocalizationStringToHTML(
  localization: Localization,
  path: string,
  variables?: LocalizationVariables,
  sanitize?: boolean,
  sanitizeConfig: RenderLocalizationStringToHTMLSanitizeConfig = DEFAULT_RENDER_LOCALIZATION_STRING_TO_HTML_SANITIZE_CONFIG()
) {
  return unsafeHTML(sanitize ? DOMPurify.sanitize(localization.get(path, variables), sanitizeConfig) : localization.get(path, variables))
}
