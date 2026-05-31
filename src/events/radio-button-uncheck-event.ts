import { IsomorphicEvent } from '@aracna/web'

export interface RadioButtonUncheckEventDetail {
  value?: any
}

export class RadioButtonUncheckEvent extends IsomorphicEvent<RadioButtonUncheckEventDetail> {
  constructor(value: any) {
    super('uncheck', { detail: { value } })
  }
}
