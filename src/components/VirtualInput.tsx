import React, { useCallback, useMemo, useRef } from "react";
import { VirtualInputContext } from "../context";
import { useTicker } from "../hooks";

type VirtualInputProps = {
  children: React.ReactNode;
}

/**
 * VirtualInput
 * -----
 * 
 * ...
 */
export const VirtualInput: React.FC<VirtualInputProps> = ({ children }) => {
  const down = useRef<Map<string, number>>(new Map());
  
  const simulate = useCallback((action: string): void => {
    down.current.set(action, 50);
  }, []);

  const isActive = useCallback((action: string): boolean => {
    return down.current.has(action);
  }, []);

  const hasAxis = useCallback((negative: string, positive: string): number => {
    return +isActive(positive) - +isActive(negative);
  }, [isActive]);

  // Clear any inputs that have not been activated in the last 50ms.
  useTicker((delta) => {
    for (const [action, remaining] of down.current) {
      if (remaining > delta) {
        down.current.set(action, remaining - delta);
      } else {
        down.current.delete(action);
      }
    }
  });

  const context = useMemo(
    () => ({ simulate, isActive, hasAxis }),
    [simulate, isActive, hasAxis],
  );

  return (
    <VirtualInputContext.Provider value={context}>
      {children}
    </VirtualInputContext.Provider>
  );
};
