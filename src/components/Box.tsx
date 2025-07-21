import { CSSProperties } from "react";
import { useBaseStyleProperties, useElement, useProperty, useRender, useRenderProperty } from "../hooks";
import { UseElementResult } from "../hooks/useElement";
import { BaseStyleProps, Prop } from "../types";
import { Node } from "./Node";

export type BoxProps = BaseStyleProps & {
  className?: string;
  style?: CSSProperties;
  element?: UseElementResult<HTMLDivElement>;
  color?: Prop<string>;
  children?: React.ReactNode;
};

/**
 * Box
 * ---
 * 
 * A rectangle (just a div) with a position, size, angle, and a background color. It can be used to
 * group elements that should be moved as though one.
 */
export const Box: React.FC<BoxProps> = ({ className, style, ...props }) => {
  const element = useElement(props.element);

  const base = useBaseStyleProperties(props);
  const color = useProperty(props.color || 'transparent');

  useRender(() => {
    element.setBaseStyles(base);
  });

  useRenderProperty(color, (color) => {
    element.setStyle('background-color', color);
  });

  return (
    <Node pos={base.pos}>
      <div
        ref={element.ref}
        className={`absolute ${className || ''}`}
        style={{ contain: 'content', ...style }}
      >
        {props.children}
      </div>
    </Node>
  );
}
