import { IsomorphicEvent } from '@aracna/web'

export interface ListBoxOptionSelectEventDetail {
  value?: any
}

export class ListBoxOptionSelectEvent extends IsomorphicEvent<ListBoxOptionSelectEventDetail> {
  constructor(value: any) {
    super('select', { detail: { value } })
  }
}
