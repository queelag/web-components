import { IsomorphicEvent } from '@aracna/web'

export class FormControlTouchEvent extends IsomorphicEvent {
  constructor() {
    super('form-control-touch')
  }
}
