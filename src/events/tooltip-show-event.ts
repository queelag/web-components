import { IsomorphicEvent } from '@aracna/web'

/**
 * @category Event
 */
export class TooltipShowEvent extends IsomorphicEvent {
  constructor() {
    super('show')
  }
}
