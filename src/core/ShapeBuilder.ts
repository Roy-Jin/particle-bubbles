import { Point } from "./Point";
import type { Drawing } from "./Drawing";

export interface ShapeBuilded {
    dots: Point[];
    w: number;
    h: number;
}

export class ShapeBuilder {
    gap = 13;
    shapeCanvas = document.createElement("canvas");
    shapeContext = this.shapeCanvas.getContext(
        "2d",
        { willReadFrequently: true },
    ) as CanvasRenderingContext2D;
    fontSize = 500;
    fontFamily: string;
    drawing: Drawing;

    constructor(drawing: Drawing, fontFamily?: string) {
        this.fit();
        this.drawing = drawing;
        this.fontFamily = fontFamily || "sans-serif";
        window.addEventListener("resize", () => {
            this.fit();
        });
    }

    imageFile(url: string, callback: Function) {
        let image = new Image(),
            a = this.drawing.getArea();

        image.onload = () => {
            this.shapeContext.clearRect(
                0,
                0,
                this.shapeCanvas.width,
                this.shapeCanvas.height,
            );
            this.shapeContext.drawImage(image, 0, 0, a.h * 0.6, a.h * 0.6);
            callback(this.processCanvas());
        };

        image.onerror = () => {
            callback(this.letter("#IMAGE"));
        };

        image.src = url;
    }
    circle(d: number) {
        var r = Math.max(0, d) / 2;
        this.shapeContext.clearRect(
            0,
            0,
            this.shapeCanvas.width,
            this.shapeCanvas.height,
        );
        this.shapeContext.beginPath();
        this.shapeContext.arc(
            r * this.gap,
            r * this.gap,
            r * this.gap,
            0,
            2 * Math.PI,
            false,
        );
        this.shapeContext.fill();
        this.shapeContext.closePath();

        return this.processCanvas();
    }

    letter(l: string) {
        var s = 0;

        this.setFontSize(this.fontSize);
        s = Math.min(
            this.fontSize,
            (this.shapeCanvas.width / this.shapeContext.measureText(l).width) *
                0.8 *
                this.fontSize,
            (this.shapeCanvas.height / this.fontSize) *
                (this.isNumber(l) ? 1 : 0.45) *
                this.fontSize,
        );
        this.setFontSize(s);

        this.shapeContext.clearRect(
            0,
            0,
            this.shapeCanvas.width,
            this.shapeCanvas.height,
        );
        this.shapeContext.fillText(
            l,
            this.shapeCanvas.width / 2,
            this.shapeCanvas.height / 2,
        );

        return this.processCanvas();
    }

    rectangle(w: number, h: number): ShapeBuilded {
        var dots = [],
            width = this.gap * w,
            height = this.gap * h;

        for (var y = 0; y < height; y += this.gap) {
            for (var x = 0; x < width; x += this.gap) {
                dots.push(
                    new Point({
                        x: x,
                        y: y,
                    }),
                );
            }
        }

        return { dots: dots, w: width, h: height };
    }

    private fit() {
        try {
            this.shapeCanvas.width = Math.floor(window.innerWidth / this.gap) *
                this.gap;
            this.shapeCanvas.height =
                Math.floor(window.innerHeight / this.gap) *
                this.gap;
            this.shapeContext.fillStyle = "red";
            this.shapeContext.textBaseline = "middle";
            this.shapeContext.textAlign = "center";
        } catch (e) {}
    }

    processCanvas(): ShapeBuilded {
        let pixels = this.shapeContext.getImageData(
                0,
                0,
                this.shapeCanvas.width,
                this.shapeCanvas.height,
            ).data,
            dots = [],
            x = 0,
            y = 0,
            fx = this.shapeCanvas.width,
            fy = this.shapeCanvas.height,
            w = 0,
            h = 0;

        for (var p = 0; p < pixels.length; p += 4 * this.gap) {
            if (pixels[p + 3] > 0) {
                dots.push(
                    new Point({
                        x: x,
                        y: y,
                    }),
                );

                w = x > w ? x : w;
                h = y > h ? y : h;
                fx = x < fx ? x : fx;
                fy = y < fy ? y : fy;
            }

            x += this.gap;

            if (x >= this.shapeCanvas.width) {
                x = 0;
                y += this.gap;
                p += this.gap * 4 * this.shapeCanvas.width;
            }
        }

        return { dots: dots, w: w + fx, h: h + fy };
    }

    private setFontSize(s: number) {
        this.shapeContext.font = "bold " + s + "px " + this.fontFamily;
    }

    private isNumber(n: any) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }
}
