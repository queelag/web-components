import { KeyboardEventKey } from '@aracna/web'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import '../../../src/elements/aria/aria-check-box-element'
import type { AracnaAriaCheckBoxElement as AriaCheckBoxElement } from '../../../src/elements/aria/aria-check-box-element'
import { dispatchKeyDownEvent, render } from '../../../vitest/dom-utils'

describe('AriaCheckBoxElement', () => {
  let checkbox: AriaCheckBoxElement

  beforeEach(() => {
    checkbox = document.createElement('aracna-aria-checkbox')
  })

  afterEach(() => {
    checkbox.remove()
  })

  it('has correct aria', async () => {
    await render(checkbox)

    expect(checkbox.getAttribute('aria-checked')).toBe('false')
    expect(checkbox.getAttribute('aria-disabled')).toBe('false')
    expect(checkbox.getAttribute('aria-readonly')).toBe('false')
    expect(checkbox.getAttribute('role')).toBe('checkbox')
    expect(checkbox.getAttribute('tabindex')).toBe('0')
  })

  it('checks and unchecks', async () => {
    await render(checkbox)

    expect(checkbox.checked).toBeFalsy()
    expect(checkbox.getAttribute('aria-checked')).toBe('false')

    checkbox.click()
    await checkbox.updateComplete

    expect(checkbox.checked).toBeTruthy()
    expect(checkbox.getAttribute('aria-checked')).toBe('true')

    checkbox.click()
    await checkbox.updateComplete

    expect(checkbox.checked).toBeFalsy()
    expect(checkbox.getAttribute('aria-checked')).toBe('false')
  })

  it('supports keyboard usage', async () => {
    await render(checkbox)

    expect(checkbox.checked).toBeFalsy()
    expect(checkbox.getAttribute('aria-checked')).toBe('false')

    /**
     * Press SPACE and expected the checkbox to be checked
     */
    dispatchKeyDownEvent(checkbox, KeyboardEventKey.SPACE)
    await checkbox.updateComplete

    expect(checkbox.checked).toBeTruthy()
    expect(checkbox.getAttribute('aria-checked')).toBe('true')
  })

  it('reflects disabled and readonly to aria', async () => {
    await render(checkbox, { disabled: 'true', readonly: 'true' })

    expect(checkbox.getAttribute('aria-disabled')).toBe('true')
    expect(checkbox.getAttribute('aria-readonly')).toBe('true')
  })
})
