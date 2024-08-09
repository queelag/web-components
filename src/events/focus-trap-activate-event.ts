import { IsomorphicEvent } from '@aracna/web'

/**
 * @category Event
 */
export class FocusTrapActivateEvent extends IsomorphicEvent<void> {
  constructor() {
    super('focus-trap-activate')
  }
}
