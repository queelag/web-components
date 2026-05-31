import { IsomorphicEvent } from '@aracna/web'
import { StructError } from 'superstruct'
import type { FormControlElementSchema, FormControlElementValidation } from '../definitions/types.js'

export interface InputChangeEventDetail<T> {
  domValue: string
  error?: StructError
  schema?: FormControlElementSchema
  touched?: boolean
  validation?: FormControlElementValidation
  value: T
}

interface Optional extends Omit<InputChangeEventDetail<any>, 'domValue' | 'value'> {}

export class InputChangeEvent<T> extends IsomorphicEvent<InputChangeEventDetail<T>> {
  constructor(value: T, domValue: string, optional: Optional) {
    super('input-change', { detail: { ...optional, domValue, value } })
  }
}
