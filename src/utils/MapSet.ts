export class MapSet<S, T> {
  entries: Map<S, Set<T>> = new Map();

  add(a: S, b: T) {
    if (!this.entries.has(a)) {
      this.entries.set(a, new Set<T>());
    }
    this.entries.get(a)?.add(b);
  }

  has(a: S, b: T) {
    return !!this.entries.get(a)?.has(b);
  }
}
