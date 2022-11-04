import type { DetailedHTMLProps, HTMLAttributes } from 'preact/compat'

export type ElementProps<Element extends HTMLElement, Attributes> = DetailedHTMLProps<HTMLAttributes<Element>, Element> & Attributes
