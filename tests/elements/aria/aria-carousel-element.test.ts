import { sleep } from '@aracna/core'
import { KeyboardEventKey } from '@aracna/web'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import '../../../src/elements/aria/aria-carousel-element'
import type {
  AriaCarouselElement,
  AriaCarouselNextSlideControlElement,
  AriaCarouselPreviousSlideControlElement,
  AriaCarouselRotationControlElement,
  AriaCarouselSlideElement,
  AriaCarouselSlidesElement,
  AriaCarouselTabElement,
  AriaCarouselTabsElement
} from '../../../src/elements/aria/aria-carousel-element'
import {
  dispatchBlurEvent,
  dispatchFocusEvent,
  dispatchFocusInEvent,
  dispatchFocusOutEvent,
  dispatchKeyDownEvent,
  dispatchMouseEnterEvent,
  dispatchMouseLeaveEvent,
  render
} from '../../../vitest/dom-utils'

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
    carousel = document.createElement('aracna-aria-carousel')
    carousel.automaticRotationIntervalTime = 100

    slides = document.createElement('aracna-aria-carousel-slides')
    s1 = document.createElement('aracna-aria-carousel-slide')
    s2 = document.createElement('aracna-aria-carousel-slide')
    rc = document.createElement('aracna-aria-carousel-rotation-control')
    nsc = document.createElement('aracna-aria-carousel-next-slide-control')
    psc = document.createElement('aracna-aria-carousel-previous-slide-control')
    tabs = document.createElement('aracna-aria-carousel-tabs')
    t1 = document.createElement('aracna-aria-carousel-tab')
    t2 = document.createElement('aracna-aria-carousel-tab')

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
    expect(carousel.getAttribute('live')).toBe('polite')
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
    expect(carousel.getAttribute('live')).toBe('polite')
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

    /**
     * Click the next slide control and expect the first slide to be active
     */
    nsc.click()
    await nsc.updateComplete

    expect(s1.active).toBeTruthy()
    expect(s2.active).toBeFalsy()

    /**
     * Click the previous slide control and nothing happens since there is no infinite rotation
     */
    psc.click()
    await psc.updateComplete

    expect(s1.active).toBeTruthy()
    expect(s2.active).toBeFalsy()

    /**
     * Click the next slide control and expect the second slide to be active
     */
    nsc.click()
    await nsc.updateComplete

    expect(s1.active).toBeFalsy()
    expect(s2.active).toBeTruthy()

    /**
     * Click the next slide control and nothing happens since there is no infinite rotation
     */
    nsc.click()
    await nsc.updateComplete

    expect(s1.active).toBeFalsy()
    expect(s2.active).toBeTruthy()

    /**
     * Click the previous slide control and expect the first slide to be active
     */
    psc.click()
    await psc.updateComplete

    expect(s1.active).toBeTruthy()
    expect(s2.active).toBeFalsy()

    /**
     * Click the rotation control and expect the automatic rotation to start
     */
    rc.click()
    await rc.updateComplete

    expect(carousel.automaticRotation).toBeTruthy()
    expect(carousel.getAttribute('live')).toBe('off')
    expect(slides.getAttribute('aria-live')).toBe('off')
    expect(rc.getAttribute('aria-label')).toBe('Stop Automatic Slide Show')

    /**
     * Sleep for 100ms to wait for the automatic rotation to go to the next slide
     */
    await sleep(100)
    expect(s1.active).toBeFalsy()
    expect(s2.active).toBeTruthy()

    /**
     * Click the rotation control and expect the automatic rotation to stop
     */
    rc.click()
    await rc.updateComplete

    expect(carousel.automaticRotation).toBeFalsy()
    expect(carousel.getAttribute('live')).toBe('polite')
    expect(slides.getAttribute('aria-live')).toBe('polite')
    expect(rc.getAttribute('aria-label')).toBe('Start Automatic Slide Show')

    /**
     * Sleep for 100ms to assert that the automatic rotation was stopped for real
     */
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

    /**
     * Click the first tab and expect the first tab and slide to be active
     */
    t1.click()
    await t1.updateComplete

    expect(s1.active).toBeTruthy()
    expect(s2.active).toBeFalsy()
    expect(t1.getAttribute('aria-selected')).toBeDefined()
    expect(t2.getAttribute('aria-selected')).toBeNull()

    /**
     * Click the second tab and expect the second tab and slide to be active
     */
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

    /**
     * Make the first slide and tab active and expect them to be active
     */
    s1.active = true
    t1.active = true
    await s1.updateComplete
    await t1.updateComplete

    expect(s1.active).toBeTruthy()
    expect(s2.active).toBeFalsy()
    expect(t1.getAttribute('aria-selected')).toBeDefined()
    expect(t2.getAttribute('aria-selected')).toBeNull()

    /**
     * Press ARROW_RIGHT and expect the second slide and tab to be active
     */
    dispatchKeyDownEvent(tabs, KeyboardEventKey.ARROW_RIGHT)
    await tabs.updateComplete

    expect(s1.active).toBeFalsy()
    expect(s2.active).toBeTruthy()
    expect(t1.getAttribute('aria-selected')).toBeNull()
    expect(t2.getAttribute('aria-selected')).toBeDefined()

    /**
     * Press ARROW_RIGHT and nothing happens since there is no infinite rotation
     */
    dispatchKeyDownEvent(tabs, KeyboardEventKey.ARROW_RIGHT)
    await tabs.updateComplete

    expect(s1.active).toBeFalsy()
    expect(s2.active).toBeTruthy()
    expect(t1.getAttribute('aria-selected')).toBeNull()
    expect(t2.getAttribute('aria-selected')).toBeDefined()

    /**
     * Press ARROW_LEFT and expect the first slide and tab to be active
     */
    dispatchKeyDownEvent(tabs, KeyboardEventKey.ARROW_LEFT)
    await tabs.updateComplete

    expect(s1.active).toBeTruthy()
    expect(s2.active).toBeFalsy()
    expect(t1.getAttribute('aria-selected')).toBeDefined()
    expect(t2.getAttribute('aria-selected')).toBeNull()

    /**
     * Press ARROW_LEFT and nothing happens since there is no infinite rotation
     */
    dispatchKeyDownEvent(tabs, KeyboardEventKey.ARROW_LEFT)
    await tabs.updateComplete

    expect(s1.active).toBeTruthy()
    expect(s2.active).toBeFalsy()
    expect(t1.getAttribute('aria-selected')).toBeDefined()
    expect(t2.getAttribute('aria-selected')).toBeNull()

    /**
     * Press END and expect the last slide and tab to be active
     */
    dispatchKeyDownEvent(tabs, KeyboardEventKey.END)
    await tabs.updateComplete

    expect(s1.active).toBeFalsy()
    expect(s2.active).toBeTruthy()
    expect(t1.getAttribute('aria-selected')).toBeNull()
    expect(t2.getAttribute('aria-selected')).toBeDefined()

    /**
     * Press HOME and expect the first slide and tab to be active
     */
    dispatchKeyDownEvent(tabs, KeyboardEventKey.HOME)
    await tabs.updateComplete

    expect(s1.active).toBeTruthy()
    expect(s2.active).toBeFalsy()
    expect(t1.getAttribute('aria-selected')).toBeDefined()
    expect(t2.getAttribute('aria-selected')).toBeNull()
  })

  it('supports automatic rotation', async () => {
    await render(carousel, { 'automatic-rotation': 'true' })

    /**
     * Mark the first slide as active and expect it to be active
     */
    s1.active = true
    await s1.updateComplete

    expect(s1.active).toBeTruthy()
    expect(s2.active).toBeFalsy()

    /**
     * Sleep for 100ms to wait for the automatic rotation to activate the next slide
     */
    await sleep(100)

    expect(s1.active).toBeFalsy()
    expect(s2.active).toBeTruthy()

    /**
     * Sleep for 100ms but nothing happens since there is no infinite rotation
     */
    await sleep(100)

    expect(s1.active).toBeFalsy()
    expect(s2.active).toBeTruthy()
  })

  it('supports reverse automatic rotation', async () => {
    await render(carousel, { 'automatic-rotation': 'true', 'reverse-rotation': 'true' })

    /**
     * Mark the last slide as active and expect it to be active
     */
    s2.active = true
    await s2.updateComplete

    expect(s1.active).toBeFalsy()
    expect(s2.active).toBeTruthy()

    /**
     * Sleep for 100ms to wait for the automatic rotation to activate the previous slide
     */
    await sleep(100)

    expect(s1.active).toBeTruthy()
    expect(s2.active).toBeFalsy()

    /**
     * Sleep for 100ms but nothing happens since there is no infinite rotation
     */
    await sleep(100)

    expect(s1.active).toBeTruthy()
    expect(s2.active).toBeFalsy()
  })

  it('supports infinite rotation', async () => {
    await render(carousel, { 'automatic-rotation': 'true', 'infinite-rotation': 'true' })

    /**
     * Mark the first slide as active and expect it to be active
     */
    s1.active = true
    await s1.updateComplete

    expect(s1.active).toBeTruthy()
    expect(s2.active).toBeFalsy()

    /**
     * Sleep for 100ms to wait for the automatic rotation to activate the next slide
     */
    await sleep(100)

    expect(s1.active).toBeFalsy()
    expect(s2.active).toBeTruthy()

    /**
     * Sleep for 100ms to wait for the automatic rotation to activate the first slide
     */
    await sleep(100)

    expect(s1.active).toBeTruthy()
    expect(s2.active).toBeFalsy()
  })

  it('stops on focus or on mouse enter and resumes on blur or mouse leave', async () => {
    await render(carousel, { 'automatic-rotation': 'true', 'infinite-rotation': 'true' })

    /**
     * Mark the first slide as active and expect it to be active
     */
    s1.active = true
    await s1.updateComplete

    expect(carousel.getAttribute('live')).toBe('off')
    expect(slides.getAttribute('aria-live')).toBe('off')
    expect(s1.active).toBeTruthy()
    expect(s2.active).toBeFalsy()

    /**
     * Focus the carousel and sleep for 100ms to assert that the automatic rotation was stopped
     */
    dispatchFocusInEvent(carousel)
    await sleep(100)

    expect(carousel.getAttribute('live')).toBe('off')
    expect(slides.getAttribute('aria-live')).toBe('polite')
    expect(s1.active).toBeTruthy()
    expect(s2.active).toBeFalsy()

    /**
     * Blur the carousel and sleep for 100ms to assert that the automatic rotation was resumed
     */
    dispatchFocusOutEvent(carousel)
    await sleep(100)

    expect(carousel.getAttribute('live')).toBe('off')
    expect(slides.getAttribute('aria-live')).toBe('off')
    expect(s1.active).toBeFalsy()
    expect(s2.active).toBeTruthy()

    /**
     * Enter the carousel with the mouse and sleep for 100ms to assert that the automatic rotation was stopped
     */
    dispatchMouseEnterEvent(carousel)
    await sleep(100)

    expect(carousel.getAttribute('live')).toBe('off')
    expect(slides.getAttribute('aria-live')).toBe('polite')
    expect(s1.active).toBeFalsy()
    expect(s2.active).toBeTruthy()

    /**
     * Leave the carousel with the mouse and sleep for 100ms to assert that the automatic rotation was resumed
     */
    dispatchMouseLeaveEvent(carousel)
    await sleep(100)

    expect(carousel.getAttribute('live')).toBe('off')
    expect(slides.getAttribute('aria-live')).toBe('off')
    expect(s1.active).toBeTruthy()
    expect(s2.active).toBeFalsy()
  })

  it('forces automatic rotation if the rotation is started though the rotation control', async () => {
    carousel.append(rc)
    await render(carousel, { 'infinite-rotation': 'true' })

    /**
     * Mark the first slide as active and expect it to be active
     */
    s1.active = true
    await s1.updateComplete

    /**
     * Click the rotation control and expect the automatic rotation to start and to ignore focus/mouseenter events
     */
    rc.click()
    await rc.updateComplete

    expect(carousel.getAttribute('live')).toBe('off')
    expect(slides.getAttribute('aria-live')).toBe('off')
    expect(s1.active).toBeTruthy()
    expect(s2.active).toBeFalsy()

    /**
     * Focus the carousel and sleep for 100ms to assert that the automatic rotation is still running
     */
    dispatchFocusEvent(carousel)
    await sleep(100)

    expect(carousel.getAttribute('live')).toBe('off')
    expect(slides.getAttribute('aria-live')).toBe('off')
    expect(s1.active).toBeFalsy()
    expect(s2.active).toBeTruthy()

    /**
     * Blur the carousel and sleep for 100ms to assert that the automatic rotation is still running
     */
    dispatchBlurEvent(carousel)
    await sleep(100)

    expect(carousel.getAttribute('live')).toBe('off')
    expect(slides.getAttribute('aria-live')).toBe('off')
    expect(s1.active).toBeTruthy()
    expect(s2.active).toBeFalsy()
  })
})
