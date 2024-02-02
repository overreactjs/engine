import { Property } from "../types";

export class DynamicProperty<IN, OUT> {

  value: Property<IN>;
  fn: (value: IN) => OUT;

  constructor(value: Property<IN>, fn: (value: IN) => OUT) {
    this.value = value;
    this.fn = fn;
  }
  
  get current(): OUT {
    return this.fn(this.value.current);
  }

  get invalidated(): boolean {
    return this.value.invalidated;
  }

  set invalidated(value: boolean) {
    this.value.invalidated = value;
  }
}
