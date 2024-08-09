import { ALPHABET_HEX_LOWERCASE, type GenerateRandomStringOptions, type TypeaheadPredicate, getObjectProperty, isObject } from '@aracna/core'
import type { IconElementSanitizeConfig } from './interfaces.js'
import type {
  AriaComboBoxElementFilterOptionsPredicate,
  GetRadioButtonLabel,
  GetRadioButtonValue,
  GetSelectOptionLabel,
  GetSelectOptionValue,
  InputElementType,
  Orientation
} from './types.js'

/**
 * AriaCarouselElement
 */
/** */
export const DEFAULT_CAROUSEL_ROTATION_DURATION: number = 2500

/**
 * AriaComboBoxElement and SelectElement
 */
/** */
export const DEFAULT_COMBOBOX_FILTER_OPTIONS_PREDICATE: AriaComboBoxElementFilterOptionsPredicate<{ value?: any }> = (
  option: { value?: any },
  _,
  __,
  inputElementValue: string
) => String(option.value).toLowerCase().includes(inputElementValue.toLowerCase().trim())
export const DEFAULT_COMBOBOX_TYPEAHEAD_PREDICATE: TypeaheadPredicate<{ value?: any }> = (element: { value?: any }, value: string) =>
  String(element.value).toLowerCase().includes(value.toLowerCase().trim())

/**
 * AriaListBoxElement
 */
/** */
export const DEFAULT_LISTBOX_TYPEAHEAD_PREDICATE: TypeaheadPredicate<{ value?: any }> = (element: { value?: any }, value: string) =>
  String(element.value).toLowerCase().includes(value.toLowerCase().trim())

/**
 * AriaMenuElement
 */
/** */
export const DEFAULT_MENU_COLLAPSE_DEBOUNCE_TIME: number = 200
export const DEFAULT_MENU_TYPEAHEAD_PREDICATE: TypeaheadPredicate<{ headline?: string }> = (element: { headline?: string }, value: string) =>
  typeof element.headline === 'string' ? element.headline.toLowerCase().includes(value.toLowerCase().trim()) : true

/**
 * AriaMeterElement and MeterElement
 */
/** */
export const DEFAULT_METER_MAX: number = 1
export const DEFAULT_METER_MIN: number = 0
export const DEFAULT_METER_VALUE: number = 0

/**
 * AriaSliderElement and SliderElement
 */
/** */
export const DEFAULT_SLIDER_DECIMALS: number = 0
export const DEFAULT_SLIDER_MAX: number = 100
export const DEFAULT_SLIDER_MIN: number = 0
export const DEFAULT_SLIDER_MIN_DISTANCE: number = 0
export const DEFAULT_SLIDER_ORIENTATION: Orientation = 'horizontal'
export const DEFAULT_SLIDER_STEP: number = 1
export const DEFAULT_SLIDER_THUMB_VALUE: number = 0

/**
 * BadgeElement
 */
/** */
export const DEFAULT_BADGE_MAX: number = 99
export const DEFAULT_BADGE_MIN: number = 0

/**
 * Elements
 */
/** */
export const ELEMENT_UID_GENERATE_OPTIONS: GenerateRandomStringOptions = { alphabet: ALPHABET_HEX_LOWERCASE, size: 8 }

/**
 * IconElement
 */
/** */
export const CACHE_ICONS: Map<string, string> = new Map()
export const DEFAULT_ICON_SVG_STRING: string = '<svg viewBox="0 0 0 0"></svg>'
export const DEFAULT_ICON_SANITIZE_CONFIG: IconElementSanitizeConfig = { RETURN_DOM: false, RETURN_DOM_FRAGMENT: false }
export const FETCHING_ICONS: Set<string> = new Set()

/**
 * ImageElement
 */
/** */
export const DEFAULT_IMAGE_SIZE: string = '100%'
export const DEFAULT_IMAGE_SRC: string = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
export const FETCHING_IMAGES: Set<string> = new Set()

/**
 * InputElement
 */
/** */
export const DEFAULT_INPUT_TYPE: InputElementType = 'text'

/**
 * RadioButtonElement
 */
/** */
export const DEFAULT_GET_RADIO_BUTTON_LABEL: GetRadioButtonLabel<unknown> = (button: unknown) => {
  let label: string | undefined, value: unknown

  label = isObject(button) ? getObjectProperty(button, 'label') : undefined
  if (typeof label === 'string') return label

  value = DEFAULT_GET_RADIO_BUTTON_VALUE(button)
  if (typeof value === 'string') return value
}
export const DEFAULT_GET_RADIO_BUTTON_VALUE: GetRadioButtonValue<unknown> = (button: unknown) =>
  isObject(button) ? getObjectProperty(button, 'value') : button

/**
 * SelectElement
 */
/** */
export const DEFAULT_GET_SELECT_OPTION_LABEL: GetSelectOptionLabel<unknown> = (option: unknown) => {
  let label: string | undefined, value: unknown

  label = isObject(option) ? getObjectProperty(option, 'label') : undefined
  if (typeof label === 'string') return label

  value = DEFAULT_GET_SELECT_OPTION_VALUE(option)
  if (typeof value === 'string') return value
}
export const DEFAULT_GET_SELECT_OPTION_VALUE: GetSelectOptionValue<unknown> = (option: unknown) =>
  isObject(option) ? getObjectProperty(option, 'value') : option

/**
 * Squircle
 */
/** */
export const DEFAULT_SQUIRCLE_CURVATURE: number = 0.75
export const DEFAULT_SQUIRCLE_SIZE: number = 0
export const SQUIRCLES_CONTAINER_ID: string = 'squircles_7d4ad1ff'

/**
 * SVG
 */
/** */
export const SVG_NAMESPACE_URI: 'http://www.w3.org/2000/svg' = 'http://www.w3.org/2000/svg' as const
