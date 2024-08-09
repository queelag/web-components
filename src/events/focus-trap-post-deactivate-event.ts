import { IsomorphicEvent } from '@aracna/web'

/**
 * @category Event
 */
export class FocusTrapPostDeactivateEvent extends IsomorphicEvent<void> {
  constructor() {
    super('focus-trap-post-deactivate')
  }
}
