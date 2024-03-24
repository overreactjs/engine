import { Property } from "../types";

export class MergeProperty<A, B, OUT> {

  private a: Property<A>;
  private b: Property<B>;
  private fn: (a: A, b: B) => OUT;

  constructor(a: Property<A>, b: Property<B>, fn: (a: A, b: B) => OUT) {
    this.a = a;
    this.b = b;
    this.fn = fn;
  }
  
  get current(): OUT {
    return this.fn(this.a.current, this.b.current);
  }

  get invalidated(): boolean {
    return this.a.invalidated || this.b.invalidated;
  }

  set invalidated(value: boolean) {
    this.a.invalidated = value;
    this.b.invalidated = value;
  }
}
