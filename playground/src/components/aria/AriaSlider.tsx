import { getLowestNumber, getNumbersDistance } from '@queelag/core'
import { useState } from 'preact/hooks'
import type { DetailedHTMLProps, HTMLAttributes } from 'react'
import {
  AriaSliderElement,
  AriaSliderElementAttributes,
  AriaSliderThumbElement,
  AriaSliderThumbElementAttributes,
  getAriaSliderThumbElementPercentage,
  getAriaSliderThumbElementStyleLeft,
  getAriaSliderThumbElementStyleTop,
  joinElementClasses,
  Orientation
} from '../../../../src'
import '../../../../src/elements/aria/aria.slider.element'
import type { AriaSliderChangeEvent } from '../../../../src/events/slider.change.event'
import { useEventListener } from '../../hooks/use.event.listener'
import { useQueelagElement } from '../../hooks/use.queelag.element'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'q-aria-slider': AriaSliderProps
      'q-aria-slider-thumb': AriaSliderThumbProps
    }
  }
}

interface AriaSliderProps extends AriaSliderElementAttributes, DetailedHTMLProps<HTMLAttributes<AriaSliderElement>, AriaSliderElement> {}
interface AriaSliderThumbProps extends AriaSliderThumbElementAttributes, DetailedHTMLProps<HTMLAttributes<AriaSliderThumbElement>, AriaSliderThumbElement> {}

export function AriaSlider() {
  const { element, ref } = useQueelagElement('q-aria-slider')
  const [props] = useState<AriaSliderProps>({})
  const [orientation] = useState<Orientation>('horizontal')
  const [percentages, setPercentages] = useState<number[]>([25, 75])

  useEventListener(ref, 'slider-change', (event: AriaSliderChangeEvent) => {
    setPercentages(event.detail.percentages)
  })

  return (
    <div>
      <q-aria-slider
        {...props}
        ref={ref}
        className={joinElementClasses('relative flex justify-center items-center', element?.isOrientationVertical ? 'w-5 h-64' : 'w-64 h-5')}
        minimum-distance={20}
        orientation={orientation}
        disable-swap
      >
        <div className={joinElementClasses('rounded-sm bg-gray-200', element?.isOrientationVertical ? 'w-1 h-full' : 'w-full h-1')} />
        {element?.hasMultipleThumbs && (
          <div
            className={joinElementClasses('absolute bg-blue-200', element.isOrientationVertical ? 'w-1' : 'h-1')}
            style={
              element.isOrientationVertical
                ? {
                    height: getNumbersDistance(percentages[0], percentages[1]) + '%',
                    top: getLowestNumber(percentages) + '%'
                  }
                : {
                    left: getLowestNumber(percentages) + '%',
                    width: getNumbersDistance(percentages[0], percentages[1]) + '%'
                  }
            }
          />
        )}
        <AriaSliderThumb orientation={orientation} value={25} />
        {/* <AriaSliderThumb orientation={orientation} value={75} /> */}
      </q-aria-slider>
    </div>
  )
}

function AriaSliderThumb({ orientation, value }: any) {
  const { element, ref } = useQueelagElement('q-aria-slider-thumb')
  const [percentage] = useState<number>(getAriaSliderThumbElementPercentage(value))
  // const [percentage, setPercentage] = useState<number>(getAriaSliderThumbElementPercentage(value))

  // useEventListener(ref, 'slider-thumb-move', (event: AriaSliderThumbMoveEvent) => {
  //   setPercentage(event.detail.percentage)
  // })

  return (
    <q-aria-slider-thumb
      background='#2563eb'
      className={joinElementClasses('w-5 h-5 outline-none rounded-full transition duration-200', 'hover:ring-4 focus:ring-4 active:ring-8 ring-blue-100')}
      default-value={value}
      ref={ref}
      shape='circle'
      size={20}
      style={{
        left: getAriaSliderThumbElementStyleLeft(percentage, orientation),
        top: getAriaSliderThumbElementStyleTop(percentage, orientation)
      }}
      // disable-compute-position
      // value={value}
    />
  )
}
