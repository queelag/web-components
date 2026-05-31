import { IsomorphicEvent } from '@aracna/web'
import type { FormControlElementSchema, FormControlElementValidation } from '../definitions/types.js'

export interface FormControlValidateEventDetail<T> {
  error?: string
  schema: FormControlElementSchema
  touched?: boolean
  validation: FormControlElementValidation
  value: T
}

interface Optional extends Pick<FormControlValidateEventDetail<any>, 'error' | 'touched'> {}

export class FormControlValidateEvent<T> extends IsomorphicEvent<FormControlValidateEventDetail<T>> {
  constructor(schema: FormControlElementSchema, validation: FormControlElementValidation, value: T, optional: Optional) {
    super('form-control-validate', { detail: { ...optional, schema, validation, value } })
  }
}
