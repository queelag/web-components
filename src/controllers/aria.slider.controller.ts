import { DEFAULT_SLIDER_MAX, DEFAULT_SLIDER_MIN, DEFAULT_SLIDER_ORIENTATION, DEFAULT_SLIDER_THUMB_VALUE, setImmutableElementAttribute } from '@queelag/web'
import { ReactiveController, ReactiveControllerHost } from 'lit'
import type { AriaSliderElement, AriaSliderThumbElement } from '../elements/aria/aria.slider.element'

export class AriaSliderController implements ReactiveController {
  constructor(private host: ReactiveControllerHost & AriaSliderElement) {
    this.host.addController(this)
  }

  hostConnected(): void {
    this.setAttributes()
  }

  hostUpdate(): void {
    this.setAttributes()
  }

  setAttributes(): void {
    if (this.host.native) {
      return
    }

    // setImmutableElementAttribute(this.host, 'aria-labelledby', '')
    setImmutableElementAttribute(this.host, 'aria-disabled', this.host.disabled ? 'true' : undefined)
    setImmutableElementAttribute(this.host, 'aria-readonly', this.host.readonly ? 'true' : undefined)
    setImmutableElementAttribute(this.host, 'role', 'group')
  }
}

export class AriaSliderThumbController implements ReactiveController {
  constructor(private host: ReactiveControllerHost & AriaSliderThumbElement) {
    this.host.addController(this)
  }

  hostConnected(): void {
    this.setAttributes()
  }

  hostUpdate(): void {
    this.setAttributes()
  }

  setAttributes(): void {
    // setImmutableElementAttribute(this.host, 'aria-labelledby', '')
    setImmutableElementAttribute(this.host, 'aria-orientation', this.host.rootElement.orientation ?? DEFAULT_SLIDER_ORIENTATION)
    setImmutableElementAttribute(this.host, 'aria-valuemax', String(this.host.rootElement.max ?? DEFAULT_SLIDER_MAX))
    setImmutableElementAttribute(this.host, 'aria-valuemin', String(this.host.rootElement.min ?? DEFAULT_SLIDER_MIN))
    setImmutableElementAttribute(this.host, 'aria-valuenow', String(this.host.value ?? DEFAULT_SLIDER_THUMB_VALUE))
    setImmutableElementAttribute(this.host, 'role', 'slider')
    setImmutableElementAttribute(this.host, 'tabindex', '0')
  }
}
