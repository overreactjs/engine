import { useElement, useDebug, usePosition, useProperty, useRender } from "../hooks";
import { useBoxPhysics } from "../hooks/usePhysics";
import { Prop, Position, Size } from "../types";

const CLASS_NAME = "absolute outline outline-2 outline-[#f0f] bg-[#f0f3] -outline-offset-1";

type PhysicsBoxProps = {
  id?: string;
  pos?: Prop<Position>;
  size: Prop<Size>;
  static?: boolean;
}

/**
 * PhysicsBox
 * ----------
 * 
 * Register a box-shaped physics body.
 */
export const PhysicsBox: React.FC<PhysicsBoxProps> = (props) => {
  const element = useElement<HTMLDivElement>();
  const debug = useDebug();

  const pos = usePosition(props.pos);
  const size = useProperty(props.size);

  useBoxPhysics(pos, size, { isStatic: props.static });

  useRender(() => {
    if (debug) {
      element.setBaseStyles({
        pos: { current: [pos.current[0] - size.current[0] / 2, pos.current[1] - size.current[1] / 2]},
        size,
      });
    }
  });

  return debug ? <div ref={element.ref} className={CLASS_NAME} style={{ contain: 'content' }} /> : null;
}