import { ElementName, QueryDeclarations } from '@queelag/web'
import {
  AriaCarouselElement,
  AriaCarouselNextSlideControlElement,
  AriaCarouselPreviousSlideControlElement,
  AriaCarouselRotationControlElement,
  AriaCarouselSlideElement,
  AriaCarouselSlidesElement,
  AriaCarouselTabElement,
  AriaCarouselTabsElement
} from '../aria/aria.carousel.element'

declare global {
  interface HTMLElementTagNameMap {
    'q-carousel': AriaCarouselElement
    'q-carousel-next-slide-control': AriaCarouselNextSlideControlElement
    'q-carousel-previous-slide-control': AriaCarouselPreviousSlideControlElement
    'q-carousel-rotation-control': AriaCarouselRotationControlElement
    'q-carousel-slide': AriaCarouselSlideElement
    'q-carousel-slides': AriaCarouselSlidesElement
    'q-carousel-tab': AriaCarouselTabElement
    'q-carousel-tabs': AriaCarouselTabsElement
  }
}

export class CarouselElement extends AriaCarouselElement {
  get name(): ElementName {
    return ElementName.CAROUSEL
  }

  static queries: QueryDeclarations = {
    activeSlideElement: { selector: 'q-carousel-slide[active]' },
    activeTabElement: { selector: 'q-carousel-tab[active]' },
    rotationControlElement: { selector: 'q-carousel-rotation-control' },
    slideElements: { selector: 'q-carousel-slide', all: true },
    slidesElement: { selector: 'q-carousel-slides' },
    tabElements: { selector: 'q-carousel-tab', all: true },
    tabsElement: { selector: 'q-carousel-tabs' }
  }
}

export class CarouselSlidesElement extends AriaCarouselSlidesElement {
  get name(): ElementName {
    return ElementName.CAROUSEL_SLIDES
  }

  static queries: QueryDeclarations = {
    rootElement: { selector: 'q-carousel', closest: true }
  }
}

export class CarouselSlideElement extends AriaCarouselSlideElement {
  get name(): ElementName {
    return ElementName.CAROUSEL_SLIDE
  }

  static queries: QueryDeclarations = {
    rootElement: { selector: 'q-carousel', closest: true },
    slidesElement: { selector: 'q-carousel-slides', closest: true }
  }
}

export class CarouselRotationControlElement extends AriaCarouselRotationControlElement {
  get name(): ElementName {
    return ElementName.CAROUSEL_ROTATION_CONTROL
  }

  static queries: QueryDeclarations = {
    rootElement: { selector: 'q-carousel', closest: true }
  }
}

export class CarouselNextSlideControlElement extends AriaCarouselNextSlideControlElement {
  get name(): ElementName {
    return ElementName.CAROUSEL_NEXT_SLIDE_CONTROL
  }

  static queries: QueryDeclarations = {
    rootElement: { selector: 'q-carousel', closest: true }
  }
}

export class CarouselPreviousSlideControlElement extends AriaCarouselPreviousSlideControlElement {
  get name(): ElementName {
    return ElementName.CAROUSEL_PREVIOUS_SLIDE_CONTROL
  }

  static queries: QueryDeclarations = {
    rootElement: { selector: 'q-carousel', closest: true }
  }
}

export class CarouselTabsElement extends AriaCarouselTabsElement {
  get name(): ElementName {
    return ElementName.CAROUSEL_TABS
  }

  static queries: QueryDeclarations = {
    activeTabElement: { selector: 'q-carousel-tab[active]' },
    rootElement: { selector: 'q-carousel', closest: true },
    tabElements: { selector: 'q-carousel-tab', all: true }
  }
}

export class CarouselTabElement extends AriaCarouselTabElement {
  get name(): ElementName {
    return ElementName.CAROUSEL_TAB
  }

  static queries: QueryDeclarations = {
    rootElement: { selector: 'q-carousel', closest: true },
    tabsElement: { selector: 'q-carousel-tabs', closest: true }
  }
}

customElements.define('q-carousel', CarouselElement)
customElements.define('q-carousel-next-slide-control', CarouselNextSlideControlElement)
customElements.define('q-carousel-previous-slide-control', CarouselPreviousSlideControlElement)
customElements.define('q-carousel-rotation-control', CarouselRotationControlElement)
customElements.define('q-carousel-slide', CarouselSlideElement)
customElements.define('q-carousel-slides', CarouselSlidesElement)
customElements.define('q-carousel-tab', CarouselTabElement)
customElements.define('q-carousel-tabs', CarouselTabsElement)
