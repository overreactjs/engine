import { Vector } from "detect-collisions";
import { Engine } from "matter-js";
import { Body, StateMachine } from "./utils";

export type ElementType = InnerHTML & ElementCSSInlineStyle & Element;

export type Property<T> = {
  current: T;
  invalidated: boolean;
}

export type Prop<T> = T | Property<T>;

export type Position = [number, number];

export type Velocity = [number, number];

export type Size = [number, number];

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

type PartialRecord<K extends keyof any, T> =  Partial<Record<K, T>>;

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
