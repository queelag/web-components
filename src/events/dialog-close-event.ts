import { IsomorphicEvent } from '@aracna/web'

/**
 * @category Event
 */
export class DialogCloseEvent extends IsomorphicEvent<void> {
  constructor() {
    super('dialog-close')
  }
}
