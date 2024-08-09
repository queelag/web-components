import { IsomorphicEvent } from '@aracna/web'

/**
 * @category Event
 */
export class DialogOpenEvent extends IsomorphicEvent<void> {
  constructor() {
    super('dialog-open')
  }
}
