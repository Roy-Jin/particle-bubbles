import { Point } from "./Point";
import { Color } from "./Color";
import type { Drawing } from "./Drawing";
import { ColorOptions } from "../types";

export class Dot {
    point: Point;
    color: Color;
    e;
    s;
    t;
    q: any[] = [];
    drawing: Drawing;
    constructor(
        x: number,
        y: number,
        drawing: Drawing,
        color: ColorOptions | string,
    ) {
        this.drawing = drawing;

        this.point = new Point({
            x: x,
            y: y,
            z: 5,
            a: 1,
            h: 0,
        });
        this.e = 0.07;
        this.s = true;

        this.color = new Color(color);

        this.t = this.clone();
    }

    clone() {
        return new Point({
            x: this.point.x,
            y: this.point.y,
            a: this.point.a,
            h: this.point.h,
        });
    }

    private draw() {
        this.color.a = this.point.a;
        this.drawing.drawCircle(this.point, this.color);
    }

    private moveTowards(n: any) {
        let details = this.distanceTo(n, true),
            dx = details[0],
            dy = details[1],
            d = details[2],
            e = this.e * d;

        if (this.point.h === -1) {
            this.point.x = n.x;
            this.point.y = n.y;
            return true;
        }

        if (d > 1) {
            this.point.x -= (dx / d) * e;
            this.point.y -= (dy / d) * e;
        } else {
            if (this.point.h > 0) {
                this.point.h--;
            } else {
                return true;
            }
        }

        return false;
    }

    private update() {
        let p,
            d;

        if (this.moveTowards(this.t)) {
            p = this.q.shift();

            if (p) {
                this.t.x = p.x || this.point.x;
                this.t.y = p.y || this.point.y;
                this.t.z = p.z || this.point.z;
                this.t.a = p.a || this.point.a;
                this.point.h = p.h || 0;
            } else {
                if (this.s) {
                    this.point.x -= Math.sin(Math.random() * 3.14);
                    this.point.y -= Math.sin(Math.random() * 3.14);
                } else {
                    this.move(
                        new Point({
                            x: this.point.x + (Math.random() * 50) - 25,
                            y: this.point.y + (Math.random() * 50) - 25,
                        }),
                    );
                }
            }
        }

        d = this.point.a - this.t.a;
        this.point.a = Math.max(0.1, this.point.a - (d * 0.05));
        d = this.point.z - this.t.z;
        this.point.z = Math.max(1, this.point.z - (d * 0.05));
    }

    private distanceTo(
        n: Partial<Point>,
        details: true,
    ): [number, number, number];
    private distanceTo(n: Partial<Point>, details?: false): number;
    private distanceTo(n: Point, details?: boolean) {
        let dx = this.point.x - n.x,
            dy = this.point.y - n.y,
            d = Math.sqrt(dx * dx + dy * dy);

        if (details) {
            return [dx, dy, d];
        }

        return d;
    }

    move(p: Partial<Point>, avoidStatic: boolean = false) {
        if (!avoidStatic || (avoidStatic && (this.distanceTo(p)) > 1)) {
            this.q.push(p);
        }
    }

    render() {
        this.update();
        this.draw();
    }
}
