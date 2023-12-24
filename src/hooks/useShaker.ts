import { RefObject, useCallback, useMemo } from "react";
import { UseElementResult, useElement } from "./useElement";
import { useProperty } from "./useProperty";
import { useDynamicProperty } from "./useDynamicProperty";
import { Position } from "../types";
import { useUpdate } from "./useUpdate";
import { useRender } from "./useRender";

type UseShakerProps<E extends Element> = {
  element?: UseElementResult<E>;
  strength?: number;
  phase?: number;
}

type UseShakerResult<E extends Element> = {
  ref: RefObject<E>;
  shake: () => void;
}

export function useShaker<E extends Element = HTMLDivElement>(props?: UseShakerProps<E>): UseShakerResult<E> {
  const element = useElement<E>(props?.element);
  const amount = useProperty(0);
  const strength = useProperty(props?.strength || 40);
  const phase = useProperty(props?.phase || 30);

  const pos = useDynamicProperty(amount, (amount): Position => ([
    Math.sin(amount / phase.current) * strength.current * (amount / 500),
    0,
  ]));

  useUpdate((delta) => {
    amount.current = Math.max(0, amount.current - delta);
  });

  useRender(() => {
    element.setBaseStyles({ pos });
  });

  const shake = useCallback(() => {
    amount.current = 750;
  }, [amount]);

  return useMemo(() => ({ ref: element.ref, shake }), [element.ref, shake]);
}
