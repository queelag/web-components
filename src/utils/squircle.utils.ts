import { SVG_NAMESPACE_URI } from '@aracna/web'
import { html, TemplateResult } from 'lit-html'

export function getSquircleHTML(id: string, size: number, curvature: number = 0.75): TemplateResult {
  let arc: number, d: string, transform: string, viewbox: string

  arc = Math.min(size / 2, size / 2) * (1 - curvature)
  d = `
      M 0 ${size / 2}
      C 0 ${arc}, ${arc} 0, ${size / 2} 0
      S ${size} ${arc}, ${size} ${size / 2}, ${size - arc} ${size}
        ${size / 2} ${size}, 0 ${size - arc}, 0 ${size / 2}
    `
  transform = `rotate(${0}, ${size / 2}, ${size / 2}) translate(${(size - size) / 2}, ${(size - size) / 2})`
  viewbox = `0 0 ${size} ${size}`

  return html`
    <svg class="squircle" fill="black" viewBox="${viewbox}" xmlns="${SVG_NAMESPACE_URI}">
      <clipPath id="${id}">
        <path d="${d}" transform="${transform}"></path>
      </clipPath>
    </svg>
  `
}
