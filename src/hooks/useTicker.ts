import { useContext, useId, useEffect } from "react";
import { TickerFunction } from "../types";
import { NodeContext } from "../context";

export const useTicker = (fn: TickerFunction, name?: string) => {
  const { registerTicker } = useContext(NodeContext);
  const id = useId();

  useEffect(() => registerTicker?.(id, fn), [fn, id, name, registerTicker]);
}
