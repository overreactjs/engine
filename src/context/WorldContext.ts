import React from "react";
import { Body } from "detect-collisions";
import { CollisionUpdateFunction, CollisionEventFunction, Property, Position } from "../types";
import { VariableProperty } from "../utils";

type WorldContextProps = {
  registerCollider: (id: string, tags: string[], body: Body, fn: CollisionUpdateFunction) => () => void;
  registerHandler: (id: string, fn: CollisionEventFunction) => () => void;
  registerPostHandler: (fn: () => void) => () => void;
  isInside: (id: string, pos?: Property<Position>) => boolean;
  mouse: Property<Position>;
  touch: Property<Position>;
}

export const WorldContext = React.createContext<WorldContextProps>({
  registerCollider: () => () => {},
  registerHandler: () => () => {},
  registerPostHandler: () => () => {},
  isInside: () => false,
  mouse: new VariableProperty([0, 0]),
  touch: new VariableProperty([0, 0]),
});
