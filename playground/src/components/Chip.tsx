import { useState } from 'preact/hooks'
import type { DetailedHTMLProps, HTMLAttributes } from 'react'
import type { ChipElement, ChipElementAttributes } from '../../../src'
import '../../../src/elements/chip.element'
import { useQueelagElement } from '../hooks/use.queelag.element'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'q-chip': ChipProps
    }
  }
}

interface ChipProps extends ChipElementAttributes, DetailedHTMLProps<HTMLAttributes<ChipElement>, ChipElement> {}

export function Chip() {
  const { element, ref } = useQueelagElement('q-chip')
  const [props] = useState<ChipProps>({})

  return (
    <div>
      <q-chip {...props} ref={ref} className='flex items-center gap-2 px-2 py-1 rounded-sm bg-gray-300'>
        <span className='text-xs'>Chip</span>
        <q-icon
          className='mt-px cursor-pointer'
          fill='none'
          size={12}
          src='https://raw.githubusercontent.com/feathericons/feather/master/icons/x.svg'
          stroke='black'
          stroke-width={2}
        />
      </q-chip>
    </div>
  )
}
