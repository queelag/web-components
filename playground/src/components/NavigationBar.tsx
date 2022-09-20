import { useState } from 'preact/hooks'
import type { DetailedHTMLProps, HTMLAttributes } from 'react'
import {
  joinElementClasses,
  NavigationBarElement,
  NavigationBarElementAttributes,
  NavigationBarItemElement,
  NavigationBarItemElementAttributes
} from '../../../src'
import '../../../src/elements/navigation.bar.element'
import { useQueelagElement } from '../hooks/use.queelag.element'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'q-navigation-bar': NavigationBarProps
      'q-navigation-bar-item': NavigationBarItemProps
    }
  }
}

interface NavigationBarProps extends NavigationBarElementAttributes, DetailedHTMLProps<HTMLAttributes<NavigationBarElement>, NavigationBarElement> {}

interface NavigationBarItemProps
  extends NavigationBarItemElementAttributes,
    DetailedHTMLProps<HTMLAttributes<NavigationBarItemElement>, NavigationBarItemElement> {}

export function NavigationBar() {
  const { element, ref } = useQueelagElement('q-navigation-bar', { attribute: { dispatch: true } })
  const [props] = useState<NavigationBarProps>({})
  const [items] = useState<string[]>(['Discover', 'Home', 'Settings'])

  return (
    <div className='flex'>
      <q-navigation-bar {...props} ref={ref} active-item='Home' className='flex rounded-sm border divide-x border-gray-400 divide-gray-400'>
        {items.map((item: string) => (
          <q-navigation-bar-item
            active={element?.isItemActive(item)}
            className={joinElementClasses('px-2 py-1 cursor-pointer', element?.isItemActive(item) && 'bg-gray-200')}
            key={item}
            onClick={() => element?.activateItem(item)}
          >
            <span className='text-xs'>{item}</span>
          </q-navigation-bar-item>
        ))}
      </q-navigation-bar>
    </div>
  )
}
