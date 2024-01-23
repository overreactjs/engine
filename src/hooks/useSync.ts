import { useState } from "react";
import { useTicker } from "./useTicker";

export function useSync<T>(fn: () => T): T {
  const [value, setValue] = useState<T>(fn());

  useTicker(() => {
    const newValue = fn();
    if (newValue !== value) {
      setValue(newValue);
    }
  });

  return value;
}
