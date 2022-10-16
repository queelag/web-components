import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import '../../../src/elements/aria/aria.breadcrumb.element'
import type { AriaBreadcrumbElement, AriaBreadcrumbListElement, AriaBreadcrumbListItemElement } from '../../../src/elements/aria/aria.breadcrumb.element'
import { render } from '../../../vitest/dom.utils'

describe('AriaBreadcrumbElement', () => {
  let breadcrumb: AriaBreadcrumbElement,
    list: AriaBreadcrumbListElement,
    li1: AriaBreadcrumbListItemElement,
    li2: AriaBreadcrumbListItemElement,
    a1: HTMLAnchorElement,
    a2: HTMLAnchorElement

  beforeEach(() => {
    breadcrumb = document.createElement('q-aria-breadcrumb')

    list = document.createElement('q-aria-breadcrumb-list')
    li1 = document.createElement('q-aria-breadcrumb-list-item')
    li2 = document.createElement('q-aria-breadcrumb-list-item')
    a1 = document.createElement('a')
    a2 = document.createElement('a')

    li1.append(a1)
    li2.append(a2)
    list.append(li1, li2)
    breadcrumb.append(list)
  })

  afterEach(() => {
    breadcrumb.remove()
  })

  it('has correct aria', async () => {
    await render(breadcrumb)

    expect(breadcrumb.getAttribute('role')).toBe('navigation')
    expect(list.getAttribute('role')).toBe('list')
    expect(li1.querySelector('a')?.getAttribute('aria-current')).toBeNull()
    expect(li2.querySelector('a')?.getAttribute('aria-current')).toBeNull()
  })

  it('reflects current item', async () => {
    await render(breadcrumb)

    li1.current = true
    await li1.updateComplete

    expect(li1.querySelector('a')?.getAttribute('aria-current')).toBeDefined()
    expect(li2.querySelector('a')?.getAttribute('aria-current')).toBeNull()

    li1.current = false
    li2.current = true
    await li1.updateComplete
    await li2.updateComplete

    expect(li1.querySelector('a')?.getAttribute('aria-current')).toBeNull()
    expect(li2.querySelector('a')?.getAttribute('aria-current')).toBeDefined()
  })
})
