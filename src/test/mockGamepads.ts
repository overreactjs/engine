import { vi } from "vitest";

let original: () => (Gamepad | null)[];

export const mockGamepads = () => {
  original = navigator.getGamepads;
  const gamepad = new MockGamepad();
  navigator.getGamepads = vi.fn().mockImplementation(() => ([gamepad]));
  return gamepad;
};

export const resetGamepads = () => {
  navigator.getGamepads = original;
};

export class MockGamepad implements Gamepad {
  axes: readonly number[];
  buttons: readonly MockGamepadButton[];
  connected: boolean;
  hapticActuators: readonly GamepadHapticActuator[];
  id: string;
  index: number;
  mapping: GamepadMappingType;
  timestamp: number;
  vibrationActuator: GamepadHapticActuator;

  constructor() {
    this.axes = [];
    this.connected = true;
    this.hapticActuators = [];
    this.id = 'gamepad_0';
    this.index = 0;
    this.mapping = 'standard';
    this.timestamp = 0;
    this.vibrationActuator = {} as GamepadHapticActuator;
    this.buttons = (new Array(20)).fill(null).map(() => new MockGamepadButton());
  }

  simulateButtonDown(button: number) {
    this.buttons[button].pressed = true;
  }

  simulateButtonUp(button: number) {
    this.buttons[button].pressed = false;
  }
}

class MockGamepadButton implements GamepadButton {
  pressed: boolean;
  touched: boolean;
  value: number;
  
  constructor() {
    this.pressed = false;
    this.touched = false;
    this.value = 0;
  }
}
