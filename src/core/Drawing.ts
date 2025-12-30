import type { Color } from "./Color";
import type { Point } from "./Point";

export class Drawing {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    renderFn: Function | null = null;
    constructor(el: HTMLCanvasElement) {
        this.canvas = el;
        this.context = this.canvas.getContext("2d") as CanvasRenderingContext2D;
        this.adjustCanvas();

        window.addEventListener("resize", () => {
            this.adjustCanvas();
        });
    }

    loop(fn: Function) {
        this.renderFn = !this.renderFn ? fn : this.renderFn;
        this.clearFrame();
        this.renderFn();
        window.requestAnimationFrame(() => this.loop(fn));
    }

    adjustCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    clearFrame() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    getArea() {
        return { w: this.canvas.width, h: this.canvas.height };
    }

    drawCircle(p: Point, c: Color) {
        this.context.fillStyle = c.render();
        this.context.beginPath();
        this.context.arc(p.x, p.y, p.z, 0, 2 * Math.PI, true);
        this.context.closePath();
        this.context.fill();
    }
}
