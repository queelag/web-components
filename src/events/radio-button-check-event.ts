import { IsomorphicEvent } from '@aracna/web'

interface Detail {
  value?: any
}

/**
 * @category Event
 */
export class RadioButtonCheckEvent extends IsomorphicEvent<Detail> {
  constructor(value: any) {
    super('check', { detail: { value } })
  }
}
