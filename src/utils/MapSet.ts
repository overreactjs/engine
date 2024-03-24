export class MapSet<S, T> {
  entries: Map<S, Set<T>> = new Map();

  add(a: S, b: T) {
    if (!this.entries.has(a)) {
      this.entries.set(a, new Set<T>());
    }
    this.entries.get(a)?.add(b);
  }

  delete(a: S, b: T) {
    this.entries.get(a)?.delete(b);
  }

  has(a: S, b: T) {
    return !!this.entries.get(a)?.has(b);
  }

  get size() {
    let result = 0;
    for (const entry of this.entries) {
      result += entry[1].size;
    }
    return result;
  }
}
