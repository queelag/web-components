import { sleep } from '@queelag/core'
import { useState } from 'preact/hooks'
import type { DetailedHTMLProps, HTMLAttributes } from 'react'
import type { FormElement, FormElementAttributes, SubmitAsyncEvent } from '../../../src'
import '../../../src/elements/form.element'
import { useEventListener } from '../hooks/use.event.listener'
import { useQueelagElement } from '../hooks/use.queelag.element'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'q-form': FormProps
    }
  }
}

interface FormProps extends FormElementAttributes, DetailedHTMLProps<HTMLAttributes<FormElement>, FormElement> {}

export function Form() {
  const { element, ref } = useQueelagElement('q-form')
  const [props] = useState<FormProps>({})

  useEventListener(ref, 'submit-async', async (event: SubmitAsyncEvent) => {
    await sleep(1000)
    event.detail.finalize()
  })

  return (
    <div className='flex gap-2'>
      <q-form {...props} ref={ref}>
        <q-input placeholder='input inside form' type='text' />
      </q-form>
    </div>
  )
}
