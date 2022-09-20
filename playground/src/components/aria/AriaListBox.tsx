import { useState } from 'preact/hooks'
import type { DetailedHTMLProps, HTMLAttributes } from 'react'
import {
  AriaListBoxElement,
  AriaListBoxElementAttributes,
  AriaListBoxOptionElement,
  AriaListBoxOptionElementAttributes,
  joinElementClasses
} from '../../../../src'
import '../../../../src/elements/aria/aria.list.box.element'
import { useQueelagElement } from '../../hooks/use.queelag.element'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'q-aria-listbox': AriaListBoxProps
      'q-aria-listbox-option': AriaListBoxOptionProps
    }
  }
}

interface AriaListBoxProps extends AriaListBoxElementAttributes, DetailedHTMLProps<HTMLAttributes<AriaListBoxElement>, AriaListBoxElement> {}

interface AriaListBoxOptionProps
  extends AriaListBoxOptionElementAttributes,
    DetailedHTMLProps<HTMLAttributes<AriaListBoxOptionElement>, AriaListBoxOptionElement> {}

export function AriaListBox() {
  const { element, ref } = useQueelagElement('q-aria-listbox')
  const [props] = useState<AriaListBoxProps>({})
  const [options] = useState<string[]>(['Lion', 'Giraffe', 'Zebra', 'Buffalo'])

  return (
    <div>
      <q-aria-listbox
        {...props}
        ref={ref}
        className='w-64 flex flex-col rounded-sm border divide-y border-gray-400 divide-gray-400'
        // selection-follows-focus
        // select-first-option-on-focus
      >
        {options.map((option: string) => (
          <AriaListBoxOption key={option} name={option} />
        ))}
      </q-aria-listbox>
    </div>
  )
}

export function AriaListBoxOption({ name }: any) {
  const { element, ref } = useQueelagElement('q-aria-listbox-option', { attribute: { dispatch: true } })

  return (
    <q-aria-listbox-option
      ref={ref}
      className={joinElementClasses(
        'flex justify-between items-center p-2 rounded-sm',
        element?.focused && 'ring-2 ring-offset-2 ring-blue-700',
        element?.selected && 'bg-gray-200'
      )}
    >
      <span className='text-xs'>{name}</span>
      {element?.selected && (
        <q-icon fill='none' size={16} src='https://raw.githubusercontent.com/feathericons/feather/master/icons/check.svg' stroke='black' stroke-width={1.5} />
      )}
    </q-aria-listbox-option>
  )
}
