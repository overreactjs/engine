import { useProperty } from "./useProperty";
import { useUpdate } from "./useUpdate";

export const useTime = () => {
  const time = useProperty(0);

  useUpdate((delta) => {
    time.current += delta;
  });

  return time;
};
