import { PointOptions } from "../types";

export class Point {
  public x: number;
  public y: number;
  public z: number;
  public a: number;
  public h: number;

  constructor(options: PointOptions) {
    this.x = options.x;
    this.y = options.y;
    this.z = options.z || 5;
    this.a = options.a || 1;
    this.h = options.h || 0;
  }

  clone(): Point {
    return new Point({
      x: this.x,
      y: this.y,
      z: this.z,
      a: this.a,
      h: this.h,
    });
  }

  distanceTo(other: Point): { dx: number; dy: number; distance: number } {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    return { dx, dy, distance };
  }
}
