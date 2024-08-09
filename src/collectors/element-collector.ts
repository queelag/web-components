import type { AracnaBaseElement as BaseElement } from '../elements/core/base-element.js'

/**
 * The `ElementCollector` class is used to store elements by their ID and UID.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/web/collectors/element-collector)
 */
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
    element.id && this.mapByID.set(element.id, element)
    element.uid && this.mapByUID.set(element.uid, element)
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
    return this.mapByID.get(args[0]) || this.mapByUID.get(args[0])
  }

  /**
   * Deletes an element by its ID and UID.
   */
  static delete<T extends BaseElement>(element: T): void {
    this.mapByID.delete(element.id)
    this.mapByUID.delete(element.uid)
  }
}
