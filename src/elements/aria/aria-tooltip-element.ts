import { defineCustomElement, KeyboardEventKey } from '@aracna/web'
import { css, type CSSResultGroup, type PropertyDeclarations } from 'lit'
import { AriaTooltipContentController, AriaTooltipController, AriaTooltipTriggerController } from '../../controllers/aria-tooltip-controller.js'
import { ElementSlug } from '../../definitions/enums.js'
import type {
  AriaTooltipArrowElementEventMap,
  AriaTooltipContentElementEventMap,
  AriaTooltipElementEventMap,
  AriaTooltipTriggerElementEventMap
} from '../../definitions/events.js'
import type { QueryDeclarations } from '../../definitions/interfaces.js'
import { TooltipHideEvent } from '../../events/tooltip-hide-event.js'
import { TooltipShowEvent } from '../../events/tooltip-show-event.js'
import { gkek } from '../../functions/gkek.js'
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
   * Properties
   */
  /** */
  focusable?: boolean
  showOnPointerEnter?: boolean
  visible?: boolean

  /**
   * Queries
   */
  /** */
  arrowElement?: AriaTooltipArrowElement
  contentElement?: AriaTooltipContentElement
  triggerElement?: AriaTooltipTriggerElement

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

    ElementLogger.verbose(this.uid, 'onKeyDown', gkek(event), `Hiding the tooltip.`)
    this.hide()
  }

  show(): void {
    this.visible = true
    ElementLogger.verbose(this.uid, 'show', `The tooltip has been shown.`)

    this.dispatchEvent(new TooltipShowEvent())
    ElementLogger.verbose(this.uid, 'show', `The "show" event has been dispatched.`)
  }

  hide(): void {
    this.visible = false
    ElementLogger.verbose(this.uid, 'hide', `The tooltip has been hidden.`)

    this.dispatchEvent(new TooltipHideEvent())
    ElementLogger.verbose(this.uid, 'hide', `The "hide" event has been dispatched.`)
  }

  get slug(): ElementSlug {
    return ElementSlug.ARIA_TOOLTIP
  }

  static properties: PropertyDeclarations = {
    focusable: { type: Boolean, reflect: true },
    showOnPointerEnter: {
      type: Boolean,
      attribute: 'show-on-pointer-enter',
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
  get slug(): ElementSlug {
    return ElementSlug.ARIA_TOOLTIP_ARROW
  }

  static styles: CSSResultGroup = [
    super.styles,
    css`
      :host {
        position: absolute;
      }
    `
  ]
}

class AriaTooltipContentElement<E extends AriaTooltipContentElementEventMap = AriaTooltipContentElementEventMap> extends FloatingElement<E> {
  protected aria: AriaTooltipContentController = new AriaTooltipContentController(this)

  /**
   * Queries
   */
  /** */
  rootElement?: AriaTooltipElement

  get arrowElement(): AriaTooltipArrowElement | undefined {
    return this.rootElement?.arrowElement
  }

  get slug(): ElementSlug {
    return ElementSlug.ARIA_TOOLTIP_CONTENT
  }

  get referenceElement(): AriaTooltipTriggerElement | undefined {
    return this.rootElement?.triggerElement
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
   * Queries
   */
  /** */
  rootElement?: AriaTooltipElement

  connectedCallback(): void {
    super.connectedCallback()

    this.addEventListener('blur', this.onBlur)
    this.addEventListener('click', this.onClick)
    this.addEventListener('focus', this.onFocus)
    this.addEventListener('pointerenter', this.onPointerEnter)
    this.addEventListener('pointerleave', this.onPointerLeave)
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()

    this.removeEventListener('blur', this.onBlur)
    this.removeEventListener('click', this.onClick)
    this.removeEventListener('focus', this.onFocus)
    this.removeEventListener('pointerenter', this.onPointerEnter)
    this.removeEventListener('pointerleave', this.onPointerLeave)
  }

  onBlur = (): void => {
    if (!this.rootElement) {
      return
    }

    ElementLogger.verbose(this.uid, 'onBlur', `Hiding the tooltip.`)
    this.rootElement.hide()
  }

  onClick = (): void => {
    if (!this.rootElement) {
      return
    }

    ElementLogger.verbose(this.uid, 'onClick', `Showing the tooltip.`)
    this.rootElement.show()
  }

  onFocus = (): void => {
    if (!this.rootElement) {
      return
    }

    ElementLogger.verbose(this.uid, 'onFocus', `Showing the tooltip.`)
    this.rootElement.show()
  }

  onPointerEnter = (): void => {
    if (!this.rootElement?.showOnPointerEnter) {
      return
    }

    ElementLogger.verbose(this.uid, 'onPointerEnter', `Showing the tooltip.`)
    this.rootElement.show()
  }

  onPointerLeave = (): void => {
    if (!this.rootElement) {
      return
    }

    ElementLogger.verbose(this.uid, 'onPointerLeave', `Hiding the tooltip.`)
    this.rootElement.hide()
  }

  get slug(): ElementSlug {
    return ElementSlug.ARIA_TOOLTIP_TRIGGER
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
