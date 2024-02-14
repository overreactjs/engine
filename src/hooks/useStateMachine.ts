import { useMemo } from "react";
import { StateDefinitions } from "../types";
import { StateMachine } from "../utils";
import { usePostCollisions } from "./usePostCollisions";
import { useProperty } from "./useProperty";

export function useStateMachine<T>(entity: T, state: string, states: StateDefinitions<T>) {
  const fsm = useProperty(new StateMachine(entity, state, states));

  usePostCollisions((delta) => {
    fsm.current.update(delta);
  });

  return useMemo(() => fsm, [fsm]);
}
