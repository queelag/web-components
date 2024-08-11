import { IsomorphicEvent } from '@aracna/web'

interface Detail {
  value?: any
}

/**
 * @category Event
 */
export class RadioButtonUncheckEvent extends IsomorphicEvent<Detail> {
  constructor(value: any) {
    super('uncheck', { detail: { value } })
  }
}
