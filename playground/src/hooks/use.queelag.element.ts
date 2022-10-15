import type { AttributeChangeEvent, StateChangeEvent } from '@queelag/web'
import type { RefObject } from 'preact'
import { useEffect, useReducer, useRef } from 'preact/hooks'
import { useEventListener } from './use.event.listener'

interface Options {
  attribute?: {
    blacklist?: string[]
    dispatch?: boolean
    whitelist?: string[]
  }
  state?: {
    blacklist?: string[]
    dispatch?: boolean
    whitelist?: string[]
  }
}

interface ReturnInterface<K extends keyof HTMLElementTagNameMap> {
  element: HTMLElementTagNameMap[K] | null
  ref: RefObject<HTMLElementTagNameMap[K]>
}

export function useQueelagElement<K extends keyof HTMLElementTagNameMap>(tagName: K, options?: Options): ReturnInterface<K> {
  const ref = useRef(null)
  const [, dispatch] = useReducer(() => ({}), {})

  const onAttributeChanged = (event: AttributeChangeEvent) => {
    if (options?.attribute?.dispatch !== true) {
      return
    }

    if (options.attribute.blacklist && options.attribute.blacklist.includes(event.detail.name)) {
      return
    }

    if (options.attribute.whitelist && !options.attribute.whitelist.includes(event.detail.name)) {
      return
    }

    dispatch({})
  }

  const onStateChanged = (event: StateChangeEvent<any>) => {
    if (options?.state?.dispatch !== true) {
      return
    }

    if (options.state.blacklist && options.state.blacklist.includes(event.detail.name)) {
      return
    }

    if (options.state.whitelist && !options.state.whitelist.includes(event.detail.name)) {
      return
    }

    dispatch({})
  }

  useEventListener(ref, 'attribute-change', onAttributeChanged, [ref.current])
  useEventListener(ref, 'state-change', onStateChanged, [ref.current])
  useEffect(() => dispatch({}), [ref.current])

  return { element: ref.current, ref }
}
