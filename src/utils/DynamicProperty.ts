import { Property } from "../types";

export class DynamicProperty<IN, OUT> {

  private _invalidated: boolean = true;
  private value: Property<IN>;
  private fn: (value: IN) => OUT;

  constructor(value: Property<IN>, fn: (value: IN) => OUT) {
    this.value = value;
    this.fn = fn;
  }
  
  get current(): OUT {
    return this.fn(this.value.current);
  }

  get invalidated(): boolean {
    return this._invalidated || this.value.invalidated;
  }

  set invalidated(value: boolean) {
    this._invalidated = false;
    this.value.invalidated = value;
  }
}
