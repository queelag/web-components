import { defineCustomElement, KeyboardEventKey } from '@aracna/web'
import type { PropertyDeclarations } from 'lit'
import { type FocusableElement, tabbable } from 'tabbable'
import {
  AriaFeedArticleController,
  AriaFeedArticleDescriptionController,
  AriaFeedArticleLabelController,
  AriaFeedController
} from '../../controllers/aria-feed-controller.js'
import { ElementName } from '../../definitions/enums.js'
import type {
  AriaFeedArticleDescriptionElementEventMap,
  AriaFeedArticleElementEventMap,
  AriaFeedArticleLabelElementEventMap,
  AriaFeedElementEventMap
} from '../../definitions/events.js'
import type { QueryDeclarations } from '../../definitions/interfaces.js'
import { gkek } from '../../functions/gkek.js'
import { ElementLogger } from '../../loggers/element-logger.js'
import { AracnaBaseElement as BaseElement } from '../core/base-element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-aria-feed': AriaFeedElement
    'aracna-aria-feed-article': AriaFeedArticleElement
    'aracna-aria-feed-article-description': AriaFeedArticleDescriptionElement
    'aracna-aria-feed-article-label': AriaFeedArticleLabelElement
  }
}

class AriaFeedElement<E extends AriaFeedElementEventMap = AriaFeedElementEventMap> extends BaseElement<E> {
  protected aria: AriaFeedController = new AriaFeedController(this)

  /**
   * Properties
   */
  /** */
  busy?: boolean

  /**
   * Queries
   */
  /** */
  articleElements!: AriaFeedArticleElement[]
  focusedArticleElement?: AriaFeedArticleElement

  connectedCallback(): void {
    super.connectedCallback()
    this.addEventListener('keydown', this.onKeyDown)
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()
    this.removeEventListener('keydown', this.onKeyDown)
  }

  onKeyDown = (event: KeyboardEvent): void => {
    switch (event.key) {
      case KeyboardEventKey.END:
      case KeyboardEventKey.HOME:
      case KeyboardEventKey.PAGE_DOWN:
      case KeyboardEventKey.PAGE_UP:
        event.preventDefault()
        event.stopPropagation()

        break
    }

    switch (event.key) {
      case KeyboardEventKey.END:
        if (!this.previousTabbableElementSibling) {
          break
        }

        this.previousTabbableElementSibling.focus()
        ElementLogger.verbose(
          this.uid,
          'onKeyDown',
          gkek(event),
          `The previous tabbable element sibling has been focused.`,
          this.previousTabbableElementSibling
        )

        break
      case KeyboardEventKey.HOME:
        if (!this.nextTabbableElementSibling) {
          break
        }

        this.nextTabbableElementSibling.focus()
        ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `The next tabbable element sibling has been focused.`, this.nextTabbableElementSibling)

        break
      case KeyboardEventKey.PAGE_DOWN: {
        let article: AriaFeedArticleElement | undefined

        if (this.focusedArticleElementIndex >= this.articleElements.length - 1) {
          return ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `No more articles to focus ahead.`)
        }

        article = this.articleElements[this.focusedArticleElementIndex + 1]
        if (!article) break

        article.focus()
        ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `The next article has been focused.`, article)

        break
      }
      case KeyboardEventKey.PAGE_UP: {
        let article: AriaFeedArticleElement | undefined

        if (this.focusedArticleElementIndex <= 0) {
          return ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `No more articles to focus behind.`)
        }

        article = this.articleElements[this.focusedArticleElementIndex - 1]
        if (!article) break

        article.focus()
        ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `The previous article has been focused.`, article)

        break
      }
    }
  }

  get focusedArticleElementIndex(): number {
    return this.focusedArticleElement ? this.articleElements.indexOf(this.focusedArticleElement) : -1
  }

  get name(): ElementName {
    return ElementName.ARIA_FEED
  }

  get nextTabbableElementSibling(): FocusableElement | null {
    let focusable: FocusableElement[], last: AriaFeedArticleElement | undefined, next: FocusableElement | undefined

    last = this.articleElements[this.articleElements.length - 1]
    if (!last) return null

    focusable = tabbable(document.body, {
      getShadowRoot: true,
      includeContainer: true
    })
    next = focusable[focusable.indexOf(last) + 1]

    return next ?? null
  }

  get previousTabbableElementSibling(): FocusableElement | null {
    let focusable: FocusableElement[], first: AriaFeedArticleElement | undefined, previous: FocusableElement | undefined

    first = this.articleElements[0]
    if (!first) return null

    focusable = tabbable(document.body, {
      getShadowRoot: true,
      includeContainer: true
    })
    previous = focusable[focusable.indexOf(first) - 1]

    return previous ?? null
  }

  static properties: PropertyDeclarations = {
    busy: { type: Boolean, reflect: true }
  }

  static queries: QueryDeclarations = {
    articleElements: { selector: 'aracna-aria-feed-article', all: true },
    focusedArticleElement: { selector: 'aracna-aria-feed-article[focused]' }
  }
}

class AriaFeedArticleElement<E extends AriaFeedArticleElementEventMap = AriaFeedArticleElementEventMap> extends BaseElement<E> {
  protected aria: AriaFeedArticleController = new AriaFeedArticleController(this)

  /**
   * Properties
   */
  /** */
  focused?: boolean

  /**
   * Queries
   */
  /** */
  descriptionElement?: AriaFeedArticleDescriptionElement
  labelElement?: AriaFeedArticleLabelElement
  rootElement!: AriaFeedElement

  connectedCallback(): void {
    super.connectedCallback()

    this.addEventListener('blur', this.onBlur)
    this.addEventListener('focus', this.onFocus)
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()

    this.removeEventListener('blur', this.onBlur)
    this.removeEventListener('focus', this.onFocus)
  }

  onBlur = (): void => {
    this.focused = false
    ElementLogger.verbose(this.uid, 'onBlur', `The article has been blurred.`)
  }

  onFocus = (): void => {
    this.focused = true
    ElementLogger.verbose(this.uid, 'onFocus', `The article has been focused.`)
  }

  get index(): number {
    return this.rootElement.articleElements.indexOf(this)
  }

  get name(): ElementName {
    return ElementName.ARIA_FEED_ARTICLE
  }

  static properties: PropertyDeclarations = {
    focused: { type: Boolean, reflect: true }
  }

  static queries: QueryDeclarations = {
    descriptionElement: { selector: 'aracna-aria-feed-article-description' },
    labelElement: { selector: 'aracna-aria-feed-article-label' },
    rootElement: { selector: 'aracna-aria-feed', closest: true }
  }
}

class AriaFeedArticleLabelElement<E extends AriaFeedArticleLabelElementEventMap = AriaFeedArticleLabelElementEventMap> extends BaseElement<E> {
  protected aria: AriaFeedArticleLabelController = new AriaFeedArticleLabelController(this)

  get name(): ElementName {
    return ElementName.ARIA_FEED_ARTICLE_LABEL
  }
}

class AriaFeedArticleDescriptionElement<
  E extends AriaFeedArticleDescriptionElementEventMap = AriaFeedArticleDescriptionElementEventMap
> extends BaseElement<E> {
  protected aria: AriaFeedArticleDescriptionController = new AriaFeedArticleDescriptionController(this)

  get name(): ElementName {
    return ElementName.ARIA_FEED_ARTICLE_DESCRIPTION
  }
}

defineCustomElement('aracna-aria-feed', AriaFeedElement)
defineCustomElement('aracna-aria-feed-article', AriaFeedArticleElement)
defineCustomElement('aracna-aria-feed-article-description', AriaFeedArticleDescriptionElement)
defineCustomElement('aracna-aria-feed-article-label', AriaFeedArticleLabelElement)

export {
  AriaFeedArticleDescriptionElement as AracnaAriaFeedArticleDescriptionElement,
  AriaFeedArticleElement as AracnaAriaFeedArticleElement,
  AriaFeedArticleLabelElement as AracnaAriaFeedArticleLabelElement,
  AriaFeedElement as AracnaAriaFeedElement
}
