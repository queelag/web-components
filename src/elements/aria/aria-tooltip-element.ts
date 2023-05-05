import {
  AriaTooltipArrowElementEventMap,
  AriaTooltipContentElementEventMap,
  AriaTooltipElementEventMap,
  AriaTooltipTriggerElementEventMap,
  defineCustomElement,
  ElementName,
  KeyboardEventKey,
  QueryDeclarations,
  WebElementLogger
} from '@aracna/web'
import { css, CSSResultGroup, PropertyDeclarations } from 'lit'
import { AriaTooltipContentController, AriaTooltipController, AriaTooltipTriggerController } from '../../controllers/aria-tooltip-controller.js'
import { BaseElement } from '../core/base-element.js'
import { FloatingElement } from '../core/floating-element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-aria-tooltip': AriaTooltipElement
    'aracna-aria-tooltip-arrow': AriaTooltipArrowElement
    'aracna-aria-tooltip-content': AriaTooltipContentElement
    'aracna-aria-tooltip-trigger': AriaTooltipTriggerElement
  }
}

export class AriaTooltipElement<E extends AriaTooltipElementEventMap = AriaTooltipElementEventMap> extends BaseElement<E> {
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
    WebElementLogger.verbose(this.uid, 'onKeyDown', `The tooltip has been hidden.`)
  }

  get name(): ElementName {
    return ElementName.ARIA_TOOLTIP
  }

  static properties: PropertyDeclarations = {
    focusable: { type: Boolean, reflect: true },
    showOnMouseEnter: { type: Boolean, attribute: 'show-on-mouse-enter', reflect: true },
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

export class AriaTooltipArrowElement<E extends AriaTooltipArrowElementEventMap = AriaTooltipArrowElementEventMap> extends BaseElement<E> {
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

export class AriaTooltipContentElement<E extends AriaTooltipContentElementEventMap = AriaTooltipContentElementEventMap> extends FloatingElement<E> {
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

export class AriaTooltipTriggerElement<E extends AriaTooltipTriggerElementEventMap = AriaTooltipTriggerElementEventMap> extends BaseElement<E> {
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
    if (!this.rootElement.showOnMouseEnter) {
      return
    }

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
