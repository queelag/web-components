import { wf } from '@aracna/core'
import { type ElementAttributeValue, setElementAttributes } from '@aracna/web'

function waitForElementRender(selectors: string): Promise<void | Error> {
  return wf(
    () => {
      return document.querySelector(selectors)?.shadowRoot
    },
    4,
    5000
  )
}

export async function cleanup() {
  document.body.innerHTML = ''
}

export async function render<T extends HTMLElement>(
  element: T,
  attributes?: Record<string, ElementAttributeValue>,
  listeners?: Record<string, (event: any) => any>
): Promise<void | Error> {
  if (attributes) {
    setElementAttributes(element, attributes)
  }

  if (listeners) {
    for (let type in listeners) {
      element.addEventListener(type, listeners[type])
    }
  }

  document.body.append(element)

  return waitForElementRender(element.tagName.toLowerCase())
}

export function dispatchEvent<T extends Document | HTMLElement, U extends Event>(element: T | null, event: U): void {
  if (!element) {
    return
  }

  element.dispatchEvent(event)
}

/**
 * FOCUS EVENTS
 */

export function dispatchBlurEvent<T extends HTMLElement>(element: T | null): void {
  return dispatchEvent(element, new FocusEvent('blur'))
}

export function dispatchFocusEvent<T extends HTMLElement>(element: T | null): void {
  return dispatchEvent(element, new FocusEvent('focus'))
}

export function dispatchFocusInEvent<T extends HTMLElement>(element: T | null): void {
  return dispatchEvent(element, new FocusEvent('focusin'))
}

export function dispatchFocusOutEvent<T extends HTMLElement>(element: T | null): void {
  return dispatchEvent(element, new FocusEvent('focusout'))
}

/**
 * FORM EVENTS
 */

export function dispatchSubmitEvent<T extends HTMLFormElement>(element: T | null): void {
  return dispatchEvent(element, new Event('submit'))
}

/**
 * INPUT EVENTS
 */

export function dispatchChangeEvent(input: HTMLInputElement | HTMLSelectElement | null, value: string): void {
  if (!input) {
    return
  }

  input.value = value
  input.dispatchEvent(new InputEvent('change'))
}

export function dispatchInputEvent(input: HTMLInputElement | HTMLTextAreaElement | null, value: string): void {
  if (!input) {
    return
  }

  input.value = value
  input.dispatchEvent(new InputEvent('input'))
}

export function dispatchInputFileEvent(input: HTMLInputElement | null, files: File[] | null): void {
  let list: FileList | null = null

  if (!input) {
    return
  }

  if (files) {
    list = { ...files, item: (index: number) => files[index] || null }
  }

  Object.defineProperty(input, 'files', { configurable: true, value: files })
  input.dispatchEvent(new InputEvent('change'))
}

/**
 * KEYBOARD EVENTS
 */

export function dispatchKeyDownEvent<T extends HTMLElement>(element: T | null, key: string, init?: KeyboardEventInit): void {
  return dispatchEvent(element, new KeyboardEvent('keydown', { key, ...init }))
}

export function dispatchKeyUpEvent<T extends HTMLElement>(element: T | null, key: string, init?: KeyboardEventInit): void {
  return dispatchEvent(element, new KeyboardEvent('keyup', { key, ...init }))
}

/**
 * MOUSE EVENTS
 */

export function dispatchClickEvent<T extends HTMLElement>(element: T | null, init?: MouseEventInit): void {
  return dispatchEvent(element, new MouseEvent('click', init))
}

export function dispatchMouseDownEvent<T extends HTMLElement>(element: T | null): void {
  return dispatchEvent(element, new MouseEvent('mousedown'))
}

export function dispatchMouseEnterEvent<T extends HTMLElement>(element: T | null): void {
  return dispatchEvent(element, new MouseEvent('mouseenter'))
}

export function dispatchMouseLeaveEvent<T extends HTMLElement>(element: T | null): void {
  return dispatchEvent(element, new MouseEvent('mouseleave'))
}

export function dispatchMouseMoveEvent<T extends Document | HTMLElement>(element: T | null, init?: MouseEventInit): void {
  return dispatchEvent(element, new MouseEvent('mousemove', init))
}

export function dispatchMouseUpEvent<T extends Document | HTMLElement>(element: T | null): void {
  return dispatchEvent(element, new MouseEvent('mouseup'))
}

/**
 * TOUCH EVENTS
 */

export function dispatchTouchEndEvent<T extends HTMLElement>(element: T | null): void {
  return dispatchEvent(element, new TouchEvent('touchend'))
}

export function dispatchTouchMoveEvent<T extends HTMLElement>(element: T | null, init?: TouchEventInit): void {
  return dispatchEvent(element, new TouchEvent('touchmove', init))
}

export function dispatchTouchStartEvent<T extends HTMLElement>(element: T | null): void {
  return dispatchEvent(element, new TouchEvent('touchstart'))
}
