import { IsomorphicEvent } from '@aracna/web'

/**
 * @category Event
 */
export class ComboBoxCollapseEvent extends IsomorphicEvent<void> {
  constructor() {
    super('combo-box-collapse')
  }
}
