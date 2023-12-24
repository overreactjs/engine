import React, { useCallback, useMemo, useRef } from "react";
import { System, Body, Point } from "detect-collisions";
import { Node } from "./Node";
import { CollisionEventFunction, CollisionUpdateFunction, Position, Property } from "../types";
import { useDynamicProperty, useMouse, useTouch, useUpdate } from "../hooks";
import { WorldContext } from "../context";

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
  const bodies = useRef<Map<string, Body>>(new Map());
  const bodyTags = useRef<Map<Body, string[]>>(new Map());
  const updaters = useRef<Map<Body, CollisionUpdateFunction>>(new Map());
  const handlers = useRef<Map<Body, Set<CollisionEventFunction>>>(new Map());
  const overlaps = useRef(new OverlappingSet());

  const registerCollider = useCallback((id: string, tags: string[], body: Body, fn: CollisionUpdateFunction) => {
    if (!bodies.current.has(id)) {
      system.current.insert(body);
      bodies.current.set(id, body);
      bodyTags.current.set(body, tags);
      updaters.current.set(body, fn);
    }

    return () => {
      if (bodies.current.has(id)) {
        const body = bodies.current.get(id);
        if (body) {
          system.current.remove(body)
          updaters.current.delete(body);
          handlers.current.delete(body);
          bodies.current.delete(id);
        }
      }
    }
  }, []);

  const registerHandler = useCallback((id: string, fn: CollisionEventFunction) => {
    const body = bodies.current.get(id);
    if (body) {
      if (!handlers.current.has(body)) {
        handlers.current.set(body, new Set());
      }
      handlers.current.get(body)?.add(fn);
    }

    return () => {
      if (body) {
        handlers.current.get(body)?.delete(fn);
      }
    };
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
  useUpdate(() => {
    // Run all body update callbacks.
    for (const [body, update] of updaters.current) {
      update(body);
    }

    const newOverlaps = new OverlappingSet();

    // Check for collisions.
    system.current.checkAll((collision) => {
      for (const handler of handlers.current.get(collision.a) || []) {
        const tags = bodyTags.current.get(collision.b) || [];
        const firstTime = !overlaps.current.has(collision.a, collision.b);
        
        handler({ collision, tags, firstTime });
        newOverlaps.add(collision.a, collision.b);
      }
    });

    overlaps.current = newOverlaps;
  });

  /**
   * Convert the global mouse position to world co-ordinates.
   */
  const mouse = useMouse();
  const worldMousePos = useDynamicProperty(mouse.pos, ([x, y]): Position => {
    const rect = ref.current?.getBoundingClientRect();
    return [x - (rect?.x || 0), y - (rect?.y || 0)];
  });

  /**
   * Convert the global mouse position to world co-ordinates.
   */
  const touch = useTouch();
  const worldTouchPos = useDynamicProperty(touch.pos, ([x, y]): Position => {
    const rect = ref.current?.getBoundingClientRect();
    return [x - (rect?.x || 0), y - (rect?.y || 0)];
  });

  const worldContext = useMemo(
    () => ({ registerCollider, registerHandler, isInside, mouse: worldMousePos, touch: worldTouchPos }),
    [registerCollider, registerHandler, isInside, worldMousePos, worldTouchPos],
  );

  return (
    <WorldContext.Provider value={worldContext}>
      <Node>
        <div ref={ref}>{children}</div>
      </Node>
    </WorldContext.Provider>
  );
};

class OverlappingSet {
  overlaps: Map<Body, Set<Body>> = new Map();

  add(a: Body, b: Body) {
    if (!this.overlaps.has(a)) {
      this.overlaps.set(a, new Set());
    }
    this.overlaps.get(a)?.add(b);
  }

  has(a: Body, b: Body) {
    return !!this.overlaps.get(a)?.has(b);
  }
}