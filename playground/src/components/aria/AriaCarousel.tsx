import { useState } from 'preact/hooks'
import type { DetailedHTMLProps, HTMLAttributes } from 'react'
import {
  AriaCarouselElement,
  AriaCarouselElementAttributes,
  AriaCarouselNextSlideControlElement,
  AriaCarouselNextSlideControlElementAttributes,
  AriaCarouselPreviousSlideControlElement,
  AriaCarouselPreviousSlideControlElementAttributes,
  AriaCarouselRotationControlElement,
  AriaCarouselRotationControlElementAttributes,
  AriaCarouselSlideElement,
  AriaCarouselSlideElementAttributes,
  AriaCarouselSlidesElement,
  AriaCarouselSlidesElementAttributes,
  AriaCarouselTabElement,
  AriaCarouselTabElementAttributes,
  AriaCarouselTabsElement,
  AriaCarouselTabsElementAttributes,
  joinElementClasses
} from '../../../../src'
import '../../../../src/elements/aria/aria.carousel.element'
import { useQueelagElement } from '../../hooks/use.queelag.element'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'q-aria-carousel': AriaCarouselProps
      'q-aria-carousel-next-slide-control': AriaCarouselNextSlideControlProps
      'q-aria-carousel-previous-slide-control': AriaCarouselPreviousSlideControlProps
      'q-aria-carousel-rotation-control': AriaCarouselRotationControlProps
      'q-aria-carousel-slide': AriaCarouselSlideProps
      'q-aria-carousel-slides': AriaCarouselSlidesProps
      'q-aria-carousel-tab': AriaCarouselTabProps
      'q-aria-carousel-tabs': AriaCarouselTabsProps
    }
  }
}

interface AriaCarouselProps extends AriaCarouselElementAttributes, DetailedHTMLProps<HTMLAttributes<AriaCarouselElement>, AriaCarouselElement> {}

interface AriaCarouselNextSlideControlProps
  extends AriaCarouselNextSlideControlElementAttributes,
    DetailedHTMLProps<HTMLAttributes<AriaCarouselNextSlideControlElement>, AriaCarouselNextSlideControlElement> {}

interface AriaCarouselPreviousSlideControlProps
  extends AriaCarouselPreviousSlideControlElementAttributes,
    DetailedHTMLProps<HTMLAttributes<AriaCarouselPreviousSlideControlElement>, AriaCarouselPreviousSlideControlElement> {}

interface AriaCarouselRotationControlProps
  extends AriaCarouselRotationControlElementAttributes,
    DetailedHTMLProps<HTMLAttributes<AriaCarouselRotationControlElement>, AriaCarouselRotationControlElement> {}

interface AriaCarouselSlideProps
  extends AriaCarouselSlideElementAttributes,
    DetailedHTMLProps<HTMLAttributes<AriaCarouselSlideElement>, AriaCarouselSlideElement> {}

interface AriaCarouselSlidesProps
  extends AriaCarouselSlidesElementAttributes,
    DetailedHTMLProps<HTMLAttributes<AriaCarouselSlidesElement>, AriaCarouselSlidesElement> {}

interface AriaCarouselTabProps extends AriaCarouselTabElementAttributes, DetailedHTMLProps<HTMLAttributes<AriaCarouselTabElement>, AriaCarouselTabElement> {}

interface AriaCarouselTabsProps
  extends AriaCarouselTabsElementAttributes,
    DetailedHTMLProps<HTMLAttributes<AriaCarouselTabsElement>, AriaCarouselTabsElement> {}

export function AriaCarousel() {
  const { element, ref } = useQueelagElement('q-aria-carousel', { attribute: { dispatch: true } })
  const [props] = useState<AriaCarouselProps>({})
  const [slides] = useState<string[]>([
    'https://images.unsplash.com/photo-1533883355737-25ab4d1fbefb',
    'https://images.unsplash.com/photo-1462688681110-15bc88b1497c',
    'https://images.unsplash.com/photo-1571774367564-5037461020a3'
  ])

  return (
    <div>
      <q-aria-carousel
        {...props}
        ref={ref}
        className='relative w-96 aspect-video flex justify-center'
        automatic-rotation-interval-time={2000}
        // automatic-rotation
        infinite-rotation
        //
      >
        <q-aria-carousel-slides className='relative w-full rounded-sm overflow-hidden'>
          {slides.map((slide: string, index: number) => (
            <AriaCarouselSlide index={index} slide={slide} />
          ))}
        </q-aria-carousel-slides>
        <q-aria-carousel-tabs className='absolute bottom-2'>
          {slides.map((_, index: number) => (
            <AriaCarouselTab index={index} />
          ))}
        </q-aria-carousel-tabs>
        <div className='absolute bottom-0 right-0 flex justify-between items-center p-1 gap-2 text-xs'>
          <q-aria-carousel-rotation-control className='px-2 py-1 rounded-sm bg-black'>
            <span className='uppercase text-white'>{element?.automaticRotation ? 'Stop' : 'Start'}</span>
          </q-aria-carousel-rotation-control>
          {/* <q-aria-carousel-previous-slide-control className='px-2 py-1 rounded-sm bg-black'>
            <span className='uppercase text-white'>Prev</span>
          </q-aria-carousel-previous-slide-control>
          <q-aria-carousel-next-slide-control className='px-2 py-1 rounded-sm bg-black'>
            <span className='uppercase text-white'>Next</span>
          </q-aria-carousel-next-slide-control> */}
        </div>
      </q-aria-carousel>
    </div>
  )
}

function AriaCarouselSlide({ index, slide }: any) {
  const { element, ref } = useQueelagElement('q-aria-carousel-slide', { attribute: { dispatch: true } })

  return (
    <q-aria-carousel-slide ref={ref} active={index <= 0} className={joinElementClasses('absolute inset-0', !element?.active && 'hidden')}>
      <q-image className='w-full' src={slide + '?w=768'} />
    </q-aria-carousel-slide>
  )
}

function AriaCarouselTab({ index }: any) {
  const { element, ref } = useQueelagElement('q-aria-carousel-tab', { attribute: { dispatch: true } })

  return (
    <q-aria-carousel-tab ref={ref} active={index <= 0}>
      <q-icon
        fill='white'
        size={14}
        src={
          element?.active
            ? 'https://raw.githubusercontent.com/feathericons/feather/master/icons/disc.svg'
            : 'https://raw.githubusercontent.com/feathericons/feather/master/icons/circle.svg'
        }
        stroke='black'
        stroke-width={2}
      />
    </q-aria-carousel-tab>
  )
}
