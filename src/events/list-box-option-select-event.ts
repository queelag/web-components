import { IsomorphicEvent } from '@aracna/web'

interface Detail {
  value?: any
}

/**
 * @category Event
 */
export class ListBoxOptionSelectEvent extends IsomorphicEvent<Detail> {
  constructor(value: any) {
    super('select', { detail: { value } })
  }
}
