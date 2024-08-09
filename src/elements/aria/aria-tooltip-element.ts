import { defineCustomElement, KeyboardEventKey } from '@aracna/web'
import { css, type CSSResultGroup, type PropertyDeclarations } from 'lit'
import { AriaTooltipContentController, AriaTooltipController, AriaTooltipTriggerController } from '../../controllers/aria-tooltip-controller.js'
import { ElementName } from '../../definitions/enums.js'
import type {
  AriaTooltipArrowElementEventMap,
  AriaTooltipContentElementEventMap,
  AriaTooltipElementEventMap,
  AriaTooltipTriggerElementEventMap
} from '../../definitions/events.js'
import type { QueryDeclarations } from '../../definitions/interfaces.js'
import { ElementLogger } from '../../loggers/element-logger.js'
import { AracnaBaseElement as BaseElement } from '../core/base-element.js'
import { AracnaFloatingElement as FloatingElement } from '../core/floating-element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-aria-tooltip': AriaTooltipElement
    'aracna-aria-tooltip-arrow': AriaTooltipArrowElement
    'aracna-aria-tooltip-content': AriaTooltipContentElement
    'aracna-aria-tooltip-trigger': AriaTooltipTriggerElement
  }
}

class AriaTooltipElement<E extends AriaTooltipElementEventMap = AriaTooltipElementEventMap> extends BaseElement<E> {
  protected aria: AriaTooltipController = new AriaTooltipController(this)

  /**
   * PROPERTIES
   */
  focusable?: boolean
  showOnMouseEnter?: boolean
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
    ElementLogger.verbose(this.uid, 'onKeyDown', `The tooltip has been hidden.`)
  }

  get name(): ElementName {
    return ElementName.ARIA_TOOLTIP
  }

  static properties: PropertyDeclarations = {
    focusable: { type: Boolean, reflect: true },
    showOnMouseEnter: {
      type: Boolean,
      attribute: 'show-on-mouse-enter',
      reflect: true
    },
    visible: { type: Boolean, reflect: true }
  }

  static queries: QueryDeclarations = {
    arrowElement: { selector: 'aracna-aria-tooltip-arrow' },
    contentElement: { selector: 'aracna-aria-tooltip-content' },
    triggerElement: { selector: 'aracna-aria-tooltip-trigger' }
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

class AriaTooltipArrowElement<E extends AriaTooltipArrowElementEventMap = AriaTooltipArrowElementEventMap> extends BaseElement<E> {
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

class AriaTooltipContentElement<E extends AriaTooltipContentElementEventMap = AriaTooltipContentElementEventMap> extends FloatingElement<E> {
  protected aria: AriaTooltipContentController = new AriaTooltipContentController(this)

  /**
   * QUERIES
   */
  rootElement!: AriaTooltipElement

  get arrowElement(): AriaTooltipArrowElement | undefined {
    return this.rootElement.arrowElement
  }

  get name(): ElementName {
    return ElementName.ARIA_TOOLTIP_CONTENT
  }

  get referenceElement(): AriaTooltipTriggerElement | undefined {
    return this.rootElement.triggerElement
  }

  static queries: QueryDeclarations = {
    rootElement: { selector: 'aracna-aria-tooltip', closest: true }
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

class AriaTooltipTriggerElement<E extends AriaTooltipTriggerElementEventMap = AriaTooltipTriggerElementEventMap> extends BaseElement<E> {
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
    ElementLogger.verbose(this.uid, 'onBlur', `The tooltip has been hidden.`)
  }

  onClick = (): void => {
    this.rootElement.visible = true
    ElementLogger.verbose(this.uid, 'onClick', `The tooltip has been shown.`)
  }

  onFocus = (): void => {
    this.rootElement.visible = true
    ElementLogger.verbose(this.uid, 'onFocus', `The tooltip has been shown.`)
  }

  onMouseEnter = (): void => {
    if (!this.rootElement.showOnMouseEnter) {
      return
    }

    this.rootElement.visible = true
    ElementLogger.verbose(this.uid, 'onMouseEnter', `The tooltip has been shown.`)
  }

  onMouseLeave = (): void => {
    this.rootElement.visible = false
    ElementLogger.verbose(this.uid, 'onMouseLeave', `The tooltip has been hidden.`)
  }

  get name(): ElementName {
    return ElementName.ARIA_TOOLTIP_TRIGGER
  }

  static queries: QueryDeclarations = {
    rootElement: { selector: 'aracna-aria-tooltip', closest: true }
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

defineCustomElement('aracna-aria-tooltip', AriaTooltipElement)
defineCustomElement('aracna-aria-tooltip-arrow', AriaTooltipArrowElement)
defineCustomElement('aracna-aria-tooltip-content', AriaTooltipContentElement)
defineCustomElement('aracna-aria-tooltip-trigger', AriaTooltipTriggerElement)

export {
  AriaTooltipArrowElement as AracnaAriaTooltipArrowElement,
  AriaTooltipContentElement as AracnaAriaTooltipContentElement,
  AriaTooltipElement as AracnaAriaTooltipElement,
  AriaTooltipTriggerElement as AracnaAriaTooltipTriggerElement
}
