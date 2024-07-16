export abstract class BaseParticle {
  node: HTMLDivElement = {} as unknown as HTMLDivElement;
  spawned = true;
  ttl = 0;

  attach(node: HTMLDivElement) {
    this.node = node;
  }

  abstract init(): void;
  abstract update(delta: number): void;
  abstract destroy(): void;
}
