import { IsomorphicEvent } from '@aracna/web'

export class FocusTrapPostDeactivateEvent extends IsomorphicEvent<void> {
  constructor() {
    super('focus-trap-post-deactivate')
  }
}
