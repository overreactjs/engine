import { Position, Property, Velocity } from "../types";
import { lerp } from "../utils";
import { useKeyboard } from "./useKeyboard";
import { useOverlap } from "./useOverlap";
import { useUpdate } from "./useUpdate";

const DEFAULT_OPTIONS = {
  speed: 0.5,
  acceleration: 0.2,
}

type Use8DirectionMovementOptions = {
  speed: number;
  acceleration: number;
};

export const use8DirectionMovement = (collider: string, pos: Property<Position>, velocity: Property<Velocity>, options?: Use8DirectionMovementOptions) => {
  const { speed, acceleration } = { ...DEFAULT_OPTIONS, ...options };
  const { hasKeyAxis } = useKeyboard();

  useOverlap(collider, ({ collision }) => {
    pos.current[0] -= collision.overlapV.x;
    pos.current[1] -= collision.overlapV.y;
  });

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
  });
};