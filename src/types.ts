import { Vector } from "detect-collisions";
import { Engine } from "matter-js";
import { Body, StateMachine } from "./utils";

export type ElementType = ElementCSSInlineStyle & Element;

export type Property<T> = {
  current: T;
  invalidated: boolean;
}

export type Prop<T> = T | Property<T>;

export type Position = [number, number];

export type Velocity = [number, number];

export type Size = [number, number];

export type BaseStyleProps = {
  pos?: Prop<Position>;
  size: Prop<Size>;
  flip?: Prop<boolean>;
  angle?: Prop<number>;
  scale?: Prop<number>;
  visible?: Prop<boolean>;
};

export type BitmapAsset = {
  url: string;
  size: Position;
};

export type BitmapSpriteAsset = BitmapAsset & {
  count: number;
  rate: number;
}

export type Tileset = {
  image: BitmapAsset;
  cellSize: Size;
  tileSize: Size;
  gridSize: Size;
}

export type BitmapFontFace = {
  image: BitmapAsset;
  glyphSize: Size;
  glyphs: string;
};

export type TickerFunction = (delta: number, time: number) => void;

export type UpdateFunction = (delta: number, time: number) => void;

export type UpdateOptions = {
  after?: string;
}

export type UpdateConfig = UpdateOptions & {
  fn: UpdateFunction;
}

export type RenderFunction = () => void;

export type CollisionUpdateFunction = (body: Body) => void;

export type CollisionEventFunctionProps<T = unknown> = {
  a: Body<T>;
  b: Body<T>;
  overlap: Vector;
  tags: string[];
  firstTime: boolean;
};

export type CollisionEventFunction<T = unknown> = (collisions: CollisionEventFunctionProps<T>[], delta: number) => void;

export type CollisionTag = 'solid' | 'platform' | string;

export type PhysicsUpdateFunction = (body: Matter.Body) => void;

export type PhysicsEventType = 'collision';

export type PhysicsEvent = Matter.IEventCollision<Engine>;

export type CameraAxis = 'x' | 'y' | 'xy';

export type DeviceMode = 'mobile' | 'mobile-landscape' | 'tablet' | 'desktop';

export type StateFunction<T> = (fsm: StateMachine<T>, delta: number) => void;

export type StateDefinitions<T> = PartialRecord<string, StateFunction<T>>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PartialRecord<K extends keyof any, T> =  Partial<Record<K, T>>;

export type KeyboardMap = Partial<Record<KeyboardKeyName, string>>;

export type KeyboardKeyName =
  | 'KeyA'
  | 'KeyB'
  | 'KeyC'
  | 'KeyD'
  | 'KeyE'
  | 'KeyF'
  | 'KeyG'
  | 'KeyH'
  | 'KeyI'
  | 'KeyJ'
  | 'KeyK'
  | 'KeyL'
  | 'KeyM'
  | 'KeyN'
  | 'KeyO'
  | 'KeyP'
  | 'KeyQ'
  | 'KeyR'
  | 'KeyS'
  | 'KeyT'
  | 'KeyU'
  | 'KeyV'
  | 'KeyW'
  | 'KeyX'
  | 'KeyY'
  | 'KeyZ'
  | 'Digit0'
  | 'Digit1'
  | 'Digit2'
  | 'Digit3'
  | 'Digit4'
  | 'Digit5'
  | 'Digit6'
  | 'Digit7'
  | 'Digit8'
  | 'Digit9'
  | 'ArrowUp'
  | 'ArrowDown'
  | 'ArrowLeft'
  | 'ArrowRight'
  | 'Space'
  | 'Enter'
  | 'Escape'
  ;

export type GamepadButtonMap = Partial<Record<GamepadButtonName, string>>;

export type GamepadButtonName =
  | 'Up'
  | 'Down'
  | 'Left'
  | 'Right'
  | 'A'
  | 'B'
  | 'X'
  | 'Y'
  | 'Shoulder_L1'
  | 'Shoulder_L2'
  | 'Shoulder_R1'
  | 'Shoulder_R2'
  | 'Start'
  | 'Select'
  ;

export type GamepadAxisMap = Partial<Record<GamepadAxisName, [(string | null), (string | null)]>>;

export type GamepadAxisName =
  | 'Left_Horizontal'
  | 'Left_Vertical'
  | 'Right_Horizontal'
  | 'Right_Vertical'
  ;

export type EventHandler<T> = (event: T) => void;

export type UseEventTarget<E, T> = {
  addEventListener: (type: E, fn: EventHandler<T>) => void;
  removeEventListener: (type: E, fn: EventHandler<T>) => void;
};

export type UseEventListenersResult<E, T> = UseEventTarget<E, T> & {
  fireEvent: (type: E, payload: T) => void;
};
