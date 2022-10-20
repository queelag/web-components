import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import '../../../src/elements/aria/aria.tabs.element'
import type { AriaTabsElement } from '../../../src/elements/aria/aria.tabs.element'
import { render } from '../../../vitest/dom.utils'

describe('AriaTabsElement', () => {
  let tabs: AriaTabsElement

  beforeEach(() => {
    tabs = document.createElement('q-aria-tabs')
  })

  afterEach(() => {
    tabs.remove()
  })

  it('has correct aria', async () => {
    await render(tabs)

    expect(tabs.getAttribute('role')).toBe('tablist')
  })
})
