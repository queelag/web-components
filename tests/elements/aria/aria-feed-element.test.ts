import { KeyboardEventKey } from '@aracna/web'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import '../../../src/elements/aria/aria-feed-element'
import type {
  AracnaAriaFeedArticleDescriptionElement as AriaFeedArticleDescriptionElement,
  AracnaAriaFeedArticleElement as AriaFeedArticleElement,
  AracnaAriaFeedArticleLabelElement as AriaFeedArticleLabelElement,
  AracnaAriaFeedElement as AriaFeedElement
} from '../../../src/elements/aria/aria-feed-element'
import { dispatchKeyDownEvent, render } from '../../../vitest/dom-utils'

describe('AriaFeedElement', () => {
  let feed: AriaFeedElement,
    a1: AriaFeedArticleElement,
    a2: AriaFeedArticleElement,
    al1: AriaFeedArticleLabelElement,
    al2: AriaFeedArticleLabelElement,
    ad1: AriaFeedArticleDescriptionElement,
    ad2: AriaFeedArticleDescriptionElement,
    ptabbable: HTMLButtonElement,
    ntabbable: HTMLButtonElement

  beforeEach(() => {
    feed = document.createElement('aracna-aria-feed')

    a1 = document.createElement('aracna-aria-feed-article')
    a2 = document.createElement('aracna-aria-feed-article')
    al1 = document.createElement('aracna-aria-feed-article-label')
    al2 = document.createElement('aracna-aria-feed-article-label')
    ad1 = document.createElement('aracna-aria-feed-article-description')
    ad2 = document.createElement('aracna-aria-feed-article-description')

    a1.append(al1, ad1)
    a2.append(al2, ad2)
    feed.append(a1, a2)

    ptabbable = document.createElement('button')
    ntabbable = document.createElement('button')

    document.body.append(ptabbable)
  })

  afterEach(() => {
    feed.remove()
    ptabbable.remove()
    ntabbable.remove()
  })

  it('has correct aria', async () => {
    await render(feed)

    expect(feed.getAttribute('aria-busy')).toBe('false')
    // expect(feed.getAttribute('aria-labelledby')).toBe('label')
    expect(feed.getAttribute('role')).toBe('feed')

    expect(a1.getAttribute('aria-describedby')).toBe(ad1.id)
    expect(a1.getAttribute('aria-labelledby')).toBe(al1.id)
    expect(a1.getAttribute('aria-posinset')).toBe('1')
    expect(a1.getAttribute('aria-setsize')).toBe('2')
    expect(a1.getAttribute('role')).toBe('article')
    expect(a1.getAttribute('tabindex')).toBe('0')

    expect(a2.getAttribute('aria-describedby')).toBe(ad2.id)
    expect(a2.getAttribute('aria-labelledby')).toBe(al2.id)
    expect(a2.getAttribute('aria-posinset')).toBe('2')
    expect(a2.getAttribute('aria-setsize')).toBe('2')
    expect(a2.getAttribute('role')).toBe('article')
    expect(a2.getAttribute('tabindex')).toBe('0')

    expect(al1.getAttribute('id')).not.toBeNull()
    expect(al2.getAttribute('id')).not.toBeNull()

    expect(ad1.getAttribute('id')).not.toBeNull()
    expect(ad2.getAttribute('id')).not.toBeNull()
  })

  it('supports busy', async () => {
    await render(feed, { busy: 'true' })

    expect(feed.getAttribute('aria-busy')).toBe('true')
  })

  it('supports keyboard usage', async () => {
    await render(feed)
    document.body.append(ntabbable)

    expect(a1.getAttribute('focused')).toBeNull()
    expect(a2.getAttribute('focused')).toBeNull()

    /**
     * Focus the first article and expect it to be focused
     */
    a1.focus()
    await a1.updateComplete

    expect(a1.getAttribute('focused')).not.toBeNull()
    expect(a2.getAttribute('focused')).toBeNull()

    /**
     * Press PAGE_DOWN and expect the next (second) article to be focused
     */
    dispatchKeyDownEvent(feed, KeyboardEventKey.PAGE_DOWN)
    await feed.updateComplete

    expect(a1.getAttribute('focused')).toBeNull()
    expect(a2.getAttribute('focused')).not.toBeNull()

    /**
     * Press PAGE_UP and expect the previous (first) article to be focused
     */
    dispatchKeyDownEvent(feed, KeyboardEventKey.PAGE_UP)
    await feed.updateComplete

    expect(a1.getAttribute('focused')).not.toBeNull()
    expect(a2.getAttribute('focused')).toBeNull()

    /**
     * Press END and expect the first tabbable element before the feed to be focused
     */
    // dispatchKeyDownEvent(feed, KeyboardEventKey.END)
    // await feed.updateComplete

    // expect(ptabbable).toBe(document.activeElement)
    // expect(a1.getAttribute('focused')).toBeNull()
    // expect(a2.getAttribute('focused')).toBeNull()

    /**
     * Press HOME and expect the first tabbable element after the feed to be focused
     */
    // dispatchKeyDownEvent(feed, KeyboardEventKey.END)
    // await feed.updateComplete

    // expect(ntabbable).toBe(document.activeElement)
    // expect(a1.getAttribute('focused')).toBeNull()
    // expect(a2.getAttribute('focused')).toBeNull()
  })
})
