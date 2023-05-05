import { parseNumber } from '@aracna/core'

class StubDOMRect implements DOMRect {
  readonly bottom: number
  readonly height: number
  readonly left: number
  readonly right: number
  readonly top: number
  readonly width: number
  readonly x: number
  readonly y: number

  constructor(x?: number, y?: number, width?: number, height?: number) {
    this.x = x ?? 0
    this.y = y ?? 0
    this.width = width ?? 0
    this.height = height ?? 0

    this.bottom = 0
    this.left = 0
    this.right = 0
    this.top = 0
  }

  toJSON(): any {
    return JSON.parse(JSON.stringify(this))
  }
}

Element.prototype.getBoundingClientRect = function () {
  return new StubDOMRect(0, 0, parseNumber(this.style.width), parseNumber(this.style.height))
}
