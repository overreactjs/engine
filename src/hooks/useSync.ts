import { useState } from "react";
import { useTicker } from "./useTicker";

export function useSync<T>(fn: () => T) {
  const [value, setValue] = useState<T>();

  useTicker(() => {
    const newValue = fn();
    if (newValue !== value) {
      setValue(newValue);
    }
  });

  return value;
}
