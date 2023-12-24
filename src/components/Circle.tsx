import { useElement, usePosition, useProperty, useRender } from "../hooks";
import { Position, Prop, Size } from "../types";
import { Node } from "./Node";

type CircleProps = {
  pos?: Prop<Position>;
  size: Prop<Size>;
  color: Prop<string>;
  className?: string;
};

/**
 * Circle
 * ------
 * 
 * A fully rounded oval (just a div) with a position, size, angle, and a background color. It can
 * be used to group elements that should be moved as though one.
 */
export const Circle: React.FC<CircleProps> = ({ className, ...props }) => {
  const element = useElement<HTMLDivElement>();

  const pos = usePosition(props.pos);
  const size = useProperty<Size>(props.size);
  const color = useProperty<string>(props.color);

  useRender(() => {
    element.setBaseStyles({ pos, size });
    element.setStyle('background', color.current);
  });

  return (
    <Node pos={pos}>
      <div ref={element.ref} className={`absolute rounded-[100%] ${className}`} style={{ contain: 'content' }} />
    </Node>
  );
}
