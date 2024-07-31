import { Property } from "../types";
import { ObjectState } from "./ObjectState";
import { Validator } from "./Validator";

type Listener<T> = (value: Property<T>) => void;

export class VariableProperty<T> extends ObjectState {

  private _current: T;
  private _invalidated: boolean = false;
  
  private listeners: Set<Listener<T>> = new Set();

  constructor(initial: T) {
    super();
    this._current = this.proxy(initial);
    this._invalidated = true;
  }

  listen(listener: (value: Property<T>) => void) {
    this.listeners.add(listener);
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

    this.listeners.forEach((listener) => {
      listener(this);
    });
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
