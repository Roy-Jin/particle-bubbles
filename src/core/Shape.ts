import { Dot } from "./Dot";
import { Point } from "./Point";
import type { Drawing } from "./Drawing";
import { ColorOptions, PointOptions } from "../types";
import type { ShapeBuilded } from "./ShapeBuilder";

export class Shape {
    dots: Dot[] = [];
    width = 0;
    height = 0;
    cx = 0;
    cy = 0;
    drawing: Drawing;
    color: ColorOptions | string;

    constructor(drawing: Drawing, color: ColorOptions | string) {
        this.drawing = drawing;
        this.color = color;
    }
    private compensate() {
        var a = this.drawing.getArea();

        this.cx = a.w / 2 - this.width / 2;
        this.cy = a.h / 2 - this.height / 2;
    }

    shuffleIdle() {
        var a = this.drawing.getArea();

        for (var d = 0; d < this.dots.length; d++) {
            if (!this.dots[d].s) {
                this.dots[d].move({
                    x: Math.random() * a.w,
                    y: Math.random() * a.h,
                });
            }
        }
    }

    switchShape(n: ShapeBuilded, fast: boolean = false) {
        let size,
            a = this.drawing.getArea(),
            d = 0,
            i = 0;

        this.width = n.w;
        this.height = n.h;

        this.compensate();

        if (n.dots.length > this.dots.length) {
            size = n.dots.length - this.dots.length;
            for (d = 1; d <= size; d++) {
                this.dots.push(
                    new Dot(a.w / 2, a.h / 2, this.drawing, this.color),
                );
            }
        }

        d = 0;

        while (n.dots.length > 0) {
            i = Math.floor(Math.random() * n.dots.length);
            this.dots[d].e = fast ? 0.25 : (this.dots[d].s ? 0.14 : 0.11);

            if (this.dots[d].s) {
                this.dots[d].move(
                    new Point({
                        z: Math.random() * 20 + 10,
                        a: Math.random(),
                        h: 18,
                    } as PointOptions),
                );
            } else {
                this.dots[d].move(
                    new Point({
                        z: Math.random() * 5 + 5,
                        h: fast ? 18 : 30,
                    } as PointOptions),
                );
            }

            this.dots[d].s = true;
            this.dots[d].move(
                new Point({
                    x: n.dots[i].x + this.cx,
                    y: n.dots[i].y + this.cy,
                    a: 1,
                    z: 5,
                    h: 0,
                }),
            );

            n.dots = n.dots.slice(0, i).concat(n.dots.slice(i + 1));
            d++;
        }

        for (i = d; i < this.dots.length; i++) {
            if (this.dots[i].s) {
                this.dots[i].move(
                    new Point({
                        z: Math.random() * 20 + 10,
                        a: Math.random(),
                        h: 20,
                    } as PointOptions),
                );

                this.dots[i].s = false;
                this.dots[i].e = 0.04;
                this.dots[i].move(
                    new Point({
                        x: Math.random() * a.w,
                        y: Math.random() * a.h,
                        a: 0.3, //.4
                        z: Math.random() * 4,
                        h: 0,
                    }),
                );
            }
        }
    }

    render() {
        for (var d = 0; d < this.dots.length; d++) {
            this.dots[d].render();
        }
    }
}
