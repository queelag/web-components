import { IsomorphicEvent } from '@aracna/web'
import type { FormControlElementSchema, FormControlElementValidation } from '../definitions/types.js'

interface Detail<T> {
  schema: FormControlElementSchema
  validation: FormControlElementValidation
  value: T
}

/**
 * @category Event
 */
export class FormControlValidateEvent<T> extends IsomorphicEvent<Detail<T>> {
  constructor(schema: FormControlElementSchema, validation: FormControlElementValidation, value: T) {
    super('form-control-validate', { detail: { schema, validation, value } })
  }
}
