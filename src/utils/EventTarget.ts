import { EventHandler } from "../types";

export class EventTarget<E, T = undefined> {
  listeners: Map<E, Set<EventHandler<T>>> = new Map();

  addEventListener(type: E, callback: EventHandler<T>): void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }

    this.listeners.get(type)?.add(callback);
  }

  removeEventListener(type: E, callback: EventHandler<T>): void {
    if (this.listeners.get(type)?.has(callback)) {
      this.listeners.get(type)?.delete(callback);
    }
  }

  fireEvent(type: E, payload: T): void {
    for (const listener of this.listeners.get(type) || []) {
      listener(payload);
    }
  }
}
