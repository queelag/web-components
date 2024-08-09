import { IsomorphicEvent } from '@aracna/web'

interface Detail {
  finalize: Function
}

/**
 * @category Event
 */
export class FormSubmitEvent extends IsomorphicEvent<Detail> {
  constructor(finalize: Function) {
    super('form-submit', { detail: { finalize } })
  }
}
