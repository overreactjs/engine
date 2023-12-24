import { RefObject, useCallback, useMemo, useRef } from "react";
import { Position, Size } from "../types";

export type SetStyleFn = (key: keyof CSSStyleDeclaration, value: string | number) => void;

export type SetBaseStyles = {
  pos?: RefObject<Position>;
  size?: RefObject<Size>;
  angle?: RefObject<number>;
  flip?: RefObject<boolean>;
}

export type UseElementResult<E extends Element> = {
  ref: RefObject<E>;
  setText: (text: string) => void;
  setAttribute: (key: string, value: unknown) => void;
  setData: (key: string, value: unknown) => void;
  setStyle: SetStyleFn;
  setBaseStyles: (options: SetBaseStyles) => void;
}

export function useElement<E extends Element = HTMLDivElement>(element?: UseElementResult<E>): UseElementResult<E> {
  const generatedRef = useRef<Element>(null) as RefObject<E>;
  const ref = element?.ref || generatedRef;

  /**
   * Set the inner text of the element.
   */
  const setText = useCallback((text: string) => {
    if (ref.current) {
      ref.current.innerHTML = text;
    }
  }, [ref]);

  /**
   * Set an attribute, or clear the attribute if the value is undefined.
   */
  const setAttribute = useCallback((key: string, value: unknown) => {
    if (ref.current) {
      if (value !== undefined) {
        ref.current.setAttribute(key, String(value));
      } else {
        ref.current.removeAttribute(key);
      }
    }
  }, [ref]);

  /**
   * Set a data attribute.
   */
  const setData = useCallback((key: string, value: unknown) => {
    setAttribute('data-' + key, value);
  }, [setAttribute]);

  /**
   * Set a style property on the element.
   */
  const setStyle = useCallback((key: keyof CSSStyleDeclaration, value: string | number) => {
    if (ref.current && value !== undefined) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((ref.current as any).style as any)[key] = value;
    }
  }, [ref]);

  /**
   * Set the commonly used base styles: position, size, angle, and flip.
   */
  const setBaseStyles = useCallback((options: SetBaseStyles) => {
    const { pos, size, angle, flip } = options;

    const transforms = [];

    if (pos?.current) {
      transforms.push(`translate(${Math.round(pos.current[0])}px, ${Math.round(pos.current[1])}px)`);
    }
    if (angle?.current) {
      transforms.push(`rotate(${angle.current}deg)`);
    }
    if (flip?.current) {
      transforms.push(`scaleX(-1)`);
    }

    if (transforms.length > 0) {
      setStyle('transform', transforms.join(' '));
    }

    if (size?.current) {
      const [width, height] = size.current;
      setStyle('width', `${width}px`);
      setStyle('height', `${height}px`);
    }
  }, [setStyle]);

  return useMemo(() => {
    if (element) {
      return element;
    } else {
      return { ref, setText, setAttribute, setData, setStyle, setBaseStyles };
    }
  }, [element, ref, setAttribute, setBaseStyles, setData, setStyle, setText]);
}
