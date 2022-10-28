import { ElementName, KeyboardEventKey, QueryDeclarations, WebElementLogger } from '@queelag/web'
import { PropertyDeclarations } from 'lit'
import { FocusableElement, tabbable } from 'tabbable'
import {
  AriaFeedArticleController,
  AriaFeedArticleDescriptionController,
  AriaFeedArticleLabelController,
  AriaFeedController
} from '../../controllers/aria.feed.controller'
import { BaseElement } from '../core/base.element'

declare global {
  interface HTMLElementTagNameMap {
    'q-aria-feed': AriaFeedElement
    'q-aria-feed-article': AriaFeedArticleElement
    'q-aria-feed-article-description': AriaFeedArticleDescriptionElement
    'q-aria-feed-article-label': AriaFeedArticleLabelElement
  }
}

export class AriaFeedElement extends BaseElement {
  protected aria: AriaFeedController = new AriaFeedController(this)

  /**
   * PROPERTIES
   */
  busy?: boolean

  /**
   * QUERIES
   */
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
    }

    switch (event.key) {
      case KeyboardEventKey.END:
        this.previousTabbableElementSibling?.focus()
        WebElementLogger.verbose(this.uid, 'onKeyDown', 'END', `The previous tabbable element sibling has been focused.`)

        break
      case KeyboardEventKey.HOME:
        this.nextTabbableElementSibling?.focus()
        WebElementLogger.verbose(this.uid, 'onKeyDown', 'HOME', `The next tabbable element sibling has been focused.`)

        break
      case KeyboardEventKey.PAGE_DOWN:
        if (this.focusedArticleElementIndex >= this.articleElements.length - 1) {
          return
        }

        this.articleElements[this.focusedArticleElementIndex + 1]?.focus()
        WebElementLogger.verbose(this.uid, 'onKeyDown', 'PAGE_DOWN', `The next article has been focused.`)

        break
      case KeyboardEventKey.PAGE_UP:
        if (this.focusedArticleElementIndex <= 0) {
          return
        }

        this.articleElements[this.focusedArticleElementIndex - 1]?.focus()
        WebElementLogger.verbose(this.uid, 'onKeyDown', 'PAGE_UP', `The previous article has been focused.`)

        break
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

    focusable = tabbable(document.body, { getShadowRoot: true, includeContainer: true })
    next = focusable[focusable.indexOf(last) + 1]

    return next || null
  }

  get previousTabbableElementSibling(): FocusableElement | null {
    let focusable: FocusableElement[], first: AriaFeedArticleElement | undefined, previous: FocusableElement | undefined

    first = this.articleElements[0]
    if (!first) return null

    focusable = tabbable(document.body, { getShadowRoot: true, includeContainer: true })
    previous = focusable[focusable.indexOf(first) - 1]

    console.log(focusable)

    return previous || null
  }

  static properties: PropertyDeclarations = {
    busy: { type: Boolean, reflect: true }
  }

  static queries: QueryDeclarations = {
    articleElements: { selector: 'q-aria-feed-article', all: true },
    focusedArticleElement: { selector: 'q-aria-feed-article[focused]' }
  }
}

export class AriaFeedArticleElement extends BaseElement {
  protected aria: AriaFeedArticleController = new AriaFeedArticleController(this)

  /**
   * PROPERTIES
   */
  focused?: boolean

  /**
   * QUERIES
   */
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
    WebElementLogger.verbose(this.uid, 'onFocus', `The article has been blurred.`)
  }

  onFocus = (): void => {
    this.focused = true
    WebElementLogger.verbose(this.uid, 'onFocus', `The article has been focused.`)
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
    descriptionElement: { selector: 'q-aria-feed-article-description' },
    labelElement: { selector: 'q-aria-feed-article-label' },
    rootElement: { selector: 'q-aria-feed', closest: true }
  }
}

export class AriaFeedArticleLabelElement extends BaseElement {
  protected aria: AriaFeedArticleLabelController = new AriaFeedArticleLabelController(this)

  get name(): ElementName {
    return ElementName.ARIA_FEED_ARTICLE_LABEL
  }
}

export class AriaFeedArticleDescriptionElement extends BaseElement {
  protected aria: AriaFeedArticleDescriptionController = new AriaFeedArticleDescriptionController(this)

  get name(): ElementName {
    return ElementName.ARIA_FEED_ARTICLE_DESCRIPTION
  }
}

customElements.define('q-aria-feed', AriaFeedElement)
customElements.define('q-aria-feed-article', AriaFeedArticleElement)
customElements.define('q-aria-feed-article-description', AriaFeedArticleDescriptionElement)
customElements.define('q-aria-feed-article-label', AriaFeedArticleLabelElement)
