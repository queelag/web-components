import { IsomorphicEvent } from '@aracna/web'
import { FormErrors } from '../definitions/types.js'
import { AracnaFormControlElement as FormControlElement } from '../elements/core/form-control-element.js'

export interface FormSubmitEventDetail {
  callback: CallableFunction
  controls: FormControlElement[]
  data: FormData
  errors?: FormErrors
}

export class FormSubmitEvent extends IsomorphicEvent<FormSubmitEventDetail> {
  constructor(callback: CallableFunction, controls: FormControlElement[], data: FormData, errors: FormErrors | undefined) {
    super('form-submit', { detail: { callback, controls, data, errors } })
  }
}
