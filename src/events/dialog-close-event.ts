import { IsomorphicEvent } from '@aracna/web'

export class DialogCloseEvent extends IsomorphicEvent<void> {
  constructor() {
    super('dialog-close')
  }
}
