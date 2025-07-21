import React, { useRef, useCallback, useMemo, MutableRefObject } from "react";
import { useProperty, useRenderProperty } from "../hooks";
import { Prop } from "../types";

type AnimationConfig = {
  element: MutableRefObject<HTMLOrSVGElement | null>;
  reset: () => void;
}

type SpriteSetProps = {
  animation: Prop<string>;
  children: React.ReactNode;
};

/**
 * SpriteSet
 * ---------
 * 
 * Wrap a set of bitmap or vector sprites, ensuring that only one is ever shown at once, based on
 * the current animation.
 */
export const SpriteSet: React.FC<SpriteSetProps> = (props) => {
  const animation = useProperty(props.animation);
  const animations = useRef<Map<string, AnimationConfig>>(new Map());
  
  const register = useCallback((name: string, element: MutableRefObject<HTMLOrSVGElement | null>, reset: () => void) => {
    animations.current.set(name, { element, reset });
    return () => animations.current.delete(name);
  }, []);

  const context = useMemo(() => ({ register }), [register]);

  useRenderProperty(animation, (animation) => {
    for (const [id, { element, reset }] of animations.current) {
      const elem = element.current as HTMLElement;

      if (elem.style.display === 'none' && id === animation) {
        reset();
      }

      elem.style.display = id === animation ? 'block' : 'none';
    }
  });
  
  return (
    <SpriteSetContext.Provider value={context}>
      {props.children}
    </SpriteSetContext.Provider>
  );
};

type SpriteSetContextProps = {
  register: (animation: string, element: MutableRefObject<HTMLOrSVGElement | null>, reset: () => void) => () => void;
}

export const SpriteSetContext = React.createContext<SpriteSetContextProps>({
  register: () => () => {},
});
