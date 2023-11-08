import {
  CarouselElementEventMap,
  CarouselNextSlideControlElementEventMap,
  CarouselPreviousSlideControlElementEventMap,
  CarouselRotationControlElementEventMap,
  CarouselSlideElementEventMap,
  CarouselSlidesElementEventMap,
  CarouselTabElementEventMap,
  CarouselTabsElementEventMap,
  defineCustomElement,
  ElementName,
  QueryDeclarations
} from '@aracna/web'
import { PropertyDeclarations } from 'lit'
import {
  AriaCarouselElement,
  AriaCarouselNextSlideControlElement,
  AriaCarouselPreviousSlideControlElement,
  AriaCarouselRotationControlElement,
  AriaCarouselSlideElement,
  AriaCarouselSlidesElement,
  AriaCarouselTabElement,
  AriaCarouselTabsElement
} from '../aria/aria-carousel-element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-carousel': CarouselElement
    'aracna-carousel-next-slide-control': CarouselNextSlideControlElement
    'aracna-carousel-previous-slide-control': CarouselPreviousSlideControlElement
    'aracna-carousel-rotation-control': CarouselRotationControlElement
    'aracna-carousel-slide': CarouselSlideElement
    'aracna-carousel-slides': CarouselSlidesElement
    'aracna-carousel-tab': CarouselTabElement
    'aracna-carousel-tabs': CarouselTabsElement
  }
}

export class CarouselElement<E extends CarouselElementEventMap = CarouselElementEventMap, T = any> extends AriaCarouselElement<E> {
  slides?: T[]

  get name(): ElementName {
    return ElementName.CAROUSEL
  }

  static properties: PropertyDeclarations = {
    slides: { type: Array }
  }

  static queries: QueryDeclarations = {
    activeSlideElement: { selector: 'aracna-carousel-slide[active]' },
    activeTabElement: { selector: 'aracna-carousel-tab[active]' },
    rotationControlElement: { selector: 'aracna-carousel-rotation-control' },
    slideElements: { selector: 'aracna-carousel-slide', all: true },
    slidesElement: { selector: 'aracna-carousel-slides' },
    tabElements: { selector: 'aracna-carousel-tab', all: true },
    tabsElement: { selector: 'aracna-carousel-tabs' }
  }
}

export class CarouselSlidesElement<E extends CarouselSlidesElementEventMap = CarouselSlidesElementEventMap> extends AriaCarouselSlidesElement<E> {
  get name(): ElementName {
    return ElementName.CAROUSEL_SLIDES
  }

  static queries: QueryDeclarations = {
    rootElement: { selector: 'aracna-carousel', closest: true }
  }
}

export class CarouselSlideElement<E extends CarouselSlideElementEventMap = CarouselSlideElementEventMap> extends AriaCarouselSlideElement<E> {
  get name(): ElementName {
    return ElementName.CAROUSEL_SLIDE
  }

  static queries: QueryDeclarations = {
    rootElement: { selector: 'aracna-carousel', closest: true },
    slidesElement: { selector: 'aracna-carousel-slides', closest: true }
  }
}

export class CarouselRotationControlElement<
  E extends CarouselRotationControlElementEventMap = CarouselRotationControlElementEventMap
> extends AriaCarouselRotationControlElement<E> {
  get name(): ElementName {
    return ElementName.CAROUSEL_ROTATION_CONTROL
  }

  static queries: QueryDeclarations = {
    rootElement: { selector: 'aracna-carousel', closest: true }
  }
}

export class CarouselNextSlideControlElement<
  E extends CarouselNextSlideControlElementEventMap = CarouselNextSlideControlElementEventMap
> extends AriaCarouselNextSlideControlElement<E> {
  get name(): ElementName {
    return ElementName.CAROUSEL_NEXT_SLIDE_CONTROL
  }

  static queries: QueryDeclarations = {
    rootElement: { selector: 'aracna-carousel', closest: true }
  }
}

export class CarouselPreviousSlideControlElement<
  E extends CarouselPreviousSlideControlElementEventMap = CarouselPreviousSlideControlElementEventMap
> extends AriaCarouselPreviousSlideControlElement<E> {
  get name(): ElementName {
    return ElementName.CAROUSEL_PREVIOUS_SLIDE_CONTROL
  }

  static queries: QueryDeclarations = {
    rootElement: { selector: 'aracna-carousel', closest: true }
  }
}

export class CarouselTabsElement<E extends CarouselTabsElementEventMap = CarouselTabsElementEventMap> extends AriaCarouselTabsElement<E> {
  get name(): ElementName {
    return ElementName.CAROUSEL_TABS
  }

  static queries: QueryDeclarations = {
    activeTabElement: { selector: 'aracna-carousel-tab[active]' },
    focusedTabElement: { selector: 'aracna-carousel-tab:focus' },
    rootElement: { selector: 'aracna-carousel', closest: true },
    tabElements: { selector: 'aracna-carousel-tab', all: true }
  }
}

export class CarouselTabElement<E extends CarouselTabElementEventMap = CarouselTabElementEventMap> extends AriaCarouselTabElement<E> {
  get name(): ElementName {
    return ElementName.CAROUSEL_TAB
  }

  static queries: QueryDeclarations = {
    rootElement: { selector: 'aracna-carousel', closest: true },
    tabsElement: { selector: 'aracna-carousel-tabs', closest: true }
  }
}

defineCustomElement('aracna-carousel', CarouselElement)
defineCustomElement('aracna-carousel-next-slide-control', CarouselNextSlideControlElement)
defineCustomElement('aracna-carousel-previous-slide-control', CarouselPreviousSlideControlElement)
defineCustomElement('aracna-carousel-rotation-control', CarouselRotationControlElement)
defineCustomElement('aracna-carousel-slide', CarouselSlideElement)
defineCustomElement('aracna-carousel-slides', CarouselSlidesElement)
defineCustomElement('aracna-carousel-tab', CarouselTabElement)
defineCustomElement('aracna-carousel-tabs', CarouselTabsElement)
