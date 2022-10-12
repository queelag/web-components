import { Interval } from '@queelag/core'
import {
  AriaLive,
  CarouselSlideActivateEvent,
  CarouselSlideDeactivateEvent,
  DEFAULT_CAROUSEL_ROTATION_DURATION,
  ElementName,
  KeyboardEventKey,
  QueryDeclarations,
  WebElementLogger
} from '@queelag/web'
import { css, CSSResultGroup, PropertyDeclarations } from 'lit'
import {
  AriaCarouselController,
  AriaCarouselNextSlideControlController,
  AriaCarouselPreviousSlideControlController,
  AriaCarouselRotationControlController,
  AriaCarouselSlideController,
  AriaCarouselSlidesController,
  AriaCarouselTabController,
  AriaCarouselTabsController
} from '../../controllers/aria.carousel.controller'
import { BaseElement } from '../core/base.element'
import { AriaButtonElement } from './aria.button.element'

declare global {
  interface HTMLElementTagNameMap {
    'q-aria-carousel': AriaCarouselElement
    'q-aria-carousel-next-slide-control': AriaCarouselNextSlideControlElement
    'q-aria-carousel-previous-slide-control': AriaCarouselPreviousSlideControlElement
    'q-aria-carousel-rotation-control': AriaCarouselRotationControlElement
    'q-aria-carousel-slide': AriaCarouselSlideElement
    'q-aria-carousel-slides': AriaCarouselSlidesElement
    'q-aria-carousel-tab': AriaCarouselTabElement
    'q-aria-carousel-tabs': AriaCarouselTabsElement
  }
}

export class AriaCarouselElement extends BaseElement {
  protected aria: AriaCarouselController = new AriaCarouselController(this)

  /**
   * PROPERTIES
   */
  automaticRotation?: boolean
  automaticRotationIntervalTime?: number
  forceAutomaticRotation?: boolean
  infiniteRotation?: boolean

  /**
   * QUERIES
   */
  activeSlideElement?: AriaCarouselSlideElement
  activeTabElement?: AriaCarouselSlideElement
  slideElements!: AriaCarouselSlideElement[]
  slidesElement!: AriaCarouselSlidesElement
  tabElements!: AriaCarouselTabElement[]
  tabsElement?: AriaCarouselTabsElement

  /**
   * STATES
   */
  live?: AriaLive

  connectedCallback(): void {
    super.connectedCallback()

    this.addEventListener('blur', this.onBlur)
    this.addEventListener('focus', this.onFocus)
    this.addEventListener('mouseenter', this.onMouseEnter)
    this.addEventListener('mouseleave', this.onMouseLeave)

    if (this.automaticRotation) {
      Interval.start(this.uid, this.activateNextSlide, this.automaticRotationIntervalTime ?? DEFAULT_CAROUSEL_ROTATION_DURATION)
      WebElementLogger.verbose(this.uid, 'connectedCallback', `The automatic rotation has been started.`)

      return
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()

    this.removeEventListener('blur', this.onBlur)
    this.removeEventListener('focus', this.onFocus)
    this.removeEventListener('mouseenter', this.onMouseEnter)
    this.removeEventListener('mouseleave', this.onMouseLeave)

    Interval.stop(this.uid)
    WebElementLogger.verbose(this.uid, 'disconnectedCallback', `The automatic rotation has been stopped.`)
  }

  onBlur = (): void => {
    this.onBlurOrMouseLeave()
  }

  onFocus = (): void => {
    this.onFocusOrMouseEnter()
  }

  onMouseEnter = (): void => {
    this.onFocusOrMouseEnter()
  }

  onMouseLeave = (): void => {
    this.onBlurOrMouseLeave()
  }

  onBlurOrMouseLeave = (): void => {
    if (this.forceAutomaticRotation || !this.automaticRotation) {
      return
    }

    Interval.stop(this.uid)

    Interval.start(this.uid, this.activateNextSlide, this.automaticRotationIntervalTime ?? DEFAULT_CAROUSEL_ROTATION_DURATION)
    WebElementLogger.verbose(this.uid, 'onBlur', `The automatic rotation has been started.`)

    this.live = undefined
    WebElementLogger.verbose(this.uid, 'onBlur', `The temporary live state has been unset.`)
  }

  onFocusOrMouseEnter = (): void => {
    if (this.forceAutomaticRotation || !this.automaticRotation) {
      return
    }

    this.live = 'polite'
    WebElementLogger.verbose(this.uid, 'onFocus', `The temporary live state has been set to polite.`)

    Interval.stop(this.uid)
    WebElementLogger.verbose(this.uid, 'onFocus', `The automatic rotation has been stopped.`)
  }

  activateNextSlide = (): void => {
    if (this.slideElements.length <= 0) {
      return
    }

    if (this.activeSlideElementIndex >= this.slideElements.length - 1) {
      if (!this.infiniteRotation) {
        return
      }

      this.activeSlideElement?.deactivate()
      this.activeTabElement?.deactivate()

      this.slideElements[0].activate()
      WebElementLogger.verbose(this.uid, 'activateNextSlide', `The first slide has been activated.`)

      if (this.tabElements.length <= 0) {
        return
      }

      this.tabElements[0].activate()
      WebElementLogger.verbose(this.uid, 'activateNextSlide', `The first tab has been activated.`)

      return
    }

    this.activeSlideElement?.deactivate()
    this.activeTabElement?.deactivate()

    this.slideElements[this.activeSlideElementIndex + 1].activate()
    WebElementLogger.verbose(this.uid, 'activateNextSlide', `The next slide has been activated.`)

    if (this.tabElements.length <= 0) {
      return
    }

    this.tabElements[this.activeSlideElementIndex + 1].activate()
    WebElementLogger.verbose(this.uid, 'activateNextSlide', `The next tab has been activated.`)
  }

  activatePreviousSlide = (): void => {
    if (this.slideElements.length <= 0) {
      return
    }

    if (this.activeSlideElementIndex <= 0) {
      if (!this.infiniteRotation) {
        return
      }

      this.activeSlideElement?.deactivate()

      this.slideElements[this.slideElements.length - 1].activate()
      WebElementLogger.verbose(this.uid, 'activatePreviousSlide', `The last slide has been activated.`)

      return
    }

    this.activeSlideElement?.deactivate()

    this.slideElements[this.activeSlideElementIndex - 1].activate()
    WebElementLogger.verbose(this.uid, 'activatePreviousSlide', `The previous slide has been activated.`)
  }

  get activeSlideElementIndex(): number {
    return this.activeSlideElement ? this.slideElements.indexOf(this.activeSlideElement) : -1
  }

  get name(): ElementName {
    return ElementName.ARIA_CAROUSEL
  }

  static properties: PropertyDeclarations = {
    automaticRotation: { type: Boolean, attribute: 'automatic-rotation', reflect: true },
    automaticRotationIntervalTime: { type: Number, attribute: 'automatic-rotation-interval-time', reflect: true },
    infiniteRotation: { type: Boolean, attribute: 'infinite-rotation', reflect: true },
    live: { state: true }
  }

  static queries: QueryDeclarations = {
    activeSlideElement: { selector: 'q-aria-carousel-slide[active]' },
    activeTabElement: { selector: 'q-aria-carousel-tab[active]' },
    slideElements: { selector: 'q-aria-carousel-slide', all: true },
    slidesElement: { selector: 'q-aria-carousel-slides' },
    tabElements: { selector: 'q-aria-carousel-tab', all: true },
    tabsElement: { selector: 'q-aria-carousel-tabs' }
  }
}

export class AriaCarouselSlidesElement extends BaseElement {
  protected aria: AriaCarouselSlidesController = new AriaCarouselSlidesController(this)

  /**
   * QUERIES
   */
  rootElement!: AriaCarouselElement

  get name(): ElementName {
    return ElementName.ARIA_CAROUSEL_SLIDES
  }

  static queries: QueryDeclarations = {
    rootElement: { selector: 'q-aria-carousel', closest: true }
  }
}

export class AriaCarouselSlideElement extends BaseElement {
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
    let old: AriaCarouselSlideElement | undefined

    old = this.rootElement.activeSlideElement
    this.active = true

    this.rootElement.dispatchEvent(new CarouselSlideActivateEvent(this, old))
  }

  deactivate(): void {
    this.active = false
    this.rootElement.dispatchEvent(new CarouselSlideDeactivateEvent(this))
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
    rootElement: { selector: 'q-aria-carousel', closest: true },
    slidesElement: { selector: 'q-aria-carousel-slides', closest: true }
  }
}

export class AriaCarouselRotationControlElement extends AriaButtonElement {
  protected aria2: AriaCarouselRotationControlController = new AriaCarouselRotationControlController(this)

  /**
   * QUERIES
   */
  rootElement!: AriaCarouselElement

  onClick = (): void => {
    this.rootElement.forceAutomaticRotation = true
    this.rootElement.live = undefined

    if (this.rootElement.automaticRotation) {
      Interval.stop(this.rootElement.uid)
    }

    this.rootElement.automaticRotation = !this.rootElement.automaticRotation
    WebElementLogger.verbose(this.uid, 'onClick', `The automatic rotation has been ${this.rootElement.automaticRotation ? 'enabled' : 'disabled'}.`)

    if (this.rootElement.automaticRotation) {
      Interval.start(
        this.rootElement.uid,
        this.rootElement.activateNextSlide,
        this.rootElement.automaticRotationIntervalTime ?? DEFAULT_CAROUSEL_ROTATION_DURATION
      )
      WebElementLogger.verbose(this.uid, 'onClick', `The automatic rotation has been started.`)
    }
  }

  get name(): ElementName {
    return ElementName.ARIA_CAROUSEL_ROTATION_CONTROL
  }

  static queries: QueryDeclarations = {
    rootElement: { selector: 'q-aria-carousel', closest: true }
  }
}

export class AriaCarouselNextSlideControlElement extends AriaButtonElement {
  protected aria2: AriaCarouselNextSlideControlController = new AriaCarouselNextSlideControlController(this)

  /**
   * QUERIES
   */
  rootElement!: AriaCarouselElement

  onClick = (): void => {
    this.rootElement.activateNextSlide()
  }

  get name(): ElementName {
    return ElementName.ARIA_CAROUSEL_NEXT_SLIDE_CONTROL
  }

  static queries: QueryDeclarations = {
    rootElement: { selector: 'q-aria-carousel', closest: true }
  }
}

export class AriaCarouselPreviousSlideControlElement extends AriaButtonElement {
  protected aria2: AriaCarouselPreviousSlideControlController = new AriaCarouselPreviousSlideControlController(this)

  /**
   * QUERIES
   */
  rootElement!: AriaCarouselElement

  onClick = (): void => {
    this.rootElement.activatePreviousSlide()
  }

  get name(): ElementName {
    return ElementName.ARIA_CAROUSEL_PREVIOUS_SLIDE_CONTROL
  }

  static queries: QueryDeclarations = {
    rootElement: { selector: 'q-aria-carousel', closest: true }
  }
}

export class AriaCarouselTabsElement extends BaseElement {
  protected aria: AriaCarouselTabsController = new AriaCarouselTabsController(this)

  /**
   * QUERIES
   */
  activeTabElement?: AriaCarouselTabElement
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

  onKeyDown = (event: KeyboardEvent): void => {
    switch (event.key) {
      case KeyboardEventKey.ARROW_LEFT:
      case KeyboardEventKey.ARROW_RIGHT:
      case KeyboardEventKey.END:
      case KeyboardEventKey.HOME:
        event.preventDefault()
        event.stopPropagation()

        this.activeTabElement?.deactivate()
        this.rootElement.activeSlideElement?.deactivate()
    }

    switch (event.key) {
      case KeyboardEventKey.ARROW_LEFT:
        if (this.activeTabElementIndex <= 0) {
          this.tabElements[this.tabElements.length - 1].focus()

          this.tabElements[this.tabElements.length - 1].activate()
          WebElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_LEFT', `The last tab has been activated.`)

          this.rootElement.slideElements[this.tabElements.length - 1].activate()
          WebElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_LEFT', `The last slide has been activated.`)

          break
        }

        this.tabElements[this.activeTabElementIndex - 1].focus()

        this.tabElements[this.activeTabElementIndex - 1].activate()
        WebElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_LEFT', `The previous tab has been activated.`)

        this.rootElement.slideElements[this.activeTabElementIndex - 1].activate()
        WebElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_LEFT', `The previous slide has been activated.`)

        break
      case KeyboardEventKey.ARROW_RIGHT:
        if (this.activeTabElementIndex >= this.tabElements.length - 1) {
          this.tabElements[0].focus()

          this.tabElements[0].activate()
          WebElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_RIGHT', `The first tab has been activated.`)

          this.rootElement.slideElements[0].activate()
          WebElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_RIGHT', `The first slide has been activated.`)

          break
        }

        this.tabElements[this.activeTabElementIndex + 1].focus()

        this.tabElements[this.activeTabElementIndex + 1].activate()
        WebElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_RIGHT', `The next tab has been activated.`)

        this.rootElement.slideElements[this.activeTabElementIndex + 1].activate()
        WebElementLogger.verbose(this.uid, 'onKeyDown', 'ARROW_RIGHT', `The next slide has been activated.`)

        break
      case KeyboardEventKey.END:
        this.tabElements[this.tabElements.length - 1].focus()

        this.tabElements[this.tabElements.length - 1].activate()
        WebElementLogger.verbose(this.uid, 'onKeyDown', 'END', `The last tab has been activated.`)

        this.rootElement.slideElements[this.tabElements.length - 1].activate()
        WebElementLogger.verbose(this.uid, 'onKeyDown', 'END', `The last slide has been activated.`)

        break
      case KeyboardEventKey.HOME:
        this.tabElements[0].focus()

        this.tabElements[0].activate()
        WebElementLogger.verbose(this.uid, 'onKeyDown', 'HOME', `The first tab has been activated.`)

        this.rootElement.slideElements[0].activate()
        WebElementLogger.verbose(this.uid, 'onKeyDown', 'HOME', `The first slide has been activated.`)

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
    activeTabElement: { selector: 'q-aria-carousel-tab[active]' },
    rootElement: { selector: 'q-aria-carousel', closest: true },
    tabElements: { selector: 'q-aria-carousel-tab', all: true }
  }
}

export class AriaCarouselTabElement extends BaseElement {
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

  onClick = (): void => {
    this.tabsElement.activeTabElement?.deactivate()
    this.rootElement.activeSlideElement?.deactivate()

    this.active = true
    WebElementLogger.verbose(this.uid, 'onClick', `The tab has been activated.`)

    this.rootElement.slideElements[this.index].activate()
    WebElementLogger.verbose(this.uid, 'onClick', `The matching slide has been activated.`)
  }

  activate(): void {
    this.active = true
  }

  deactivate(): void {
    this.active = false
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
    rootElement: { selector: 'q-aria-carousel', closest: true },
    tabsElement: { selector: 'q-aria-carousel-tabs', closest: true }
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

customElements.define('q-aria-carousel', AriaCarouselElement)
customElements.define('q-aria-carousel-next-slide-control', AriaCarouselNextSlideControlElement)
customElements.define('q-aria-carousel-previous-slide-control', AriaCarouselPreviousSlideControlElement)
customElements.define('q-aria-carousel-rotation-control', AriaCarouselRotationControlElement)
customElements.define('q-aria-carousel-slide', AriaCarouselSlideElement)
customElements.define('q-aria-carousel-slides', AriaCarouselSlidesElement)
customElements.define('q-aria-carousel-tab', AriaCarouselTabElement)
customElements.define('q-aria-carousel-tabs', AriaCarouselTabsElement)
