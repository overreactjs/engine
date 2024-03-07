import { useCallback, useEffect, useMemo, useRef } from "react";

type UseAudioResult = {
  play: (url: string) => void;
};

export const useAudio = (): UseAudioResult => {
  const context = useRef<AudioContext>();

  useEffect(() => {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    context.current = new AudioContext();
  }, []);

  const play = useCallback((path: string) => {
    const audio = new Audio(path);
    audio.play();
  }, []);

  return useMemo(() => ({ play }), [play]);
};
