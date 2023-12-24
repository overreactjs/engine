import { useEffect } from "react";
import { useWorld } from "./useWorld";
import { CollisionEventFunction } from "../types";

export const useOverlap = (id: string, handler: CollisionEventFunction) => {
  const { registerHandler } = useWorld();

  useEffect(() => {
    return registerHandler?.(id, handler);
  }, [id, handler, registerHandler]);
};
