import { Size, Property, Position } from "../../types";
import { VariableProperty } from "../../utils";

export class Tiles {
  size: Size;
  tiles: Property<number>[];

  constructor(size: Size, init: () => number = () => -1) {
    this.size = size;
    this.tiles = new Array(size[0] * size[1]);

    for (let i = 0; i < this.tiles.length; i++) {
      this.tiles[i] = new VariableProperty<number>(init());
    }
  }

  get length(): number {
    return this.tiles.length; 
  }

  get(pos: Position): number | undefined {
    return pos[0] >= 0 && pos[0] < this.size[0] && pos[1] >= 0 && pos[1] < this.size[1]
      ? this.tiles[pos[1] * this.size[0] + pos[0]].current
      : -1;
  }

  getByIndex(index: number): number {
    return this.tiles[index].current;
  }

  set(pos: Position, value: number): void {
    this.tiles[pos[1] * this.size[0] + pos[0]].current = value;
  }

  setByIndex(index: number, value: number): void {
    this.tiles[index].current = value;
  }

  map<U>(callback: (value: Property<number>, index: number, array: Property<number>[]) => U): U[] {
    return this.tiles.map(callback);
  }

  forEach(callback: (value: Property<number>, index: number, array: Property<number>[]) => void) {
    for (let i = 0; i < this.length; i++) {
      callback(this.tiles[i], i, this.tiles);
    }
  }

  update(callback: (value: Property<number>) => number) {
    this.forEach((value, index, array) => {
      array[index].current = callback(value);
    });
  }
}
