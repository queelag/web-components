import type { FormControlElementTarget } from '../definitions/types.js'
import type { AracnaFormControlElement as FormControlElement } from '../elements/core/form-control-element.js'

/**
 * The `FormControlElementCollector` class is used to store form control elements by their ID, UID  and target/path.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/web/collectors/form-control-element-collector)
 */
export class FormControlElementCollector {
  private static mapByID: Map<string, any> = new Map()
  private static mapByTarget: Map<FormControlElementTarget, Map<string, any>> = new Map()
  private static mapByUID: Map<string, any> = new Map()

  static set<T extends FormControlElement>(element: T): void {
    let mapByPath: Map<string, any> | undefined

    element.id && this.mapByID.set(element.id, element)
    element.uid && this.mapByUID.set(element.uid, element)

    if (!element.target || !element.path) {
      return
    }

    mapByPath = this.mapByTarget.get(element.target)
    if (!mapByPath) {
      this.mapByTarget.set(element.target, new Map())
      return this.set(element)
    }

    mapByPath.set(element.path, element)
  }

  static get<T extends FormControlElement>(id: string): T | undefined
  static get<T extends FormControlElement>(uid: string): T | undefined
  static get<T extends FormControlElement>(target: FormControlElementTarget, path: string): T | undefined
  static get<T extends FormControlElement>(...args: any[]): T | undefined {
    if (typeof args[0] === 'string') {
      return this.mapByID.get(args[0]) || this.mapByUID.get(args[0])
    }

    return this.mapByTarget.get(args[0])?.get(args[1])
  }

  static delete<T extends FormControlElement>(element: T): void {
    this.mapByID.delete(element.id)
    this.mapByUID.delete(element.uid)

    if (!element.target || !element.path) {
      return
    }

    this.mapByTarget.get(element.target)?.delete(element.path)
  }
}
