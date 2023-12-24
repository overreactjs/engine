import { useContext, useEffect } from "react";
import { PhysicsContext } from "../context";
import { PhysicsEvent } from "../types";

export const usePhysicsEngine = () => {
  return useContext(PhysicsContext);
};

export const usePhysicsCollision = (fn: (event: PhysicsEvent) => void) => {
  const { addEventListener, removeEventListener } = usePhysicsEngine();

  useEffect(() => {
    addEventListener('collision', fn);
    return () => removeEventListener('collision', fn);
  }, [addEventListener, removeEventListener]);
};
