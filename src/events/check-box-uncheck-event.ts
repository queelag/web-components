import { IsomorphicEvent } from '@aracna/web'

/**
 * @category Event
 */
export class CheckBoxUncheckEvent extends IsomorphicEvent {
  constructor() {
    super('uncheck')
  }
}
