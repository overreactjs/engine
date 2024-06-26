import { useElement, useDebug, usePosition, useProperty, useRender, useCirclePhysics, useOffsetPosition } from "../hooks";
import { useDynamicProperty } from "../hooks/useDynamicProperty";
import { Prop, Position, Size } from "../types";

const CLASS_NAME = "absolute outline outline-2 outline-[#f0f] bg-[#f0f3] -outline-offset-1 rounded-full";

type PhysicsCircleProps = {
  id?: string;
  pos?: Prop<Position>;
  radius: Prop<number>;
  static?: boolean;
}

/**
 * PhysicsCircle
 * -------------
 * 
 * Register a circular physics body.
 */
export const PhysicsCircle: React.FC<PhysicsCircleProps> = (props) => {
  const element = useElement<HTMLDivElement>();
  const debug = useDebug();

  const pos = usePosition(props.pos);
  const radius = useProperty(props.radius);
  const debugPos = useOffsetPosition(pos, [-radius.current, -radius.current]);
  const debugSize = useDynamicProperty(radius, (value): Size => [value * 2, value * 2]);

  useCirclePhysics(pos, radius, { friction: 0.5, restitution: 0.5, slop: 0.01, isStatic: props.static });

  useRender(() => {
    if (debug.current) {
      element.setBaseStyles({ pos: debugPos, size: debugSize });
    }

    if (debug.invalidated) {
      element.setStyle('display', debug.current ? 'block' : 'none');
      debug.invalidated = false;
    }
  });

  return <div ref={element.ref} className={CLASS_NAME} style={{ display: 'none', contain: 'content' }} />;
}