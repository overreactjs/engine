export class SlidingWindow {
  _values: number[] = [];
  size: number;
  index: number = 0;
  
  constructor(size: number) {
    this.size = size;
  }

  get values() {
    return [...this._values];
  }

  push(value: number) {
    this._values[this.index] = value;
    this.index = (this.index + 1) % this.size;
  }

  mean(): number {
    return this._values.reduce((result, current) => result + current, 0) / this.size;
  }
}
