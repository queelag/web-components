import { IsomorphicEvent } from '@aracna/web'

/**
 * @category Event
 */
export class FocusTrapDeactivateEvent extends IsomorphicEvent<void> {
  constructor() {
    super('focus-trap-deactivate')
  }
}
