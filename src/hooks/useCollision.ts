import { useCallback } from "react";
import { CollisionEventFunction } from "../types";
import { useOverlap } from "./useOverlap";

export function useCollision<T = unknown>(id: string, handler: CollisionEventFunction<T>) {
  const wrappedHandler: CollisionEventFunction<T> = useCallback((collisions, delta) => {
    const filtered = collisions.filter(({ firstTime }) => firstTime);

    if (filtered.length > 0) {
      handler(filtered, delta);
    }
  }, [handler]);

  return useOverlap(id, wrappedHandler);
}

export function useTaggedCollision<T = unknown>(collider: string, tag: string | string[], handler: CollisionEventFunction<T>) {
  const tags = typeof tag === 'string' ? [tag] : tag;

  useCollision<T>(collider, (collisions, delta) => {
    const filtered = collisions.filter((props) => {
      for (tag of props.tags) {
        if (tags.includes(tag)) {
          return true;
        }
      }

      return false;
    });

    if (filtered.length > 0) {
      handler(filtered, delta);
    }
  });
}
