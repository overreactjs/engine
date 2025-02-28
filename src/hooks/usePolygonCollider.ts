import { useCallback, useRef } from "react";
import { PotentialVector } from "detect-collisions";
import { Position, Property } from "../types";
import { Body, PolygonBody } from "../utils";
import { useCollider } from "./useCollider";

/**
 * Register a new collider that can be any arbitrary polygon in shape.
 */
export const usePolygonCollider = (
  id: string | undefined,
  active: Property<boolean>,
  tags: Property<string[]>,
  pos: Property<Position>,
  points: Position[],
) => {
  const [x, y] = pos.current;

  const box = useRef(new PolygonBody({ x, y }, points.map(([x, y]): PotentialVector => ({ x, y }))));

  const update = useCallback((body: Body) => {
    body.setPosition(pos.current[0], pos.current[1]);
  }, [pos]);

  useCollider(id, active, tags, box, update);
};
