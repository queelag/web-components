import { IsomorphicEvent } from '@aracna/web'
import { FormErrors } from '../definitions/types.js'
import { AracnaFormControlElement as FormControlElement } from '../elements/core/form-control-element.js'

interface Detail {
  callback: Function
  controls: FormControlElement[]
  data: FormData
  errors?: FormErrors
}

/**
 * @category Event
 */
export class FormSubmitEvent extends IsomorphicEvent<Detail> {
  constructor(callback: Function, controls: FormControlElement[], data: FormData, errors: FormErrors | undefined) {
    super('form-submit', { detail: { callback, controls, data, errors } })
  }
}
