import { defineCustomElement } from '@aracna/web'
import { ElementSlug } from '../../definitions/enums.js'
import type {
  TooltipArrowElementEventMap,
  TooltipContentElementEventMap,
  TooltipElementEventMap,
  TooltipTriggerElementEventMap
} from '../../definitions/events.js'
import type { QueryDeclarations } from '../../definitions/interfaces.js'
import {
  AracnaAriaTooltipArrowElement as AriaTooltipArrowElement,
  AracnaAriaTooltipContentElement as AriaTooltipContentElement,
  AracnaAriaTooltipElement as AriaTooltipElement,
  AracnaAriaTooltipTriggerElement as AriaTooltipTriggerElement
} from '../aria/aria-tooltip-element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-tooltip': TooltipElement
    'aracna-tooltip-arrow': TooltipArrowElement
    'aracna-tooltip-content': TooltipContentElement
    'aracna-tooltip-trigger': TooltipTriggerElement
  }
}

class TooltipElement<E extends TooltipElementEventMap = TooltipElementEventMap> extends AriaTooltipElement<E> {
  get slug(): ElementSlug {
    return ElementSlug.TOOLTIP
  }

  static queries: QueryDeclarations = {
    arrowElement: { selector: 'aracna-tooltip-arrow' },
    contentElement: { selector: 'aracna-tooltip-content' },
    triggerElement: { selector: 'aracna-tooltip-trigger' }
  }
}

class TooltipArrowElement<E extends TooltipArrowElementEventMap = TooltipArrowElementEventMap> extends AriaTooltipArrowElement<E> {
  get slug(): ElementSlug {
    return ElementSlug.TOOLTIP_ARROW
  }
}

class TooltipContentElement<E extends TooltipContentElementEventMap = TooltipContentElementEventMap> extends AriaTooltipContentElement<E> {
  get slug(): ElementSlug {
    return ElementSlug.TOOLTIP_CONTENT
  }

  static queries: QueryDeclarations = {
    rootElement: { selector: 'aracna-tooltip', closest: true }
  }
}

class TooltipTriggerElement<E extends TooltipTriggerElementEventMap = TooltipTriggerElementEventMap> extends AriaTooltipTriggerElement<E> {
  get slug(): ElementSlug {
    return ElementSlug.TOOLTIP_TRIGGER
  }

  static queries: QueryDeclarations = {
    rootElement: { selector: 'aracna-tooltip', closest: true }
  }
}

defineCustomElement('aracna-tooltip', TooltipElement)
defineCustomElement('aracna-tooltip-arrow', TooltipArrowElement)
defineCustomElement('aracna-tooltip-content', TooltipContentElement)
defineCustomElement('aracna-tooltip-trigger', TooltipTriggerElement)

export {
  TooltipArrowElement as AracnaTooltipArrowElement,
  TooltipContentElement as AracnaTooltipContentElement,
  TooltipElement as AracnaTooltipElement,
  TooltipTriggerElement as AracnaTooltipTriggerElement
}
