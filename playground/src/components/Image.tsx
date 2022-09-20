import { useState } from 'preact/hooks'
import type { DetailedHTMLProps, HTMLAttributes } from 'react'
import type { ImageElement, ImageElementAttributes } from '../../../src'
import '../../../src/elements/image.element'
import { useQueelagElement } from '../hooks/use.queelag.element'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'q-image': ImageProps
    }
  }
}

interface ImageProps extends ImageElementAttributes, DetailedHTMLProps<HTMLAttributes<ImageElement>, ImageElement> {}

export function Image() {
  const { element, ref } = useQueelagElement('q-image')
  const [props] = useState<ImageProps>({ src: '' })

  return (
    <div>
      <q-image
        {...props}
        cache-quality={0}
        cache-type='image/jpeg'
        ref={ref}
        shape='squircle'
        size={128}
        src='https://media.wired.co.uk/photos/60c8730fa81eb7f50b44037e/1:1/w_256,h_256,c_limit/1521-WIRED-Cat.jpeg'
        // cache
        eager
      />
      {/* <q-image
        {...props}
        ref={ref}
        size={128}
        src='https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/1200px-Cat03.jpg'
        cache
      /> */}
    </div>
  )
}
