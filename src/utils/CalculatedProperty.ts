import { ObjectState } from "./ObjectState";

export class CalculatedProperty<T> extends ObjectState {

  private fn: () => T;

  constructor(fn: () => T) {
    super();
    this.fn = fn;
  }

  listen(fn: (value: T) => void) {
    return fn(this.fn());
  }

  get current() {
    return this.fn();
  }

  set current(_: T) {
    // do nothing
  }

  get invalidated() {
    return true;
  }

  set invalidated(_: boolean) {
    // do nothing
  }
}
