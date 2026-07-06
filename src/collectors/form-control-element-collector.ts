import type { FormControlElementTarget } from '../definitions/types.js'
import type { AracnaFormControlElement as FormControlElement } from '../elements/core/form-control-element.js'

/**
 * The `FormControlElementCollector` class is used to store form control elements by their ID, UID  and target/path.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/web/collectors/form-control-element-collector)
 */
// biome-ignore lint/complexity/noStaticOnlyClass: intended
export class FormControlElementCollector {
  private static mapByID: Map<string, any> = new Map()
  private static mapByTarget: Map<FormControlElementTarget, Map<string, any>> = new Map()
  private static mapByUID: Map<string, any> = new Map()

  static set<T extends FormControlElement>(element: T): void {
    let mapByPath: Map<string, any> | undefined

    if (element.id) {
      FormControlElementCollector.mapByID.set(element.id, element)
    }

    if (element.uid) {
      FormControlElementCollector.mapByUID.set(element.uid, element)
    }

    if (!(element.target && element.path)) {
      return
    }

    mapByPath = FormControlElementCollector.mapByTarget.get(element.target)

    if (!mapByPath) {
      FormControlElementCollector.mapByTarget.set(element.target, new Map())
      return FormControlElementCollector.set(element)
    }

    mapByPath.set(element.path, element)
  }

  static get<T extends FormControlElement>(id: string): T | undefined
  static get<T extends FormControlElement>(uid: string): T | undefined
  static get<T extends FormControlElement>(target: FormControlElementTarget, path: string): T | undefined
  static get<T extends FormControlElement>(...args: any[]): T | undefined {
    if (typeof args[0] === 'string') {
      return FormControlElementCollector.mapByID.get(args[0]) || FormControlElementCollector.mapByUID.get(args[0])
    }

    return FormControlElementCollector.mapByTarget.get(args[0])?.get(args[1])
  }

  static delete<T extends FormControlElement>(element: T): void {
    FormControlElementCollector.mapByID.delete(element.id)
    FormControlElementCollector.mapByUID.delete(element.uid)

    if (!(element.target && element.path)) {
      return
    }

    FormControlElementCollector.mapByTarget.get(element.target)?.delete(element.path)
  }
}
