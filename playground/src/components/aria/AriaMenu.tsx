import { offset } from '@floating-ui/dom'
import { useState } from 'preact/hooks'
import type { DetailedHTMLProps, HTMLAttributes } from 'react'
import {
  AriaMenuButtonElement,
  AriaMenuButtonElementAttributes,
  AriaMenuElement,
  AriaMenuElementAttributes,
  AriaMenuItemElement,
  AriaMenuItemElementAttributes,
  AriaMenuListElement,
  AriaMenuListElementAttributes,
  joinElementClasses
} from '../../../../src'
import '../../../../src/elements/aria/aria.menu.element'
import { FRUITS } from '../../definitions/constants'
import { useQueelagElement } from '../../hooks/use.queelag.element'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'q-aria-menu': AriaMenuProps
      'q-aria-menu-button': AriaMenuButtonProps
      'q-aria-menu-item': AriaMenuItemProps
      'q-aria-menu-list': AriaMenuListProps
    }
  }
}

interface AriaMenuProps extends AriaMenuElementAttributes, DetailedHTMLProps<HTMLAttributes<AriaMenuElement>, AriaMenuElement> {}
interface AriaMenuButtonProps extends AriaMenuButtonElementAttributes, DetailedHTMLProps<HTMLAttributes<AriaMenuButtonElement>, AriaMenuButtonElement> {}
interface AriaMenuItemProps extends AriaMenuItemElementAttributes, DetailedHTMLProps<HTMLAttributes<AriaMenuItemElement>, AriaMenuItemElement> {}
interface AriaMenuListProps extends AriaMenuListElementAttributes, DetailedHTMLProps<HTMLAttributes<AriaMenuListElement>, AriaMenuListElement> {}

export function AriaMenu() {
  const { element, ref } = useQueelagElement('q-aria-menu', { attribute: { dispatch: true } })
  const [props] = useState<AriaMenuProps>({})
  const [items] = useState<string[]>(FRUITS)

  return (
    <div>
      <q-aria-menu
        {...props}
        ref={ref}
        // navigation
      >
        <q-aria-menu-button className={joinElementClasses('px-2 py-1 rounded-sm border border-gray-400 bg-gray-200', 'hover:bg-gray-300 active:bg-gray-100')}>
          <span className='text-xs'>ARIA Menu</span>
        </q-aria-menu-button>
        <q-aria-menu-list
          className={joinElementClasses(
            'w-64 h-64 flex flex-col rounded-sm border divide-y border-gray-400 divide-gray-400 bg-white',
            !element?.expanded && 'opacity-0 pointer-events-none'
          )}
          middlewares={[offset(4)]}
          placement='bottom-start'
        >
          {items.map((item: string) => (
            <AriaMenuItem item={item} key={item} />
          ))}
        </q-aria-menu-list>
      </q-aria-menu>
    </div>
  )
}

function AriaMenuItem({ item }: any) {
  const { element, ref } = useQueelagElement('q-aria-menu-item', { attribute: { dispatch: true } })

  const onClick = () => {
    window.alert(`The item ${item} has been clicked.`)
  }

  return (
    <q-aria-menu-item ref={ref} className={joinElementClasses('p-2 text-xs', element?.focused && 'ring-2 ring-offset-2 ring-blue-700')} onClick={onClick}>
      {/* <a href='#'>{item}</a> */}
      <span>{item}</span>
    </q-aria-menu-item>
  )
}
