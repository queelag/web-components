import type { CheckBoxElementAttributes } from '@queelag/web'
import { useState } from 'preact/hooks'
import type { DetailedHTMLProps, HTMLAttributes } from 'react'
import type { CheckBoxElement } from '../../../../src'
import '../../../../src/elements/inputs/check.box.element'
import { useQueelagElement } from '../../hooks/use.queelag.element'

declare global {
  namespace preact.createElement.JSX {
    interface IntrinsicElements {
      'q-checkbox': CheckBoxProps
    }
  }
}

interface CheckBoxProps extends CheckBoxElementAttributes, DetailedHTMLProps<HTMLAttributes<CheckBoxElement>, CheckBoxElement> {}

export function CheckBox() {
  const { element, ref } = useQueelagElement('q-checkbox', { state: { dispatch: true } })
  const [props] = useState<CheckBoxProps>({})

  return (
    <div className='flex items-center gap-2'>
      <q-checkbox {...props} ref={ref} normalized>
        <q-aria-checkbox checked={element?.checked} className='w-8 h-8 flex justify-center items-center rounded border border-gray-200'>
          {element?.checked && (
            <q-icon fill='none' size={16} src='https://raw.githubusercontent.com/feathericons/feather/master/icons/check.svg' stroke='black' stroke-width={2} />
          )}
        </q-aria-checkbox>
      </q-checkbox>
    </div>
  )
}
