import { ElementName, KeyboardEventKey, QueryDeclarations, WebElementLogger } from '@queelag/web'
import { css, CSSResultGroup, PropertyDeclarations } from 'lit'
import { AriaTooltipContentController, AriaTooltipController, AriaTooltipTriggerController } from '../../controllers/aria.tooltip.controller'
import { BaseElement } from '../core/base.element'
import { FloatingElement } from '../core/floating.element'

declare global {
  interface HTMLElementTagNameMap {
    'q-aria-tooltip': AriaTooltipElement
    'q-aria-tooltip-arrow': AriaTooltipArrowElement
    'q-aria-tooltip-content': AriaTooltipContentElement
    'q-aria-tooltip-trigger': AriaTooltipTriggerElement
  }
}

export class AriaTooltipElement extends BaseElement {
  protected aria: AriaTooltipController = new AriaTooltipController(this)

  /**
   * PROPERTIES
   */
  focusable?: boolean
  visible?: boolean

  /**
   * QUERIES
   */
  arrowElement?: AriaTooltipArrowElement
  contentElement?: AriaTooltipContentElement
  triggerElement!: AriaTooltipTriggerElement

  connectedCallback(): void {
    super.connectedCallback()
    this.addEventListener('keydown', this.onKeyDown)
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()
    this.removeEventListener('keydown', this.onKeyDown)
  }

  onKeyDown = (event: KeyboardEvent): void => {
    if (event.key !== KeyboardEventKey.ESCAPE) {
      return
    }

    this.visible = false
    WebElementLogger.verbose(this.uid, 'onKeyDown', `The tooltip has been hidden.`)
  }

  get name(): ElementName {
    return ElementName.ARIA_TOOLTIP
  }

  static properties: PropertyDeclarations = {
    focusable: { type: Boolean, reflect: true },
    visible: { type: Boolean, reflect: true }
  }

  static queries: QueryDeclarations = {
    arrowElement: { selector: 'q-aria-tooltip-arrow' },
    contentElement: { selector: 'q-aria-tooltip-content' },
    triggerElement: { selector: 'q-aria-tooltip-trigger' }
  }

  static styles: CSSResultGroup = [
    super.styles,
    css`
      :host {
        position: relative;
      }
    `
  ]
}

export class AriaTooltipArrowElement extends BaseElement {
  get name(): ElementName {
    return ElementName.ARIA_TOOLTIP_ARROW
  }

  static styles: CSSResultGroup = [
    super.styles,
    css`
      :host {
        left: 0;
        position: absolute;
        top: 0;
      }
    `
  ]
}

export class AriaTooltipContentElement extends FloatingElement {
  protected aria: AriaTooltipContentController = new AriaTooltipContentController(this)

  /**
   * QUERIES
   */
  rootElement!: AriaTooltipElement

  get arrowElement(): AriaTooltipArrowElement | undefined {
    return this.querySelector('q-aria-tooltip-arrow') || undefined
  }

  get name(): ElementName {
    return ElementName.ARIA_TOOLTIP_CONTENT
  }

  get referenceElement(): AriaTooltipTriggerElement | undefined {
    return this.rootElement.triggerElement
  }

  static queries: QueryDeclarations = {
    rootElement: { selector: 'q-aria-tooltip', closest: true }
  }

  static styles: CSSResultGroup = [
    super.styles,
    css`
      :host {
        left: 0;
        position: absolute;
        top: 0;
      }
    `
  ]
}

export class AriaTooltipTriggerElement extends BaseElement {
  protected aria: AriaTooltipTriggerController = new AriaTooltipTriggerController(this)

  /**
   * QUERIES
   */
  rootElement!: AriaTooltipElement

  connectedCallback(): void {
    super.connectedCallback()

    this.addEventListener('blur', this.onBlur)
    this.addEventListener('click', this.onClick)
    this.addEventListener('focus', this.onFocus)
    this.addEventListener('mouseenter', this.onMouseEnter)
    this.addEventListener('mouseleave', this.onMouseLeave)
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()

    this.removeEventListener('blur', this.onBlur)
    this.removeEventListener('click', this.onClick)
    this.removeEventListener('focus', this.onFocus)
    this.removeEventListener('mouseenter', this.onMouseEnter)
    this.removeEventListener('mouseleave', this.onMouseLeave)
  }

  onBlur = (): void => {
    this.rootElement.visible = false
    WebElementLogger.verbose(this.uid, 'onBlur', `The tooltip has been hidden.`)
  }

  onClick = (): void => {
    this.rootElement.visible = true
    WebElementLogger.verbose(this.uid, 'onClick', `The tooltip has been shown.`)
  }

  onFocus = (): void => {
    this.rootElement.visible = true
    WebElementLogger.verbose(this.uid, 'onFocus', `The tooltip has been shown.`)
  }

  onMouseEnter = (): void => {
    this.rootElement.visible = true
    WebElementLogger.verbose(this.uid, 'onMouseEnter', `The tooltip has been shown.`)
  }

  onMouseLeave = (): void => {
    this.rootElement.visible = false
    WebElementLogger.verbose(this.uid, 'onMouseLeave', `The tooltip has been hidden.`)
  }

  get name(): ElementName {
    return ElementName.ARIA_TOOLTIP_TRIGGER
  }

  static queries: QueryDeclarations = {
    rootElement: { selector: 'q-aria-tooltip', closest: true }
  }

  static styles: CSSResultGroup = [
    super.styles,
    css`
      :host {
        z-index: 1;
      }
    `
  ]
}

customElements.define('q-aria-tooltip', AriaTooltipElement)
customElements.define('q-aria-tooltip-arrow', AriaTooltipArrowElement)
customElements.define('q-aria-tooltip-content', AriaTooltipContentElement)
customElements.define('q-aria-tooltip-trigger', AriaTooltipTriggerElement)
