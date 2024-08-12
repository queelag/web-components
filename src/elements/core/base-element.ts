import { generateRandomString, parseNumber } from '@aracna/core'
import { getElementStyleCompatibleValue, setImmutableElementAttribute } from '@aracna/web'
import { type CSSResultGroup, LitElement, type PropertyDeclarations, type TemplateResult, css, html } from 'lit'
import type { DirectiveResult } from 'lit/directive.js'
import type { StyleInfo } from 'lit/directives/style-map.js'
import { ElementCollector } from '../../collectors/element-collector.js'
import { DEFAULT_SQUIRCLE_CURVATURE, ELEMENT_UID_GENERATE_OPTIONS } from '../../definitions/constants.js'
import { ElementName } from '../../definitions/enums.js'
import type { BaseElementEventMap } from '../../definitions/events.js'
import type { QueryDeclaration, QueryDeclarations } from '../../definitions/interfaces.js'
import type { Layer, Shape, Size } from '../../definitions/types.js'
import { styleMap } from '../../directives/style-map.js'
import { AttributeChangeEvent } from '../../events/attribute-change-event.js'
import { getShapeStyleInfo } from '../../utils/shape-utils.js'
import { appendSquircleElement } from '../../utils/squircle-utils.js'

class BaseElement<E extends BaseElementEventMap = BaseElementEventMap> extends LitElement {
  /**
   * Properties
   */
  height?: string
  layer?: Layer
  shape?: Shape
  shapeRectangleRadius?: number
  shapeSquareRadius?: number
  shapeSquircleCurvature?: number
  size?: Size
  width?: string

  /**
   * Internals
   */
  uid: string = generateRandomString({
    ...ELEMENT_UID_GENERATE_OPTIONS,
    prefix: this.name
  })

  constructor() {
    super()
    this.defineQueries()
  }

  connectedCallback(): void {
    super.connectedCallback()

    setImmutableElementAttribute(this, 'base-element', '')
    setImmutableElementAttribute(this, 'uid', this.uid)

    ElementCollector.set(this)
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()
    ElementCollector.delete(this)
  }

  attributeChangedCallback(name: string, _old: string | null, value: string | null): void {
    super.attributeChangedCallback(name, _old, value)

    if (Object.is(_old, value)) {
      return
    }

    if (name === 'shape' && value === 'squircle') {
      appendSquircleElement({
        curvature: this.shapeSquircleCurvature,
        size: this.numericSize
      })
    }

    if (name === 'shape-squircle-curvature' && this.shape === 'squircle') {
      appendSquircleElement({
        curvature: parseNumber(value, DEFAULT_SQUIRCLE_CURVATURE),
        size: this.numericSize
      })
    }

    if (name === 'size' && this.shape === 'squircle') {
      appendSquircleElement({
        curvature: this.shapeSquircleCurvature,
        size: parseNumber(value)
      })
    }

    this.dispatchEvent(new AttributeChangeEvent(name, _old, value))
  }

  addEventListener<K extends keyof E>(type: K, listener: (this: HTMLElement, ev: E[K]) => any, options?: boolean | AddEventListenerOptions | undefined): void
  addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions | undefined): void
  addEventListener(type: any, listener: any, options?: any): void {
    return super.addEventListener(type, listener, options)
  }

  removeEventListener<K extends keyof E>(type: K, listener: (this: HTMLElement, ev: E[K]) => any, options?: boolean | EventListenerOptions | undefined): void
  removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions | undefined): void
  removeEventListener(type: any, listener: any, options?: any): void {
    return super.removeEventListener(type, listener, options)
  }

  onSlotChange(): void {}

  defineQueries(): void {
    let declarations: QueryDeclarations = (this.constructor as any).queries

    for (let key in declarations) {
      let declaration: QueryDeclaration, get: () => any

      declaration = declarations[key] as QueryDeclaration
      get = () => this.querySelector(declaration.selector) || undefined

      if (declaration.all && declaration.shadow) {
        get = () => [...this.renderRoot.querySelectorAll(declaration.selector)]
      } else if (declaration.all) {
        get = () => [...this.querySelectorAll(declaration.selector)]
      } else if (declaration.closest) {
        get = () => this.closest(declaration.selector) || undefined
      } else if (declaration.shadow) {
        get = () => this.renderRoot.querySelector(declaration.selector) || undefined
      }

      Object.defineProperty(this, key, { configurable: true, get })
    }
  }

  render(): unknown {
    return html`
      ${this.styleHTML}
      <slot @slotchange=${this.onSlotChange}></slot>
    `
  }

  get name(): string {
    return ElementName.BASE
  }

  get numericSize(): number {
    switch (typeof this.size) {
      case 'number':
        return this.size
      case 'string':
        return parseNumber(this.size)
      default:
        return 0
    }
  }

  get shapeStyleInfo(): StyleInfo {
    return getShapeStyleInfo(this.shape, {
      rectangle: { radius: this.shapeRectangleRadius },
      square: { radius: this.shapeSquareRadius },
      squircle: {
        curvature: this.shapeSquircleCurvature,
        size: this.numericSize
      }
    })
  }

  get sizeStyleInfo(): StyleInfo {
    return {
      height: getElementStyleCompatibleValue(this.height ?? this.size),
      width: getElementStyleCompatibleValue(this.width ?? this.size)
    }
  }

  get styleHTML(): TemplateResult {
    return html`
      <style>
        :host {
          border-radius: ${this.shapeStyleInfo.borderRadius ?? 'unset'};
          clip-path: ${this.shapeStyleInfo.clipPath ?? 'unset'};
          height: ${getElementStyleCompatibleValue(this.height ?? this.size) ?? 'unset'};
          width: ${getElementStyleCompatibleValue(this.width ?? this.size) ?? 'unset'};
        }
      </style>
    `
  }

  get styleInfo(): StyleInfo {
    return {
      ...this.shapeStyleInfo,
      ...this.sizeStyleInfo
    }
  }

  get styleMap(): DirectiveResult {
    return styleMap(this.styleInfo)
  }

  static queries: QueryDeclarations = {}

  static properties: PropertyDeclarations = {
    height: { type: String, reflect: true },
    layer: { type: Number, reflect: true },
    shape: { type: String, reflect: true },
    shapeRectangleRadius: {
      type: String,
      attribute: 'shape-rectangle-radius',
      reflect: true
    },
    shapeSquareRadius: {
      type: String,
      attribute: 'shape-square-radius',
      reflect: true
    },
    shapeSquircleCurvature: {
      type: String,
      attribute: 'shape-squircle-curvature',
      reflect: true
    },
    shapeSquircleSize: {
      type: String,
      attribute: 'shape-squircle-size',
      reflect: true
    },
    size: { type: String, reflect: true },
    width: { type: String, reflect: true }
  }

  static styles: CSSResultGroup = css`
    :host {
      display: inline-flex;
    }
  `
}

export { BaseElement as AracnaBaseElement }
