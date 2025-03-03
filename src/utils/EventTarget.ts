import { EventHandler } from "../types";

export class EventTarget<E, T = undefined> {
  listeners: Map<E, Set<EventHandler<T>>> = new Map();
  uncaught: Map<E, Array<T>> = new Map();

  addEventListener(type: E, callback: EventHandler<T>): void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }

    this.listeners.get(type)?.add(callback);

    const uncaught = this.uncaught.get(type) || [];
    if (uncaught.length > 0) {
      for (const payload of uncaught) {
        this.fireEvent(type, payload);
      }

      this.uncaught.delete(type);
    }
  }

  removeEventListener(type: E, callback: EventHandler<T>): void {
    if (this.listeners.get(type)?.has(callback)) {
      this.listeners.get(type)?.delete(callback);
    }
  }

  fireEvent(type: E, payload: T): void {
    const listeners = this.listeners.get(type);

    if (listeners) {
      for (const listener of listeners) {
        listener(payload);
      }
    } else {
      if (!this.uncaught.has(type)) {
        this.uncaught.set(type, []);
      }

      this.uncaught.get(type)?.push(payload);
    }
  }
}
