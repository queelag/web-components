import { useState } from 'preact/hooks'
import type { DetailedHTMLProps, HTMLAttributes } from 'react'
import type { DividerElement, DividerElementAttributes } from '../../../src'
import '../../../src/elements/divider.element'
import { useQueelagElement } from '../hooks/use.queelag.element'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'q-divider': DividerProps
    }
  }
}

interface DividerProps extends DividerElementAttributes, DetailedHTMLProps<HTMLAttributes<DividerElement>, DividerElement> {}

export function Divider() {
  const { element, ref } = useQueelagElement('q-divider')
  const [props] = useState<DividerProps>({})

  return (
    <div className='flex gap-2'>
      <q-divider {...props} className='flex-1' orientation='horizontal' ref={ref}>
        <div className='w-full h-px bg-gray-200' slot='horizontal' />
        <div className='w-px h-full bg-gray-200' slot='vertical' />
      </q-divider>
    </div>
  )
}
