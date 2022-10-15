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
    }, 100)
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

export function dispatchInputEvent(input: HTMLInputElement | null, value: string): void {
  if (!input) {
    return
  }

  input.value = value
  input.dispatchEvent(new InputEvent('input'))
}

export function dispatchKeyUpEvent<T extends HTMLElement>(element: T | null, key: string): void {
  if (!element) {
    return
  }

  element.dispatchEvent(new KeyboardEvent('keyup', { key }))
}
