import { useCallback } from "react";
import { CollisionEventFunction } from "../types";
import { useOverlap } from "./useOverlap";

export const useCollision = (id: string, handler: CollisionEventFunction) => {
  const wrappedHandler: CollisionEventFunction = useCallback((collisions, delta) => {
    const filtered = collisions.filter(({ firstTime }) => firstTime);

    if (filtered.length > 0) {
      handler(filtered, delta);
    }
  }, [handler]);

  return useOverlap(id, wrappedHandler);
};

export const useTaggedCollision = (collider: string, tag: string, handler: CollisionEventFunction) => {
  useCollision(collider, (collisions, delta) => {
    const filtered = collisions.filter((props) => props.tags.includes(tag));

    if (filtered.length > 0) {
      handler(filtered, delta);
    }
  });
};
