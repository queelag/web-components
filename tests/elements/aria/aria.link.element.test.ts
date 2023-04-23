import { KeyboardEventKey } from '@aracna/web'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import '../../../src/elements/aria/aria.link.element'
import type { AriaLinkElement } from '../../../src/elements/aria/aria.link.element'
import { dispatchKeyDownEvent, render } from '../../../vitest/dom.utils'

describe('AriaLinkElement', () => {
  let link: AriaLinkElement

  beforeEach(() => {
    link = document.createElement('aracna-aria-link')
  })

  afterEach(() => {
    link.remove()
  })

  it('has correct aria', async () => {
    await render(link)

    expect(link.getAttribute('role')).toBe('link')
    expect(link.getAttribute('tabindex')).toBe('0')
  })

  it('opens a window when clicked', async () => {
    let href: string | URL | undefined, target: string | undefined

    await render(link, { href: '/', target: '_blank' })

    window.open = vi.fn((u, t) => {
      href = u
      target = t

      return null
    })

    link.click()
    await link.updateComplete

    expect(window.open).toBeCalledTimes(1)
    expect(href).toBe(link.href)
    expect(target).toBe(link.target)
  })

  it('supports keyboard usage', async () => {
    await render(link, { href: '/' })

    window.open = vi.fn()

    dispatchKeyDownEvent(link, KeyboardEventKey.ENTER)
    await link.updateComplete

    expect(window.open).toBeCalledTimes(1)
  })
})
