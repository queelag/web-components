import { IsomorphicEvent } from '@aracna/web'

export class CheckBoxUncheckEvent extends IsomorphicEvent {
  constructor() {
    super('uncheck')
  }
}
