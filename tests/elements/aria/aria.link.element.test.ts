import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import '../../../src/elements/aria/aria.link.element'
import type { AriaLinkElement } from '../../../src/elements/aria/aria.link.element'
import { render } from '../../../vitest/dom.utils'

describe('AriaLinkElement', () => {
  let link: AriaLinkElement

  beforeEach(() => {
    link = document.createElement('q-aria-link')
  })

  afterEach(() => {
    link.remove()
  })

  it('has correct aria', async () => {
    await render(link)

    expect(link.getAttribute('role')).toBe('link')
    expect(link.getAttribute('tabindex')).toBe('0')
  })
})
