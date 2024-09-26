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
