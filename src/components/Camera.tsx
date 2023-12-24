import { useDebug, useElement, usePosition, useRender, useUpdate, useViewport } from "../hooks";
import { CameraAxis, Position } from "../types";
import { lerp } from "../utils";

const SMOOTH_FACTOR = 0.04;

const CLASS_NAME = "absolute w-2 h-2 -m-1 border-2 border-pink-600";

type CameraProps = {
  axis?: CameraAxis;
  offset?: Position;
  smooth?: boolean;
}

/**
 * Camera
 * ------
 * 
 * Reports the position of the nested object up to the closest viewport.
 */
export const Camera: React.FC<CameraProps> = ({ axis = 'xy', offset = [0, 0], smooth = false }) => {
  const element = useElement<HTMLDivElement>();
  const debug = useDebug();

  const { origin } = useViewport();
  const pos = usePosition();

  useUpdate(() => {
    if (origin) {
      if (axis === 'x' || axis === 'xy') {
        origin.current[0] = lerp(origin.current[0], pos.current[0] + offset[0], smooth ? SMOOTH_FACTOR : 1);
      }
      if (axis === 'y' || axis === 'xy') {
        origin.current[1] = lerp(origin.current[1], pos.current[1] + offset[1], smooth ? SMOOTH_FACTOR : 1);
      }
    }
  });

  useRender(() => {
    if (debug) {
      element.setBaseStyles({ pos: origin });
    }
  });

  return debug ? <div ref={element.ref} className={CLASS_NAME} /> : null;
}
