import { DEFAULT_GET_RADIO_BUTTON_LABEL, DEFAULT_GET_RADIO_BUTTON_VALUE } from '../definitions/constants.js'
import type { GetRadioButtonLabel, GetRadioButtonValue } from '../definitions/types.js'

/**
 * Finds a radio button by its value.
 * Optionally a custom function can be passed to get the value of the radio button.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/web/utils/radio-element)
 */
export function findRadioButtonByValue<T>(options: T[], value: unknown, getValue: GetRadioButtonValue<T> = DEFAULT_GET_RADIO_BUTTON_VALUE): T | undefined {
  return options.find((option: T) => getValue(option) === value)
}

/**
 * Finds a radio button label by its value.
 *
 * - Optionally a custom function can be passed to get the label of the radio button.
 * - Optionally a custom function can be passed to get the value of the radio button.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/web/utils/radio-element)
 */
export function findRadioButtonLabelByValue<T>(
  options: T[],
  value: unknown,
  getLabel: GetRadioButtonLabel<T> = DEFAULT_GET_RADIO_BUTTON_LABEL,
  getValue?: (option: T) => any
): string | undefined {
  let option: T | undefined

  option = findRadioButtonByValue(options, value, getValue)
  if (!option) return undefined

  return getLabel(option)
}
