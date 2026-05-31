import { IsomorphicEvent } from '@aracna/web'

export interface RadioButtonCheckEventDetail {
  value?: any
}

export class RadioButtonCheckEvent extends IsomorphicEvent<RadioButtonCheckEventDetail> {
  constructor(value: any) {
    super('check', { detail: { value } })
  }
}
