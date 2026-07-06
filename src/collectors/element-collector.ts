import type { AracnaBaseElement as BaseElement } from '../elements/core/base-element.js'

/**
 * The `ElementCollector` class is used to store elements by their ID and UID.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/web/collectors/element-collector)
 */
// biome-ignore lint/complexity/noStaticOnlyClass: intended
export class ElementCollector {
  /**
   * The map of elements by their ID.
   */
  private static mapByID: Map<string, any> = new Map()
  /**
   * The map of elements by their UID.
   */
  private static mapByUID: Map<string, any> = new Map()

  /**
   * Stores an element by its ID and UID.
   */
  static set<T extends BaseElement>(element: T): void {
    if (element.id) {
      ElementCollector.mapByID.set(element.id, element)
    }

    if (element.uid) {
      ElementCollector.mapByUID.set(element.uid, element)
    }
  }

  /**
   * Returns an element by its ID
   */
  static get<T extends BaseElement>(id: string): T | undefined
  /**
   * Returns an element by its UID
   */
  static get<T extends BaseElement>(uid: string): T | undefined
  static get<T extends BaseElement>(...args: any[]): T | undefined {
    return ElementCollector.mapByID.get(args[0]) || ElementCollector.mapByUID.get(args[0])
  }

  /**
   * Deletes an element by its ID and UID.
   */
  static delete<T extends BaseElement>(element: T): void {
    ElementCollector.mapByID.delete(element.id)
    ElementCollector.mapByUID.delete(element.uid)
  }
}
