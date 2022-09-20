import { useState } from 'preact/hooks'
import type { DetailedHTMLProps, HTMLAttributes } from 'react'
import type { TextAreaElement, TextAreaElementAttributes } from '../../../src'
import '../../../src/elements/text.area.element'
import { useQueelagElement } from '../hooks/use.queelag.element'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'q-textarea': TextAreaProps
    }
  }
}

interface TextAreaProps extends TextAreaElementAttributes, DetailedHTMLProps<HTMLAttributes<TextAreaElement>, TextAreaElement> {}

export function TextArea() {
  const { element, ref } = useQueelagElement('q-textarea')
  const [props] = useState<TextAreaProps>({})

  return (
    <div className='flex items-center gap-2'>
      <q-textarea {...props} ref={ref} placeholder='textarea' autosize />
      <q-button native normalized>
        <q-icon
          fill='none'
          onClick={() => element?.clear()}
          size={16}
          src='https://raw.githubusercontent.com/feathericons/feather/master/icons/x.svg'
          stroke='black'
          stroke-width={2}
        />
      </q-button>
    </div>
  )
}
