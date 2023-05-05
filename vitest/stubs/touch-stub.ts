import { vi } from 'vitest'

class StubTouch implements Touch {
  readonly clientX: number
  readonly clientY: number
  readonly force: number
  readonly identifier: number
  readonly pageX: number
  readonly pageY: number
  readonly radiusX: number
  readonly radiusY: number
  readonly rotationAngle: number
  readonly screenX: number
  readonly screenY: number
  readonly target: EventTarget

  constructor(touchInitDict: TouchInit) {
    this.clientX = touchInitDict.clientX ?? 0
    this.clientY = touchInitDict.clientY ?? 0
    this.force = touchInitDict.force ?? 0
    this.identifier = touchInitDict.identifier
    this.pageX = touchInitDict.pageX ?? 0
    this.pageY = touchInitDict.pageY ?? 0
    this.radiusX = touchInitDict.radiusX ?? 0
    this.radiusY = touchInitDict.radiusY ?? 0
    this.rotationAngle = touchInitDict.rotationAngle ?? 0
    this.screenX = touchInitDict.screenX ?? 0
    this.screenY = touchInitDict.screenY ?? 0
    this.target = touchInitDict.target
  }
}

vi.stubGlobal('Touch', StubTouch)
