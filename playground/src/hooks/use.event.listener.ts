import type { RefObject } from 'preact'
import { Inputs, useEffect } from 'preact/hooks'

export function useEventListener<T extends Element, E extends Event>(
  ref: RefObject<T | null>,
  type: string,
  listener: (event: E) => void,
  inputs: Inputs = []
) {
  useEffect(() => {
    ref.current?.addEventListener(type as any, listener)
    return () => ref.current?.removeEventListener(type as any, listener)
  }, inputs)
}
