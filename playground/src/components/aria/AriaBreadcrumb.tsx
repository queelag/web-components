import type { AriaBreadcrumbElementAttributes, AriaBreadcrumbItemElementAttributes, AriaBreadcrumbListElementAttributes } from '@queelag/web'
import { Fragment } from 'preact'
import { useState } from 'preact/hooks'
import type { DetailedHTMLProps, HTMLAttributes } from 'react'
import type { AriaBreadcrumbElement, AriaBreadcrumbItemElement, AriaBreadcrumbListElement } from '../../../../src'
import '../../../../src/elements/aria/aria.breadcrumb.element'
import type { ElementProps } from '../../definitions/types'
import { useQueelagElement } from '../../hooks/use.queelag.element'

declare global {
  namespace preact.createElement.JSX {
    interface IntrinsicElements {
      'q-aria-breadcrumb': AriaBreadcrumbProps
      'q-aria-breadcrumb-list': AriaBreadcrumbListProps
      'q-aria-breadcrumb-list-item': AriaBreadcrumbListItemProps
    }
  }
}

interface AriaBreadcrumbProps extends ElementProps<AriaBreadcrumbElement, AriaBreadcrumbElementAttributes> {}

interface AriaBreadcrumbListProps
  extends AriaBreadcrumbListElementAttributes,
    DetailedHTMLProps<HTMLAttributes<AriaBreadcrumbListElement>, AriaBreadcrumbListElement> {}

interface AriaBreadcrumbListItemProps
  extends AriaBreadcrumbItemElementAttributes,
    DetailedHTMLProps<HTMLAttributes<AriaBreadcrumbItemElement>, AriaBreadcrumbItemElement> {}

export function AriaBreadcrumb() {
  const { element, ref } = useQueelagElement('q-aria-breadcrumb')
  const [props] = useState<AriaBreadcrumbProps>({})
  const [items] = useState<string[]>(['Home', 'Shop', 'Article'])

  return (
    <div>
      <q-aria-breadcrumb {...props} className='p-2 rounded-sm border border-gray-400' ref={ref}>
        <q-aria-breadcrumb-list className='flex items-center gap-2 text-xs'>
          {items.map((item: string, index: number) => (
            <Fragment>
              {index > 0 && <span>/</span>}
              <q-aria-breadcrumb-list-item current={index >= items.length - 1}>
                <a className='hover:underline' href='#' target='_blank'>
                  {item}
                </a>
              </q-aria-breadcrumb-list-item>
            </Fragment>
          ))}
        </q-aria-breadcrumb-list>
      </q-aria-breadcrumb>
    </div>
  )
}
