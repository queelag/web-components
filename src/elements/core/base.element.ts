import { ID, parseNumber } from '@aracna/core'
import {
  AttributeChangeEvent,
  BaseElementEventMap,
  ELEMENT_UID_GENERATE_OPTIONS,
  ElementCollector,
  ElementName,
  Layer,
  QueryDeclaration,
  QueryDeclarations,
  Shape,
  Size,
  getElementStyleCompatibleValue,
  setImmutableElementAttribute
} from '@aracna/web'
import { CSSResultGroup, LitElement, PropertyDeclarations, TemplateResult, css, html } from 'lit'
import { DirectiveResult } from 'lit-html/directive.js'
import { StyleInfo } from 'lit-html/directives/style-map.js'
import { styleMap } from '../../directives/style.map.js'
import { getShapeStyleInfo } from '../../utils/shape.utils.js'
import { getSquircleHTML } from '../../utils/squircle.utils.js'

export class BaseElement<E extends BaseElementEventMap = BaseElementEventMap> extends LitElement {
  /**
   * PROPERTIES
   */
  background?: string
  height?: string
  layer?: Layer
  shape?: Shape
  shapeRectangleRadius?: number
  shapeSquareRadius?: number
  shapeSquircleCurvature?: number
  shapeSquircleSize?: number
  size?: Size
  width?: string

  /**
   * INTERNAL
   */
  // squircleID: string = ID.generate({ ...ELEMENT_UID_GENERATE_OPTIONS, prefix: ElementName.SQUIRCLE })
  uid: string = ID.generate({ ...ELEMENT_UID_GENERATE_OPTIONS, prefix: this.name })

  constructor() {
    super()
    this.defineQueries()
  }

  connectedCallback(): void {
    super.connectedCallback()
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

  private defineQueries(): void {
    let declarations: QueryDeclarations = (this.constructor as any).queries

    for (let key in declarations) {
      let declaration: QueryDeclaration, get: () => any

      declaration = declarations[key] as QueryDeclaration
      get = () => this.querySelector(declaration.selector) || undefined

      if (declaration.all) {
        get = () => [...this.querySelectorAll(declaration.selector)]
      }

      if (declaration.closest) {
        get = () => this.closest(declaration.selector) || undefined
      }

      if (declaration.shadow) {
        get = () => this.renderRoot.querySelector(declaration.selector) || undefined
      }

      Object.defineProperty(this, key, { configurable: true, get })
    }
  }

  render(): unknown {
    return html`<slot @slotchange=${this.onSlotChange}></slot>`
  }

  // @ts-ignore
  get name(): ElementName {}

  get shapeHTML(): TemplateResult | undefined {
    if (this.shape !== 'squircle') {
      return
    }

    return getSquircleHTML('squircle-clip-path', this.shapeSquircleSize ?? this.numericSize, this.shapeSquircleCurvature)
  }

  get shapeStyleInfo(): StyleInfo {
    return getShapeStyleInfo(this.shape, {
      rectangle: { radius: this.shapeRectangleRadius },
      square: { radius: this.shapeSquareRadius },
      squircle: { id: 'squircle-clip-path' }
    })
  }

  get sizeStyleInfo(): StyleInfo {
    return {
      height: getElementStyleCompatibleValue(this.height || this.size),
      width: getElementStyleCompatibleValue(this.width || this.size)
    }
  }

  get styleInfo(): StyleInfo {
    return { ...this.shapeStyleInfo, ...this.sizeStyleInfo, background: this.background }
  }

  get styleMap(): DirectiveResult {
    return styleMap(this.styleInfo)
  }

  private get numericSize(): number {
    switch (typeof this.size) {
      case 'number':
        return this.size
      case 'string':
        return parseNumber(this.size)
      default:
        return 0
    }
  }

  static queries: QueryDeclarations = {}

  static properties: PropertyDeclarations = {
    background: { type: String, reflect: true },
    height: { type: String, reflect: true },
    layer: { type: Number, reflect: true },
    shape: { type: String, reflect: true },
    shapeRectangleRadius: { type: String, attribute: 'shape-rectangle-radius', reflect: true },
    shapeSquareRadius: { type: String, attribute: 'shape-square-radius', reflect: true },
    shapeSquircleCurvature: { type: String, attribute: 'shape-squircle-curvature', reflect: true },
    shapeSquircleSize: { type: String, attribute: 'shape-squircle-size', reflect: true },
    size: { type: String, reflect: true },
    width: { type: String, reflect: true }
  }

  static styles: CSSResultGroup = css`
    :host {
      display: inline-flex;
    }

    svg.squircle {
      height: 0;
      opacity: 0;
      pointer-events: none;
      position: absolute;
      width: 0;
    }
  `
}
