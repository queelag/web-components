import { IsomorphicEvent } from '@aracna/web'

/**
 * @category Event
 */
export class ComboBoxExpandEvent extends IsomorphicEvent<void> {
  constructor() {
    super('expand')
  }
}
