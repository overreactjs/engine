export class MockGamepad implements Gamepad {
  axes: readonly number[];
  buttons: readonly MockGamepadButton[];
  connected: boolean;
  hapticActuators: readonly GamepadHapticActuator[];
  id: string;
  index: number;
  mapping: GamepadMappingType;
  timestamp: number;
  vibrationActuator: GamepadHapticActuator | null;

  constructor() {
    this.axes = [];
    this.connected = true;
    this.hapticActuators = [];
    this.id = 'gamepad_0';
    this.index = 0;
    this.mapping = 'standard';
    this.timestamp = 0;
    this.vibrationActuator = null;
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