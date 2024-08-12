import { IsomorphicEvent } from '@aracna/web'

/**
 * @category Event
 */
export class FloatingComputePositionEvent extends IsomorphicEvent {
  constructor() {
    super('floating-compute-position')
  }
}
