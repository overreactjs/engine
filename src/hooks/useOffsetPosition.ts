import { useMemo } from "react";
import { Position, Prop, Property } from "../types";
import { useProperty } from "./useProperty";

export const useOffsetPosition = (value: Property<Position>, offset: Prop<Position>) => {
  const _offset = useProperty(offset);
  return useMemo(() => new DynamicPosition(value, _offset), [_offset, value]);
}

export class DynamicPosition {
  
  value: Property<Position>;
  offset: Property<Position>;

  constructor(value: Property<Position>, offset: Property<Position>) {
    this.value = value;
    this.offset = offset;
  }

  listen(fn: (value: Position) => void) {
    return this.value.listen(() => fn(this.current));
  }
  
  get current(): [number, number] {
    const x = this.value.current[0] + this.offset.current[0];
    const y = this.value.current[1] + this.offset.current[1];
    return [x, y];
  }

  get invalidated(): boolean {
    return this.value.invalidated || this.offset.invalidated;
  }

  set invalidated(_: boolean) {
    // Do nothing!
  }
}
