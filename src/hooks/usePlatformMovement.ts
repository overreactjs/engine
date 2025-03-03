import { useMemo } from "react";
import { BBox } from "detect-collisions";
import { intersects, lerp, permutator } from "../utils";
import { CollisionEventFunctionProps, Position, Prop, Property, Velocity } from "../types";
import { useEventListeners } from "./useEventListeners";
import { useOverlap } from "./useOverlap";
import { useProperty } from "./useProperty";
import { useUpdate } from "./useUpdate";
import { useVirtualInput } from "./useVirtualInput";

const DEFAULT_OPTIONS = {
  enabled: true,
  gravity: [0, 0.002],
  speed: 0.5,
  jumpStrength: 0.7,
  acceleration: 0.2,
  maxFallSpeed: 0.2,
  maxJumpCount: 1,
  canTurnMidair: false,
} as const;

export type PlatformMovementEventType = 'jump';

export type UsePlatformMovementOptions = {
  enabled?: Prop<boolean>;
  gravity?: Velocity;
  speed?: number;
  jumpStrength?: number;
  acceleration?: number;
  maxFallSpeed?: number;
  maxJumpCount?: number;
  canTurnMidair?: boolean;
};

export type UsePlatformMovementResult = {
  isOnFloor: Property<boolean>;
  isJumping: Property<boolean>;
  isFalling: Property<boolean>;
  jumpCount: Property<number>;
  direction: Property<'left' | 'right'>;
  addEventListener: (type: PlatformMovementEventType, fn: () => void) => void;
  removeEventListener: (type: PlatformMovementEventType, fn: () => void) => void;
}

export const usePlatformMovement = (collider: string, pos: Property<Position>, velocity: Property<Velocity>, options?: UsePlatformMovementOptions): UsePlatformMovementResult => {
  const allOptions = { ...DEFAULT_OPTIONS, ...options };
  const { gravity, speed, jumpStrength, acceleration, maxFallSpeed, maxJumpCount, canTurnMidair } = allOptions;
  const { isActive, hasAxis } = useVirtualInput();
  const { addEventListener, removeEventListener, fireEvent } = useEventListeners<PlatformMovementEventType>();

  const enabled = useProperty(allOptions.enabled);
  const change = useProperty([0, 0]);
  const isOnFloor = useProperty(false);
  const isJumping = useProperty(false);
  const isFalling = useProperty(false);
  const jumpCount = useProperty(0);
  const direction = useProperty<'left' | 'right'>('right');

  /**
   * Update the players velocity, position, and state flags, based on current inputs.
   */
  useUpdate((delta) => {
    if (enabled.current) {
      // Apply keyboard input to the player's velocity.
      const horizontalInput = hasAxis('left', 'right');
      const accelerationFactor = isOnFloor.current ? 1.0 : 0.2;
      velocity.current[0] = lerp(velocity.current[0], horizontalInput * speed, acceleration * accelerationFactor);

      // Jump, if one of the following conditions are met:
      // 1. The entity is stood on the ground.
      // 2. The entity is falling, and has not yet jumped the maximum number of times.
      if (isActive('jump') && (isOnFloor.current || (isFalling.current && jumpCount.current > 0 && jumpCount.current < maxJumpCount))) {
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
      velocity.current[0] = velocity.current[0] + (gravity[0] || 0) * delta;
      velocity.current[1] = Math.min(maxFallSpeed, velocity.current[1] + (gravity[1] || 0) * delta);

      // Apply the velocity to the player.
      change.current[0] = velocity.current[0] * delta;
      change.current[1] = velocity.current[1] * delta;
      pos.current[0] += change.current[0];
      pos.current[1] += change.current[1];

      // Update the player's direction.
      if (canTurnMidair || isOnFloor.current) {
        if (horizontalInput < 0) {
          direction.current = 'left';
        } else if (horizontalInput > 0) {
          direction.current = 'right';
        }
      }
    }
  });

  /**
   * Handle collisions, ensuring that the entity cannot pass through solid objects.
   */
  useOverlap(collider, (collisions, delta) => {
    if (enabled.current) {
      console.log('---');
      const change: Position = [0, 0];
      const solids = optimize(collisions.filter((event) => event.tags.includes('solid')));
      const platforms = optimize(collisions.filter((event) => event.tags.includes('platform')));

      for (const { overlap } of solids) {
        console.log(overlap.x, overlap.y);

        if (overlap.y > 0 && overlap.y > change[1]) {
          pos.current[1] -= overlap.y;
          change[1] = overlap.y;
        }

        if (overlap.y < 0 && overlap.y < change[1]) {
          pos.current[1] -= overlap.y;
          change[1] = overlap.y;
        }

        if (overlap.x > 0 && overlap.x > change[0]) {
          pos.current[0] -= overlap.x;
          change[0] = overlap.x;
        }

        if (overlap.x < 0 && overlap.x < change[0]) {
          pos.current[0] -= overlap.x;
          change[0] = overlap.x;
        }
      }

      for (const { overlap } of platforms) {
        if (overlap.y > 0 && velocity.current[1] * delta * 1.02 >= overlap.y) {
          pos.current[1] -= overlap.y;
          change[1] = overlap.y;
        }
      }

      if (change[1] > 0 || change[1] < 0) {
        velocity.current[1] = 0;
      }

      if (change[0] > 0 || change[0] < 0) {
        velocity.current[0] = 0;
      }
      
      if (change[1] > 0) {
        isOnFloor.current = true;
        isFalling.current = false;
        jumpCount.current = 0;
      }
    }
  });

  return useMemo(() =>
    ({ isOnFloor, isJumping, isFalling, jumpCount, direction, addEventListener, removeEventListener }),
    [addEventListener, removeEventListener, direction, isFalling, isJumping, isOnFloor, jumpCount],
  );
};

/**
 * This function takes an array of collision events, and returns an optimal array of collision
 * events. It is considered optimal when the number of required adjustments to the player's
 * position is as small as possible.
 * 
 * To achieve this, we iterate through all of the permutations of the event list, and for each
 * permutation we apply the overlaps in order, checking to see if the previously applied offsets
 * have rendered the current one unnecessary.
 */
const optimize = (collisions: CollisionEventFunctionProps[]): CollisionEventFunctionProps[] => {
  const permutations = permutator(collisions);

  let result: CollisionEventFunctionProps[] = [];
  let best = Number.MAX_VALUE;

  for (const permutation of permutations) {
    const delta: Position = [0, 0];

    for (const event of permutation) {
      if (intersects(add(event.a.bbox, delta), event.b.bbox)) {
        delta[0] -= event.overlap.x;
        delta[1] -= event.overlap.y;
      }
    }

    const score = Math.abs(delta[0]) + Math.abs(delta[1]);

    if (score < best) {
      best = score;
      result = permutation;
    }
  }

  const delta: Position = [0, 0];

  for (const event of result) {
    if (intersects(add(event.a.bbox, delta), event.b.bbox)) {
      delta[0] -= event.overlap.x;
      delta[1] -= event.overlap.y;
    } else {
      event.overlap.x = 0;
      event.overlap.y = 0;
    }
  }

  return collisions;
};

/**
 * Add a delta offset to a bounding box.
 */
const add = (box: BBox, delta: Position): BBox => {
  return {
    minX: box.minX + delta[0],
    maxX: box.maxX + delta[0],
    minY: box.minY + delta[1],
    maxY: box.maxY + delta[1],
  };
};
