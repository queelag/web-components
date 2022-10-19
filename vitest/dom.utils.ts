import { ElementAttributeValue, setElementAttributes } from '@queelag/web'

function waitForElementRender(selectors: string): Promise<void> {
  return new Promise((resolve) => {
    let interval: NodeJS.Timer

    interval = setInterval(() => {
      if (!document.querySelector(selectors)?.shadowRoot) {
        return
      }

      clearInterval(interval)
      resolve()
    }, 10)
  })
}

export async function render<T extends HTMLElement>(
  element: T,
  attributes?: Record<string, ElementAttributeValue>,
  listeners?: Record<string, (event: any) => any>
): Promise<void> {
  if (attributes) {
    setElementAttributes(element, attributes)
  }

  if (listeners) {
    for (let type in listeners) {
      element.addEventListener(type, listeners[type])
    }
  }

  document.body.append(element)

  return waitForElementRender(element.tagName)
}

export function dispatchEvent<T extends HTMLElement, U extends Event>(element: T | null, event: U): void {
  if (!element) {
    return
  }

  element.dispatchEvent(event)
}

export function dispatchBlurEvent<T extends HTMLElement>(element: T | null): void {
  return dispatchEvent(element, new FocusEvent('blur'))
}

export function dispatchChangeEvent(input: HTMLInputElement | HTMLSelectElement | null, value: string): void {
  if (!input) {
    return
  }

  input.value = value
  input.dispatchEvent(new InputEvent('change'))
}

export function dispatchFocusEvent<T extends HTMLElement>(element: T | null): void {
  return dispatchEvent(element, new FocusEvent('focus'))
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

export function dispatchKeyUpEvent<T extends HTMLElement>(element: T | null, key: string, init?: KeyboardEventInit): void {
  return dispatchEvent(element, new KeyboardEvent('keyup', { key, ...init }))
}

export function dispatchKeyDownEvent<T extends HTMLElement>(element: T | null, key: string, init?: KeyboardEventInit): void {
  return dispatchEvent(element, new KeyboardEvent('keydown', { key, ...init }))
}

export function dispatchMouseEnterEvent<T extends HTMLElement>(element: T | null): void {
  return dispatchEvent(element, new MouseEvent('mouseenter'))
}

export function dispatchMouseLeaveEvent<T extends HTMLElement>(element: T | null): void {
  return dispatchEvent(element, new MouseEvent('mouseleave'))
}
