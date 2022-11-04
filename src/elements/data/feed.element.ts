import { ElementName, QueryDeclarations } from '@queelag/web'
import { AriaFeedArticleDescriptionElement, AriaFeedArticleElement, AriaFeedArticleLabelElement, AriaFeedElement } from '../aria/aria.feed.element'

declare global {
  interface HTMLElementTagNameMap {
    'q-feed': FeedElement
    'q-feed-article': FeedArticleElement
    'q-feed-article-description': FeedArticleDescriptionElement
    'q-feed-article-label': FeedArticleLabelElement
  }
}

export class FeedElement extends AriaFeedElement {
  get name(): ElementName {
    return ElementName.FEED
  }

  static queries: QueryDeclarations = {
    articleElements: { selector: 'q-feed-article', all: true },
    focusedArticleElement: { selector: 'q-feed-article[focused]' }
  }
}

export class FeedArticleElement extends AriaFeedArticleElement {
  get name(): ElementName {
    return ElementName.FEED_ARTICLE
  }

  static queries: QueryDeclarations = {
    descriptionElement: { selector: 'q-feed-article-description' },
    labelElement: { selector: 'q-feed-article-label' },
    rootElement: { selector: 'q-feed', closest: true }
  }
}

export class FeedArticleLabelElement extends AriaFeedArticleLabelElement {
  get name(): ElementName {
    return ElementName.FEED_ARTICLE_LABEL
  }
}

export class FeedArticleDescriptionElement extends AriaFeedArticleDescriptionElement {
  get name(): ElementName {
    return ElementName.FEED_ARTICLE_DESCRIPTION
  }
}

customElements.define('q-feed', FeedElement)
customElements.define('q-feed-article', FeedArticleElement)
customElements.define('q-feed-article-description', FeedArticleDescriptionElement)
customElements.define('q-feed-article-label', FeedArticleLabelElement)
