import { IsomorphicEvent } from '@aracna/web'

/**
 * @category Event
 */
export class FocusTrapPostActivateEvent extends IsomorphicEvent<void> {
  constructor() {
    super('focus-trap-post-activate')
  }
}
