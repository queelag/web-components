import { useState } from 'preact/hooks'
import type { DetailedHTMLProps, HTMLAttributes } from 'react'
import {
  AriaRadioButtonElement,
  AriaRadioButtonElementAttributes,
  AriaRadioGroupElement,
  AriaRadioGroupElementAttributes,
  joinElementClasses
} from '../../../../src'
import '../../../../src/elements/aria/aria.radio.group.element'
import { FRUITS } from '../../definitions/constants'
import { useQueelagElement } from '../../hooks/use.queelag.element'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'q-aria-radio-button': AriaRadioButtonProps
      'q-aria-radio-group': AriaRadioGroupProps
    }
  }
}

interface AriaRadioButtonProps extends AriaRadioButtonElementAttributes, DetailedHTMLProps<HTMLAttributes<AriaRadioButtonElement>, AriaRadioButtonElement> {}
interface AriaRadioGroupProps extends AriaRadioGroupElementAttributes, DetailedHTMLProps<HTMLAttributes<AriaRadioGroupElement>, AriaRadioGroupElement> {}

export function AriaRadioGroup() {
  const { element, ref } = useQueelagElement('q-aria-radio-group')
  const [props] = useState<AriaRadioGroupProps>({})
  const [options] = useState<string[]>(FRUITS.slice(4, 7))

  return (
    <div>
      <q-aria-radio-group {...props} ref={ref} className='w-32 flex flex-col gap-1 outline-none'>
        {options.map((option: string) => (
          <AriaRadioButton option={option} />
        ))}
      </q-aria-radio-group>
    </div>
  )
}

export function AriaRadioButton({ option }: any) {
  const { element, ref } = useQueelagElement('q-aria-radio-button', { attribute: { dispatch: true } })

  return (
    <q-aria-radio-button
      ref={ref}
      className={joinElementClasses(
        'flex items-center gap-2 p-2 rounded-sm border border-gray-400',
        element?.checked && '',
        element?.focused && 'ring-2 ring-offset-1 ring-blue-700'
      )}
    >
      <q-icon
        fill='none'
        size={14}
        src={
          element?.checked
            ? 'https://raw.githubusercontent.com/feathericons/feather/master/icons/disc.svg'
            : 'https://raw.githubusercontent.com/feathericons/feather/master/icons/circle.svg'
        }
        stroke='black'
        stroke-width={2}
      />
      <span className='text-xs'>{option}</span>
    </q-aria-radio-button>
  )
}
