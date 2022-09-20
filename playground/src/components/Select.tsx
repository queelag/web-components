import { useState } from 'preact/hooks'
import type { DetailedHTMLProps, FormEvent, HTMLAttributes } from 'react'
import { joinElementClasses, SelectElement, SelectElementAttributes, SelectOption } from '../../../src'
import '../../../src/elements/select.element'
import { useQueelagElement } from '../hooks/use.queelag.element'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'q-select': SelectProps
    }
  }
}

interface SelectProps extends SelectElementAttributes, DetailedHTMLProps<HTMLAttributes<SelectElement>, SelectElement> {}

export function Select() {
  const { element, ref } = useQueelagElement('q-select')
  const [props] = useState<SelectProps>({})

  const [options] = useState<SelectOption[]>([
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' }
  ])

  return (
    <div className='flex'>
      <q-select {...props} ref={ref} options={options} native>
        <div className='flex flex-col gap-2'>
          <q-input onInput={(event: FormEvent) => element?.onSearchInput(event.nativeEvent)} placeholder='search options' type='text' />
          <div className='flex flex-col divide-y rounded-sm border border-gray-400 divide-gray-400'>
            {element?.optionsFilteredBySearchValue?.map((option: SelectOption) => (
              <div
                className={joinElementClasses('flex justify-between items-center px-2 py-1.5 cursor-pointer', option.value === element.value && 'bg-gray-100')}
                onClick={() => element.onClickOption(option)}
              >
                <span className='text-xs'>{option.label || option.value}</span>
                {option.value === element.value && (
                  <q-icon
                    fill='none'
                    size={16}
                    src='https://raw.githubusercontent.com/feathericons/feather/master/icons/check.svg'
                    stroke='black'
                    stroke-width={1}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </q-select>
    </div>
  )
}
