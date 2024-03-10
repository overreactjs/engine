import { usePosition, useProperty, useBoxCollider } from "../hooks";
import { Prop, Position, Size, CollisionTag } from "../types";

// const DEBUG: CSSProperties = {
//   display: 'none',
//   position: 'absolute',
//   boxSizing: 'border-box',
//   background: '#0ff3',
//   border: '1px solid #0ff',
// };

type CollisionBoxProps = {
  id?: string;
  pos?: Prop<Position>;
  size: Prop<Size>;
  tags?: Prop<CollisionTag[]>;
  active?: Prop<boolean>;
  entity?: unknown;
}

/**
 * CollisionBox
 * ------------
 * 
 * Register a box-shaped collider that will report collisions and overlaps with other colliders
 */
export const CollisionBox: React.FC<CollisionBoxProps> = ({ id, entity, ...props }) => {
  // const element = useElement<HTMLDivElement>();
  // const debug = useDebug();

  const pos = usePosition(props.pos);
  const size = useProperty(props.size);
  const tags = useProperty(props.tags || []);
  const active = useProperty(props.active !== undefined ? props.active : true);

  useBoxCollider(id, active, tags, pos, size, entity);

  // useRender(() => {
  //   element.setBaseStyles({ pos, size });

  //   if (debug.invalidated) {
  //     element.setStyle('display', debug.current ? 'block' : 'none');
  //     debug.invalidated = false;
  //   }
  // });

  return null; //<div ref={element.ref} style={DEBUG} />;
}