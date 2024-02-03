# Change log

## Unreleased

- Added `useIntegerPosition` hook, for rounding positions.
- Added `useStateMachine` hook, for building state machines, handy for NPC behaviors.
- Added support for invalidation of dynamic properties.
- Added `maxFallSpeed` option to `usePlatformMovement` hook.
- Improved performance of the `BitmapText` component.

## [0.9.0]

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

## [0.8.0]

- Added `delta` parameter to `useKeyAxis` callback.
- Added support for static circular physics bodies.

## [0.7.0]

- Added `clamp` utility function.
- Added `useSwipe` hook.
- Added debug information to the device component.
- Removed legacy mouse and touch handlers.
- Fixed camera smoothing to be frame rate agnostic.

## [0.6.0]

- Added support for pointer events.
- Added support for speech synthesis API.

## [0.5.0]

- Added particle generator

## [0.4.0]

- Implemented automatic property invalidation mechanism, using proxies.

## [0.3.0]

- Added `setVelocity` function to physics context.
- Use CSS typed object model for setting styles.

## [0.2.0]

- Added different device modes.
- Device styles for mobile simulation.

## [0.1.2]

- Initial prototype.