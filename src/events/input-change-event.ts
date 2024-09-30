import { IsomorphicEvent } from '@aracna/web'
import type { FormControlElementSchema, FormControlElementValidation } from '../definitions/types.js'

interface Detail<T> {
  domValue: string
  error?: string
  schema?: FormControlElementSchema
  touched?: boolean
  validation?: FormControlElementValidation
  value: T
}

interface Optional extends Omit<Detail<any>, 'domValue' | 'value'> {}

/**
 * @category Event
 */
export class InputChangeEvent<T> extends IsomorphicEvent<Detail<T>> {
  constructor(value: T, domValue: string, optional: Optional) {
    super('input-change', { detail: { ...optional, domValue, value } })
  }
}
