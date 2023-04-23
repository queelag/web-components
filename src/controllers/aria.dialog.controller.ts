import { ID } from '@aracna/core'
import { ReactiveController, ReactiveControllerHost } from 'lit'
import type { AriaDialogDescriptionElement, AriaDialogElement, AriaDialogLabelElement } from '../elements/aria/aria.dialog.element'

import { ELEMENT_UID_GENERATE_OPTIONS, setImmutableElementAttribute } from '@aracna/web'

export class AriaDialogController implements ReactiveController {
  alert: boolean

  constructor(private host: ReactiveControllerHost & AriaDialogElement, alert: boolean = false) {
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
  constructor(private host: ReactiveControllerHost & AriaDialogDescriptionElement) {
    this.host.addController(this)
  }

  hostConnected(): void {
    this.setAttributes()
  }

  hostUpdate(): void {
    this.setAttributes()
  }

  setAttributes(): void {
    if (this.host.id.length <= 0) {
      setImmutableElementAttribute(this.host, 'id', ID.generate({ ...ELEMENT_UID_GENERATE_OPTIONS, prefix: this.host.name }))
    }
  }
}

export class AriaDialogLabelController implements ReactiveController {
  constructor(private host: ReactiveControllerHost & AriaDialogLabelElement) {
    this.host.addController(this)
  }

  hostConnected(): void {
    this.setAttributes()
  }

  hostUpdate(): void {
    this.setAttributes()
  }

  setAttributes(): void {
    if (this.host.id.length <= 0) {
      setImmutableElementAttribute(this.host, 'id', ID.generate({ ...ELEMENT_UID_GENERATE_OPTIONS, prefix: this.host.name }))
    }
  }
}
