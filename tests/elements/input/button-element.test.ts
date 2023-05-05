import { sleep } from '@aracna/core'
import { ButtonClickEvent } from '@aracna/web'
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest'
import '../../../src/elements/input/button-element'
import type { ButtonElement } from '../../../src/elements/input/button-element'
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
    await render(button, { native: 'true' })

    expect(button.getAttribute('aria-disabled')).toBeNull()
    expect(button.getAttribute('aria-pressed')).toBeNull()
    expect(button.getAttribute('role')).toBeNull()
    expect(button.getAttribute('tabindex')).toBe('0')

    expect(button.shadowRoot?.querySelector('button')?.getAttribute('aria-label')).toBeNull()
    expect(button.shadowRoot?.querySelector('button')?.getAttribute('aria-pressed')).toBeNull()
    expect(button.shadowRoot?.querySelector('button')?.getAttribute('disabled')).toBeNull()
    expect(button.shadowRoot?.querySelector('button')?.getAttribute('style')).toBe('')
    expect(button.shadowRoot?.querySelector('button')?.getAttribute('tabindex')).toBe('-1')
    expect(button.shadowRoot?.querySelector('button')?.getAttribute('type')).toBeNull()

    await render(button, { disabled: 'true', label: 'label', native: 'true', pressed: 'true', type: 'button' })

    expect(button.getAttribute('aria-disabled')).toBeNull()
    expect(button.getAttribute('aria-pressed')).toBeNull()
    expect(button.getAttribute('role')).toBeNull()
    expect(button.getAttribute('tabindex')).toBe('0')

    expect(button.shadowRoot?.querySelector('button')?.getAttribute('aria-label')).toBe('label')
    expect(button.shadowRoot?.querySelector('button')?.getAttribute('aria-pressed')).toBe('true')
    expect(button.shadowRoot?.querySelector('button')?.getAttribute('disabled')).toBe('')
    expect(button.shadowRoot?.querySelector('button')?.getAttribute('style')).toBe('')
    expect(button.shadowRoot?.querySelector('button')?.getAttribute('tabindex')).toBe('-1')
    expect(button.shadowRoot?.querySelector('button')?.getAttribute('type')).toBe('button')
  })

  it('supports async click', async () => {
    let listener: Mock = vi.fn(async (event: ButtonClickEvent) => {
      await sleep(100)
      event.detail?.finalize()
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
