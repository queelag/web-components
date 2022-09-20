import { useState } from 'preact/hooks'
import type { DetailedHTMLProps, HTMLAttributes } from 'react'
import type { IconElement, IconElementAttributes } from '../../../src'
import '../../../src/elements/icon.element'
import { useQueelagElement } from '../hooks/use.queelag.element'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'q-icon': IconProps
    }
  }
}

interface IconProps extends IconElementAttributes, DetailedHTMLProps<HTMLAttributes<IconElement>, IconElement> {}

export function Icon() {
  const { element, ref } = useQueelagElement('q-icon')
  const [props] = useState<IconProps>({ src: '' })

  return (
    <div>
      <q-icon
        {...props}
        fill='none'
        ref={ref}
        size={24}
        // src='https://raw.githubusercontent.com/feathericons/feather/master/icons/airplay.svg'
        src={`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-compass"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>`}
        stroke='black'
        stroke-width={1}
      />
    </div>
  )
}
