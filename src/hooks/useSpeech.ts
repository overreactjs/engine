import { useCallback, useMemo } from "react";

export const useSpeech = () => {
  const speak = useCallback((text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  }, []);

  return useMemo(() => ({ speak }), [speak]);
};
