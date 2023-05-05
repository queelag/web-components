import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import '../../../src/elements/input/check-box-element'
import type { CheckBoxElement } from '../../../src/elements/input/check-box-element'
import { render } from '../../../vitest/dom-utils'

describe('CheckBoxElement', () => {
  let checkbox: CheckBoxElement

  beforeEach(() => {
    checkbox = document.createElement('aracna-checkbox')
  })

  afterEach(() => {
    checkbox.remove()
  })

  it('has aria attributes', async () => {
    await render(checkbox)

    expect(checkbox.getAttribute('aria-checked')).toBe('false')
    expect(checkbox.getAttribute('aria-disabled')).toBe('false')
    expect(checkbox.getAttribute('aria-readonly')).toBe('false')
    expect(checkbox.getAttribute('role')).toBe('checkbox')
    expect(checkbox.getAttribute('tabindex')).toBe('0')
  })

  it('supports native checkbox', async () => {
    await render(checkbox, { native: 'true' })

    expect(checkbox.getAttribute('aria-checked')).toBeNull()
    expect(checkbox.getAttribute('aria-disabled')).toBeNull()
    expect(checkbox.getAttribute('aria-readonly')).toBeNull()
    expect(checkbox.getAttribute('role')).toBeNull()
    expect(checkbox.getAttribute('tabindex')).toBeNull()
  })

  it('checks and unchecks', async () => {
    await render(checkbox)
    expect(checkbox.getAttribute('checked')).toBeNull()

    checkbox.click()
    expect(checkbox.checked).toBeTruthy()
    expect(checkbox.value).toBeTruthy()

    checkbox.click()
    expect(checkbox.checked).toBeFalsy()
    expect(checkbox.value).toBeFalsy()
  })

  it('does not check if disabled or readonly', async () => {
    await render(checkbox, { disabled: 'true' })

    checkbox.click()
    expect(checkbox.checked).toBeUndefined()

    await render(checkbox, { readonly: 'true' })

    checkbox.click()
    expect(checkbox.checked).toBeUndefined()
  })
})
