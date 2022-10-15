import { describe, expect, it } from 'vitest'
import { getShapeStyleInfo } from '../../src/utils/shape.utils'

describe('ShapeUtils', () => {
  it('gets shape style info', () => {
    expect(getShapeStyleInfo('circle')).toStrictEqual({ borderRadius: '9999px' })
    expect(getShapeStyleInfo('rectangle')).toStrictEqual({ borderRadius: undefined })
    expect(getShapeStyleInfo('rectangle', { rectangle: { radius: 5 } })).toStrictEqual({ borderRadius: '5px' })
    expect(getShapeStyleInfo('square')).toStrictEqual({ borderRadius: undefined })
    expect(getShapeStyleInfo('square', { square: { radius: 5 } })).toStrictEqual({ borderRadius: '5px' })
    expect(getShapeStyleInfo('squircle', { squircle: { id: 'squircle' } })).toStrictEqual({ clipPath: `url(#squircle)` })
  })
})
