import { sleep } from '@aracna/core'
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest'
import '../../../src/elements/input/button-element'
import type { AracnaButtonElement as ButtonElement } from '../../../src/elements/input/button-element'
import { ButtonClickEvent } from '../../../src/events/button-click-event'
import { render } from '../../../vitest/dom-utils'

describe('ButtonElement', () => {
  let button: ButtonElement

  beforeEach(() => {
    button = document.createElement('aracna-button')
  })

  afterEach(() => {
    button.remove()
  })

  it('has aria attributes', async () => {
    await render(button)

    expect(button.getAttribute('aria-disabled')).toBe('false')
    expect(button.getAttribute('aria-pressed')).toBeNull()
    expect(button.getAttribute('role')).toBe('button')
    expect(button.getAttribute('tabindex')).toBe('0')
  })

  it('supports native button element', async () => {
    let native: HTMLButtonElement

    native = document.createElement('button')
    button.append(native)

    await render(button)

    expect(button.getAttribute('aria-disabled')).toBeNull()
    expect(button.getAttribute('aria-pressed')).toBeNull()
    expect(button.getAttribute('role')).toBeNull()
    expect(button.getAttribute('tabindex')).toBeNull()

    expect(native.ariaLabel).toBeNull()
    expect(native.ariaPressed).toBeNull()
    expect(native.disabled).toBeFalsy()
    expect(native.tabIndex).toBe(0)
    expect(native.type).toBe('submit')

    button.disabled = true
    button.pressed = 'true'
    button.text = 'label'
    button.type = 'button'

    await button.updateComplete

    expect(button.getAttribute('aria-disabled')).toBeNull()
    expect(button.getAttribute('aria-pressed')).toBeNull()
    expect(button.getAttribute('role')).toBeNull()
    expect(button.getAttribute('tabindex')).toBeNull()

    expect(native.ariaLabel).toBe('label')
    expect(native.ariaPressed).toBe('true')
    expect(native.disabled).toBeTruthy()
    expect(native.tabIndex).toBe(0)
    expect(native.type).toBe('button')
  })

  it('supports async click', async () => {
    let listener: Mock = vi.fn(async (event: ButtonClickEvent) => {
      await sleep(100)
      event.detail?.callback()
    })

    await render(button, { async: 'true' }, { 'button-click': listener })

    expect(button.getAttribute('disabled')).toBeNull()
    expect(button.getAttribute('spinning')).toBeNull()

    button.click()

    expect(listener).toBeCalledTimes(1)
    expect(button.getAttribute('disabled')).toBeDefined()
    expect(button.getAttribute('spinning')).toBeDefined()

    await sleep(200)

    expect(button.getAttribute('disabled')).toBeNull()
    expect(button.getAttribute('spinning')).toBeNull()
  })
})
