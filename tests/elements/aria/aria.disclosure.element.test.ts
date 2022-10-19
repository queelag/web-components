import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import '../../../src/elements/aria/aria.disclosure.element'
import type {
  AriaDisclosureButtonElement,
  AriaDisclosureElement,
  AriaDisclosurePanelElement,
  AriaDisclosureSectionElement
} from '../../../src/elements/aria/aria.disclosure.element'
import { render } from '../../../vitest/dom.utils'

describe('AriaDisclosureElement', () => {
  let disclosure: AriaDisclosureElement,
    s1: AriaDisclosureSectionElement,
    s2: AriaDisclosureSectionElement,
    b1: AriaDisclosureButtonElement,
    b2: AriaDisclosureButtonElement,
    p1: AriaDisclosurePanelElement,
    p2: AriaDisclosurePanelElement

  beforeEach(() => {
    disclosure = document.createElement('q-aria-disclosure')

    s1 = document.createElement('q-aria-disclosure-section')
    s2 = document.createElement('q-aria-disclosure-section')
    b1 = document.createElement('q-aria-disclosure-button')
    b2 = document.createElement('q-aria-disclosure-button')
    p1 = document.createElement('q-aria-disclosure-panel')
    p2 = document.createElement('q-aria-disclosure-panel')

    s1.append(b1, p1)
    s2.append(b2, p2)
    disclosure.append(s1, s2)
  })

  afterEach(() => {
    disclosure.remove()
  })

  it('has correct aria', async () => {
    await render(disclosure)

    expect(b1.getAttribute('aria-controls')).toBe(p1.id)
    expect(b1.getAttribute('aria-expanded')).toBeNull()
    expect(b1.getAttribute('role')).toBe('button')
    expect(b1.getAttribute('tabindex')).toBe('0')
    expect(b2.getAttribute('aria-controls')).toBe(p2.id)
    expect(b2.getAttribute('aria-expanded')).toBeNull()
    expect(b2.getAttribute('role')).toBe('button')
    expect(b2.getAttribute('tabindex')).toBe('0')

    expect(p1.getAttribute('id')).not.toBeNull()
    expect(p2.getAttribute('id')).not.toBeNull()
  })

  it('works', async () => {
    await render(disclosure)

    expect(s1.getAttribute('expanded')).toBeNull()
    expect(b1.getAttribute('aria-expanded')).toBeNull()
    expect(s2.getAttribute('expanded')).toBeNull()
    expect(b2.getAttribute('aria-expanded')).toBeNull()

    b1.click()
    await b1.updateComplete

    expect(s1.getAttribute('expanded')).not.toBeNull()
    expect(b1.getAttribute('aria-expanded')).toBe('true')
    expect(s2.getAttribute('expanded')).toBeNull()
    expect(b2.getAttribute('aria-expanded')).toBeNull()

    b2.click()
    await b2.updateComplete

    expect(s1.getAttribute('expanded')).not.toBeNull()
    expect(b1.getAttribute('aria-expanded')).toBe('true')
    expect(s2.getAttribute('expanded')).not.toBeNull()
    expect(b2.getAttribute('aria-expanded')).toBe('true')

    b1.click()
    await b1.updateComplete

    expect(s1.getAttribute('expanded')).toBeNull()
    expect(b1.getAttribute('aria-expanded')).toBeNull()
    expect(s2.getAttribute('expanded')).not.toBeNull()
    expect(b2.getAttribute('aria-expanded')).toBe('true')

    b2.click()
    await b2.updateComplete

    expect(s1.getAttribute('expanded')).toBeNull()
    expect(b1.getAttribute('aria-expanded')).toBeNull()
    expect(s2.getAttribute('expanded')).toBeNull()
    expect(b2.getAttribute('aria-expanded')).toBeNull()
  })
})
