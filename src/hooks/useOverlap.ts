import { useEffect } from "react";
import { useWorld } from "./useWorld";
import { CollisionEventFunction } from "../types";

export function useOverlap<T = unknown>(id: string, handler: CollisionEventFunction<T>) {
  const { registerHandler } = useWorld();

  useEffect(() => {
    return registerHandler?.(id, handler);
  }, [id, handler, registerHandler]);
};