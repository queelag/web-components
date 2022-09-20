import { useRef, useState } from 'preact/hooks'
import type { DetailedHTMLProps, HTMLAttributes } from 'react'
import { size, string } from 'superstruct'
import type { InputElement, InputElementAttributes } from '../../../src'
import '../../../src/elements/input.element'
import { useQueelagElement } from '../hooks/use.queelag.element'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'q-input': InputProps
    }
  }
}

interface InputProps extends InputElementAttributes, DetailedHTMLProps<HTMLAttributes<InputElement>, InputElement> {}

export function Input() {
  const { element, ref } = useQueelagElement('q-input')
  const [props] = useState<InputProps>({ type: 'text' })
  const target = useRef({ name: '' })

  return (
    <div className='flex flex-col gap-1'>
      <div className='flex items-center gap-2'>
        <q-input {...props} path='name' target={target.current} ref={ref} placeholder='input' schema={size(string(), 0, 5)} touch-trigger='change' />
        <q-button onClick={() => (element?.obscured ? element.reveal() : element?.obscure())} native normalized>
          <q-icon
            fill='none'
            size={12}
            src={
              element?.obscured
                ? 'https://raw.githubusercontent.com/feathericons/feather/master/icons/eye.svg'
                : 'https://raw.githubusercontent.com/feathericons/feather/master/icons/eye-off.svg'
            }
            stroke='black'
            stroke-width={2.5}
          />
        </q-button>
        <q-button onClick={() => element?.clear()} native normalized>
          <q-icon fill='none' size={16} src='https://raw.githubusercontent.com/feathericons/feather/master/icons/x.svg' stroke='black' stroke-width={2} />
        </q-button>
      </div>
      {element?.isErrorVisible && <span className='text-xs text-red-500'>{element.error}</span>}
    </div>
  )
}
