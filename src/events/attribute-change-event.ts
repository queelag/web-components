import { IsomorphicEvent } from '@aracna/web'

export interface AttributeChangeEventDetail {
  name: string
  old: string | null
  value: string | null
}

export class AttributeChangeEvent extends IsomorphicEvent<AttributeChangeEventDetail> {
  constructor(name: string, old: string | null, value: string | null) {
    super('attribute-change', { detail: { name, old, value } })
  }
}
