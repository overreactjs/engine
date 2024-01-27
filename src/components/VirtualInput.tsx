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
  const down = useRef<Set<string>>(new Set());
  
  const simulate = useCallback((what: string): void => {
    down.current.add(what);
  }, []);

  const isActive = useCallback((what: string): boolean => {
    return down.current.has(what);
  }, []);

  const hasAxis = useCallback((negative: string, positive: string): number => {
    return +isActive(positive) - +isActive(negative);
  }, [isActive]);

  useTicker(() => {
    for (const what of down.current) {
      down.current.delete(what);
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
