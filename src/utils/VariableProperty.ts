import { ObjectState } from "./ObjectState";
import { Validator } from "./Validator";

export class VariableProperty<T> extends ObjectState {

  private _current: T;
  private _invalidated: boolean = false;

  constructor(initial: T) {
    super();
    this._current = this.proxy(initial);
    this._invalidated = true;
  }

  /**
   * If the value is an object, proxy it so that any set operations automatically invalidate the
   * property, so that any dependant DOM elements will be updated in the next render pass.
   */
  proxy(value: T) {
    const invalidate = () => this.invalidated = true;

    return value instanceof Object
      ? new Proxy(value, {
        set(target, prop, value) {
          invalidate();
          return Reflect.set(target, prop, value);
        }
      })
      : value;
  }

  get current() {
    return this._current;
  }

  set current(value: T) {
    this._current = this.proxy(value);
    this._invalidated = true;
  }

  get invalidated() {
    return this._invalidated;
  }

  set invalidated(value: boolean) {
    if (value) {
      this._invalidated = true;
    } else {
      Validator.add(() => this._invalidated = false);
    }
  }
}
