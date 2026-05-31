import { IsomorphicEvent } from '@aracna/web'

export interface ListBoxOptionUnselectEventDetail {
  value?: any
}

export class ListBoxOptionUnselectEvent extends IsomorphicEvent<ListBoxOptionUnselectEventDetail> {
  constructor(value: any) {
    super('unselect', { detail: { value } })
  }
}
