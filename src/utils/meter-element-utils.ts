import { type GetLimitedNumberOptions, type GetNumberPercentageOptions, getLimitedNumber, getNumberPercentage } from '@aracna/core'
import { DEFAULT_METER_MAX, DEFAULT_METER_MIN, DEFAULT_METER_VALUE } from '../definitions/constants.js'

/**
 * Returns the percentage of a value between a minimum and a maximum.
 * Optionally the percentage can be rounded.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/web/utils/meter-element)
 */
export function getMeterElementPercentage(value?: number, options?: GetNumberPercentageOptions): number {
  return getNumberPercentage(getMeterElementValue(value, options), {
    ...options,
    min: options?.min ?? DEFAULT_METER_MIN,
    max: options?.max ?? DEFAULT_METER_MAX
  })
}

/**
 * Returns a value between a minimum and a maximum.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/web/utils/meter-element)
 */
export function getMeterElementValue(value?: number, options?: GetLimitedNumberOptions): number {
  return getLimitedNumber(value ?? DEFAULT_METER_VALUE, { ...options, min: options?.min ?? DEFAULT_METER_MIN, max: options?.max ?? DEFAULT_METER_MAX })
}
