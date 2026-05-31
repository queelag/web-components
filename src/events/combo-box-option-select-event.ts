import { IsomorphicEvent } from '@aracna/web'

export interface ComboBoxOptionSelectEventDetail {
  value?: any
}

export class ComboBoxOptionSelectEvent extends IsomorphicEvent<ComboBoxOptionSelectEventDetail> {
  constructor(value: any) {
    super('select', { detail: { value } })
  }
}
