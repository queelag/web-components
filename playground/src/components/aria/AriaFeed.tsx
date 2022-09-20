import { useState } from 'preact/hooks'
import type { DetailedHTMLProps, HTMLAttributes } from 'react'
import type {
  AriaFeedArticleDescriptionElement,
  AriaFeedArticleDescriptionElementAttributes,
  AriaFeedArticleElement,
  AriaFeedArticleElementAttributes,
  AriaFeedArticleLabelElement,
  AriaFeedArticleLabelElementAttributes,
  AriaFeedElement,
  AriaFeedElementAttributes
} from '../../../../src'
import '../../../../src/elements/aria/aria.feed.element'
import { useQueelagElement } from '../../hooks/use.queelag.element'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'q-aria-feed': AriaFeedProps
      'q-aria-feed-article': AriaFeedArticleProps
      'q-aria-feed-article-description': AriaFeedArticleDescriptionProps
      'q-aria-feed-article-label': AriaFeedArticleLabelProps
    }
  }
}

interface AriaFeedProps extends AriaFeedElementAttributes, DetailedHTMLProps<HTMLAttributes<AriaFeedElement>, AriaFeedElement> {}

interface AriaFeedArticleProps extends AriaFeedArticleElementAttributes, DetailedHTMLProps<HTMLAttributes<AriaFeedArticleElement>, AriaFeedArticleElement> {}

interface AriaFeedArticleDescriptionProps
  extends AriaFeedArticleDescriptionElementAttributes,
    DetailedHTMLProps<HTMLAttributes<AriaFeedArticleDescriptionElement>, AriaFeedArticleDescriptionElement> {}

interface AriaFeedArticleLabelProps
  extends AriaFeedArticleLabelElementAttributes,
    DetailedHTMLProps<HTMLAttributes<AriaFeedArticleLabelElement>, AriaFeedArticleLabelElement> {}

export function AriaFeed() {
  const { element, ref } = useQueelagElement('q-aria-feed')
  const [props] = useState<AriaFeedProps>({})
  const [articles] = useState<number[]>([1, 2, 3])

  return (
    <div>
      <q-aria-feed {...props} ref={ref} className='flex flex-col rounded-sm border divide-y border-gray-400 divide-gray-400'>
        {articles.map((article: number) => (
          <q-aria-feed-article className='flex flex-col p-2 gap-1 text-xs' key={article}>
            <q-aria-feed-article-label>ARIA Article {article}</q-aria-feed-article-label>
            <q-aria-feed-article-description className='text-gray-400'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </q-aria-feed-article-description>
          </q-aria-feed-article>
        ))}
      </q-aria-feed>
    </div>
  )
}
