import { DEFAULT_GET_SELECT_OPTION_LABEL, DEFAULT_GET_SELECT_OPTION_VALUE } from '../definitions/constants.js'
import type { GetSelectOptionLabel, GetSelectOptionValue } from '../definitions/types.js'

/**
 * Finds a select option by its value.
 * Optionally a custom function can be passed to get the value of the select option.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/web/utils/select-element)
 */
export function findSelectOptionByValue<T>(options: T[], value: any, getValue: GetSelectOptionValue<T> = DEFAULT_GET_SELECT_OPTION_VALUE): T | undefined {
  return options.find((option: T) => getValue(option) === value)
}

/**
 * Finds a select option label by its value.
 *
 * - Optionally a custom function can be passed to get the label of the select option.
 * - Optionally a custom function can be passed to get the value of the select option.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/web/utils/select-element)
 */
export function findSelectOptionLabelByValue<T>(
  options: T[],
  value: any,
  getLabel: GetSelectOptionLabel<T> = DEFAULT_GET_SELECT_OPTION_LABEL,
  getValue?: GetSelectOptionValue<T>
): string | undefined {
  let option: T | undefined

  option = findSelectOptionByValue(options, value, getValue)
  if (!option) return undefined

  return getLabel(option)
}
