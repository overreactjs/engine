import React, { useRef, useCallback, useMemo } from "react";
import { useProperty, useRender } from "../hooks";
import { Prop, Property } from "../types";

type AnimationConfig = {
  element: Property<HTMLOrSVGElement | null>;
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
  
  const register = useCallback((animation: string, element: Property<HTMLOrSVGElement | null>, reset: () => void) => {
    animations.current.set(animation, { element, reset });
    return () => animations.current.delete(animation);
  }, []);

  const context = useMemo(() => ({ register }), [register]);

  useRender(() => {
    for (const [id, { element, reset }] of animations.current) {
      const elem = element.current as HTMLElement;

      if (elem.style.visibility === 'hidden' && id === animation.current) {
        reset();
      }

      elem.style.visibility = id === animation.current ? 'visible' : 'hidden';
    }
  });
  
  return (
    <SpriteSetContext.Provider value={context}>
      {props.children}
    </SpriteSetContext.Provider>
  );
};

type SpriteSetContextProps = {
  register: (animation: string, element: Property<HTMLOrSVGElement | null>, reset: () => void) => () => void;
}

export const SpriteSetContext = React.createContext<SpriteSetContextProps>({
  register: () => () => {},
});
