import {
  defineCustomElement,
  ElementName,
  QueryDeclarations,
  TooltipArrowElementEventMap,
  TooltipContentElementEventMap,
  TooltipElementEventMap,
  TooltipTriggerElementEventMap
} from '@aracna/web'
import { AriaTooltipArrowElement, AriaTooltipContentElement, AriaTooltipElement, AriaTooltipTriggerElement } from '../aria/aria-tooltip-element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-tooltip': TooltipElement
    'aracna-tooltip-arrow': TooltipArrowElement
    'aracna-tooltip-content': TooltipContentElement
    'aracna-tooltip-trigger': TooltipTriggerElement
  }
}

export class TooltipElement<E extends TooltipElementEventMap = TooltipElementEventMap> extends AriaTooltipElement<E> {
  get name(): ElementName {
    return ElementName.TOOLTIP
  }

  static queries: QueryDeclarations = {
    arrowElement: { selector: 'aracna-tooltip-arrow' },
    contentElement: { selector: 'aracna-tooltip-content' },
    triggerElement: { selector: 'aracna-tooltip-trigger' }
  }
}

export class TooltipArrowElement<E extends TooltipArrowElementEventMap = TooltipArrowElementEventMap> extends AriaTooltipArrowElement<E> {
  get name(): ElementName {
    return ElementName.TOOLTIP_ARROW
  }
}

export class TooltipContentElement<E extends TooltipContentElementEventMap = TooltipContentElementEventMap> extends AriaTooltipContentElement<E> {
  get name(): ElementName {
    return ElementName.TOOLTIP_CONTENT
  }

  static queries: QueryDeclarations = {
    rootElement: { selector: 'aracna-tooltip', closest: true }
  }
}

export class TooltipTriggerElement<E extends TooltipTriggerElementEventMap = TooltipTriggerElementEventMap> extends AriaTooltipTriggerElement<E> {
  get name(): ElementName {
    return ElementName.TOOLTIP_TRIGGER
  }

  static queries: QueryDeclarations = {
    rootElement: { selector: 'aracna-tooltip', closest: true }
  }
}

defineCustomElement('aracna-tooltip', TooltipElement)
defineCustomElement('aracna-tooltip-arrow', TooltipArrowElement)
defineCustomElement('aracna-tooltip-content', TooltipContentElement)
defineCustomElement('aracna-tooltip-trigger', TooltipTriggerElement)
