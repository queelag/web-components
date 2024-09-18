import type { FormControlElementAttributes } from '../definitions/attributes.js'
import { AracnaFormControlElement as FormControlElement } from '../elements/core/form-control-element.js'

export function getFormControlElementValue<T = any>(element: FormControlElement): T
export function getFormControlElementValue<T = any>(attributes: FormControlElementAttributes): T
export function getFormControlElementValue<T = any>(eoa: FormControlElement | FormControlElementAttributes): T {
  if (eoa.target && typeof eoa.path === 'string') {
    return eoa.target[eoa.path]
  }

  return eoa.value
}
