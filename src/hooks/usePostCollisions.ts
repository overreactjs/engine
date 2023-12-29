import { useEffect } from "react";
import { useWorld } from "./useWorld";

export const usePostCollisions = (handler: () => void) => {
  const { registerPostHandler } = useWorld();

  useEffect(() => {
    return registerPostHandler?.(handler);
  }, [handler, registerPostHandler]);
};
