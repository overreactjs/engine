import { useCallback, useRef } from "react";
import { Position, Property, Size } from "../types";
import { Body, BoxBody } from "../utils";
import { useCollider } from "./useCollider";

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
