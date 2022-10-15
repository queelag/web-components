import { KeyboardEventKey } from '@queelag/web'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import '../../../src/elements/aria/aria.accordion.element'
import type {
  AriaAccordionButtonElement,
  AriaAccordionElement,
  AriaAccordionHeaderElement,
  AriaAccordionPanelElement,
  AriaAccordionSectionElement
} from '../../../src/elements/aria/aria.accordion.element'
import { dispatchKeyDownEvent, render } from '../../../vitest/dom.utils'

describe('AriaAccordionElement', () => {
  let accordion: AriaAccordionElement,
    s1: AriaAccordionSectionElement,
    h1: AriaAccordionHeaderElement,
    b1: AriaAccordionButtonElement,
    p1: AriaAccordionPanelElement,
    s2: AriaAccordionSectionElement,
    h2: AriaAccordionHeaderElement,
    b2: AriaAccordionButtonElement,
    p2: AriaAccordionPanelElement

  beforeEach(() => {
    accordion = document.createElement('q-aria-accordion')

    s1 = document.createElement('q-aria-accordion-section')
    h1 = document.createElement('q-aria-accordion-header')
    b1 = document.createElement('q-aria-accordion-button')
    p1 = document.createElement('q-aria-accordion-panel')

    s2 = document.createElement('q-aria-accordion-section')
    h2 = document.createElement('q-aria-accordion-header')
    b2 = document.createElement('q-aria-accordion-button')
    p2 = document.createElement('q-aria-accordion-panel')

    h1.append(b1)
    s1.append(h1, p1)

    h2.append(b2)
    s2.append(h2, p2)

    accordion.append(s1, s2)
  })

  afterEach(() => {
    accordion.remove()
  })

  it('has correct aria', async () => {
    await render(accordion)

    expect(b1.getAttribute('aria-controls')).toBe(p1.id)
    expect(b1.getAttribute('aria-disabled')).toBe('false')
    expect(b1.getAttribute('id')).toBeDefined()
    expect(b1.getAttribute('role')).toBe('button')
    expect(b1.getAttribute('tabindex')).toBe('0')

    expect(h1.getAttribute('aria-level')).toBe('6')
    expect(h1.getAttribute('role')).toBe('heading')

    expect(p1.getAttribute('aria-expanded')).toBe('false')
    expect(p1.getAttribute('aria-labelledby')).toBe(b1.id)
    expect(p1.getAttribute('id')).toBeDefined()
    expect(p1.getAttribute('role')).toBe('region')
  })

  it('expands and collapses sections on click', async () => {
    await render(accordion)

    b1.click()
    await b1.updateComplete

    expect(s1.expanded).toBeTruthy()
    expect(s2.expanded).toBeFalsy()
    expect(p1.getAttribute('aria-expanded')).toBe('true')
    expect(p2.getAttribute('aria-expanded')).toBe('false')

    b2.click()
    await b2.updateComplete

    expect(s1.expanded).toBeTruthy()
    expect(s2.expanded).toBeTruthy()
    expect(p1.getAttribute('aria-expanded')).toBe('true')
    expect(p2.getAttribute('aria-expanded')).toBe('true')

    b1.click()
    await b1.updateComplete

    expect(s1.expanded).toBeFalsy()
    expect(s2.expanded).toBeTruthy()
    expect(p1.getAttribute('aria-expanded')).toBe('false')
    expect(p2.getAttribute('aria-expanded')).toBe('true')
  })

  it('can allow only one section to be expanded at once', async () => {
    await render(accordion, { 'allow-only-one-expanded-section': 'true' })

    b1.click()
    await b1.updateComplete

    expect(s1.expanded).toBeTruthy()
    expect(s2.expanded).toBeFalsy()
    expect(p1.getAttribute('aria-expanded')).toBe('true')
    expect(p2.getAttribute('aria-expanded')).toBe('false')

    b2.click()
    await b2.updateComplete

    expect(s1.expanded).toBeFalsy()
    expect(s2.expanded).toBeTruthy()
    expect(p1.getAttribute('aria-expanded')).toBe('false')
    expect(p2.getAttribute('aria-expanded')).toBe('true')
  })

  it('supports keyboard usage', async () => {
    await render(accordion)

    b1.focus()
    dispatchKeyDownEvent(accordion, KeyboardEventKey.ENTER)
    await accordion.updateComplete

    expect(s1.expanded).toBeTruthy()
    expect(s2.expanded).toBeFalsy()
    expect(p1.getAttribute('aria-expanded')).toBe('true')
    expect(p2.getAttribute('aria-expanded')).toBe('false')

    dispatchKeyDownEvent(accordion, KeyboardEventKey.ARROW_DOWN)
    dispatchKeyDownEvent(accordion, KeyboardEventKey.SPACE)
    await accordion.updateComplete

    expect(s1.expanded).toBeTruthy()
    expect(s2.expanded).toBeTruthy()
    expect(p1.getAttribute('aria-expanded')).toBe('true')
    expect(p2.getAttribute('aria-expanded')).toBe('true')

    dispatchKeyDownEvent(accordion, KeyboardEventKey.ARROW_UP)
    dispatchKeyDownEvent(accordion, KeyboardEventKey.ENTER)
    await accordion.updateComplete

    expect(s1.expanded).toBeFalsy()
    expect(s2.expanded).toBeTruthy()
    expect(p1.getAttribute('aria-expanded')).toBe('false')
    expect(p2.getAttribute('aria-expanded')).toBe('true')

    dispatchKeyDownEvent(accordion, KeyboardEventKey.END)
    dispatchKeyDownEvent(accordion, KeyboardEventKey.ENTER)
    await accordion.updateComplete

    expect(s1.expanded).toBeFalsy()
    expect(s2.expanded).toBeFalsy()
    expect(p1.getAttribute('aria-expanded')).toBe('false')
    expect(p2.getAttribute('aria-expanded')).toBe('false')

    dispatchKeyDownEvent(accordion, KeyboardEventKey.HOME)
    dispatchKeyDownEvent(accordion, KeyboardEventKey.ENTER)
    await accordion.updateComplete

    expect(s1.expanded).toBeTruthy()
    expect(s2.expanded).toBeFalsy()
    expect(p1.getAttribute('aria-expanded')).toBe('true')
    expect(p2.getAttribute('aria-expanded')).toBe('false')
  })
})
