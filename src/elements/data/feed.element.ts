import {
  defineCustomElement,
  ElementName,
  FeedArticleDescriptionElementEventMap,
  FeedArticleElementEventMap,
  FeedArticleLabelElementEventMap,
  FeedElementEventMap,
  QueryDeclarations
} from '@aracna/web'
import { AriaFeedArticleDescriptionElement, AriaFeedArticleElement, AriaFeedArticleLabelElement, AriaFeedElement } from '../aria/aria.feed.element'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-feed': FeedElement
    'aracna-feed-article': FeedArticleElement
    'aracna-feed-article-description': FeedArticleDescriptionElement
    'aracna-feed-article-label': FeedArticleLabelElement
  }
}

export class FeedElement<E extends FeedElementEventMap = FeedElementEventMap> extends AriaFeedElement<E> {
  get name(): ElementName {
    return ElementName.FEED
  }

  static queries: QueryDeclarations = {
    articleElements: { selector: 'aracna-feed-article', all: true },
    focusedArticleElement: { selector: 'aracna-feed-article[focused]' }
  }
}

export class FeedArticleElement<E extends FeedArticleElementEventMap = FeedArticleElementEventMap> extends AriaFeedArticleElement<E> {
  get name(): ElementName {
    return ElementName.FEED_ARTICLE
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
