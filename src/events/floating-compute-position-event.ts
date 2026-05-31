import { IsomorphicEvent } from '@aracna/web'

export class FloatingComputePositionEvent extends IsomorphicEvent {
  constructor() {
    super('floating-compute-position')
  }
}
