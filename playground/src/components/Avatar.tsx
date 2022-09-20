import { useState } from 'preact/hooks'
import type { DetailedHTMLProps, HTMLAttributes } from 'react'
import type { AvatarElement, AvatarElementAttributes } from '../../../src'
import '../../../src/elements/avatar.element'
import { useQueelagElement } from '../hooks/use.queelag.element'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'q-avatar': AvatarProps
    }
  }
}

interface AvatarProps extends AvatarElementAttributes, DetailedHTMLProps<HTMLAttributes<AvatarElement>, AvatarElement> {}

export function Avatar() {
  const { element, ref } = useQueelagElement('q-avatar')
  const [props] = useState<AvatarProps>({})

  return (
    <div className='flex gap-2'>
      <q-avatar {...props} background='lightgray' ref={ref} shape='circle' size={32}>
        <span className='text-xs'>DS</span>
      </q-avatar>
      <q-avatar {...props} background='lightblue' ref={ref} shape='circle' size={32}>
        <q-icon fill='none' size={16} src='https://raw.githubusercontent.com/feathericons/feather/master/icons/user.svg' stroke='white' stroke-width={2} />
      </q-avatar>
      <q-avatar {...props} background='lightgray' ref={ref} shape='circle' size={32}>
        <q-image src='https://media.wired.co.uk/photos/60c8730fa81eb7f50b44037e/1:1/w_64,h_64,c_limit/1521-WIRED-Cat.jpeg' lazy />
      </q-avatar>
    </div>
  )
}
