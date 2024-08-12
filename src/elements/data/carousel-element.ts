import { defineCustomElement } from '@aracna/web'
import type { PropertyDeclarations } from 'lit'
import { ElementName } from '../../definitions/enums.js'
import type {
  CarouselElementEventMap,
  CarouselNextSlideControlElementEventMap,
  CarouselPreviousSlideControlElementEventMap,
  CarouselRotationControlElementEventMap,
  CarouselSlideElementEventMap,
  CarouselSlidesElementEventMap,
  CarouselTabElementEventMap,
  CarouselTabsElementEventMap
} from '../../definitions/events.js'
import type { QueryDeclarations } from '../../definitions/interfaces.js'
import {
  AracnaAriaCarouselElement as AriaCarouselElement,
  AracnaAriaCarouselNextSlideControlElement as AriaCarouselNextSlideControlElement,
  AracnaAriaCarouselPreviousSlideControlElement as AriaCarouselPreviousSlideControlElement,
  AracnaAriaCarouselRotationControlElement as AriaCarouselRotationControlElement,
  AracnaAriaCarouselSlideElement as AriaCarouselSlideElement,
  AracnaAriaCarouselSlidesElement as AriaCarouselSlidesElement,
  AracnaAriaCarouselTabElement as AriaCarouselTabElement,
  AracnaAriaCarouselTabsElement as AriaCarouselTabsElement
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

class CarouselElement<E extends CarouselElementEventMap = CarouselElementEventMap, T = any> extends AriaCarouselElement<E> {
  /**
   * Properties
   */
  /** */
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

class CarouselSlidesElement<E extends CarouselSlidesElementEventMap = CarouselSlidesElementEventMap> extends AriaCarouselSlidesElement<E> {
  get name(): ElementName {
    return ElementName.CAROUSEL_SLIDES
  }

  static queries: QueryDeclarations = {
    rootElement: { selector: 'aracna-carousel', closest: true }
  }
}

class CarouselSlideElement<E extends CarouselSlideElementEventMap = CarouselSlideElementEventMap> extends AriaCarouselSlideElement<E> {
  get name(): ElementName {
    return ElementName.CAROUSEL_SLIDE
  }

  static queries: QueryDeclarations = {
    rootElement: { selector: 'aracna-carousel', closest: true },
    slidesElement: { selector: 'aracna-carousel-slides', closest: true }
  }
}

class CarouselRotationControlElement<
  E extends CarouselRotationControlElementEventMap = CarouselRotationControlElementEventMap
> extends AriaCarouselRotationControlElement<E> {
  get name(): ElementName {
    return ElementName.CAROUSEL_ROTATION_CONTROL
  }

  static queries: QueryDeclarations = {
    rootElement: { selector: 'aracna-carousel', closest: true }
  }
}

class CarouselNextSlideControlElement<
  E extends CarouselNextSlideControlElementEventMap = CarouselNextSlideControlElementEventMap
> extends AriaCarouselNextSlideControlElement<E> {
  get name(): ElementName {
    return ElementName.CAROUSEL_NEXT_SLIDE_CONTROL
  }

  static queries: QueryDeclarations = {
    rootElement: { selector: 'aracna-carousel', closest: true }
  }
}

class CarouselPreviousSlideControlElement<
  E extends CarouselPreviousSlideControlElementEventMap = CarouselPreviousSlideControlElementEventMap
> extends AriaCarouselPreviousSlideControlElement<E> {
  get name(): ElementName {
    return ElementName.CAROUSEL_PREVIOUS_SLIDE_CONTROL
  }

  static queries: QueryDeclarations = {
    rootElement: { selector: 'aracna-carousel', closest: true }
  }
}

class CarouselTabsElement<E extends CarouselTabsElementEventMap = CarouselTabsElementEventMap> extends AriaCarouselTabsElement<E> {
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

class CarouselTabElement<E extends CarouselTabElementEventMap = CarouselTabElementEventMap> extends AriaCarouselTabElement<E> {
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

export {
  CarouselElement as AracnaCarouselElement,
  CarouselNextSlideControlElement as AracnaCarouselNextSlideControlElement,
  CarouselPreviousSlideControlElement as AracnaCarouselPreviousSlideControlElement,
  CarouselRotationControlElement as AracnaCarouselRotationControlElement,
  CarouselSlideElement as AracnaCarouselSlideElement,
  CarouselSlidesElement as AracnaCarouselSlidesElement,
  CarouselTabElement as AracnaCarouselTabElement,
  CarouselTabsElement as AracnaCarouselTabsElement
}
