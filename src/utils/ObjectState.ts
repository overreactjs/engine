export class StateProp<T> {
  current: T;

  constructor(value: T) {
    this.current = value;
  }
}

export class ObjectState {
  static autoId: number = 0;

  id: number;

  constructor() {
    this.id = ObjectState.autoId++;
  }
}
