import { IsomorphicEvent } from '@aracna/web'

/**
 * @category Event
 */
export class FormControlTouchEvent extends IsomorphicEvent {
  constructor() {
    super('form-control-touch')
  }
}
