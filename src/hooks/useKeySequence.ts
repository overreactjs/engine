import { KeyboardKeyName } from "../types";
import { useKeyboard } from "./useKeyboard";
import { useProperty } from "./useProperty";
import { useUpdate } from "./useUpdate";

const KEYS: Record<string, KeyboardKeyName> = {
  A: 'KeyA',
  B: 'KeyB',
  C: 'KeyC',
  D: 'KeyD',
  E: 'KeyE',
  F: 'KeyF',
  G: 'KeyG',
  H: 'KeyH',
  I: 'KeyI',
  J: 'KeyJ',
  K: 'KeyK',
  L: 'KeyL',
  M: 'KeyM',
  N: 'KeyN',
  O: 'KeyO',
  P: 'KeyP',
  Q: 'KeyQ',
  S: 'KeyS',
  T: 'KeyT',
  U: 'KeyU',
  V: 'KeyV',
  W: 'KeyW',
  X: 'KeyX',
  Y: 'KeyY',
  Z: 'KeyZ',
};

export const useKeySequence = (sequence: string, fn: () => void) => {
  const keyboard = useKeyboard();
  const index = useProperty(0);

  useUpdate(() => {
    const nextKey = KEYS[sequence[index.current]];

    if (keyboard.isKeyPressed(nextKey)) {
      index.current += 1;
    } else if (keyboard.isAnyKeyPressed()) {
      index.current = 0;
    }

    if (index.current === sequence.length) {
      index.current = 0;
      fn();
    }
  });
};
