import { KeyboardEventKey } from '@aracna/web'
import { describe, expect, it } from 'vitest'
import { gkek } from '../../src/functions/gkek'

describe('gkek', () => {
  it('should return the key', () => {
    for (let key in KeyboardEventKey) {
      expect(gkek(new KeyboardEvent('keydown', { key: KeyboardEventKey[key] }))).toBe(key)
    }
  })
})
