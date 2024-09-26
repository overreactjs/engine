import React from "react";
import { CollisionUpdateFunction, CollisionEventFunction, Property, Position } from "../types";
import { Body, VariableProperty } from "../utils";

type WorldContextProps = {
  registerCollider: (id: string, active: Property<boolean>, tags: Property<string[]>, body: Body, fn: CollisionUpdateFunction) => () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  registerHandler: (id: string, fn: CollisionEventFunction<any>) => () => void;
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
