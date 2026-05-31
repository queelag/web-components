import { IsomorphicEvent } from '@aracna/web'

export class FocusTrapPostActivateEvent extends IsomorphicEvent<void> {
  constructor() {
    super('focus-trap-post-activate')
  }
}
