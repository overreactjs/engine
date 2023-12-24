import React from "react";
import { Engine } from "matter-js";
import { PhysicsEvent, PhysicsEventType, PhysicsUpdateFunction, Property } from "../types";

type PhysicsContextProps = {
  engine: Property<Engine | null>;
  register: (body: Matter.Body, fn: PhysicsUpdateFunction) => () => void;
  setGravity: (x: number, y: number) => void;
  addEventListener: (type: PhysicsEventType, fn: (event: PhysicsEvent) => void) => void;
  removeEventListener: (type: PhysicsEventType, fn: (event: PhysicsEvent) => void) => void;
}

export const PhysicsContext = React.createContext<PhysicsContextProps>({
  engine: { current: null },
  register: () => () => {},
  setGravity: () => {},
  addEventListener: () => {},
  removeEventListener: () => {},
});
