import { sleep } from '@queelag/core'
import { useState } from 'preact/hooks'
import type { DetailedHTMLProps, HTMLAttributes } from 'react'
import type { ButtonElement, ButtonElementAttributes } from '../../../src'
import '../../../src/elements/button.element'
import type { ClickAsyncEvent } from '../../../src/events/click.async.event'
import { useEventListener } from '../hooks/use.event.listener'
import { useQueelagElement } from '../hooks/use.queelag.element'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'q-button': ButtonProps
    }
  }
}

interface ButtonProps extends ButtonElementAttributes, DetailedHTMLProps<HTMLAttributes<ButtonElement>, ButtonElement> {}

export function Button() {
  const { element, ref } = useQueelagElement('q-button', { attribute: { dispatch: true } })
  const [props] = useState<ButtonProps>({})

  useEventListener(ref, 'click-async', async (event: ClickAsyncEvent) => {
    await sleep(1000)
    event.detail.finalize()
  })

  return (
    <div>
      <q-button {...props} ref={ref} async native>
        <span>{element?.spinning ? 'Spinning' : 'Button'}</span>
      </q-button>
    </div>
  )
}
