import { Queries, RenderHookOptions, RenderHookResult, queries, render as _render, renderHook as _renderHook, RenderOptions, RenderResult } from "@testing-library/react";
import { useContext } from "react";
import { vi } from 'vitest';
import { Engine } from "../components";
import { EngineContext, EngineContextProps } from "../context";

export function render<
  Q extends Queries = typeof queries,
  Container extends Element | DocumentFragment = HTMLElement,
  BaseElement extends Element | DocumentFragment = Container,
>(
  ui: React.ReactNode,
  options: RenderOptions<Q, Container, BaseElement>,
): RenderResult<Q, Container, BaseElement> {
  const result = _render(ui, { wrapper: Engine, ...options });

  // Run the engine until it unpauses.
  nextFrame();
  return result;
}

export function renderHook<
  Result,
  Props,
  Q extends Queries = typeof queries,
  Container extends Element | DocumentFragment = HTMLElement,
  BaseElement extends Element | DocumentFragment = Container,
>(
  render: (initialProps: Props) => Result,
  options?: RenderHookOptions<Props, Q, Container, BaseElement>,
): RenderHookResult<Result, Props> {
  const result = _renderHook(render, { wrapper: Engine, ...options });

  // Run the engine until it unpauses.
  nextFrame();
  return result;
}

export function renderHookWithEngine<
  Result,
  Props,
  Q extends Queries = typeof queries,
  Container extends Element | DocumentFragment = HTMLElement,
  BaseElement extends Element | DocumentFragment = Container,
>(
  render: (initialProps: Props) => Result,
  options?: RenderHookOptions<Props, Q, Container, BaseElement>,
): RenderHookResult<Result & { engine: EngineContextProps }, Props> {
  // Augment the renderHook result with the engine context.
  const result = _renderHook((initialProps: Props) => {
    const engine = useContext(EngineContext);
    const hook = render(initialProps);
    return { ...hook, engine };
  }, { wrapper: Engine, ...options });

  // Run the engine until it unpauses.
  nextFrame();
  return result;
}

export function nextFrame() {
  vi.runOnlyPendingTimers();
}