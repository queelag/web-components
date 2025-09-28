/// <reference types="@vitest/browser/providers/webdriverio" />

import { wf } from '@aracna/core'
import { type ElementAttributeValue, KeyboardEventKey, setElementAttributes } from '@aracna/web'
import { userEvent } from '@vitest/browser/context'
import { ButtonNames } from 'webdriverio'

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

export async function dispatchKeyDownEvent<T extends HTMLElement>(key: KeyboardEventKey | string, element?: T | null): Promise<void> {
  let text: string

  text = Object.values(KeyboardEventKey).includes(key as KeyboardEventKey) ? `{${key}}` : key

  if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
    return userEvent.type(element, text)
  }

  if (element) {
    element.focus()
  }

  return userEvent.keyboard(text)
}

export async function dispatchKeyUpEvent<T extends HTMLElement>(key: KeyboardEventKey | string, element?: T | null): Promise<void> {
  let text: string

  text = Object.values(KeyboardEventKey).includes(key as KeyboardEventKey) ? `{/${key}}` : key

  if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
    return userEvent.type(element, text)
  }

  if (element) {
    element.focus()
  }

  return userEvent.keyboard(text)
}

/**
 * POINTER EVENTS
 */

export function dispatchClickEvent<T extends HTMLElement>(element: T | null, init?: MouseEventInit): void {
  return dispatchEvent(element, new MouseEvent('click', init))
}

export async function dispatchPointerDownEvent<T extends HTMLElement>(element: T | null, button?: ButtonNames): Promise<void> {
  return dispatchEvent(element, new PointerEvent('pointerdown'))
}

export function dispatchPointerEnterEvent<T extends HTMLElement>(element: T | null): void {
  return dispatchEvent(element, new PointerEvent('pointerenter'))
}

export function dispatchPointerLeaveEvent<T extends HTMLElement>(element: T | null): void {
  return dispatchEvent(element, new PointerEvent('pointerleave'))
}

export function dispatchPointerMoveEvent<T extends Document | HTMLElement>(element: T | null, init?: PointerEventInit): void {
  return dispatchEvent(element, new PointerEvent('pointermove', init))
}

export function dispatchPointerUpEvent<T extends Document | HTMLElement>(element: T | null): void {
  return dispatchEvent(element, new PointerEvent('pointerup'))
}
