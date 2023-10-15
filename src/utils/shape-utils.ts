import { getElementStyleCompatibleValue, Shape, ShapeOptions } from '@aracna/web'
import { StyleInfo } from 'lit-html/directives/style-map.js'

export function getShapeStyleInfo(shape?: Shape, options?: ShapeOptions): StyleInfo {
  switch (shape) {
    case 'circle':
      return { borderRadius: '9999px', overflow: 'hidden' }
    case 'rectangle':
      return { borderRadius: getElementStyleCompatibleValue(options?.rectangle?.radius), overflow: 'hidden' }
    case 'square':
      return { borderRadius: getElementStyleCompatibleValue(options?.square?.radius), overflow: 'hidden' }
    case 'squircle':
      if (!options?.squircle?.id) {
        return {}
      }

      return { clipPath: `url(#${options.squircle.id})`, overflow: 'hidden' }
    default:
      return {}
  }
}
