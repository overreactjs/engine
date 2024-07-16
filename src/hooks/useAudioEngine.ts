import { useContext } from "react"
import { AudioEngineContext } from "../components";

export const useAudioEngine = () => {
  return useContext(AudioEngineContext);
};
