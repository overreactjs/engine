import { GamepadAxisName, GamepadButtonName } from "./types";

export const STANDARD_BUTTON_MAPPING: Record<GamepadButtonName, number> = {
  Up: 12,
  Down: 13,
  Left: 14,
  Right: 15,
  A: 0,
  B: 1,
  X: 2,
  Y: 3,
  Shoulder_L1: 4,
  Shoulder_L2: 6,
  Shoulder_R1: 5,
  Shoulder_R2: 7,
  Start: 8,
  Select: 9,
};

export const STANDARD_AXIS_MAPPING: Record<GamepadAxisName, number> = {
  Left_Horizontal: 0,
  Left_Vertical: 1,
  Right_Horizontal: 2,
  Right_Vertical: 3,
};

export const STANDARD_BUTTON_UNMAPPING: Record<number, GamepadButtonName> = {
  12: 'Up',
  13: 'Down',
  14: 'Left',
  15: 'Right',
  0: 'A',
  1: 'B',
  2: 'X',
  3: 'Y',
  4: 'Shoulder_L1',
  6: 'Shoulder_L2',
  5: 'Shoulder_R1',
  7: 'Shoulder_R2',
  8: 'Start',
  9: 'Select',
};