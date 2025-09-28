import { KeyboardEventKey } from '@aracna/web'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import '../../../src/elements/aria/aria-switch-element'
import type { AracnaAriaSwitchElement as AriaSwitchElement } from '../../../src/elements/aria/aria-switch-element'
import { dispatchKeyDownEvent, render } from '../../../vitest/dom-utils'

describe('AriaSwitchElement', () => {
  let switche: AriaSwitchElement

  beforeEach(() => {
    switche = document.createElement('aracna-aria-switch')
  })

  afterEach(() => {
    switche.remove()
  })

  it('has correct aria', async () => {
    await render(switche)

    expect(switche.getAttribute('aria-checked')).toBe('false')
    expect(switche.getAttribute('aria-disabled')).toBe('false')
    expect(switche.getAttribute('aria-readonly')).toBe('false')
    expect(switche.getAttribute('role')).toBe('switch')
    expect(switche.getAttribute('tabindex')).toBe('0')
  })

  it('turns on and off', async () => {
    await render(switche)

    expect(switche.getAttribute('aria-checked')).toBe('false')
    expect(switche.getAttribute('on')).toBeNull()

    switche.click()
    await switche.updateComplete

    expect(switche.getAttribute('aria-checked')).toBe('true')
    expect(switche.getAttribute('on')).not.toBeNull()

    switche.click()
    await switche.updateComplete

    expect(switche.getAttribute('aria-checked')).toBe('false')
    expect(switche.getAttribute('on')).toBeNull()
  })

  it('supports keyboard usage', async () => {
    await render(switche)

    expect(switche.getAttribute('aria-checked')).toBe('false')
    expect(switche.getAttribute('on')).toBeNull()

    await dispatchKeyDownEvent(KeyboardEventKey.SPACE, switche)
    await switche.updateComplete

    expect(switche.getAttribute('aria-checked')).toBe('true')
    expect(switche.getAttribute('on')).not.toBeNull()

    await dispatchKeyDownEvent(KeyboardEventKey.SPACE)
    await switche.updateComplete

    expect(switche.getAttribute('aria-checked')).toBe('false')
    expect(switche.getAttribute('on')).toBeNull()
  })
})
