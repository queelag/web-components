import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import '../../../src/elements/aria/aria.menu.element'
import type { AriaMenuElement } from '../../../src/elements/aria/aria.menu.element'
import { render } from '../../../vitest/dom.utils'

describe('AriaMenuElement', () => {
  let menu: AriaMenuElement

  beforeEach(() => {
    menu = document.createElement('q-aria-menu')
  })

  afterEach(() => {
    menu.remove()
  })

  it('has correct aria', async () => {
    await render(menu)

    expect(menu.getAttribute('role')).toBe('menubar')
  })
})
