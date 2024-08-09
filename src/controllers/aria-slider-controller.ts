import { setImmutableElementAttribute } from '@aracna/web'
import type { ReactiveController, ReactiveControllerHost } from 'lit'
import { DEFAULT_SLIDER_MAX, DEFAULT_SLIDER_MIN, DEFAULT_SLIDER_ORIENTATION, DEFAULT_SLIDER_THUMB_VALUE } from '../definitions/constants.js'
import type {
  AracnaAriaSliderElement as AriaSliderElement,
  AracnaAriaSliderThumbElement as AriaSliderThumbElement
} from '../elements/aria/aria-slider-element.js'

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
    setImmutableElementAttribute(this.host, 'aria-disabled', this.host.disabled ? 'true' : 'false')
    setImmutableElementAttribute(this.host, 'aria-readonly', this.host.readonly ? 'true' : 'false')
    setImmutableElementAttribute(this.host, 'role', 'group')

    for (let thumb of this.host.thumbElements) {
      setImmutableElementAttribute(thumb, 'aria-orientation', this.host.orientation ?? DEFAULT_SLIDER_ORIENTATION)
      setImmutableElementAttribute(thumb, 'aria-valuemax', String(this.host.max ?? DEFAULT_SLIDER_MAX))
      setImmutableElementAttribute(thumb, 'aria-valuemin', String(this.host.min ?? DEFAULT_SLIDER_MIN))
    }
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
    setImmutableElementAttribute(this.host, 'aria-valuenow', String(this.host.value ?? DEFAULT_SLIDER_THUMB_VALUE))
    setImmutableElementAttribute(this.host, 'role', 'slider')
    setImmutableElementAttribute(this.host, 'tabindex', '0')
  }
}
