import { generateRandomString } from '@aracna/core'
import { setImmutableElementAttribute } from '@aracna/web'
import type { ReactiveController, ReactiveControllerHost } from 'lit'
import { ELEMENT_UID_GENERATE_OPTIONS } from '../definitions/constants.js'
import type { AracnaAriaFeedArticleElement as AriaFeedArticleElement, AracnaAriaFeedElement as AriaFeedElement } from '../elements/aria/aria-feed-element.js'
import type { AracnaBaseElement as BaseElement } from '../elements/core/base-element.js'

export class AriaFeedController implements ReactiveController {
  constructor(private host: ReactiveControllerHost & AriaFeedElement) {
    this.host.addController(this)
  }

  hostConnected(): void {
    this.setAttributes()
  }

  hostUpdate(): void {
    this.setAttributes()
  }

  setAttributes(): void {
    setImmutableElementAttribute(this.host, 'aria-busy', this.host.busy ? 'true' : 'false')
    //   setImmutableElementAttribute(this.host, 'aria-labelledby', '')
    setImmutableElementAttribute(this.host, 'role', 'feed')
  }
}

export class AriaFeedArticleController implements ReactiveController {
  constructor(private host: ReactiveControllerHost & AriaFeedArticleElement) {
    this.host.addController(this)
  }

  hostConnected(): void {
    this.setAttributes()
  }

  hostUpdate(): void {
    this.setAttributes()
  }

  setAttributes(): void {
    setImmutableElementAttribute(this.host, 'aria-describedby', this.host.descriptionElement?.id)
    setImmutableElementAttribute(this.host, 'aria-labelledby', this.host.labelElement?.id)
    setImmutableElementAttribute(this.host, 'aria-posinset', String(this.host.index + 1))
    setImmutableElementAttribute(this.host, 'aria-setsize', String(this.host.rootElement.articleElements.length))
    setImmutableElementAttribute(this.host, 'role', 'article')
    setImmutableElementAttribute(this.host, 'tabindex', '0')
  }
}

export class AriaFeedArticleDescriptionController implements ReactiveController {
  constructor(private host: ReactiveControllerHost & BaseElement) {
    this.host.addController(this)
  }

  hostConnected(): void {
    this.setAttributes()
  }

  hostUpdate(): void {
    this.setAttributes()
  }

  setAttributes(): void {
    if (this.host.id.length > 0) {
      return
    }

    setImmutableElementAttribute(
      this.host,
      'id',
      generateRandomString({
        ...ELEMENT_UID_GENERATE_OPTIONS,
        prefix: this.host.name
      })
    )
  }
}

export class AriaFeedArticleLabelController extends AriaFeedArticleDescriptionController implements ReactiveController {}
