import { ObjectState } from "./ObjectState";
import { Validator } from "./Validator";

export class VariableProperty<T> extends ObjectState {

  _current: T;
  invalidated: boolean = false;

  constructor(initial: T) {
    super();
    this._current = this.proxy(initial);
    this.invalidate();
  }

  /**
   * If the value is an object, proxy it so that any set operations automatically invalidate the
   * property, so that any dependant DOM elements will be updated in the next render pass.
   */
  proxy(value: T) {
    const invalidate = () => this.invalidate();

    return value instanceof Object
      ? new Proxy(value, {
        set(target, prop, value) {
          invalidate();
          return Reflect.set(target, prop, value);
        }
      })
      : value;
  }

  invalidate() {
    if (this.invalidated === false) {
      this.invalidated = true;
      Validator.add(() => {
        this.invalidated = false;
      });
    }
  }

  get current() {
    return this._current;
  }

  set current(value: T) {
    this._current = this.proxy(value);
    this.invalidate();
  }
}
