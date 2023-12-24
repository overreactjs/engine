export class SlidingWindow {
  values: number[] = [];
  size: number;
  index: number = 0;
  
  constructor(size: number) {
    this.size = size;
  }

  push(value: number) {
    this.values[this.index] = value;
    this.index = (this.index + 1) % this.size;
  }

  mean(): number {
    return this.values.reduce((result, current) => result + current, 0) / this.size;
  }
}
