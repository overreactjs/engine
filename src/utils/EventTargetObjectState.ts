import { EventHandler } from "../types";
import { EventTarget } from "./EventTarget";
import { ObjectState } from "./ObjectState";

export class EventTargetObjectState<E, T> extends ObjectState {
  private events = new EventTarget<E, T>();

  addEventListener(type: E, callback: EventHandler<T>): void {
    this.events.addEventListener(type, callback);
  }

  removeEventListener(type: E, callback: EventHandler<T>): void {
    this.events.removeEventListener(type, callback);
  }

  fireEvent(type: E, payload: T): void {
    this.events.fireEvent(type, payload);
  }
}
