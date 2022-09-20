import { offset } from '@floating-ui/dom'
import { useState } from 'preact/hooks'
import type { DetailedHTMLProps, HTMLAttributes } from 'react'
import {
  AriaTooltipArrowElement,
  AriaTooltipArrowElementAttributes,
  AriaTooltipContentElement,
  AriaTooltipContentElementAttributes,
  AriaTooltipElement,
  AriaTooltipElementAttributes,
  AriaTooltipTriggerElement,
  AriaTooltipTriggerElementAttributes,
  joinElementClasses
} from '../../../../src'
import '../../../../src/elements/aria/aria.tooltip.element'
import { useQueelagElement } from '../../hooks/use.queelag.element'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'q-aria-tooltip': AriaTooltipProps
      'q-aria-tooltip-arrow': AriaTooltipArrowProps
      'q-aria-tooltip-content': AriaTooltipContentProps
      'q-aria-tooltip-trigger': AriaTooltipTriggerProps
    }
  }
}

interface AriaTooltipProps extends AriaTooltipElementAttributes, DetailedHTMLProps<HTMLAttributes<AriaTooltipElement>, AriaTooltipElement> {}

interface AriaTooltipArrowProps
  extends AriaTooltipArrowElementAttributes,
    DetailedHTMLProps<HTMLAttributes<AriaTooltipArrowElement>, AriaTooltipArrowElement> {}

interface AriaTooltipContentProps
  extends AriaTooltipContentElementAttributes,
    DetailedHTMLProps<HTMLAttributes<AriaTooltipContentElement>, AriaTooltipContentElement> {}

interface AriaTooltipTriggerProps
  extends AriaTooltipTriggerElementAttributes,
    DetailedHTMLProps<HTMLAttributes<AriaTooltipTriggerElement>, AriaTooltipTriggerElement> {}

export function AriaTooltip() {
  const { element, ref } = useQueelagElement('q-aria-tooltip', { attribute: { dispatch: true } })
  const [props] = useState<AriaTooltipProps>({})

  return (
    <div>
      <q-aria-tooltip {...props} ref={ref} focusable>
        <q-aria-tooltip-content
          className={joinElementClasses('px-2 py-1 rounded-sm shadow bg-black', !element?.visible && 'opacity-0 pointer-events-none')}
          middlewares={[offset(8)]}
        >
          <span className='text-xs whitespace-nowrap text-white'>ARIA Tooltip Content</span>
          <q-aria-tooltip-arrow className='h-0 w-0 border-x-[8px] border-x-transparent border-b-[8px] border-b-black' />
        </q-aria-tooltip-content>
        <q-aria-tooltip-trigger>
          <q-button className='whitespace-nowrap' tabIndex={-1} native>
            ARIA Tooltip Trigger
          </q-button>
        </q-aria-tooltip-trigger>
      </q-aria-tooltip>
    </div>
  )
}
