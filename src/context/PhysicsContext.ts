import React from "react";
import { Engine } from "matter-js";
import { PhysicsEvent, PhysicsEventType, PhysicsUpdateFunction, Position, Property, Velocity } from "../types";
import { VariableProperty } from "../utils";

type PhysicsContextProps = {
  engine: Property<Engine | null>;
  register: (body: Matter.Body, fn: PhysicsUpdateFunction) => () => void;
  setGravity: (velocity: Velocity) => void;
  setVelocity: (body: Matter.Body, velocity: Velocity) => void;
  applyForce: (body: Matter.Body, position: Position, velocity: Velocity) => void;
  addEventListener: (type: PhysicsEventType, fn: (event: PhysicsEvent) => void) => void;
  removeEventListener: (type: PhysicsEventType, fn: (event: PhysicsEvent) => void) => void;
}

export const PhysicsContext = React.createContext<PhysicsContextProps>({
  engine: new VariableProperty(null),
  register: () => () => {},
  setGravity: () => {},
  setVelocity: () => {},
  applyForce: () => {},
  addEventListener: () => {},
  removeEventListener: () => {},
});
