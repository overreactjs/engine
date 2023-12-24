import { useCallback, useMemo } from "react";

type UseAudioResult = {
  play: (url: string) => void;
};

export const useAudio = (): UseAudioResult => {

  const play = useCallback((path: string) => {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    new AudioContext();
    const audio = new Audio(path);
    audio.play();
  }, []);

  return useMemo(() => ({ play }), [play]);
};
