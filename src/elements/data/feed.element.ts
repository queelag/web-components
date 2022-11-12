import {
  defineCustomElement,
  ElementName,
  FeedArticleDescriptionElementEventMap,
  FeedArticleElementEventMap,
  FeedArticleLabelElementEventMap,
  FeedElementEventMap,
  QueryDeclarations
} from '@queelag/web'
import { AriaFeedArticleDescriptionElement, AriaFeedArticleElement, AriaFeedArticleLabelElement, AriaFeedElement } from '../aria/aria.feed.element'

declare global {
  interface HTMLElementTagNameMap {
    'q-feed': FeedElement
    'q-feed-article': FeedArticleElement
    'q-feed-article-description': FeedArticleDescriptionElement
    'q-feed-article-label': FeedArticleLabelElement
  }
}

export class FeedElement<E extends FeedElementEventMap = FeedElementEventMap> extends AriaFeedElement<E> {
  get name(): ElementName {
    return ElementName.FEED
  }

  static queries: QueryDeclarations = {
    articleElements: { selector: 'q-feed-article', all: true },
    focusedArticleElement: { selector: 'q-feed-article[focused]' }
  }
}

export class FeedArticleElement<E extends FeedArticleElementEventMap = FeedArticleElementEventMap> extends AriaFeedArticleElement<E> {
  get name(): ElementName {
    return ElementName.FEED_ARTICLE
  }

  static queries: QueryDeclarations = {
    descriptionElement: { selector: 'q-feed-article-description' },
    labelElement: { selector: 'q-feed-article-label' },
    rootElement: { selector: 'q-feed', closest: true }
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

defineCustomElement('q-feed', FeedElement)
defineCustomElement('q-feed-article', FeedArticleElement)
defineCustomElement('q-feed-article-description', FeedArticleDescriptionElement)
defineCustomElement('q-feed-article-label', FeedArticleLabelElement)
