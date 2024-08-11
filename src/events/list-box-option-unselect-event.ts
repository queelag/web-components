import { IsomorphicEvent } from '@aracna/web'

interface Detail {
  value?: any
}

/**
 * @category Event
 */
export class ListBoxOptionUnselectEvent extends IsomorphicEvent<Detail> {
  constructor(value: any) {
    super('unselect', { detail: { value } })
  }
}
