import { useMemo } from "react";
import { Property, Position, Velocity } from "../types";
import { lerp } from "../utils";
import { useKeyboard } from "./useKeyboard";
import { useOverlap } from "./useOverlap";
import { useUpdate } from "./useUpdate";
import { useProperty } from "./useProperty";

const DEFAULT_OPTIONS = {
  speed: 0.5,
  acceleration: 0.2,
}

type Direction = 'n' | 'e' | 's' | 'w' | 'ne' | 'se' | 'sw' | 'nw';

type Use8DirectionMovementOptions = {
  speed?: number;
  acceleration?: number;
};

type Use8DirectionMovementResult = {
  direction: Property<Direction>;
}

export const use8DirectionMovement = (collider: string, pos: Property<Position>, velocity: Property<Velocity>, options?: Use8DirectionMovementOptions): Use8DirectionMovementResult => {
  const { speed, acceleration } = { ...DEFAULT_OPTIONS, ...options };
  const { hasKeyAxis } = useKeyboard();

  const direction = useProperty<Direction>('n');

  useUpdate((delta) => {
    // Read keyboard input.
    const keyboardHorizontal = hasKeyAxis('KeyA', 'KeyD');
    const keyboardVertical = hasKeyAxis('KeyW', 'KeyS');

    // Apply keyboard input to the player's velocity.
    velocity.current[0] = lerp(velocity.current[0], keyboardHorizontal * speed, acceleration);
    velocity.current[1] = lerp(velocity.current[1], keyboardVertical * speed, acceleration);

    // Apply the velocity to the player.
    pos.current[0] += velocity.current[0] * delta;
    pos.current[1] += velocity.current[1] * delta;

    // Update the player's direction.
    if (keyboardHorizontal < 0) {
      if (keyboardVertical < 0) {
        direction.current = 'nw';
      } else if (keyboardVertical > 0) {
        direction.current = 'sw';
      } else {
        direction.current = 'w';
      }
    } else if (keyboardHorizontal > 0) {
      if (keyboardVertical < 0) {
        direction.current = 'ne';
      } else if (keyboardVertical > 0) {
        direction.current = 'se';
      } else {
        direction.current = 'e';
      }
    } else {
      if (keyboardVertical < 0) {
        direction.current = 'n';
      } else if (keyboardVertical > 0) {
        direction.current = 's';
      }
    }
  });

  useOverlap(collider, ({ collision }) => {
    pos.current[0] -= collision.overlapV.x;
    pos.current[1] -= collision.overlapV.y;
  });

  return useMemo(() => ({ direction }), [direction]);
};