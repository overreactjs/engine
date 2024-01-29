import React, { useCallback, useMemo, useRef } from "react";
import { System, Body, Point } from "detect-collisions";
import { Node } from "./Node";
import { CollisionEventFunction, CollisionUpdateFunction, Property, Position, CollisionEventFunctionProps } from "../types";
import { useDynamicProperty, usePointer, useUpdate } from "../hooks";
import { WorldContext } from "../context";
import { MapSet } from "../utils";

type WorldProps = {
  children: React.ReactNode;
}

/**
 * World
 * -------
 * 
 * A collection of objects that can move independently and collide with one another.
 */
export const World: React.FC<WorldProps> = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null);
  const system = useRef<System>(new System());
  const ids = useRef<Map<Body, string>>(new Map());
  const bodies = useRef<Map<string, Body>>(new Map());
  const bodyTags = useRef<Map<Body, string[]>>(new Map());
  const bodyActive = useRef<Map<Body, Property<boolean>>>(new Map());
  const updaters = useRef<Map<Body, CollisionUpdateFunction>>(new Map());
  const handlers = useRef<Map<string, Set<CollisionEventFunction>>>(new Map());;
  const overlaps = useRef<MapSet<Body, Body>>(new MapSet());
  const postHandlers = useRef<Set<(delta: number) => void>>(new Set());

  const registerCollider = useCallback((id: string, active: Property<boolean>, tags: string[], body: Body, fn: CollisionUpdateFunction) => {
    if (!bodies.current.has(id)) {
      system.current.insert(body);
      bodies.current.set(id, body);
      bodyTags.current.set(body, tags);
      bodyActive.current.set(body, active);
      updaters.current.set(body, fn);
      ids.current.set(body, id);
    }

    return () => {
      if (bodies.current.has(id)) {
        const body = bodies.current.get(id);
        if (body) {
          system.current.remove(body)
          updaters.current.delete(body);
          ids.current.delete(body);
        }
      }

      handlers.current.delete(id);
      bodies.current.delete(id);
    }
  }, []);

  /**
   * 
   */
  const registerHandler = useCallback((id: string, fn: CollisionEventFunction) => {
    if (!handlers.current.has(id)) {
      handlers.current.set(id, new Set());
    }

    handlers.current.get(id)?.add(fn);

    return () => {
      handlers.current.get(id)?.delete(fn);
    };
  }, []);

  /**
   * 
   */
  const registerPostHandler = useCallback((fn: (delta: number) => void) => {
    postHandlers.current.add(fn);
    return () => postHandlers.current.delete(fn);
  }, []);

  /**
   * Check to see if the given point is inside of the body with the given identifier.
   */
  const isInside = useCallback((id: string, pos?: Property<Position>) => {
    const body = bodies.current.get(id);
    if (body && pos?.current) {
      const point = new Point({ x: pos.current[0], y: pos.current[1] });
      return system.current.checkCollision(point, body);
    }
    return false;
  }, []);
  
  /**
   * Update all bodies so that they 
   */
  useUpdate((delta) => {
    // Run all body update callbacks.
    for (const [body, update] of updaters.current) {
      update(body);
    }

    const newOverlaps = new MapSet<Body, Body>();
    const collisions = new Map<Body, CollisionEventFunctionProps[]>();

    // Check for collisions.
    system.current.checkAll((collision) => {
      if (!collisions.has(collision.a)) {
        collisions.set(collision.a, []);
      }

      const active = bodyActive.current.get(collision.a)?.current 
        && bodyActive.current.get(collision.b)?.current;

      // Only action the collision if the collision box is currently active.
      if (active) {
        const tags = bodyTags.current.get(collision.b) || [];
        const firstTime = !overlaps.current.has(collision.a, collision.b);

        const record = {
          a: collision.a,
          b: collision.b,
          overlap: { ...collision.overlapV },
          tags,
          firstTime,
        };

        collisions.get(collision.a)?.push(record);
        newOverlaps.add(collision.a, collision.b);
      }
    });

    // Call all of the registered handlers for each collision body.
    for (const [body, events] of collisions) {
      const id = ids.current.get(body);

      if (id) {
        for (const handler of handlers.current.get(id) || []) {
          handler(events, delta);
        }
      }
    }

    overlaps.current = newOverlaps;

    // Run all post-collisions updater functions.
    for (const handler of postHandlers.current) {
      handler(delta);
    }
  });

  /**
   * Convert the global pointer position to world co-ordinates.
   */
  const pointer = usePointer();
  const worldPointerPos = useDynamicProperty(pointer.pos, ([x, y]): Position => {
    const rect = ref.current?.getBoundingClientRect();
    return [x - (rect?.x || 0), y - (rect?.y || 0)];
  });

  const worldContext = useMemo(
    () => ({ registerCollider, registerHandler, registerPostHandler, isInside, pointer: worldPointerPos }),
    [registerCollider, registerHandler, registerPostHandler, isInside, worldPointerPos],
  );

  return (
    <WorldContext.Provider value={worldContext}>
      <Node>
        <div ref={ref}>{children}</div>
      </Node>
    </WorldContext.Provider>
  );
};
