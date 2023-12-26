import { RefObject, useCallback, useMemo, useRef } from "react";
import { ElementType, Position, Size } from "../types";

export type SetBaseStyles = {
  pos?: RefObject<Position>;
  size?: RefObject<Size>;
  angle?: RefObject<number>;
  flip?: RefObject<boolean>;
}

export type UseElementResult<E extends ElementType> = {
  ref: RefObject<E>;
  setText: (text: string) => void;
  setAttribute: (key: string, value: unknown) => void;
  setData: (key: string, value: unknown) => void;
  setStyle: (key: string, value: CSSStyleValue | string | number) => void;
  setLegacyStyle: (key: string, value: string | number) => void;
  setBaseStyles: (options: SetBaseStyles) => void;
}

export function useElement<E extends ElementType = HTMLDivElement>(element?: UseElementResult<E>): UseElementResult<E> {
  const generatedRef = useRef<E>(null);
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
  const setStyle = useCallback((key: string, value: CSSStyleValue | string | number) => {
    if (ref.current && value !== undefined) {
      ref.current.attributeStyleMap.set(key, value);
    }
  }, [ref]);

  /**
   * Set a style property on the element, using "style" instead of the newer "attributeStyleMap"
   * API which doesn't seem to work for some things in Chrome!
   */
  const setLegacyStyle = useCallback((key: string, value: string | number) => {
    if (ref.current && value !== undefined) {
      ((ref.current as any).style as any)[key] = value;
    }
  }, [ref]);

  /**
   * Set the commonly used base styles: position, size, angle, and flip.
   */
  const setBaseStyles = useCallback((options: SetBaseStyles) => {
    const { pos, size, angle, flip } = options;

    const transforms: CSSTransformComponent[] = [];

    if (pos?.current) {
      transforms.push(new CSSTranslate(CSS.px(Math.round(pos.current[0])), CSS.px(Math.round(pos.current[1]))))
    }
    if (angle?.current) {
      transforms.push(new CSSRotate(CSS.deg(angle.current)));
    }
    if (flip?.current) {
      transforms.push(new CSSScale(-1, 1));
    }

    if (transforms.length > 0) {
      ref.current?.attributeStyleMap.set('transform', new CSSTransformValue(transforms));
    }

    if (size?.current) {
      const [width, height] = size.current;
      ref.current?.attributeStyleMap.set('width', CSS.px(width));
      ref.current?.attributeStyleMap.set('height', CSS.px(height));
    }
  }, [setStyle]);

  return useMemo(() => {
    if (element) {
      return element;
    } else {
      return { ref, setText, setAttribute, setData, setStyle, setLegacyStyle, setBaseStyles };
    }
  }, [element, ref, setAttribute, setBaseStyles, setData, setStyle, setText]);
}

// const setBaseStyles = useCallback((options: SetBaseStyles) => {
//   const { pos, size, angle, flip } = options;

//   const transforms = [];

//   if (pos?.current) {
//     transforms.push(`translate(${Math.round(pos.current[0])}px, ${Math.round(pos.current[1])}px)`);
//   }
//   if (angle?.current) {
//     transforms.push(`rotate(${angle.current}deg)`);
//   }
//   if (flip?.current) {
//     transforms.push(`scaleX(-1)`);
//   }

//   if (transforms.length > 0) {
//     setStyle('transform', transforms.join(' '));
//   }

//   if (size?.current) {
//     const [width, height] = size.current;
//     setStyle('width', `${width}px`);
//     setStyle('height', `${height}px`);
//   }
// }, [setStyle]);