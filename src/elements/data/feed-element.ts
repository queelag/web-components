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

export class FeedElement<E extends FeedElementEventMap = FeedElementEventMap> extends AriaFeedElement<E> {
  /**
   * PROPERTIES
   */
  articles?: any[]

  get name(): ElementName {
    return ElementName.FEED
  }

  static properties: PropertyDeclarations = {
    ...super.properties,
    articles: { type: Array }
  }

  static queries: QueryDeclarations = {
    articleElements: { selector: 'aracna-feed-article', all: true },
    focusedArticleElement: { selector: 'aracna-feed-article[focused]' }
  }
}

export class FeedArticleElement<E extends FeedArticleElementEventMap = FeedArticleElementEventMap> extends AriaFeedArticleElement<E> {
  /**
   * PROPERTIES
   */
  headline?: string
  leadingIcon?: string
  leadingImage?: string
  leadingText?: string
  text?: string
  trailingIcon?: string
  trailingImage?: string
  trailingText?: string

  get name(): ElementName {
    return ElementName.FEED_ARTICLE
  }

  static properties: PropertyDeclarations = {
    ...super.properties,
    headline: { type: String, reflect: true },
    leadingIcon: { type: String, attribute: 'leading-icon', reflect: true },
    leadingImage: { type: String, attribute: 'leading-image', reflect: true },
    leadingText: { type: String, attribute: 'leading-text', reflect: true },
    text: { type: String, reflect: true },
    trialingIcon: { type: String, attribute: 'trailing-icon', reflect: true },
    trialingImage: { type: String, attribute: 'trailing-image', reflect: true },
    trialingText: { type: String, attribute: 'trailing-text', reflect: true }
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
