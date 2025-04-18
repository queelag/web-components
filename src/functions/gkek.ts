import { KeyboardEventKey } from '@aracna/web'

/**
 * gkek stands for "get key event key".
 */
export function gkek(event: KeyboardEvent): string | undefined {
  return Object.entries(KeyboardEventKey).find(([_, value]: [string, KeyboardEventKey]) => value === event.key)?.[0]
}
