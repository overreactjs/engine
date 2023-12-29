export class ObjectState {
  static autoId: number = 0;

  id: number;

  constructor() {
    this.id = ObjectState.autoId++;
  }
}
