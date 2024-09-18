import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import '../../../src/elements/input/switch-element'
import type { AracnaSwitchElement as SwitchElement } from '../../../src/elements/input/switch-element'
import { cleanup, render } from '../../../vitest/dom-utils'

describe('SwitchElement', () => {
  let switche: SwitchElement

  beforeEach(() => {
    switche = document.createElement('aracna-switch')
  })

  afterEach(() => {
    switche.remove()
  })

  it('has aria attributes', async () => {
    await render(switche)

    expect(switche.getAttribute('aria-checked')).toBe('false')
    expect(switche.getAttribute('aria-disabled')).toBe('false')
    expect(switche.getAttribute('aria-readonly')).toBe('false')
    expect(switche.getAttribute('role')).toBe('switch')
    expect(switche.getAttribute('tabindex')).toBe('0')
  })

  it('supports native switch', async () => {
    let native: HTMLInputElement

    native = document.createElement('input')
    switche.append(native)

    await render(switche)

    expect(switche.getAttribute('aria-checked')).toBeNull()
    expect(switche.getAttribute('aria-disabled')).toBeNull()
    expect(switche.getAttribute('aria-readonly')).toBeNull()
    expect(switche.getAttribute('role')).toBeNull()
    expect(switche.getAttribute('tabindex')).toBeNull()
  })

  it('checks and unchecks', async () => {
    await render(switche)
    expect(switche.getAttribute('checked')).toBeNull()

    switche.click()
    expect(switche.on).toBeTruthy()
    expect(switche.value).toBeTruthy()

    switche.click()
    expect(switche.on).toBeFalsy()
    expect(switche.value).toBeFalsy()
  })

  it('does not check if disabled or readonly', async () => {
    await render(switche, { disabled: 'true' })

    switche.click()
    expect(switche.on).toBeUndefined()

    await render(switche, { readonly: 'true' })

    switche.click()
    expect(switche.on).toBeUndefined()
  })

  it('works with target and path', async () => {
    let target: Record<string, boolean | undefined>, path: string

    target = { value: undefined }
    path = 'value'

    switche.target = target
    await render(switche, { path })

    expect(switche.on).toBeFalsy()
    expect(switche.value).toBeFalsy()

    switche.click()
    expect(switche.on).toBeTruthy()
    expect(switche.value).toBeTruthy()

    switche = document.createElement('aracna-switch')
    switche.target = target

    await cleanup()
    await render(switche, { path })

    expect(switche.on).toBeTruthy()
    expect(switche.value).toBeTruthy()
  })
})
