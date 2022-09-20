import { createDocumentElement } from '@queelag/core'
import { useRef } from 'preact/hooks'

interface SafeRef<T> {
  current: T
}

/**
 * Creates a ref with a fallback K element only if document.createElement is available, otherwise returns an empty object.
 */
export const useSafeRef = <K extends keyof HTMLElementTagNameMap>(tagName: K, options?: ElementCreationOptions): SafeRef<HTMLElementTagNameMap[K]> => {
  return useRef(createDocumentElement(tagName, options))
}
