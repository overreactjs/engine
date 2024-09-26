import { useMemo } from "react";
import { BaseStyleProps } from "../types";
import { usePosition } from "./usePosition";
import { useProperty } from "./useProperty";
import { useVisible } from "./useVisible";

export const useBaseStyleProperties = (props: BaseStyleProps) => {
  const pos = usePosition(props.pos);
  const size = useProperty(props.size);
  const flip = useProperty(props.flip || false);
  const scale = useProperty(props.scale || 1);
  const angle = useProperty(props.angle || 0);
  const visible = useVisible(props.visible);

  return useMemo(() => ({ pos, size, flip, scale, angle, visible}), [angle, flip, pos, scale, size, visible]);
};
