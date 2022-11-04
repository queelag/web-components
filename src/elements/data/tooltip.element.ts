import { ElementName, QueryDeclarations } from '@queelag/web'
import { AriaTooltipArrowElement, AriaTooltipContentElement, AriaTooltipElement, AriaTooltipTriggerElement } from '../aria/aria.tooltip.element'

declare global {
  interface HTMLElementTagNameMap {
    'q-tooltip': TooltipElement
    'q-tooltip-arrow': TooltipArrowElement
    'q-tooltip-content': TooltipContentElement
    'q-tooltip-trigger': TooltipTriggerElement
  }
}

export class TooltipElement extends AriaTooltipElement {
  get name(): ElementName {
    return ElementName.TOOLTIP
  }

  static queries: QueryDeclarations = {
    arrowElement: { selector: 'q-tooltip-arrow' },
    contentElement: { selector: 'q-tooltip-content' },
    triggerElement: { selector: 'q-tooltip-trigger' }
  }
}

export class TooltipArrowElement extends AriaTooltipArrowElement {
  get name(): ElementName {
    return ElementName.TOOLTIP_ARROW
  }
}

export class TooltipContentElement extends AriaTooltipContentElement {
  get name(): ElementName {
    return ElementName.TOOLTIP_CONTENT
  }

  static queries: QueryDeclarations = {
    rootElement: { selector: 'q-tooltip', closest: true }
  }
}

export class TooltipTriggerElement extends AriaTooltipTriggerElement {
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
