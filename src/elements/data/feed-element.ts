import {
  defineCustomElement,
  ElementName,
  FeedArticleDescriptionElementEventMap,
  FeedArticleElementEventMap,
  FeedArticleLabelElementEventMap,
  FeedElementEventMap,
  QueryDeclarations
} from '@aracna/web'
import { PropertyDeclarations } from 'lit'
import { AriaFeedArticleDescriptionElement, AriaFeedArticleElement, AriaFeedArticleLabelElement, AriaFeedElement } from '../aria/aria-feed-element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-feed': FeedElement
    'aracna-feed-article': FeedArticleElement
    'aracna-feed-article-description': FeedArticleDescriptionElement
    'aracna-feed-article-label': FeedArticleLabelElement
  }
}

export class FeedElement<E extends FeedElementEventMap = FeedElementEventMap, T = any> extends AriaFeedElement<E> {
  /**
   * PROPERTIES
   */
  articles?: T[]

  get name(): ElementName {
    return ElementName.FEED
  }

  static properties: PropertyDeclarations = {
    articles: { type: Array }
  }

  static queries: QueryDeclarations = {
    articleElements: { selector: 'aracna-feed-article', all: true },
    focusedArticleElement: { selector: 'aracna-feed-article[focused]' }
  }
}

export class FeedArticleElement<E extends FeedArticleElementEventMap = FeedArticleElementEventMap, T = any> extends AriaFeedArticleElement<E> {
  /**
   * PROPERTIES
   */
  buttons?: T[]
  headline?: string
  image?: string
  leadingIcon?: string
  leadingImage?: string
  leadingText?: string
  subhead?: string
  text?: string
  trailingIcon?: string
  trailingImage?: string
  trailingText?: string

  get name(): ElementName {
    return ElementName.FEED_ARTICLE
  }

  static properties: PropertyDeclarations = {
    buttons: { type: Array },
    headline: { type: String, reflect: true },
    image: { type: String, reflect: true },
    leadingIcon: { type: String, attribute: 'leading-icon', reflect: true },
    leadingImage: { type: String, attribute: 'leading-image', reflect: true },
    leadingText: { type: String, attribute: 'leading-text', reflect: true },
    subhead: { type: String, reflect: true },
    text: { type: String, reflect: true },
    trailingIcon: { type: String, attribute: 'trailing-icon', reflect: true },
    trailingImage: { type: String, attribute: 'trailing-image', reflect: true },
    trailingText: { type: String, attribute: 'trailing-text', reflect: true }
  }

  static queries: QueryDeclarations = {
    descriptionElement: { selector: 'aracna-feed-article-description' },
    labelElement: { selector: 'aracna-feed-article-label' },
    rootElement: { selector: 'aracna-feed', closest: true }
  }
}

export class FeedArticleLabelElement<E extends FeedArticleLabelElementEventMap = FeedArticleLabelElementEventMap> extends AriaFeedArticleLabelElement<E> {
  get name(): ElementName {
    return ElementName.FEED_ARTICLE_LABEL
  }
}

export class FeedArticleDescriptionElement<
  E extends FeedArticleDescriptionElementEventMap = FeedArticleDescriptionElementEventMap
> extends AriaFeedArticleDescriptionElement<E> {
  get name(): ElementName {
    return ElementName.FEED_ARTICLE_DESCRIPTION
  }
}

defineCustomElement('aracna-feed', FeedElement)
defineCustomElement('aracna-feed-article', FeedArticleElement)
defineCustomElement('aracna-feed-article-description', FeedArticleDescriptionElement)
defineCustomElement('aracna-feed-article-label', FeedArticleLabelElement)
