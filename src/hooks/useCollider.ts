import { useId, useEffect, useRef, useCallback } from "react";
import { Body, Box } from "detect-collisions";
import { CollisionUpdateFunction, Position, Property, Size } from "../types";
import { useWorld } from "./useWorld";

/**
 * Register a new collider instance.
 */
export const useCollider = (
  id: string | undefined,
  tags: Property<string[]>,
  body: Property<Body>,
  update: CollisionUpdateFunction
) => {
  const { registerCollider } = useWorld();
  const generatedId = useId();
  const resolvedId = id || generatedId;

  useEffect(
    () => registerCollider(resolvedId, tags.current, body.current, update),
    [resolvedId, tags, update, registerCollider, body],
  );
};

/**
 * Register a new box shaped collider, and keep the position of it in sync.
 */
export const useBoxCollider = (
  id: string | undefined,
  tags: Property<string[]>,
  pos: Property<Position>,
  size: Property<Size>
) => {
  const [x, y] = pos.current;
  const [w, h] = size.current;

  const box = useRef(new Box({ x, y }, w, h));

  const update = useCallback((body: Body) => {
    body.setPosition(pos.current[0], pos.current[1]);
  }, [pos]);

  useCollider(id, tags, box, update);
};
