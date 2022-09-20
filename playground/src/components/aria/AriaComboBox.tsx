import { offset } from '@floating-ui/dom'
import { useState } from 'preact/hooks'
import type { DetailedHTMLProps, HTMLAttributes } from 'react'
import {
  AriaComboBoxButtonElement,
  AriaComboBoxButtonElementAttributes,
  AriaComboBoxElement,
  AriaComboBoxElementAttributes,
  AriaComboBoxGroupElement,
  AriaComboBoxGroupElementAttributes,
  AriaComboBoxInputElement,
  AriaComboBoxInputElementAttributes,
  AriaComboBoxListElement,
  AriaComboBoxListElementAttributes,
  AriaComboBoxOptionElement,
  AriaComboBoxOptionElementAttributes,
  joinElementClasses
} from '../../../../src'
import '../../../../src/elements/aria/aria.combo.box.element'
import { FRUITS } from '../../definitions/constants'
import { useQueelagElement } from '../../hooks/use.queelag.element'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'q-aria-combobox': AriaComboBoxProps
      'q-aria-combobox-button': AriaComboBoxButtonProps
      'q-aria-combobox-group': AriaComboBoxGroupProps
      'q-aria-combobox-input': AriaComboBoxInputProps
      'q-aria-combobox-list': AriaComboBoxListProps
      'q-aria-combobox-option': AriaComboBoxOptionProps
    }
  }
}

interface AriaComboBoxProps extends AriaComboBoxElementAttributes, DetailedHTMLProps<HTMLAttributes<AriaComboBoxElement>, AriaComboBoxElement> {}

interface AriaComboBoxButtonProps
  extends AriaComboBoxButtonElementAttributes,
    DetailedHTMLProps<HTMLAttributes<AriaComboBoxButtonElement>, AriaComboBoxButtonElement> {}

interface AriaComboBoxGroupProps
  extends AriaComboBoxGroupElementAttributes,
    DetailedHTMLProps<HTMLAttributes<AriaComboBoxGroupElement>, AriaComboBoxGroupElement> {}

interface AriaComboBoxInputProps
  extends AriaComboBoxInputElementAttributes,
    DetailedHTMLProps<HTMLAttributes<AriaComboBoxInputElement>, AriaComboBoxInputElement> {}

interface AriaComboBoxListProps
  extends AriaComboBoxListElementAttributes,
    DetailedHTMLProps<HTMLAttributes<AriaComboBoxListElement>, AriaComboBoxListElement> {}

interface AriaComboBoxOptionProps
  extends AriaComboBoxOptionElementAttributes,
    DetailedHTMLProps<HTMLAttributes<AriaComboBoxOptionElement>, AriaComboBoxOptionElement> {}

export function AriaComboBox() {
  const { element, ref } = useQueelagElement('q-aria-combobox', { attribute: { dispatch: true } })
  const [props] = useState<AriaComboBoxProps>({})
  const [options] = useState<string[]>(FRUITS)

  return (
    <div>
      <q-aria-combobox {...props} ref={ref} autocomplete='list' className='w-64'>
        <q-aria-combobox-group className='w-full rounded-sm border border-gray-400'>
          <q-aria-combobox-input className='w-full'>
            <input className='appearance-none w-full h-8 px-2 text-xs' placeholder='ARIA Combobox' type='text' />
          </q-aria-combobox-input>
          {/* <q-aria-combobox-button className='w-full flex justify-between items-center p-2'>
            <span className='text-xs'>{element?.selectedOptionElement ? options[element.selectedOptionElementIndex] : 'Pick an animal (combobox)'}</span>
            <q-icon
              fill='none'
              size={16}
              src={
                element?.expanded
                  ? 'https://raw.githubusercontent.com/feathericons/feather/master/icons/chevron-up.svg'
                  : 'https://raw.githubusercontent.com/feathericons/feather/master/icons/chevron-down.svg'
              }
              stroke='black'
              stroke-width={2}
            />
          </q-aria-combobox-button> */}
        </q-aria-combobox-group>
        <q-aria-combobox-list
          className={joinElementClasses(
            'max-h-64 flex flex-col rounded-sm border divide-y border-gray-400 divide-gray-400 bg-white',
            !element?.expanded && 'opacity-0 pointer-events-none'
          )}
          middlewares={[offset(4)]}
        >
          {element
            ?.filterOptions(options, (option: string) => option.toLowerCase().includes(element?.inputElement?.value.toLowerCase() || ''))
            .map((option: string) => (
              <AriaComboBoxOption key={option} option={option} />
            ))}
        </q-aria-combobox-list>
      </q-aria-combobox>
    </div>
  )
}

function AriaComboBoxOption({ option }: any) {
  const { element, ref } = useQueelagElement('q-aria-combobox-option', { attribute: { dispatch: true } })

  return (
    <q-aria-combobox-option
      ref={ref}
      className={joinElementClasses('flex justify-between items-center p-2 text-xs', element?.focused && 'ring-2 ring-offset-2 ring-blue-700')}
    >
      <span className='text-xs'>{option}</span>
      {element?.selected && (
        <q-icon fill='none' size={14} src='https://raw.githubusercontent.com/feathericons/feather/master/icons/check.svg' stroke='black' stroke-width={2} />
      )}
    </q-aria-combobox-option>
  )
}
