import { generateRandomString } from '@aracna/core'
import { ELEMENT_UID_GENERATE_OPTIONS, setImmutableElementAttribute } from '@aracna/web'
import { ReactiveController, ReactiveControllerHost } from 'lit'
import type { AriaDialogElement } from '../elements/aria/aria-dialog-element.js'
import type { BaseElement } from '../elements/core/base-element.js'

export class AriaDialogController implements ReactiveController {
  alert: boolean

  constructor(
    private host: ReactiveControllerHost & AriaDialogElement,
    alert: boolean = false
  ) {
    this.alert = alert
    this.host.addController(this)
  }

  hostConnected(): void {
    this.setAttributes()
  }

  hostUpdate(): void {
    this.setAttributes()
  }

  setAttributes(): void {
    setImmutableElementAttribute(this.host, 'aria-modal', 'true')
    setImmutableElementAttribute(this.host, 'aria-describedby', this.host.descriptionElement?.id)
    setImmutableElementAttribute(this.host, 'aria-labelledby', this.host.labelElement?.id)
    setImmutableElementAttribute(this.host, 'role', this.alert ? 'alertdialog' : 'dialog')
  }
}

export class AriaDialogDescriptionController implements ReactiveController {
  constructor(private host: ReactiveControllerHost & BaseElement) {
    this.host.addController(this)
  }

  hostConnected(): void {
    this.setAttributes()
  }

  hostUpdate(): void {
    this.setAttributes()
  }

  setAttributes(): void {
    if (this.host.id.length > 0) {
      return
    }

    setImmutableElementAttribute(
      this.host,
      'id',
      generateRandomString({
        ...ELEMENT_UID_GENERATE_OPTIONS,
        prefix: this.host.name
      })
    )
  }
}

export class AriaDialogLabelController extends AriaDialogDescriptionController implements ReactiveController {}
