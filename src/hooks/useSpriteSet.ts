import { MutableRefObject, useContext, useLayoutEffect } from "react";
import { SpriteSetContext } from "../components";

export const useSpriteSet = (name: string | undefined, element: MutableRefObject<HTMLOrSVGElement | null>, reset: () => void) => {
  const { register } = useContext(SpriteSetContext);
  
  useLayoutEffect(() => {
    if (name) {
      return register(name, element, reset);
    }
  }, [element, name, register, reset]);
};
