import { clearInterval, isIntervalSet, parseNumber, setInterval } from '@aracna/core'
import { KeyboardEventKey, defineCustomElement } from '@aracna/web'
import { type CSSResultGroup, type PropertyDeclarations, css } from 'lit'
import {
  AriaCarouselController,
  AriaCarouselNextSlideControlController,
  AriaCarouselPreviousSlideControlController,
  AriaCarouselRotationControlController,
  AriaCarouselSlideController,
  AriaCarouselSlidesController,
  AriaCarouselTabController,
  AriaCarouselTabsController
} from '../../controllers/aria-carousel-controller.js'
import { DEFAULT_CAROUSEL_ROTATION_DURATION } from '../../definitions/constants.js'
import { ElementName } from '../../definitions/enums.js'
import type {
  AriaCarouselElementEventMap,
  AriaCarouselNextSlideControlElementEventMap,
  AriaCarouselPreviousSlideControlElementEventMap,
  AriaCarouselRotationControlElementEventMap,
  AriaCarouselSlideElementEventMap,
  AriaCarouselSlidesElementEventMap,
  AriaCarouselTabElementEventMap,
  AriaCarouselTabsElementEventMap
} from '../../definitions/events.js'
import type { QueryDeclarations } from '../../definitions/interfaces.js'
import type { AriaLive } from '../../definitions/types.js'
import { CarouselRotationPauseEvent } from '../../events/carousel-rotation-pause-event.js'
import { CarouselRotationResumeEvent } from '../../events/carousel-rotation-resume-event.js'
import { CarouselRotationStartEvent } from '../../events/carousel-rotation-start-event.js'
import { CarouselRotationStopEvent } from '../../events/carousel-rotation-stop-event.js'
import { CarouselSlideActivateEvent } from '../../events/carousel-slide-activate-event.js'
import { CarouselSlideDeactivateEvent } from '../../events/carousel-slide-deactivate-event.js'
import { CarouselTabActivateEvent } from '../../events/carousel-tab-activate-event.js'
import { CarouselTabDeactivateEvent } from '../../events/carousel-tab-deactivate-event.js'
import { ElementLogger } from '../../loggers/element-logger.js'
import { AracnaBaseElement as BaseElement } from '../core/base-element.js'
import { AracnaAriaButtonElement as AriaButtonElement } from './aria-button-element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-aria-carousel': AriaCarouselElement
    'aracna-aria-carousel-next-slide-control': AriaCarouselNextSlideControlElement
    'aracna-aria-carousel-previous-slide-control': AriaCarouselPreviousSlideControlElement
    'aracna-aria-carousel-rotation-control': AriaCarouselRotationControlElement
    'aracna-aria-carousel-slide': AriaCarouselSlideElement
    'aracna-aria-carousel-slides': AriaCarouselSlidesElement
    'aracna-aria-carousel-tab': AriaCarouselTabElement
    'aracna-aria-carousel-tabs': AriaCarouselTabsElement
  }
}

class AriaCarouselElement<E extends AriaCarouselElementEventMap = AriaCarouselElementEventMap> extends BaseElement<E> {
  protected aria: AriaCarouselController = new AriaCarouselController(this)

  /**
   * PROPERTIES
   */
  automaticRotation?: boolean
  automaticRotationIntervalTime?: number
  infiniteRotation?: boolean
  reverseRotation?: boolean

  /**
   * QUERIES
   */
  activeSlideElement?: AriaCarouselSlideElement
  activeTabElement?: AriaCarouselSlideElement
  rotationControlElement?: AriaCarouselRotationControlElement
  slideElements!: AriaCarouselSlideElement[]
  slidesElement!: AriaCarouselSlidesElement
  tabElements!: AriaCarouselTabElement[]
  tabsElement?: AriaCarouselTabsElement

  /**
   * INTERNAL
   */
  forceAutomaticRotation?: boolean

  /**
   * STATES
   */
  temporaryLive?: AriaLive

  attributeChangedCallback(name: string, _old: string | null, value: string | null): void {
    super.attributeChangedCallback(name, _old, value)

    if (Object.is(_old, value)) {
      return
    }

    if (name === 'automatic-rotation') {
      if (isIntervalSet(this.uid)) {
        clearInterval(this.uid)
        ElementLogger.verbose(this.uid, 'attributeChangedCallback', `The automatic rotation has been stopped.`)
      }

      if (typeof value === 'string') {
        setInterval(this.onAutomaticRotation, this.automaticRotationIntervalTime ?? DEFAULT_CAROUSEL_ROTATION_DURATION, this.uid)
        ElementLogger.verbose(this.uid, 'attributeChangedCallback', `The automatic rotation has been started.`)
      }
    }

    if (name === 'automatic-rotation-interval-time' && this.automaticRotation) {
      if (isIntervalSet(this.uid)) {
        clearInterval(this.uid)
        ElementLogger.verbose(this.uid, 'attributeChangedCallback', `The automatic rotation has been stopped.`)
      }

      setInterval(this.onAutomaticRotation, parseNumber(value, DEFAULT_CAROUSEL_ROTATION_DURATION), this.uid)
      ElementLogger.verbose(this.uid, 'attributeChangedCallback', `The automatic rotation has been started.`)
    }
  }

  connectedCallback(): void {
    super.connectedCallback()

    this.addEventListener('focusin', this.onFocusIn)
    this.addEventListener('focusout', this.onFocusOut)
    this.addEventListener('mouseenter', this.onMouseEnter)
    this.addEventListener('mouseleave', this.onMouseLeave)

    if (this.automaticRotation) {
      setInterval(this.onAutomaticRotation, this.automaticRotationIntervalTime ?? DEFAULT_CAROUSEL_ROTATION_DURATION, this.uid)
      ElementLogger.verbose(this.uid, 'connectedCallback', `The automatic rotation has been started.`)
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()

    this.removeEventListener('focusin', this.onFocusIn)
    this.removeEventListener('focusout', this.onFocusOut)
    this.removeEventListener('mouseenter', this.onMouseEnter)
    this.removeEventListener('mouseleave', this.onMouseLeave)

    clearInterval(this.uid)
    ElementLogger.verbose(this.uid, 'disconnectedCallback', `The automatic rotation has been stopped.`)
  }

  onFocusIn(): void {
    this.onFocusInOrMouseEnter('onFocusIn')
  }

  onFocusOut(): void {
    this.onFocusOutOrMouseLeave('onFocusOut')
  }

  onMouseEnter(): void {
    this.onFocusInOrMouseEnter('onMouseEnter')
  }

  onMouseLeave(): void {
    this.onFocusOutOrMouseLeave('onMouseLeave')
  }

  onFocusOutOrMouseLeave(fn: string): void {
    if (this.forceAutomaticRotation || !this.automaticRotation) {
      return ElementLogger.verbose(this.uid, fn, `The automatic rotation is nor enabled nor forced.`)
    }

    setInterval(this.onAutomaticRotation, this.automaticRotationIntervalTime ?? DEFAULT_CAROUSEL_ROTATION_DURATION, this.uid)
    ElementLogger.verbose(this.uid, fn, `The automatic rotation has been started.`)

    this.temporaryLive = undefined
    ElementLogger.verbose(this.uid, fn, `The temporary live state has been unset.`, [this.temporaryLive])

    this.dispatchEvent(new CarouselRotationResumeEvent())
    ElementLogger.verbose(this.uid, fn, `The "rotation-resume" event has been dispatched.`)
  }

  onFocusInOrMouseEnter(fn: string): void {
    if (this.forceAutomaticRotation || !this.automaticRotation) {
      return ElementLogger.verbose(this.uid, fn, `The automatic rotation is nor enabled nor forced.`)
    }

    this.temporaryLive = 'polite'
    ElementLogger.verbose(this.uid, fn, `The temporary live state has been set to polite.`, [this.temporaryLive])

    clearInterval(this.uid)
    ElementLogger.verbose(this.uid, fn, `The automatic rotation has been stopped.`)

    this.dispatchEvent(new CarouselRotationPauseEvent())
    ElementLogger.verbose(this.uid, fn, `The "rotation-pause" event has been dispatched.`)
  }

  onAutomaticRotation = (): void => {
    if (this.reverseRotation) {
      ElementLogger.verbose(this.uid, 'onAutomaticRotation', `Rotation is reversed, activating the previous slide.`)
      return this.activatePreviousSlide()
    }

    ElementLogger.verbose(this.uid, 'onAutomaticRotation', `Activating the next slide.`)
    this.activateNextSlide()
  }

  activateNextSlide(): void {
    if (this.slideElements.length <= 0) {
      return ElementLogger.verbose(this.uid, 'activateNextSlide', `There are no slides.`)
    }

    if (this.activeSlideElementIndex >= this.slideElements.length - 1) {
      if (!this.infiniteRotation) {
        return ElementLogger.verbose(this.uid, 'activateNextSlide', `The rotation is not infinite.`)
      }

      if (this.activeSlideElement) {
        ElementLogger.verbose(this.uid, 'activateNextSlide', `Deactivating the active slide.`, this.activeSlideElement)
        this.activeSlideElement.deactivate()
      }

      if (this.activeTabElement) {
        ElementLogger.verbose(this.uid, 'activateNextSlide', `Deactivating the active tab.`, this.activeTabElement)
        this.activeTabElement.deactivate()
      }

      ElementLogger.verbose(this.uid, 'activateNextSlide', `Activating the first slide.`, this.slideElements[0])
      this.slideElements[0]?.activate()

      if (this.tabElements.length <= 0) {
        return ElementLogger.verbose(this.uid, 'activateNextSlide', `There are no tabs.`)
      }

      ElementLogger.verbose(this.uid, 'activateNextSlide', `Activating the first tab.`, this.tabElements[0])
      this.tabElements[0]?.activate()

      return
    }

    if (this.activeSlideElement) {
      ElementLogger.verbose(this.uid, 'activateNextSlide', `Deactivating the active slide.`, this.activeSlideElement)
      this.activeSlideElement.deactivate()
    }

    if (this.activeTabElement) {
      ElementLogger.verbose(this.uid, 'activateNextSlide', `Deactivating the active tab.`, this.activeTabElement)
      this.activeTabElement.deactivate()
    }

    ElementLogger.verbose(this.uid, 'activateNextSlide', `Activating the next slide.`, this.slideElements[this.activeSlideElementIndex + 1])
    this.slideElements[this.activeSlideElementIndex + 1]?.activate()

    if (this.tabElements.length <= 0) {
      return ElementLogger.verbose(this.uid, 'activateNextSlide', `There are no tabs.`)
    }

    ElementLogger.verbose(this.uid, 'activateNextSlide', `Activating the next tab.`, this.tabElements[this.activeSlideElementIndex + 1])
    this.tabElements[this.activeSlideElementIndex + 1]?.activate()
  }

  activatePreviousSlide(): void {
    if (this.slideElements.length <= 0) {
      return ElementLogger.verbose(this.uid, 'activatePreviousSlide', `There are no slides.`)
    }

    if (this.activeSlideElementIndex <= 0) {
      if (!this.infiniteRotation) {
        return ElementLogger.verbose(this.uid, 'activatePreviousSlide', `The rotation is not infinite.`)
      }

      if (this.activeSlideElement) {
        ElementLogger.verbose(this.uid, 'activatePreviousSlide', `Deactivating the active slide.`, this.activeSlideElement)
        this.activeSlideElement.deactivate()
      }

      if (this.activeTabElement) {
        ElementLogger.verbose(this.uid, 'activatePreviousSlide', `Deactivating the active tab.`, this.activeTabElement)
        this.activeTabElement.deactivate()
      }

      ElementLogger.verbose(this.uid, 'activatePreviousSlide', `Activating the last slide.`, this.slideElements[this.slideElements.length - 1])
      this.slideElements[this.slideElements.length - 1]?.activate()

      if (this.tabElements.length <= 0) {
        return ElementLogger.verbose(this.uid, 'activatePreviousSlide', `There are no tabs.`)
      }

      ElementLogger.verbose(this.uid, 'activatePreviousSlide', `Activating the last tab.`, this.tabElements[this.tabElements.length - 1])
      this.tabElements[this.tabElements.length - 1]?.activate()

      return
    }

    if (this.activeSlideElement) {
      ElementLogger.verbose(this.uid, 'activatePreviousSlide', `Deactivating the active slide.`, this.activeSlideElement)
      this.activeSlideElement.deactivate()
    }

    if (this.activeTabElement) {
      ElementLogger.verbose(this.uid, 'activatePreviousSlide', `Deactivating the active tab.`, this.activeTabElement)
      this.activeTabElement.deactivate()
    }

    ElementLogger.verbose(this.uid, 'activatePreviousSlide', `Activating the previous slide.`, this.slideElements[this.activeSlideElementIndex - 1])
    this.slideElements[this.activeSlideElementIndex - 1]?.activate()

    if (this.tabElements.length <= 0) {
      return ElementLogger.verbose(this.uid, 'activatePreviousSlide', `There are no tabs.`)
    }

    ElementLogger.verbose(this.uid, 'activatePreviousSlide', `Activating the previous tab.`, this.tabElements[this.activeSlideElementIndex - 1])
    this.tabElements[this.activeSlideElementIndex - 1]?.activate()
  }

  get activeSlideElementIndex(): number {
    return this.activeSlideElement ? this.slideElements.indexOf(this.activeSlideElement) : -1
  }

  get name(): ElementName {
    return ElementName.ARIA_CAROUSEL
  }

  static properties: PropertyDeclarations = {
    automaticRotation: {
      type: Boolean,
      attribute: 'automatic-rotation',
      reflect: true
    },
    automaticRotationIntervalTime: {
      type: Number,
      attribute: 'automatic-rotation-interval-time',
      reflect: true
    },
    infiniteRotation: {
      type: Boolean,
      attribute: 'infinite-rotation',
      reflect: true
    },
    reverseRotation: {
      type: Boolean,
      attribute: 'reverse-rotation',
      reflect: true
    },
    temporaryLive: { state: true }
  }

  static queries: QueryDeclarations = {
    activeSlideElement: { selector: 'aracna-aria-carousel-slide[active]' },
    activeTabElement: { selector: 'aracna-aria-carousel-tab[active]' },
    rotationControlElement: {
      selector: 'aracna-aria-carousel-rotation-control'
    },
    slideElements: { selector: 'aracna-aria-carousel-slide', all: true },
    slidesElement: { selector: 'aracna-aria-carousel-slides' },
    tabElements: { selector: 'aracna-aria-carousel-tab', all: true },
    tabsElement: { selector: 'aracna-aria-carousel-tabs' }
  }
}

class AriaCarouselSlidesElement<E extends AriaCarouselSlidesElementEventMap = AriaCarouselSlidesElementEventMap> extends BaseElement<E> {
  protected aria: AriaCarouselSlidesController = new AriaCarouselSlidesController(this)

  /**
   * QUERIES
   */
  rootElement!: AriaCarouselElement

  get name(): ElementName {
    return ElementName.ARIA_CAROUSEL_SLIDES
  }

  static queries: QueryDeclarations = {
    rootElement: { selector: 'aracna-aria-carousel', closest: true }
  }
}

class AriaCarouselSlideElement<E extends AriaCarouselSlideElementEventMap = AriaCarouselSlideElementEventMap> extends BaseElement<E> {
  protected aria: AriaCarouselSlideController = new AriaCarouselSlideController(this)

  /**
   * PROPERTIES
   */
  active?: boolean

  /**
   * QUERIES
   */
  rootElement!: AriaCarouselElement
  slidesElement!: AriaCarouselSlidesElement

  activate(): void {
    let old: AriaCarouselSlideElement | undefined = this.rootElement.activeSlideElement

    this.active = true
    ElementLogger.verbose(this.uid, 'activate', `The slide has been activated.`)

    this.dispatchEvent(new CarouselSlideActivateEvent(old))
    ElementLogger.verbose(this.uid, 'activate', `The "activate" event has been dispatched.`)
  }

  deactivate(): void {
    this.active = false
    ElementLogger.verbose(this.uid, 'deactivate', `The slide has been deactivated.`)

    this.dispatchEvent(new CarouselSlideDeactivateEvent())
    ElementLogger.verbose(this.uid, 'deactivate', `The "deactivate" event has been dispatched.`)
  }

  get index(): number {
    return this.rootElement.slideElements.indexOf(this)
  }

  get name(): ElementName {
    return ElementName.ARIA_CAROUSEL_SLIDE
  }

  static properties: PropertyDeclarations = {
    active: { type: Boolean, reflect: true }
  }

  static queries: QueryDeclarations = {
    rootElement: { selector: 'aracna-aria-carousel', closest: true },
    slidesElement: { selector: 'aracna-aria-carousel-slides', closest: true }
  }
}

class AriaCarouselRotationControlElement<
  E extends AriaCarouselRotationControlElementEventMap = AriaCarouselRotationControlElementEventMap
> extends AriaButtonElement<E> {
  protected aria2: AriaCarouselRotationControlController = new AriaCarouselRotationControlController(this)

  /**
   * QUERIES
   */
  rootElement!: AriaCarouselElement

  onClick(): void {
    this.rootElement.forceAutomaticRotation = true
    ElementLogger.verbose(this.uid, 'onClick', `The automatic rotation has been forced.`)

    this.rootElement.temporaryLive = undefined
    ElementLogger.verbose(this.uid, 'onClick', `The temporary live state has been unset.`, [this.rootElement.temporaryLive])

    if (this.rootElement.automaticRotation) {
      if (isIntervalSet(this.rootElement.uid)) {
        clearInterval(this.rootElement.uid)
        ElementLogger.verbose(this.uid, 'onClick', `The automatic rotation has been stopped.`)
      }

      this.rootElement.automaticRotation = false
      ElementLogger.verbose(this.uid, 'onClick', `The automatic rotation has been disabled.`)

      this.rootElement.dispatchEvent(new CarouselRotationStopEvent())
      ElementLogger.verbose(this.uid, 'onClick', `The "rotation-stop" event has been dispatched.`)

      return
    }

    this.rootElement.automaticRotation = true
    ElementLogger.verbose(this.uid, 'onClick', `The automatic rotation has been enabled.`)

    setInterval(
      this.rootElement.onAutomaticRotation,
      this.rootElement.automaticRotationIntervalTime ?? DEFAULT_CAROUSEL_ROTATION_DURATION,
      this.rootElement.uid
    )
    ElementLogger.verbose(this.uid, 'onClick', `The automatic rotation has been started.`)

    this.rootElement.dispatchEvent(new CarouselRotationStartEvent())
    ElementLogger.verbose(this.uid, 'onClick', `The "rotation-start" event has been dispatched.`)
  }

  get name(): ElementName {
    return ElementName.ARIA_CAROUSEL_ROTATION_CONTROL
  }

  static queries: QueryDeclarations = {
    rootElement: { selector: 'aracna-aria-carousel', closest: true }
  }
}

class AriaCarouselNextSlideControlElement<
  E extends AriaCarouselNextSlideControlElementEventMap = AriaCarouselNextSlideControlElementEventMap
> extends AriaButtonElement<E> {
  protected aria2: AriaCarouselNextSlideControlController = new AriaCarouselNextSlideControlController(this)

  /**
   * QUERIES
   */
  rootElement!: AriaCarouselElement

  onClick(): void {
    ElementLogger.verbose(this.uid, 'onClick', `Activating the next slide.`)
    this.rootElement.activateNextSlide()
  }

  get name(): ElementName {
    return ElementName.ARIA_CAROUSEL_NEXT_SLIDE_CONTROL
  }

  static queries: QueryDeclarations = {
    rootElement: { selector: 'aracna-aria-carousel', closest: true }
  }
}

class AriaCarouselPreviousSlideControlElement<
  E extends AriaCarouselPreviousSlideControlElementEventMap = AriaCarouselPreviousSlideControlElementEventMap
> extends AriaButtonElement<E> {
  protected aria2: AriaCarouselPreviousSlideControlController = new AriaCarouselPreviousSlideControlController(this)

  /**
   * QUERIES
   */
  rootElement!: AriaCarouselElement

  onClick(): void {
    ElementLogger.verbose(this.uid, 'onClick', `Activating the previous slide.`)
    this.rootElement.activatePreviousSlide()
  }

  get name(): ElementName {
    return ElementName.ARIA_CAROUSEL_PREVIOUS_SLIDE_CONTROL
  }

  static queries: QueryDeclarations = {
    rootElement: { selector: 'aracna-aria-carousel', closest: true }
  }
}

class AriaCarouselTabsElement<E extends AriaCarouselTabsElementEventMap = AriaCarouselTabsElementEventMap> extends BaseElement<E> {
  protected aria: AriaCarouselTabsController = new AriaCarouselTabsController(this)

  /**
   * QUERIES
   */
  activeTabElement?: AriaCarouselTabElement
  focusedTabElement?: AriaCarouselTabElement
  rootElement!: AriaCarouselElement
  tabElements!: AriaCarouselTabElement[]

  connectedCallback(): void {
    super.connectedCallback()
    this.addEventListener('keydown', this.onKeyDown)
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()
    this.removeEventListener('keydown', this.onKeyDown)
  }

  onKeyDown(event: KeyboardEvent): void {
    switch (event.key) {
      case KeyboardEventKey.ARROW_LEFT:
      case KeyboardEventKey.ARROW_RIGHT:
      case KeyboardEventKey.END:
      case KeyboardEventKey.HOME:
        event.preventDefault()
        event.stopPropagation()
    }

    switch (event.key) {
      case KeyboardEventKey.ARROW_LEFT:
        ElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_LEFT', `Activating the previous slide.`)
        this.rootElement.activatePreviousSlide()

        break
      case KeyboardEventKey.ARROW_RIGHT:
        this.rootElement.activateNextSlide()
        ElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_RIGHT', `Activating the next slide.`)

        break
      case KeyboardEventKey.END:
        if (this.activeTabElement) {
          ElementLogger.verbose(this.uid, 'onKeyDown', 'END', `Deactivating the active tab.`, this.activeTabElement)
          this.activeTabElement.deactivate()
        }

        if (this.rootElement.activeSlideElement) {
          ElementLogger.verbose(this.uid, 'onKeyDown', 'END', `Deactivating the active slide.`, this.rootElement.activeSlideElement)
          this.rootElement.activeSlideElement.deactivate()
        }

        this.tabElements[this.tabElements.length - 1]?.focus()
        ElementLogger.verbose(this.uid, 'onKeyDown', 'END', `The last tab has been focused.`, this.tabElements[this.tabElements.length - 1])

        ElementLogger.verbose(this.uid, 'onKeyDown', 'END', `Activating the last tab.`, this.tabElements[this.tabElements.length - 1])
        this.tabElements[this.tabElements.length - 1]?.activate()

        ElementLogger.verbose(this.uid, 'onKeyDown', 'END', `Activating the last slide.`, this.rootElement.slideElements[this.tabElements.length - 1])
        this.rootElement.slideElements[this.tabElements.length - 1]?.activate()

        break
      case KeyboardEventKey.HOME:
        if (this.activeTabElement) {
          ElementLogger.verbose(this.uid, 'onKeyDown', 'HOME', `Deactivating the active tab.`, this.activeTabElement)
          this.activeTabElement.deactivate()
        }

        if (this.rootElement.activeSlideElement) {
          ElementLogger.verbose(this.uid, 'onKeyDown', 'HOME', `Deactivating the active slide.`, this.rootElement.activeSlideElement)
          this.rootElement.activeSlideElement.deactivate()
        }

        this.tabElements[0]?.focus()
        ElementLogger.verbose(this.uid, 'onKeyDown', 'HOME', `The first tab has been focused.`, this.tabElements[0])

        ElementLogger.verbose(this.uid, 'onKeyDown', 'HOME', `Activating the first tab.`, this.tabElements[0])
        this.tabElements[0]?.activate()

        ElementLogger.verbose(this.uid, 'onKeyDown', 'HOME', `Activating the first slide.`, this.rootElement.slideElements[0])
        this.rootElement.slideElements[0]?.activate()

        break
    }
  }

  get activeTabElementIndex(): number {
    return this.activeTabElement ? this.tabElements.indexOf(this.activeTabElement) : -1
  }

  get name(): ElementName {
    return ElementName.ARIA_CAROUSEL_TABS
  }

  static queries: QueryDeclarations = {
    activeTabElement: { selector: 'aracna-aria-carousel-tab[active]' },
    focusedTabElement: { selector: 'aracna-aria-carousel-tab:focus' },
    rootElement: { selector: 'aracna-aria-carousel', closest: true },
    tabElements: { selector: 'aracna-aria-carousel-tab', all: true }
  }
}

class AriaCarouselTabElement<E extends AriaCarouselTabElementEventMap = AriaCarouselTabElementEventMap> extends BaseElement<E> {
  protected aria: AriaCarouselTabController = new AriaCarouselTabController(this)

  /**
   * PROPERTIES
   */
  active?: boolean

  /**
   * QUERIES
   */
  rootElement!: AriaCarouselElement
  tabsElement!: AriaCarouselTabsElement

  connectedCallback(): void {
    super.connectedCallback()
    this.addEventListener('click', this.onClick)
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()
    this.removeEventListener('click', this.onClick)
  }

  onClick(): void {
    if (this.tabsElement.activeTabElement) {
      ElementLogger.verbose(this.uid, 'onClick', `Deactivating the active tab.`, this.tabsElement.activeTabElement)
      this.tabsElement.activeTabElement.deactivate()
    }

    if (this.rootElement.activeSlideElement) {
      ElementLogger.verbose(this.uid, 'onClick', `Deactivating the active slide.`, this.rootElement.activeSlideElement)
      this.rootElement.activeSlideElement.deactivate()
    }

    this.active = true
    ElementLogger.verbose(this.uid, 'onClick', `The tab has been activated.`)

    ElementLogger.verbose(this.uid, 'onClick', `The matching slide has been activated.`, this.rootElement.slideElements[this.index])
    this.rootElement.slideElements[this.index]?.activate()
  }

  activate(): void {
    let old: AriaCarouselTabElement | undefined = this.tabsElement.activeTabElement

    this.active = true
    ElementLogger.verbose(this.uid, 'activate', `The tab has been activated.`)

    if (this.tabsElement.focusedTabElement) {
      this.focus()
      ElementLogger.verbose(this.uid, 'activate', `The tab has been focused.`)
    }

    this.dispatchEvent(new CarouselTabActivateEvent(old))
    ElementLogger.verbose(this.uid, 'activate', `The "activate" event has been dispatched.`)
  }

  deactivate(): void {
    this.active = false
    ElementLogger.verbose(this.uid, 'deactivate', `The tab has been deactivated.`)

    this.dispatchEvent(new CarouselTabDeactivateEvent())
    ElementLogger.verbose(this.uid, 'deactivate', `The "deactivate" event has been dispatched.`)
  }

  get index(): number {
    return this.tabsElement.tabElements?.indexOf(this)
  }

  get name(): ElementName {
    return ElementName.ARIA_CAROUSEL_TAB
  }

  static properties: PropertyDeclarations = {
    active: { type: Boolean, reflect: true }
  }

  static queries: QueryDeclarations = {
    rootElement: { selector: 'aracna-aria-carousel', closest: true },
    tabsElement: { selector: 'aracna-aria-carousel-tabs', closest: true }
  }

  static styles: CSSResultGroup = [
    super.styles,
    css`
      :host {
        cursor: pointer;
      }
    `
  ]
}

defineCustomElement('aracna-aria-carousel', AriaCarouselElement)
defineCustomElement('aracna-aria-carousel-next-slide-control', AriaCarouselNextSlideControlElement)
defineCustomElement('aracna-aria-carousel-previous-slide-control', AriaCarouselPreviousSlideControlElement)
defineCustomElement('aracna-aria-carousel-rotation-control', AriaCarouselRotationControlElement)
defineCustomElement('aracna-aria-carousel-slide', AriaCarouselSlideElement)
defineCustomElement('aracna-aria-carousel-slides', AriaCarouselSlidesElement)
defineCustomElement('aracna-aria-carousel-tab', AriaCarouselTabElement)
defineCustomElement('aracna-aria-carousel-tabs', AriaCarouselTabsElement)

export {
  AriaCarouselElement as AracnaAriaCarouselElement,
  AriaCarouselNextSlideControlElement as AracnaAriaCarouselNextSlideControlElement,
  AriaCarouselPreviousSlideControlElement as AracnaAriaCarouselPreviousSlideControlElement,
  AriaCarouselRotationControlElement as AracnaAriaCarouselRotationControlElement,
  AriaCarouselSlideElement as AracnaAriaCarouselSlideElement,
  AriaCarouselSlidesElement as AracnaAriaCarouselSlidesElement,
  AriaCarouselTabElement as AracnaAriaCarouselTabElement,
  AriaCarouselTabsElement as AracnaAriaCarouselTabsElement
}
