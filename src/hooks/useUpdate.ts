import { useContext, useId, useEffect } from "react";
import { UpdateFunction } from "../types";
import { NodeContext } from "../context";

export const useUpdate = (fn: UpdateFunction, name?: string) => {
  const { registerUpdate } = useContext(NodeContext) || {};
  const id = useId();

  useEffect(() => {
    if (name) {
      console.log('register/update', name);
    }
    return registerUpdate?.(id, fn);
  }, [fn, id, name, registerUpdate]);
}
