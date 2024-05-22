# Change log

## Unreleased

- Added support for setting `visible` flags in the node hierarchy, along with a `useVisible` hook.
- Added visibility support to `BitmapImage` and `BitmapSprite` components.
- Added `useFlash` hook for easily flashing elements.

## 0.15.0

- Added support for multi touch pointer events.
- Improved performance by only updating the `BitmapSprite` offset when it's visible on screen.
- Improved performance by setting `display: none` on inactive sprite set animations.
- Improved the handling of swipe actions.
- Fixed a bug in the handling of nodes, ensuring a name is always provided.
- Hide debug elements for physics bodies by default.

## 0.14.1

- Fixed a bug in the state machine, ensuring that the age is always zero on the first call of any new state function.

## 0.14.0

- Added initial support for gamepads, with support for 'standard' gamepad layouts.
- Added `useGamepadMap` hook for easily hooking up gamepads to virtual inputs.
- Added `useSequence` hook to iteratively check a set of conditions are met in order.
- Added `active` prop to `ParticleGenerator` component.
- Added integration testing framework.
- Fixed a bug in update function processing, where 'after' update functions were sometimes not invoked.
- Improved update function processing to avoid unresolvable cycles.

## 0.13.0

- Reversed the map used by `useKeyboardMap`.
- Refactored `StateMachine` to make age a property.

## 0.12.0

- Added `offset` and `rounded` props to `Node`, for easier layout of component parts.
- Added `entity` prop to `CollisionBox`, for passing entities to collision handlers.
- Added `useCachedDynamicProperty` as a performance optimization.
- Refactored `StateMachine` to avoid performance overhead of the dynamic property.
- Limited tick delta to a maximum of one 1/15 of a second, to avoid huge deltas on startup.

## 0.11.0

- Added support for arbitrary bitmap scaling, via the `factor` prop on `BitmapImage`.
- Simplified various typings in state machine.
- Fixed development mode motion key binding.
- Removed automatic rounded of positions to whole pixels in `useElement`.

## 0.10.0

- Added `useIntegerPosition` hook, for rounding positions.
- Added `useStateMachine` hook, for building state machines, handy for NPC behaviors.
- Added `useMergeProperty` hook, for combining two properties.
- Added `useVirtualAction` hook.
- Added support for invalidation of dynamic properties.
- Added `maxFallSpeed` option to `usePlatformMovement` hook.
- Added support for disabling tilemap collisions, using an `active` prop.
- Added support for multiple tags in tilemap collisions.
- Added `active` parameter to `useKeyboardMap`.
- Improved performance of the `BitmapText` component.
- Fixed a bug in `Tilemap` where collision boxes didn't align with the tiles.

## 0.9.0

- Added `BitmapText` component.
- Added collision detection to `Tilemap` component.
- Added virtual input management, with simple keyboard mapping hook.
- Added support for landscape mobile orientations.
- Added `active` prop to `ColliderBox` component.
- Added `delta` parameter to `usePostCollisions` hook.
- Added `chance` utility function.
- Added `canTurnMidair` config option to `usePlatformMovement`.
- Pass `tags` as a property when registering colliders, so they can change.
- Automatically pause the engine when the window loses focus.
- Improved collision handling.
- Improved virtual input handling, to be temporal based.
- Improved support for angle and scale props in bitmap images and sprites.
- Fixed re-render issue with properties.
- Fixed issue with collision handlers are registered before collision bodies.

## 0.8.0

- Added `delta` parameter to `useKeyAxis` callback.
- Added support for static circular physics bodies.

## 0.7.0

- Added `clamp` utility function.
- Added `useSwipe` hook.
- Added debug information to the device component.
- Removed legacy mouse and touch handlers.
- Fixed camera smoothing to be frame rate agnostic.

## 0.6.0

- Added support for pointer events.
- Added support for speech synthesis API.

## 0.5.0

- Added particle generator

## 0.4.0

- Implemented automatic property invalidation mechanism, using proxies.

## 0.3.0

- Added `setVelocity` function to physics context.
- Use CSS typed object model for setting styles.

## 0.2.0

- Added different device modes.
- Device styles for mobile simulation.

## 0.1.2

- Initial prototype.