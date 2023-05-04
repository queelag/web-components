import { defineCustomElement } from '@aracna/web'
import { css, CSSResultGroup, html, LitElement } from 'lit'
import '../../../../src/elements/data/feed.element'

export default class Feed extends LitElement {
  protected render(): unknown {
    return html`
      <aracna-feed>
        <aracna-feed-article>
          <aracna-feed-article-label>ARIA Article 1</aracna-feed-article-label>
          <aracna-feed-article-description>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</aracna-feed-article-description>
        </aracna-feed-article>
        <aracna-feed-article>
          <aracna-feed-article-label>ARIA Article 2</aracna-feed-article-label>
          <aracna-feed-article-description>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</aracna-feed-article-description>
        </aracna-feed-article>
        <aracna-feed-article>
          <aracna-feed-article-label>ARIA Article 3</aracna-feed-article-label>
          <aracna-feed-article-description>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</aracna-feed-article-description>
        </aracna-feed-article>
      </aracna-feed>
    `
  }

  static styles?: CSSResultGroup | undefined = css`
    * {
      box-sizing: border-box;
    }

    aracna-feed {
      display: flex;
      flex-direction: column;

      border: 1px solid gray;
      border-radius: 4px;
    }

    aracna-feed > * + * {
      border-top: 1px solid gray;
    }

    aracna-feed-article {
      display: flex;
      flex-direction: column;
      padding: 8px;
      gap: 2px;

      font-size: 12px;
    }

    aracna-feed-article-label {
      font-weight: 500;
    }

    aracna-feed-article-description {
      color: gray;
    }
  `
}

defineCustomElement('my-feed', Feed)
