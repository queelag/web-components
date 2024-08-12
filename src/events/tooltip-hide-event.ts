import { IsomorphicEvent } from '@aracna/web'

/**
 * @category Event
 */
export class TooltipHideEvent extends IsomorphicEvent {
  constructor() {
    super('hide')
  }
}
