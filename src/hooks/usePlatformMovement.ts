import { useMemo, useRef } from "react";
import { Position, Property, Velocity } from "../types";
import { lerp } from "../utils";
import { useKeyboard } from "./useKeyboard";
import { useUpdate } from "./useUpdate";
import { useEventListeners } from "./useEventListeners";
import { useOverlap } from "./useOverlap";

const DEFAULT_OPTIONS = {
  gravity: [0, 0.002],
  speed: 0.5,
  jumpStrength: 0.7,
  acceleration: 0.2,
  maxJumpCount: 1,
  jumpKey: 'KeyW',
  leftKey: 'KeyA',
  rightKey: 'KeyD',
} as const;

type PlatformMovementEventType = 'jump';

type UsePlatformMovementControls = {
  jumpKey?: string;
  leftKey?: string;
  rightKey?: string;
}

type UsePlatformMovementOptions = UsePlatformMovementControls & {
  gravity?: Velocity;
  speed?: number;
  jumpStrength?: number;
  acceleration?: number;
  maxJumpCount?: number;
};

type UsePlatformMovementResult = {
  isOnFloor: Property<boolean>;
  isJumping: Property<boolean>;
  isFalling: Property<boolean>;
  jumpCount: Property<number>;
  direction: Property<'left' | 'right'>;
  addEventListener: (type: PlatformMovementEventType, fn: () => void) => void;
}

export const usePlatformMovement = (collider: string, pos: Property<Position>, velocity: Property<Velocity>, options?: UsePlatformMovementOptions): UsePlatformMovementResult => {
  const { gravity, speed, jumpStrength, acceleration, maxJumpCount, jumpKey, leftKey, rightKey } = { ...DEFAULT_OPTIONS, ...options };
  const { isKeyDown, hasKeyAxis } = useKeyboard();
  const { addEventListener, fireEvent } = useEventListeners<PlatformMovementEventType>();

  const change = useRef([0, 0]);
  const isOnFloor = useRef(false);
  const isJumping = useRef(false);
  const isFalling = useRef(false);
  const jumpCount = useRef(0);
  const direction = useRef<'left' | 'right'>('right');

  useUpdate((delta) => {
    // Apply keyboard input to the player's velocity.
    const keyboardHorizontal = hasKeyAxis(leftKey, rightKey);
    const accelerationFactor = isOnFloor.current ? 1 : 0.2;
    velocity.current[0] = lerp(velocity.current[0], keyboardHorizontal * speed, acceleration * accelerationFactor);

    // Jump, if one of the following conditions are met:
    // 1. The entity is stood on the ground.
    // 2. The entity is falling, and has not yet jumped the maximum number of times.
    if (isKeyDown(jumpKey) && (isOnFloor.current || (isFalling.current && jumpCount.current > 0 && jumpCount.current < maxJumpCount))) {
      velocity.current[1] = -jumpStrength;
      isOnFloor.current = false;
      isJumping.current = true;
      isFalling.current = false;
      jumpCount.current++;
      fireEvent('jump', undefined);
    }

    // Update state flags.
    if (velocity.current[1] > 0) {
      isOnFloor.current = false;
      isJumping.current = false;
      isFalling.current = true;
    }

    // Add gravity to the player's velocity.
    velocity.current[0] += (gravity[0] || 0) * delta;
    velocity.current[1] += (gravity[1] || 0) * delta;

    // Apply the velocity to the player.
    change.current[0] = velocity.current[0] * delta;
    change.current[1] = velocity.current[1] * delta;
    pos.current[0] += change.current[0];
    pos.current[1] += change.current[1];

    // Update the players direction.
    if (isOnFloor.current) {
      if (keyboardHorizontal < 0) {
        direction.current = 'left';
      } else if (keyboardHorizontal > 0) {
        direction.current = 'right';
      }
    }
  });

  // Handle collisions, ensuring that the entity cannot pass through solid objects.
  useOverlap(collider, ({ collision, tags }) => {
    const isLanding = collision.overlapV.y > 0;
    const isSolid = tags.includes('solid');
    const isPlatform = tags.includes('platform');

    if (isSolid || (isPlatform && isLanding && collision.overlapV.y <= change.current[1] * 1.1)) {
      pos.current[0] -= collision.overlapV.x;
      pos.current[1] -= collision.overlapV.y;

      // The entity landed on something, so we mark it as being on the floor.
      if (isLanding && isFalling.current) {
        velocity.current[1] = 0;
        isOnFloor.current = true;
        isFalling.current = false;
        jumpCount.current = 0;
      }
    }
  });

  return useMemo(() => ({ isOnFloor, isJumping, isFalling, jumpCount, direction, addEventListener }), [addEventListener]);
};

