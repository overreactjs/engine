import { useCallback, useContext, useMemo, useRef } from "react";
import { MotionContext } from "../context";
import { MotionContextProps } from "../context/MotionContext";
import { useUpdate } from "./useUpdate";

type UseMotionResult = Omit<MotionContextProps, 'isShaking'> & {
  isShaking: (cooldown?: number) => boolean;
}

export const useMotion = (): UseMotionResult => {
  const context = useContext(MotionContext);
  const remaining = useRef(0);

  const isShaking = useCallback((cooldown: number = 0) => {
    if (remaining.current === 0 && context.isShaking()) {
      remaining.current = cooldown;
      return true;
    }

    return false;
  }, []);

  useUpdate((delta) => {
    remaining.current = Math.max(0, remaining.current - delta);
  });

  return useMemo(() => ({ ...context, isShaking }), [context]);
};

export const useDeviceShaken = (cooldown: number, fn: () => void) => {
  const { isShaking } = useMotion();

  useUpdate(() => {
    if (isShaking(cooldown)) {
      fn();
    }
  });
};
