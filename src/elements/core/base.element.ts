import { ID, parseNumber } from '@queelag/core'
import {
  AttributeChangeEvent,
  ElementCollector,
  ElementName,
  ELEMENT_UID_GENERATE_OPTIONS,
  getElementStyleCompatibleValue,
  Layer,
  QueryDeclaration,
  QueryDeclarations,
  setImmutableElementAttribute,
  Shape,
  Size
} from '@queelag/web'
import { css, CSSResultGroup, html, LitElement, PropertyDeclarations, TemplateResult } from 'lit'
import { DirectiveResult } from 'lit-html/directive'
import { StyleInfo } from 'lit-html/directives/style-map'
import { styleMap } from '../../directives/style.map'
import { getShapeStyleInfo } from '../../utils/shape.utils'
import { getSquircleHTML } from '../../utils/squircle.utils'

export class BaseElement extends LitElement {
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
  squircleID: string = ID.generate({ ...ELEMENT_UID_GENERATE_OPTIONS, prefix: ElementName.SQUIRCLE })
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

  onSlotChange(): void {}

  private defineQueries(): void {
    let declarations: QueryDeclarations = (this.constructor as any).queries

    for (let key in declarations) {
      let declaration: QueryDeclaration, get: () => any

      declaration = declarations[key]
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

    return getSquircleHTML(this.squircleID, this.shapeSquircleSize ?? this.numericSize, this.shapeSquircleCurvature)
  }

  get shapeStyleInfo(): StyleInfo {
    return getShapeStyleInfo(this.shape, {
      rectangle: { radius: this.shapeRectangleRadius },
      square: { radius: this.shapeSquareRadius },
      squircle: { id: this.squircleID }
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
