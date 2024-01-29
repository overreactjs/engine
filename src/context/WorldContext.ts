import React from "react";
import { Body } from "detect-collisions";
import { CollisionUpdateFunction, CollisionEventFunction, Property, Position } from "../types";
import { VariableProperty } from "../utils";

type WorldContextProps = {
  registerCollider: (id: string, active: Property<boolean>, tags: string[], body: Body, fn: CollisionUpdateFunction) => () => void;
  registerHandler: (id: string, fn: CollisionEventFunction) => () => void;
  registerPostHandler: (fn: (delta: number) => void) => () => void;
  isInside: (id: string, pos?: Property<Position>) => boolean;
  pointer: Property<Position>;
}

export const WorldContext = React.createContext<WorldContextProps>({
  registerCollider: () => () => {},
  registerHandler: () => () => {},
  registerPostHandler: () => () => {},
  isInside: () => false,
  pointer: new VariableProperty([0, 0]),
});
