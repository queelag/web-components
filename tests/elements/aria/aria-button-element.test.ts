import { KeyboardEventKey } from '@aracna/web'
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest'
import '../../../src/elements/aria/aria-button-element'
import type { AracnaAriaButtonElement as AriaButtonElement } from '../../../src/elements/aria/aria-button-element'
import { dispatchKeyDownEvent, render } from '../../../vitest/dom-utils'

describe('AriaButtonElement', () => {
  let button: AriaButtonElement

  beforeEach(() => {
    button = document.createElement('aracna-aria-button')
  })

  afterEach(() => {
    button.remove()
  })

  it('has correct aria', async () => {
    await render(button)

    expect(button.getAttribute('aria-disabled')).toBe('false')
    // expect(button.getAttribute('aria-label')).toBe('label')
    expect(button.getAttribute('aria-pressed')).toBeNull()
    expect(button.getAttribute('role')).toBe('button')
    expect(button.getAttribute('tabindex')).toBe('0')
  })

  it('supports keyboard usage', async () => {
    let onClick: Mock = vi.fn()

    button.addEventListener('click', onClick)
    await render(button)

    button.focus()
    await dispatchKeyDownEvent(KeyboardEventKey.ENTER)
    expect(onClick).toBeCalledTimes(1)

    await dispatchKeyDownEvent(KeyboardEventKey.SPACE)
    expect(onClick).toBeCalledTimes(2)
  })

  it('does not click if disabled', async () => {
    let onClick: Mock = vi.fn()

    button.addEventListener('click', onClick)
    await render(button, { disabled: 'true' })

    button.click()
    expect(onClick).toBeCalledTimes(0)
  })

  it('supports differend pressed states', async () => {
    await render(button, { pressed: 'false' })
    expect(button.getAttribute('aria-pressed')).toBe('false')

    button.pressed = 'true'
    await button.updateComplete
    expect(button.getAttribute('aria-pressed')).toBe('true')

    button.pressed = 'mixed'
    await button.updateComplete
    expect(button.getAttribute('aria-pressed')).toBe('mixed')
  })
})
