import { beforeAll, describe, expect, it } from 'vitest'
import { getSquircleHTML } from '../../src/utils/squircle-utils'

describe('SquircleUtils', () => {
  let id: string, size: number

  beforeAll(() => {
    id = 'squircle'
    size = 24
  })

  it('gets squircle html', () => {
    expect(getSquircleHTML(id, size)).toBeTruthy()
    expect(getSquircleHTML(id, size, 0.5)).toBeTruthy()
  })
})
