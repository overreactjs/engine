import { MutableRefObject, useCallback, useContext, useEffect, useRef } from "react";
import { Bodies, Body } from "matter-js";
import { PhysicsContext } from "../context";
import { Property, PhysicsUpdateFunction, Position, Size } from "../types";
import { usePropertyListen } from "./usePropertyListen";

/**
 * Register a new physics body.
 */
export const usePhysicsBody = (
  body: MutableRefObject<Matter.Body>,
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
): MutableRefObject<Body> => {
  const [x, y] = pos.current;
  const [w, h] = size.current;

  const body = useRef(Bodies.rectangle(x, y, w, h, options));
  const update = useSyncPositions(body, pos);

  usePhysicsBody(body, update);

  return body;
};

/**
 * Register a new circular physics body.
 */
export const useCirclePhysics = (
  pos: Property<Position>,
  radius: Property<number>,
  options?: Matter.IBodyDefinition,
): MutableRefObject<Body> => {
  const [x, y] = pos.current;
  const r = radius.current;

  const body = useRef(Bodies.circle(x, y, r, options));
  const update = useSyncPositions(body, pos);

  usePhysicsBody(body, update);

  return body;
};

/**
 * Keep the given position property in sync with the position of the physics body.
 * To do this we have to keep track of the last position, so that if it is manually changed, the
 * physics body changes to match, otherwise, the physics body position take priority.
 */
export const useSyncPositions = (body: MutableRefObject<Body>, pos: Property<Position>) => {
  // Update the position of the physics body in the physics engine.
  const updateBody = useCallback(([x, y]: Position) => {
    if (x !== body.current.position.x || y !== body.current.position.y) {
      Body.setPosition(body.current, { x, y });
    }
  }, [body]);

  // Listen for changes made to the position, then reflect those changes in the physics engine.
  usePropertyListen(pos, updateBody);

  // Return a callback that is called by the physics engine to synchronise the position property.
  return useCallback(({ position: { x, y } }: Matter.Body) => {
    if (x !== pos.current[0] || y !== pos.current[1]) {
      pos.current = [x, y];
    }
  }, [pos]);
};
