import { useProperty } from "./useProperty";
import { useUpdate } from "./useUpdate";

export const useFlash = (duration: number) => {
  const visible = useProperty(true);
  const cooldown = useProperty(duration);

  useUpdate((delta) => {
    cooldown.current -= delta;

    if (cooldown.current <= 0) {
      cooldown.current += duration;
      visible.current = !visible.current;
    }
  });
  
  return visible;
};
