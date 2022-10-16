import { sleep } from '@queelag/core'
import { KeyboardEventKey } from '@queelag/web'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import '../../../src/elements/aria/aria.carousel.element'
import type {
  AriaCarouselElement,
  AriaCarouselNextSlideControlElement,
  AriaCarouselPreviousSlideControlElement,
  AriaCarouselRotationControlElement,
  AriaCarouselSlideElement,
  AriaCarouselSlidesElement,
  AriaCarouselTabElement,
  AriaCarouselTabsElement
} from '../../../src/elements/aria/aria.carousel.element'
import {
  dispatchBlurEvent,
  dispatchFocusEvent,
  dispatchKeyDownEvent,
  dispatchMouseEnterEvent,
  dispatchMouseLeaveEvent,
  render
} from '../../../vitest/dom.utils'

describe('AriaCarouselElement', () => {
  let carousel: AriaCarouselElement,
    slides: AriaCarouselSlidesElement,
    s1: AriaCarouselSlideElement,
    s2: AriaCarouselSlideElement,
    rc: AriaCarouselRotationControlElement,
    nsc: AriaCarouselNextSlideControlElement,
    psc: AriaCarouselPreviousSlideControlElement,
    tabs: AriaCarouselTabsElement,
    t1: AriaCarouselTabElement,
    t2: AriaCarouselTabElement

  beforeEach(() => {
    carousel = document.createElement('q-aria-carousel')
    carousel.automaticRotationIntervalTime = 100

    slides = document.createElement('q-aria-carousel-slides')
    s1 = document.createElement('q-aria-carousel-slide')
    s2 = document.createElement('q-aria-carousel-slide')
    rc = document.createElement('q-aria-carousel-rotation-control')
    nsc = document.createElement('q-aria-carousel-next-slide-control')
    psc = document.createElement('q-aria-carousel-previous-slide-control')
    tabs = document.createElement('q-aria-carousel-tabs')
    t1 = document.createElement('q-aria-carousel-tab')
    t2 = document.createElement('q-aria-carousel-tab')

    slides.append(s1, s2)
    tabs.append(t1, t2)
    carousel.append(slides)
  })

  afterEach(() => {
    carousel.remove()
  })

  it('has correct aria with buttons for slide control', async () => {
    carousel.append(rc, nsc, psc)
    await render(carousel)

    expect(carousel.getAttribute('aria-roledescription')).toBe('carousel')
    // expect(carousel.getAttribute('aria-label')).toBe('label')
    expect(carousel.getAttribute('role')).toBe('region')

    expect(slides.getAttribute('aria-live')).toBe('polite')
    expect(slides.getAttribute('id')).toBeDefined()

    expect(s1.getAttribute('aria-label')).toBe('1 of 2')
    expect(s1.getAttribute('aria-roledescription')).toBe('slide')
    expect(s1.getAttribute('role')).toBe('group')
    expect(s1.getAttribute('id')).toBeDefined()

    expect(s2.getAttribute('aria-label')).toBe('2 of 2')
    expect(s2.getAttribute('aria-roledescription')).toBe('slide')
    expect(s2.getAttribute('role')).toBe('group')
    expect(s2.getAttribute('id')).toBeDefined()

    expect(nsc.getAttribute('aria-label')).toBe('Next Slide')
    expect(nsc.getAttribute('aria-controls')).toBe(slides.id)
    expect(nsc.getAttribute('role')).toBe('button')
    expect(nsc.getAttribute('tabindex')).toBe('0')

    expect(psc.getAttribute('aria-label')).toBe('Previous Slide')
    expect(psc.getAttribute('aria-controls')).toBe(slides.id)
    expect(psc.getAttribute('role')).toBe('button')
    expect(psc.getAttribute('tabindex')).toBe('0')

    expect(rc.getAttribute('aria-label')).toBe('Start Automatic Slide Show')
    expect(rc.getAttribute('aria-controls')).toBe(slides.id)
    expect(rc.getAttribute('role')).toBe('button')
    expect(rc.getAttribute('tabindex')).toBe('0')
  })

  it('has correct aria with tabs for slide control', async () => {
    carousel.append(tabs)
    await render(carousel)

    expect(carousel.getAttribute('aria-roledescription')).toBe('carousel')
    // expect(carousel.getAttribute('aria-label')).toBe('label')
    expect(carousel.getAttribute('role')).toBe('region')

    expect(slides.getAttribute('aria-live')).toBe('polite')
    expect(slides.getAttribute('id')).toBeDefined()

    expect(s1.getAttribute('aria-label')).toBe('1 of 2')
    expect(s1.getAttribute('aria-roledescription')).toBe('slide')
    expect(s1.getAttribute('role')).toBe('tabpanel')
    expect(s1.getAttribute('id')).toBeDefined()

    expect(s2.getAttribute('aria-label')).toBe('2 of 2')
    expect(s2.getAttribute('aria-roledescription')).toBe('slide')
    expect(s2.getAttribute('role')).toBe('tabpanel')
    expect(s2.getAttribute('id')).toBeDefined()

    expect(tabs.getAttribute('aria-label')).toBe('Slides')
    expect(tabs.getAttribute('role')).toBe('tablist')

    expect(t1.getAttribute('aria-controls')).toBe(s1.id)
    expect(t1.getAttribute('aria-label')).toBe('Slide 1')
    expect(t1.getAttribute('aria-selected')).toBeNull()
    expect(t1.getAttribute('role')).toBe('tab')
    expect(t1.getAttribute('tabindex')).toBe('-1')

    expect(t2.getAttribute('aria-controls')).toBe(s2.id)
    expect(t2.getAttribute('aria-label')).toBe('Slide 2')
    expect(t2.getAttribute('aria-selected')).toBeNull()
    expect(t2.getAttribute('role')).toBe('tab')
    expect(t2.getAttribute('tabindex')).toBe('-1')
  })

  it('has working buttons', async () => {
    carousel.append(rc, nsc, psc)
    await render(carousel)

    expect(s1.active).toBeFalsy()
    expect(s2.active).toBeFalsy()

    nsc.click()
    await nsc.updateComplete

    expect(s1.active).toBeTruthy()
    expect(s2.active).toBeFalsy()

    psc.click()
    await psc.updateComplete

    expect(s1.active).toBeTruthy()
    expect(s2.active).toBeFalsy()

    nsc.click()
    await nsc.updateComplete

    expect(s1.active).toBeFalsy()
    expect(s2.active).toBeTruthy()

    nsc.click()
    await nsc.updateComplete

    expect(s1.active).toBeFalsy()
    expect(s2.active).toBeTruthy()

    psc.click()
    await psc.updateComplete

    expect(s1.active).toBeTruthy()
    expect(s2.active).toBeFalsy()

    rc.click()
    await rc.updateComplete

    expect(carousel.automaticRotation).toBeTruthy()
    expect(slides.getAttribute('aria-live')).toBe('off')
    expect(rc.getAttribute('aria-label')).toBe('Stop Automatic Slide Show')

    await sleep(100)
    expect(s1.active).toBeFalsy()
    expect(s2.active).toBeTruthy()

    rc.click()
    await rc.updateComplete

    expect(carousel.automaticRotation).toBeFalsy()
    expect(slides.getAttribute('aria-live')).toBe('polite')
    expect(rc.getAttribute('aria-label')).toBe('Start Automatic Slide Show')

    await sleep(100)
    expect(s1.active).toBeFalsy()
    expect(s2.active).toBeTruthy()
  })

  it('has working tabs', async () => {
    carousel.append(tabs)
    await render(carousel)

    expect(s1.active).toBeFalsy()
    expect(s2.active).toBeFalsy()
    expect(t1.getAttribute('aria-selected')).toBeNull()
    expect(t2.getAttribute('aria-selected')).toBeNull()

    t1.click()
    await t1.updateComplete

    expect(s1.active).toBeTruthy()
    expect(s2.active).toBeFalsy()
    expect(t1.getAttribute('aria-selected')).toBeDefined()
    expect(t2.getAttribute('aria-selected')).toBeNull()

    t2.click()
    await t2.updateComplete

    expect(s1.active).toBeFalsy()
    expect(s2.active).toBeTruthy()
    expect(t1.getAttribute('aria-selected')).toBeNull()
    expect(t2.getAttribute('aria-selected')).toBeDefined()
  })

  it('supports keyboard usage with tabs', async () => {
    carousel.append(tabs)
    await render(carousel)

    s1.active = true
    t1.active = true
    await s1.updateComplete
    await t1.updateComplete

    expect(s1.active).toBeTruthy()
    expect(s2.active).toBeFalsy()
    expect(t1.getAttribute('aria-selected')).toBeDefined()
    expect(t2.getAttribute('aria-selected')).toBeNull()

    t1.focus()
    dispatchKeyDownEvent(tabs, KeyboardEventKey.ARROW_RIGHT)
    await tabs.updateComplete

    expect(s1.active).toBeFalsy()
    expect(s2.active).toBeTruthy()
    expect(t1.getAttribute('aria-selected')).toBeNull()
    expect(t2.getAttribute('aria-selected')).toBeDefined()

    dispatchKeyDownEvent(tabs, KeyboardEventKey.ARROW_RIGHT)
    await tabs.updateComplete

    expect(s1.active).toBeFalsy()
    expect(s2.active).toBeTruthy()
    expect(t1.getAttribute('aria-selected')).toBeNull()
    expect(t2.getAttribute('aria-selected')).toBeDefined()

    dispatchKeyDownEvent(tabs, KeyboardEventKey.ARROW_LEFT)
    await tabs.updateComplete

    expect(s1.active).toBeTruthy()
    expect(s2.active).toBeFalsy()
    expect(t1.getAttribute('aria-selected')).toBeDefined()
    expect(t2.getAttribute('aria-selected')).toBeNull()

    dispatchKeyDownEvent(tabs, KeyboardEventKey.ARROW_LEFT)
    await tabs.updateComplete

    expect(s1.active).toBeTruthy()
    expect(s2.active).toBeFalsy()
    expect(t1.getAttribute('aria-selected')).toBeDefined()
    expect(t2.getAttribute('aria-selected')).toBeNull()

    dispatchKeyDownEvent(tabs, KeyboardEventKey.END)
    await tabs.updateComplete

    expect(s1.active).toBeFalsy()
    expect(s2.active).toBeTruthy()
    expect(t1.getAttribute('aria-selected')).toBeNull()
    expect(t2.getAttribute('aria-selected')).toBeDefined()

    dispatchKeyDownEvent(tabs, KeyboardEventKey.HOME)
    await tabs.updateComplete

    expect(s1.active).toBeTruthy()
    expect(s2.active).toBeFalsy()
    expect(t1.getAttribute('aria-selected')).toBeDefined()
    expect(t2.getAttribute('aria-selected')).toBeNull()
  })

  it('supports automatic rotation', async () => {
    await render(carousel, { 'automatic-rotation': 'true' })

    s1.active = true
    await s1.updateComplete

    expect(s1.active).toBeTruthy()
    expect(s2.active).toBeFalsy()

    await sleep(100)

    expect(s1.active).toBeFalsy()
    expect(s2.active).toBeTruthy()

    await sleep(100)

    expect(s1.active).toBeFalsy()
    expect(s2.active).toBeTruthy()
  })

  it('supports reverse automatic rotation', async () => {
    await render(carousel, { 'automatic-rotation': 'true', 'reverse-rotation': 'true' })

    s2.active = true
    await s2.updateComplete

    expect(s1.active).toBeFalsy()
    expect(s2.active).toBeTruthy()

    await sleep(100)

    expect(s1.active).toBeTruthy()
    expect(s2.active).toBeFalsy()

    await sleep(100)

    expect(s1.active).toBeTruthy()
    expect(s2.active).toBeFalsy()
  })

  it('supports infinite rotation', async () => {
    await render(carousel, { 'automatic-rotation': 'true', 'infinite-rotation': 'true' })

    s1.active = true
    await s1.updateComplete

    expect(s1.active).toBeTruthy()
    expect(s2.active).toBeFalsy()

    await sleep(100)

    expect(s1.active).toBeFalsy()
    expect(s2.active).toBeTruthy()

    await sleep(100)

    expect(s1.active).toBeTruthy()
    expect(s2.active).toBeFalsy()
  })

  it('stops on focus or on mouse enter and resumes on blur or mouse leave', async () => {
    await render(carousel, { 'automatic-rotation': 'true', 'infinite-rotation': 'true' })

    s1.active = true
    await s1.updateComplete

    expect(slides.getAttribute('aria-live')).toBe('off')
    expect(s1.active).toBeTruthy()
    expect(s2.active).toBeFalsy()

    dispatchFocusEvent(carousel)
    await sleep(100)

    expect(slides.getAttribute('aria-live')).toBe('polite')
    expect(s1.active).toBeTruthy()
    expect(s2.active).toBeFalsy()

    dispatchBlurEvent(carousel)
    await sleep(100)

    expect(slides.getAttribute('aria-live')).toBe('off')
    expect(s1.active).toBeFalsy()
    expect(s2.active).toBeTruthy()

    dispatchMouseEnterEvent(carousel)
    await sleep(100)

    expect(slides.getAttribute('aria-live')).toBe('polite')
    expect(s1.active).toBeFalsy()
    expect(s2.active).toBeTruthy()

    dispatchMouseLeaveEvent(carousel)
    await sleep(100)

    expect(slides.getAttribute('aria-live')).toBe('off')
    expect(s1.active).toBeTruthy()
    expect(s2.active).toBeFalsy()
  })

  it('forces automatic rotation if the rotation is started though the rotation control', async () => {
    carousel.append(rc)
    await render(carousel, { 'infinite-rotation': 'true' })

    s1.active = true
    await s1.updateComplete

    rc.click()
    await rc.updateComplete

    expect(slides.getAttribute('aria-live')).toBe('off')
    expect(s1.active).toBeTruthy()
    expect(s2.active).toBeFalsy()

    dispatchFocusEvent(carousel)
    await sleep(100)

    expect(slides.getAttribute('aria-live')).toBe('off')
    expect(s1.active).toBeFalsy()
    expect(s2.active).toBeTruthy()

    dispatchBlurEvent(carousel)
    await sleep(100)

    expect(slides.getAttribute('aria-live')).toBe('off')
    expect(s1.active).toBeTruthy()
    expect(s2.active).toBeFalsy()
  })
})
