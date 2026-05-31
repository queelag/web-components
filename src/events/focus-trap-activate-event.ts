import { IsomorphicEvent } from '@aracna/web'

export class FocusTrapActivateEvent extends IsomorphicEvent<void> {
  constructor() {
    super('focus-trap-activate')
  }
}
