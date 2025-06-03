import { useEffect } from "react";
import { Property } from "../types";

export const usePropertyListen = <T>(prop: Property<T>, fn: (value: T) => void) => {
  useEffect(() => {
    return prop.listen(fn);
  }, [fn, prop]);
};
