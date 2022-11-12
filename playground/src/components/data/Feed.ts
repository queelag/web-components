import { css, CSSResultGroup, html, LitElement } from 'lit'
import '../../../../src/elements/data/feed.element'

export default class Feed extends LitElement {
  protected render(): unknown {
    return html`
      <q-feed>
        <q-feed-article>
          <q-feed-article-label>ARIA Article 1</q-feed-article-label>
          <q-feed-article-description>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</q-feed-article-description>
        </q-feed-article>
        <q-feed-article>
          <q-feed-article-label>ARIA Article 2</q-feed-article-label>
          <q-feed-article-description>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</q-feed-article-description>
        </q-feed-article>
        <q-feed-article>
          <q-feed-article-label>ARIA Article 3</q-feed-article-label>
          <q-feed-article-description>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</q-feed-article-description>
        </q-feed-article>
      </q-feed>
    `
  }

  static styles?: CSSResultGroup | undefined = css`
    * {
      box-sizing: border-box;
    }

    q-feed {
      display: flex;
      flex-direction: column;

      border: 1px solid gray;
      border-radius: 4px;
    }

    q-feed > * + * {
      border-top: 1px solid gray;
    }

    q-feed-article {
      display: flex;
      flex-direction: column;
      padding: 8px;
      gap: 2px;

      font-size: 12px;
    }

    q-feed-article-label {
      font-weight: 500;
    }

    q-feed-article-description {
      color: gray;
    }
  `
}

defineCustomElement('my-feed', Feed)
