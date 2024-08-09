import { IsomorphicEvent } from '@aracna/web'

interface Detail {
  name: string
  old: string | null
  value: string | null
}

/**
 * @category Event
 */
export class AttributeChangeEvent extends IsomorphicEvent<Detail> {
  constructor(name: string, old: string | null, value: string | null) {
    super('attribute-change', { detail: { name, old, value } })
  }
}
