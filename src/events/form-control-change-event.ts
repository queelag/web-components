import { IsomorphicEvent } from '@aracna/web'
import type { FormControlElementSchema, FormControlElementValidation } from '../definitions/types.js'

export interface FormControlChangeEventDetail<T> {
  error?: string
  schema?: FormControlElementSchema
  touched?: boolean
  validation?: FormControlElementValidation
  value: T
}

interface Optional extends Omit<FormControlChangeEventDetail<any>, 'value'> {}

export class FormControlChangeEvent<T> extends IsomorphicEvent<FormControlChangeEventDetail<T>> {
  constructor(value: T, optional: Optional) {
    super('form-control-change', { detail: { ...optional, value } })
  }
}
