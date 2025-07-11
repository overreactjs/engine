import { RefObject, useCallback, useMemo, useRef } from "react";
import { ElementType, Property, Position, Size } from "../types";

export type SetBaseStyles = {
  pos?: Property<Position>;
  size?: Property<Size>;
  angle?: Property<number>;
  flip?: Property<boolean>;
  opacity?: Property<number>;
  scale?: Property<number>;
  visible?: Property<boolean>;
  force?: boolean;
}

export type UseElementResult<E extends ElementType> = {
  ref: RefObject<E>;
  setText: (text: string) => void;
  setAttribute: (key: string, value: unknown) => void;
  setData: (key: string, value: unknown) => void;
  setStyle: (key: string, value: string | number) => void;
  setLegacyStyle: (key: string, value: string | number) => void;
  setBaseStyles: (options: SetBaseStyles) => void;
}

export function useElement<E extends ElementType = HTMLDivElement>(element?: UseElementResult<E>): UseElementResult<E> {
  const generatedRef = useRef<E>(null);
  const ref = element?.ref || generatedRef;
  // const transforms = useRef<Map<string, CSSTransformComponent>>(new Map());
  const transforms = useRef<Map<string, string>>(new Map());

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
      if (value !== undefined && value !== null) {
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
   * Set a style property on the element, using "style" instead of the newer "attributeStyleMap"
   * API which doesn't seem to work for some things in Chrome!
   */
  const setLegacyStyle = useCallback((key: string, value: string | number) => {
    if (ref.current) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((ref.current as any).style as any)[key] = value;
    }
  }, [ref]);

  /**
   * Set a style property on the element.
   */
  const setStyle = useCallback((key: string, value: string | number) => {
    setLegacyStyle(key, value);
    // if (ref.current && value !== undefined) {
    //   ref.current.attributeStyleMap.set(key, value);
    // }
  }, [setLegacyStyle]);

  /**
   * Set the commonly used base styles: position, size, angle, and flip.
   */
  const setBaseStyles = useCallback((options: SetBaseStyles) => {
    const { pos, size, angle, flip, opacity, scale, visible, force = false } = options;

    let transformsChanged = false;

    if (ref.current) {
      if (pos?.invalidated || (force && pos)) {
        const [x, y] = pos.current;
        // transforms.current.set('pos', new CSSTranslate(CSS.px(x), CSS.px(y)));
        transforms.current.set('pos', `translate(${x}px, ${y}px)`);
        transformsChanged = true;
        pos.invalidated = false;
      }
      
      if (angle?.invalidated || (force && angle)) {
        // transforms.current.set('angle', new CSSRotate(CSS.deg(angle.current)));
        transforms.current.set('angle', `rotate(${angle.current}deg)`);
        transformsChanged = true;
        angle.invalidated = false;
      }

      if (flip?.invalidated || scale?.invalidated) {
        const tx = flip?.current ? -1 : 1;
        const s = scale?.current || 1;
        // transforms.current.set('flip', new CSSScale(s * tx, s));
        transforms.current.set('flip', `scale(${s * tx}, ${s})`);
        transformsChanged = true;

        if (flip) {
          flip.invalidated = false;
        }
        if (scale) {
          scale.invalidated = false;
        }
      }

      if (transformsChanged) {
        // ref.current.attributeStyleMap.set('transform', new CSSTransformValue([...transforms.current.values()]));
        ref.current.style.transform = [...transforms.current.values()].join(' ');
      }

      if (size?.invalidated || (force && size)) {
        const [width, height] = size.current;
        // ref.current?.attributeStyleMap.set('width', CSS.px(width));
        // ref.current?.attributeStyleMap.set('height', CSS.px(height));
        ref.current.style.width = `${width}px`;
        ref.current.style.height = `${height}px`;
        size.invalidated = false;
      }

      if (opacity?.invalidated || (force && opacity)) {
        // ref.current?.attributeStyleMap.set('opacity', CSS.number(opacity.current));
        ref.current.style.opacity = `${opacity.current}`;
        opacity.invalidated = false;
      }

      if (visible?.invalidated || (force && visible)) {
        // ref.current?.attributeStyleMap.set('visibility', visible.current ? 'visible' : 'hidden');
        ref.current.style.display = visible.current ? 'block' : 'none';
        visible.invalidated = false;
      }
    }
  }, [ref]);

  return useMemo(() => {
    if (element) {
      return element;
    } else {
      return { ref, setText, setAttribute, setData, setStyle, setLegacyStyle, setBaseStyles };
    }
  }, [element, ref, setAttribute, setBaseStyles, setData, setLegacyStyle, setStyle, setText]);
}