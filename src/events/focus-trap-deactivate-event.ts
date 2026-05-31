import { IsomorphicEvent } from '@aracna/web'

export class FocusTrapDeactivateEvent extends IsomorphicEvent<void> {
  constructor() {
    super('focus-trap-deactivate')
  }
}
