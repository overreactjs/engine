import { useId, useEffect, useCallback, useRef, MutableRefObject } from "react";
import { CollisionUpdateFunction, Position, Property, Size } from "../types";
import { useWorld } from "./useWorld";
import { Body, BoxBody } from "../utils";

/**
 * Register a new collider instance.
 */
export const useCollider = (
  id: string | undefined,
  active: Property<boolean>,
  tags: Property<string[]>,
  body: MutableRefObject<Body>,
  update: CollisionUpdateFunction,
) => {
  const { registerCollider } = useWorld();
  const generatedId = useId();
  const resolvedId = id || generatedId;

  useEffect(
    () => registerCollider(resolvedId, active, tags, body.current, update),
    [resolvedId, active, tags, update, registerCollider, body],
  );
};

/**
 * Register a new box shaped collider, and keep the position of it in sync.
 */
export const useBoxCollider = (
  id: string | undefined,
  active: Property<boolean>,
  tags: Property<string[]>,
  pos: Property<Position>,
  size: Property<Size>,
  entity?: unknown,
) => {
  const [x, y] = pos.current;
  const [w, h] = size.current;

  const box = useRef(new BoxBody({ x, y }, w, h, entity));

  const update = useCallback((body: Body) => {
    body.setPosition(pos.current[0], pos.current[1]);
  }, [pos]);

  useCollider(id, active, tags, box, update);
};
