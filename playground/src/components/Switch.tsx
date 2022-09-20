import { useState } from 'preact/hooks'
import type { DetailedHTMLProps, HTMLAttributes } from 'react'
import { joinElementClasses, SwitchElement, SwitchElementAttributes } from '../../../src'
import '../../../src/elements/switch.element'
import { useQueelagElement } from '../hooks/use.queelag.element'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'q-switch': SwitchProps
    }
  }
}

interface SwitchProps extends SwitchElementAttributes, DetailedHTMLProps<HTMLAttributes<SwitchElement>, SwitchElement> {}

export function Switch() {
  const { element, ref } = useQueelagElement('q-switch')
  const [props] = useState<SwitchProps>({})

  return (
    <div className='flex'>
      <q-switch {...props} ref={ref} className='w-16 h-8' native>
        <div className='w-full p-px border rounded-sm border-gray-400'>
          <div className={joinElementClasses('w-1/2 h-full', element?.on ? 'translate-x-full bg-green-700' : 'bg-red-700')} />
        </div>
      </q-switch>
    </div>
  )
}
