import { generateRandomString } from '@aracna/core'
import {
  DEFAULT_SQUIRCLE_CURVATURE,
  DEFAULT_SQUIRCLE_SIZE,
  ELEMENT_UID_GENERATE_OPTIONS,
  SQUIRCLES_CONTAINER_ID,
  SVG_NAMESPACE_URI
} from '../definitions/constants.js'
import { ElementSlug } from '../definitions/enums.js'
import type { AppendSquircleElementOptions, CreateSquircleElementOptions, GetSquircleElementOptions } from '../definitions/interfaces.js'

/**
 * Appends a squircle element to the DOM.
 * Optionally the curvature and the size can be specified.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/web/utils/squircle)
 */
export function appendSquircleElement(options?: AppendSquircleElementOptions): void {
  let element: SVGSVGElement | null

  element = getSquircleElement(options)
  if (element) return

  getSquirclesContainer().append(createSquircleElement(options))
}

/**
 * Creates a new squircle element.
 * Optionally the curvature and the size can be specified.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/web/utils/squircle)
 */
export function createSquircleElement(options?: CreateSquircleElementOptions): SVGSVGElement {
  let curvature: number,
    size: number,
    d: string,
    transform: string,
    viewbox: string,
    svg: SVGSVGElement | null,
    clipath: SVGClipPathElement,
    path: SVGPathElement

  curvature = options?.curvature ?? DEFAULT_SQUIRCLE_CURVATURE
  size = options?.size ?? DEFAULT_SQUIRCLE_SIZE

  d = getSquirclePathD(size, curvature)
  transform = getSquirclePathTransform(size)
  viewbox = getSquircleViewBox(size)

  svg = document.createElementNS(SVG_NAMESPACE_URI, 'svg')
  svg.setAttribute('curvature', curvature.toString())
  svg.setAttribute('fill', 'black')
  svg.setAttribute('id', generateRandomString({ ...ELEMENT_UID_GENERATE_OPTIONS(), prefix: ElementSlug.SQUIRCLE }))
  svg.setAttribute('size', size.toString())
  svg.setAttribute('viewBox', viewbox)
  svg.setAttribute('xmlns', SVG_NAMESPACE_URI)

  clipath = document.createElementNS(SVG_NAMESPACE_URI, 'clipPath')
  clipath.setAttribute('id', getSquircleClipPathID(size, curvature))

  path = document.createElementNS(SVG_NAMESPACE_URI, 'path')
  path.setAttribute('d', d)
  path.setAttribute('transform', transform)

  clipath.append(path)
  svg.append(clipath)

  return svg
}

/**
 * Returns a squircle element.
 * Optionally the curvature and the size can be specified.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/web/utils/squircle)
 */
export function getSquircleElement(options?: GetSquircleElementOptions): SVGSVGElement | null {
  let curvature: number, size: number

  curvature = options?.curvature ?? DEFAULT_SQUIRCLE_CURVATURE
  size = options?.size ?? DEFAULT_SQUIRCLE_SIZE

  return getSquirclesContainer().querySelector(`svg[size="${size}"][curvature="${curvature}"]`)
}

/**
 * Returns the clip path ID of a squircle.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/web/utils/squircle)
 */
export function getSquircleClipPathID(size: number, curvature: number = DEFAULT_SQUIRCLE_CURVATURE): string {
  return `${ElementSlug.SQUIRCLE_CLIP_PATH}_${size}_${curvature}`.replace(/\./g, '')
}
/**
 * Returns the path D of a squircle.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/web/utils/squircle)
 */
export function getSquirclePathD(size: number, curvature: number): string {
  let arc: number, d: string

  arc = Math.min(size / 2, size / 2) * (1 - curvature)
  d = `
    M 0 ${size / 2}
    C 0 ${arc}, ${arc} 0, ${size / 2} 0
    S ${size} ${arc}, ${size} ${size / 2}, ${size - arc} ${size}
      ${size / 2} ${size}, 0 ${size - arc}, 0 ${size / 2}
  `
  d = d.replace(/\s{2,16}/g, ' ').trim()

  return d
}

/**
 * Returns the path transform of a squircle.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/web/utils/squircle)
 */
export function getSquirclePathTransform(size: number): string {
  return `rotate(${0}, ${size / 2}, ${size / 2}) translate(${0}, ${0})`
}

/**
 * Returns the viewbox of a squircle.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/web/utils/squircle)
 */
export function getSquircleViewBox(size: number): string {
  return `0 0 ${size} ${size}`
}

/**
 * Returns the squircles container element.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/web/utils/squircle)
 */
export function getSquirclesContainer(): HTMLElement {
  let element: HTMLElement | null

  element = document.getElementById(SQUIRCLES_CONTAINER_ID)
  if (element) return element

  element = document.createElement('div')
  element.setAttribute('id', SQUIRCLES_CONTAINER_ID)

  element.style.height = '0px'
  element.style.opacity = '0'
  element.style.pointerEvents = 'none'
  element.style.position = 'absolute'
  element.style.width = '0px'

  document.body.append(element)

  return element
}
