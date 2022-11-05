import type { RadioButton, RadioGroupElementAttributes } from '@queelag/web'
import { useState } from 'preact/hooks'
import type { DetailedHTMLProps, HTMLAttributes } from 'react'
import type { RadioGroupElement } from '../../../../src'
import '../../../../src/elements/inputs/radio.group.element'
import { FRUITS } from '../../definitions/constants'
import { useQueelagElement } from '../../hooks/use.queelag.element'

declare global {
  namespace preact.createElement.JSX {
    interface IntrinsicElements {
      'q-radio-group': RadioGroupProps
    }
  }
}

interface RadioGroupProps extends RadioGroupElementAttributes, DetailedHTMLProps<HTMLAttributes<RadioGroupElement>, RadioGroupElement> {}

export function RadioGroup() {
  const { element, ref } = useQueelagElement('q-radio-group')
  const [props] = useState<RadioGroupProps>({})
  const [buttons] = useState<RadioButton[]>(FRUITS.slice(4, 7).map((fruit: string) => ({ label: fruit, value: fruit.toLowerCase() })))

  return (
    <div className='flex'>
      <q-radio-group {...props} ref={ref} buttons={buttons} className='flex flex-col' native>
        <div />
      </q-radio-group>
    </div>
  )
}
