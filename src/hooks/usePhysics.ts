import { useCallback, useContext, useEffect, useRef } from "react";
import { Bodies, Body } from "matter-js";
import { PhysicsContext } from "../context";
import { PhysicsUpdateFunction, Position, Property, Size } from "../types";
import { useProperty } from "./useProperty";

/**
 * Register a new physics body.
 */
export const usePhysicsBody = (
  body: Property<Matter.Body>,
  update: PhysicsUpdateFunction,
) => {
  const { register } = useContext(PhysicsContext);

  useEffect(
    () => register(body.current, update),
    [body, register, update],
  );
};

/**
 * Register a new box shaped physics body.
 */
export const useBoxPhysics = (
  pos: Property<Position>,
  size: Property<Size>,
  options?: Matter.IBodyDefinition,
) => {
  const [x, y] = pos.current;
  const [w, h] = size.current;

  const body = useRef(Bodies.rectangle(x, y, w, h, options));
  const update = useSyncPositions(pos);

  usePhysicsBody(body, update);
};

/**
 * Register a new circular physics body.
 */
export const useCirclePhysics = (
  pos: Property<Position>,
  radius: Property<number>,
  options?: Matter.IBodyDefinition,
) => {
  const [x, y] = pos.current;
  const r = radius.current;

  const body = useRef(Bodies.circle(x, y, r, options));
  const update = useSyncPositions(pos);

  usePhysicsBody(body, update);
};

/**
 * Keep the given position property in sync with the position of the physics body.
 * To do this we have to keep track of the last position, so that if it is manually changed, the
 * physics body changes to match, otherwise, the physics body position take priority.
 */
const useSyncPositions = (pos: Property<Position>) => {
  const last = useProperty<Position | null>([...pos.current]);

  return useCallback((body: Matter.Body) => {
    if (!last.current || last.current[0] !== pos.current[0] || last.current[1] !== pos.current[1]) {
      Body.setPosition(body, { x: pos.current[0], y: pos.current[1] });
      last.current = [pos.current[0], pos.current[1]];

    } else if (body.position.x !== pos.current[0] || body.position.y !== pos.current[1]) {
      pos.current[0] = body.position.x;
      pos.current[1] = body.position.y;
    }
  }, [pos]);
};
