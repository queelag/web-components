import {
  ElementName,
  QueryDeclarations,
  TooltipArrowElementEventMap,
  TooltipContentElementEventMap,
  TooltipElementEventMap,
  TooltipTriggerElementEventMap
} from '@queelag/web'
import { AriaTooltipArrowElement, AriaTooltipContentElement, AriaTooltipElement, AriaTooltipTriggerElement } from '../aria/aria.tooltip.element'

declare global {
  interface HTMLElementTagNameMap {
    'q-tooltip': TooltipElement
    'q-tooltip-arrow': TooltipArrowElement
    'q-tooltip-content': TooltipContentElement
    'q-tooltip-trigger': TooltipTriggerElement
  }
}

export class TooltipElement<E extends TooltipElementEventMap = TooltipElementEventMap> extends AriaTooltipElement<E> {
  get name(): ElementName {
    return ElementName.TOOLTIP
  }

  static queries: QueryDeclarations = {
    arrowElement: { selector: 'q-tooltip-arrow' },
    contentElement: { selector: 'q-tooltip-content' },
    triggerElement: { selector: 'q-tooltip-trigger' }
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
    rootElement: { selector: 'q-tooltip', closest: true }
  }
}

export class TooltipTriggerElement<E extends TooltipTriggerElementEventMap = TooltipTriggerElementEventMap> extends AriaTooltipTriggerElement<E> {
  get name(): ElementName {
    return ElementName.TOOLTIP_TRIGGER
  }

  static queries: QueryDeclarations = {
    rootElement: { selector: 'q-tooltip', closest: true }
  }
}

customElements.define('q-tooltip', TooltipElement)
customElements.define('q-tooltip-arrow', TooltipArrowElement)
customElements.define('q-tooltip-content', TooltipContentElement)
customElements.define('q-tooltip-trigger', TooltipTriggerElement)
