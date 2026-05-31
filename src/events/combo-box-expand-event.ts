import { IsomorphicEvent } from '@aracna/web'

export class ComboBoxExpandEvent extends IsomorphicEvent<void> {
  constructor() {
    super('expand')
  }
}
