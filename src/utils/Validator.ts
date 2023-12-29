export class Validator {

  static queue: (() => void)[] = [];

  static add(fn: () => void) {
    this.queue.push(fn);
  }

  static run() {
    for (const fn of this.queue) {
      fn();
    }
    this.queue = [];
  }
}
