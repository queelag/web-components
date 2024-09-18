import { IsomorphicEvent } from '@aracna/web'
import type { FormControlElementSchema, FormControlElementValidation } from '../definitions/types.js'

interface Detail<T> {
  error?: string
  schema?: FormControlElementSchema
  touched?: boolean
  validation?: FormControlElementValidation
  value: T
}

interface Optional extends Pick<Detail<any>, 'error' | 'schema' | 'touched' | 'validation'> {}

/**
 * @category Event
 */
export class FormControlChangeEvent<T> extends IsomorphicEvent<Detail<T>> {
  constructor(value: T, optional: Optional) {
    super('form-control-change', { detail: { ...optional, value } })
  }
}
