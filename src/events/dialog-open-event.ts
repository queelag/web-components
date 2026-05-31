import { IsomorphicEvent } from '@aracna/web'

export class DialogOpenEvent extends IsomorphicEvent<void> {
  constructor() {
    super('dialog-open')
  }
}
