import { useId, useEffect, MutableRefObject } from "react";
import { CollisionUpdateFunction, Property } from "../types";
import { useWorld } from "./useWorld";
import { Body } from "../utils";

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
