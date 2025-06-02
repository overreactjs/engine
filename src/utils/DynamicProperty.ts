import { Property } from "../types";

export class DynamicProperty<IN, OUT> {

  private _invalidated: boolean = true;
  private source: Property<IN>;
  private fn: (source: IN) => OUT;

  constructor(source: Property<IN>, fn: (source: IN) => OUT) {
    this.source = source;
    this.fn = fn;
  }

  listen(fn: (value: OUT) => void) {
    return this.source.listen(() => fn(this.current));
  }
  
  get current(): OUT {
    return this.fn(this.source.current);
  }

  get invalidated(): boolean {
    return this._invalidated || this.source.invalidated;
  }

  set invalidated(value: boolean) {
    this._invalidated = false;
    this.source.invalidated = value;
  }
}
