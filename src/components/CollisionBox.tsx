import { useElement, useDebug, usePosition, useProperty, useRender, useBoxCollider } from "../hooks";
import { Prop, Position, Size, CollisionTag } from "../types";

const CLASS_NAME = "absolute outline outline-2 !outline-[#f0f] bg-[#f0f3] -outline-offset-1";

type CollisionBoxProps = {
  id?: string;
  pos?: Prop<Position>;
  size: Prop<Size>;
  tags?: Prop<CollisionTag[]>;
}

/**
 * CollisionBox
 * ------------
 * 
 * Register a box-shaped collider that will report collisions and overlaps with other colliders
 */
export const CollisionBox: React.FC<CollisionBoxProps> = ({ id, ...props }) => {
  const element = useElement<HTMLDivElement>();
  const debug = useDebug();

  const pos = usePosition(props.pos);
  const size = useProperty(props.size);
  const tags = useProperty(props.tags || []);

  useBoxCollider(id, tags, pos, size);

  useRender(() => {
    if (debug) {
      element.setBaseStyles({ pos, size });
    }
  });

  return debug ? <div ref={element.ref} className={CLASS_NAME} style={{ contain: 'content' }} /> : null;
}