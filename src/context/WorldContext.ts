import React from "react";
import { Body } from "detect-collisions";
import { CollisionUpdateFunction, CollisionEventFunction, Property, Position } from "../types";

type WorldContextProps = {
  registerCollider: (id: string, tags: string[], body: Body, fn: CollisionUpdateFunction) => () => void;
  registerHandler: (id: string, fn: CollisionEventFunction) => () => void;
  isInside: (id: string, pos?: Property<Position>) => boolean;
  mouse: Property<Position>;
  touch: Property<Position>;
}

export const WorldContext = React.createContext<WorldContextProps>({
  registerCollider: () => () => {},
  registerHandler: () => () => {},
  isInside: () => false,
  mouse: { current: [0, 0] },
  touch: { current: [0, 0] },
});
