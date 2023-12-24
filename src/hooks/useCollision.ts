import { useCallback } from "react";
import { CollisionEventFunction } from "../types";
import { useOverlap } from "./useOverlap";

export const useCollision = (id: string, handler: CollisionEventFunction) => {
  const wrappedHandler: CollisionEventFunction = useCallback((props) => {
    if (props.firstTime) {
      handler(props);
    }
  }, [handler]);

  return useOverlap(id, wrappedHandler);
};

export const useTaggedCollision = (collider: string, tag: string, handler: CollisionEventFunction) => {
  useCollision(collider, (props) => {
    if (props.tags.includes(tag)) {
      handler(props);
    }
  });
};
