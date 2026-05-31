import { IsomorphicEvent } from '@aracna/web'

export class ComboBoxCollapseEvent extends IsomorphicEvent<void> {
  constructor() {
    super('collapse')
  }
}
