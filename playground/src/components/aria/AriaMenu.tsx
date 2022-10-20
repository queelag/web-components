import { offset } from '@floating-ui/dom'
import {
  AriaMenuButtonElementAttributes,
  joinElementClasses,
  type AriaMenuElementAttributes,
  type AriaMenuItemElementAttributes,
  type AriaMenuSubMenuElementAttributes
} from '@queelag/web'
import { useState } from 'preact/hooks'
import type { DetailedHTMLProps, HTMLAttributes } from 'react'
import type { AriaMenuButtonElement, AriaMenuElement, AriaMenuItemElement, AriaMenuSubMenuElement } from '../../../../src'
import '../../../../src/elements/aria/aria.menu.element'
import { useQueelagElement } from '../../hooks/use.queelag.element'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'q-aria-menu': AriaMenuProps
      'q-aria-menu-button': AriaMenuButtonProps
      'q-aria-menu-item': AriaMenuItemProps
      'q-aria-menu-submenu': AriaMenuSubMenuProps
    }
  }
}

interface AriaMenuProps extends AriaMenuElementAttributes, DetailedHTMLProps<HTMLAttributes<AriaMenuElement>, AriaMenuElement> {}
interface AriaMenuButtonProps extends AriaMenuButtonElementAttributes, DetailedHTMLProps<HTMLAttributes<AriaMenuButtonElement>, AriaMenuButtonElement> {}
interface AriaMenuItemProps extends AriaMenuItemElementAttributes, DetailedHTMLProps<HTMLAttributes<AriaMenuItemElement>, AriaMenuItemElement> {}
interface AriaMenuSubMenuProps extends AriaMenuSubMenuElementAttributes, DetailedHTMLProps<HTMLAttributes<AriaMenuSubMenuElement>, AriaMenuSubMenuElement> {}

interface Item {
  children?: Item[]
  label: string
}

export function AriaMenu() {
  const { element, ref } = useQueelagElement('q-aria-menu')
  const [props] = useState<AriaMenuProps>({})
  const [items] = useState<Item[]>([
    { label: 'Home' },
    {
      label: 'About',
      children: [
        { label: 'Overview' },
        { label: 'Administration' },
        { label: 'Facts', children: [{ label: 'History' }, { label: 'Current Statistics' }, { label: 'Awards' }] },
        { label: 'Campus Tours', children: [{ label: 'For prospective students' }, { label: 'For alumni' }, { label: 'For visitors' }] }
      ]
    },
    { label: 'Admissions', children: [{ label: 'Apply' }, { label: 'Tuition' }] }
  ])

  return (
    <div>
      <q-aria-menu {...props} ref={ref} className='flex rounded-sm border border-gray-400'>
        {items.map((item: Item, index: number) => (
          <AriaMenuItem index={index} item={item} />
        ))}
        {/* <q-aria-menu-button className='p-2 text-xs'>Button</q-aria-menu-button>
        <AriaMenuSubMenu item={items[1]} /> */}
      </q-aria-menu>
    </div>
  )
}

function AriaMenuItem({ item, index }: { item: Item; index: number }) {
  const { element, ref } = useQueelagElement('q-aria-menu-item', { attribute: { dispatch: true } })

  return (
    <q-aria-menu-item ref={ref} focused={element?.shallow && index <= 0}>
      <a className='w-full p-2 text-xs' href='#'>
        {item.label}
      </a>
      {item.children && <AriaMenuSubMenu item={item} />}
    </q-aria-menu-item>
  )
}

function AriaMenuSubMenu({ item }: { item: Item }) {
  const { element, ref } = useQueelagElement('q-aria-menu-submenu', { attribute: { dispatch: true } })

  return (
    <q-aria-menu-submenu
      ref={ref}
      className={joinElementClasses(
        'w-48 flex flex-col rounded-sm border divide-y border-gray-400 divide-gray-400 bg-white',
        !element?.subMenuElement?.expanded && 'opacity-0 pointer-events-none'
      )}
      middlewares={[offset(4)]}
      placement={element?.itemElement?.deep ? 'right-start' : 'bottom-start'}
    >
      {item.children?.map((child: Item, index: number) => (
        <AriaMenuItem index={index} item={child} />
      ))}
    </q-aria-menu-submenu>
  )
}
