import type { AriaCheckBoxElementAttributes } from '@queelag/web'
import { useState } from 'preact/hooks'
import type { DetailedHTMLProps, HTMLAttributes } from 'react'
import type { AriaCheckBoxElement } from '../../../../src'
import '../../../../src/elements/aria/aria.check.box.element'
import { useQueelagElement } from '../../hooks/use.queelag.element'

declare global {
  namespace preact.createElement.JSX {
    interface IntrinsicElements {
      'q-aria-checkbox': AriaCheckBoxProps
    }
  }
}

interface AriaCheckBoxProps extends AriaCheckBoxElementAttributes, DetailedHTMLProps<HTMLAttributes<AriaCheckBoxElement>, AriaCheckBoxElement> {}

export function AriaCheckBox() {
  const { element, ref } = useQueelagElement('q-aria-checkbox', { attribute: { dispatch: true } })
  const [props] = useState<AriaCheckBoxProps>({})

  return (
    <div className='flex gap-2'>
      <q-aria-checkbox {...props} ref={ref}>
        <q-aria-checkbox className='w-8 h-8 flex justify-center items-center rounded border border-gray-200'>
          {element?.checked && (
            <q-icon fill='none' size={16} src='https://raw.githubusercontent.com/feathericons/feather/master/icons/check.svg' stroke='black' stroke-width={2} />
          )}
        </q-aria-checkbox>
      </q-aria-checkbox>
    </div>
  )
}
