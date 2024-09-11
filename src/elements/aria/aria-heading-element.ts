import { defineCustomElement } from '@aracna/web'
import type { PropertyDeclarations } from 'lit'
import { AriaHeadingController } from '../../controllers/aria-heading-controller.js'
import { ElementName } from '../../definitions/enums.js'
import type { AriaHeadingElementEventMap } from '../../definitions/events.js'
import type { HeadingLevel } from '../../definitions/types.js'
import { AracnaBaseElement as BaseElement } from '../core/base-element.js'

declare global {
  interface HTMLElementTagNameMap {
    'aracna-aria-heading': AriaHeadingElement
  }
}

class AriaHeadingElement<E extends AriaHeadingElementEventMap = AriaHeadingElementEventMap> extends BaseElement<E> {
  protected aria: AriaHeadingController = new AriaHeadingController(this)

  /**
   * Properties
   */
  /** */
  protected _level?: HeadingLevel

  get level(): HeadingLevel {
    return this._level ?? 1
  }

  set level(level: HeadingLevel | undefined) {
    let old: HeadingLevel | undefined

    old = this._level
    this._level = level

    this.requestUpdate('level', old)
  }

  get name(): ElementName {
    return ElementName.ARIA_HEADING
  }

  static properties: PropertyDeclarations = {
    level: { type: Number, reflect: true }
  }
}

defineCustomElement('aracna-aria-heading', AriaHeadingElement)

export { AriaHeadingElement as AracnaAriaHeadingElement }
