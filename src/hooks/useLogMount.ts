import { useEffect } from "react";
import { useDebug } from "./useDebug";

export const useLogMount = (name: string) => {
  const debug = useDebug();

  useEffect(() => {
    if (debug) {
      console.log(`${name}.mount`);
    }

    return () => {
      if (debug) {
        console.log(`${name}.unmount`);
      }
    };
  }, [debug, name]);
};
