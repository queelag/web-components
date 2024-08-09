import { getFixedNumber, getNumberPercentage } from '@aracna/core'
import {
  DEFAULT_SLIDER_DECIMALS,
  DEFAULT_SLIDER_MAX,
  DEFAULT_SLIDER_MIN,
  DEFAULT_SLIDER_ORIENTATION,
  DEFAULT_SLIDER_THUMB_VALUE
} from '../definitions/constants.js'
import type { GetSliderThumbElementPercentageOptions } from '../definitions/interfaces.js'
import type { Orientation } from '../definitions/types.js'

/**
 * Returns the percentage of a value between a minimum and a maximum.
 *
 * - Optionally the percentage can be rounded.
 * - Optionally the number of decimals can be specified.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/web/utils/slider-element)
 */
export function getSliderThumbElementPercentage(value: number = DEFAULT_SLIDER_THUMB_VALUE, options?: GetSliderThumbElementPercentageOptions): number {
  return getFixedNumber(
    getNumberPercentage(value, { min: options?.min ?? DEFAULT_SLIDER_MIN, max: options?.max ?? DEFAULT_SLIDER_MAX }),
    options?.decimals ?? DEFAULT_SLIDER_DECIMALS
  )
}

/**
 * Returns the style left property of a slider thumb element based on its percentage.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/web/utils/slider-element)
 */
export function getSliderThumbElementStyleLeft(percentage: number, orientation: Orientation = DEFAULT_SLIDER_ORIENTATION): string {
  if (orientation === 'horizontal') {
    return percentage + '%'
  }

  return '0'
}

/**
 * Returns the style top property of a slider thumb element based on its percentage.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/web/utils/slider-element)
 */
export function getSliderThumbElementStyleTop(percentage: number, orientation: Orientation = DEFAULT_SLIDER_ORIENTATION): string {
  if (orientation === 'vertical') {
    return 100 - percentage + '%'
  }

  return '0'
}
