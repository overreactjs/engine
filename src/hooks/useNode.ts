import { useRef, useCallback, useMemo } from "react";
import { UpdateFunction, RenderFunction, TickerFunction, UpdateConfig, UpdateOptions } from "../types";
import { useRender } from "./useRender";
import { useUpdate } from "./useUpdate";
import { useTicker } from "./useTicker";

export const useNode = () => {
  const tickers = useRef<Map<string, TickerFunction>>(new Map());
  const updates = useRef<Map<string, UpdateConfig>>(new Map());
  const renders = useRef<Map<string, RenderFunction>>(new Map());

  const ticker = useCallback((delta: number, time: number) => {
    for (const entry of tickers.current) {
      entry[1](delta, time);
    }
  }, []);

  const update = useCallback((delta: number, time: number) => {
    const waiting: Map<string, UpdateFunction> = new Map();
    const completed: Set<string> = new Set();

    for (const [id, config] of updates.current) {
      const { fn, after } = config;
      if (after && !completed.has(after)) {
        waiting.set(after, fn);
      } else {
        fn(delta, time);
        completed.add(id);
      }

      if (waiting.has(id)) {
        waiting.get(id)?.(delta, time);
      }
    }
  }, []);

  const render = useCallback(() => {
    for (const entry of renders.current) {
      entry[1]();
    }
  }, []);

  const registerTicker = useCallback((id: string, fn: TickerFunction) => {
    tickers.current.set(id, fn);
    return () => tickers.current.delete(id);
  }, []);

  const registerUpdate = useCallback((id: string, fn: UpdateFunction, options?: UpdateOptions) => {
    updates.current.set(id, { ...options, fn });
    return () => updates.current.delete(id);
  }, []);

  const registerRender = useCallback((id: string, fn: RenderFunction) => {
    renders.current.set(id, fn);
    return () => renders.current.delete(id);
  }, []);

  useTicker(ticker);
  useUpdate(update);
  useRender(render);

  return useMemo(
    () => ({ ticker, update, render, registerTicker, registerUpdate, registerRender }),
    [ticker, update, render, registerTicker, registerUpdate, registerRender]
  );
}