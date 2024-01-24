import { useElement, usePosition, useProperty, useRender } from "../hooks";
import { UseElementResult } from "../hooks/useElement";
import { Position, Prop, Size } from "../types";
import { Node } from "./Node";

type BoxProps = {
  element?: UseElementResult<HTMLDivElement>;
  pos?: Prop<Position>;
  size: Prop<Size>;
  angle?: Prop<number>;
  color?: Prop<string>;
  children?: React.ReactNode;
  className?: string;
};

/**
 * Box
 * ---
 * 
 * A rectangle (just a div) with a position, size, angle, and a background color. It can be used to
 * group elements that should be moved as though one.
 */
export const Box: React.FC<BoxProps> = ({ className, ...props }) => {
  const element = useElement(props.element);

  const pos = usePosition(props.pos);
  const size = useProperty(props.size);
  const angle = useProperty(props.angle || 0);
  const color = useProperty(props.color || 'transparent');

  useRender(() => {
    element.setBaseStyles({ pos, size, angle });

    if (color.invalidated) {
      element.setStyle('background-color', color.current);
      color.invalidated = false;
    }
  });

  return (
    <Node pos={pos}>
      <div ref={element.ref} className={`absolute ${className || ''}`} style={{ contain: 'content' }}>
        {props.children}
      </div>
    </Node>
  );
}
