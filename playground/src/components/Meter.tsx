import { useState } from 'preact/hooks'
import type { DetailedHTMLProps, HTMLAttributes } from 'react'
import type { MeterElement, MeterElementAttributes } from '../../../src'
import '../../../src/elements/meter.element'
import { useQueelagElement } from '../hooks/use.queelag.element'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'q-meter': MeterProps
    }
  }
}

interface MeterProps extends MeterElementAttributes, DetailedHTMLProps<HTMLAttributes<MeterElement>, MeterElement> {}

export function Meter() {
  const { element, ref } = useQueelagElement('q-meter')
  const [props] = useState<MeterProps>({})

  return (
    <div>
      <q-meter {...props} ref={ref} height={16} minimum={0} maximum={100} value={50} width={256} native>
        <div className='w-full h-full rounded overflow-hidden bg-gray-200'>
          <div className='h-full bg-green-500' style={{ width: element?.percentage + '%' }} />
        </div>
      </q-meter>
    </div>
  )
}
