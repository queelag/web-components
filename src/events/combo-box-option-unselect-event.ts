import { IsomorphicEvent } from '@aracna/web'

export interface ComboBoxOptionUnselectEventDetail {
  value?: any
}

export class ComboBoxOptionUnselectEvent extends IsomorphicEvent<ComboBoxOptionUnselectEventDetail> {
  constructor(value: any) {
    super('unselect', { detail: { value } })
  }
}
