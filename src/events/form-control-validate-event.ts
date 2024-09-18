import { IsomorphicEvent } from '@aracna/web'
import type { FormControlElementSchema, FormControlElementValidation } from '../definitions/types.js'

interface Detail<T> {
  error?: string
  schema: FormControlElementSchema
  touched?: boolean
  validation: FormControlElementValidation
  value: T
}

interface Optional extends Pick<Detail<any>, 'error' | 'touched'> {}

/**
 * @category Event
 */
export class FormControlValidateEvent<T> extends IsomorphicEvent<Detail<T>> {
  constructor(schema: FormControlElementSchema, validation: FormControlElementValidation, value: T, optional: Optional) {
    super('form-control-validate', { detail: { ...optional, schema, validation, value } })
  }
}
