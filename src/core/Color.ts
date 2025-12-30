import type { ColorOptions } from "../types";

export class Color {
    r: number;
    g: number;
    b: number;
    a: number;

    constructor(options: ColorOptions | string) {
        if (typeof options === "string") {
            const rgba = this.parseColorString(options);
            this.r = rgba.r;
            this.g = rgba.g;
            this.b = rgba.b;
            this.a = rgba.a;
        } else {
            this.r = options.r;
            this.g = options.g;
            this.b = options.b;
            this.a = options.a;
        }
    }

    private parseColorString(colorStr: string): ColorOptions {
        // 简单解析常见颜色格式
        if (colorStr.startsWith("#")) {
            return this.parseHexColor(colorStr);
        } else if (colorStr.startsWith("rgba")) {
            return this.parseRgbaColor(colorStr);
        } else if (colorStr.startsWith("rgb")) {
            return this.parseRgbColor(colorStr);
        }

        // 默认返回白色
        return { r: 255, g: 255, b: 255, a: 1 };
    }

    private parseHexColor(hex: string): ColorOptions {
        hex = hex.replace("#", "");

        let r = 255, g = 255, b = 255;

        if (hex.length === 3) {
            r = parseInt(hex[0] + hex[0], 16);
            g = parseInt(hex[1] + hex[1], 16);
            b = parseInt(hex[2] + hex[2], 16);
        } else if (hex.length === 6) {
            r = parseInt(hex.substring(0, 2), 16);
            g = parseInt(hex.substring(2, 4), 16);
            b = parseInt(hex.substring(4, 6), 16);
        }

        return { r, g, b, a: 1 };
    }

    private parseRgbColor(rgb: string): ColorOptions {
        const match = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        if (match) {
            return {
                r: parseInt(match[1], 10),
                g: parseInt(match[2], 10),
                b: parseInt(match[3], 10),
                a: 1,
            };
        }
        return { r: 255, g: 255, b: 255, a: 1 };
    }

    private parseRgbaColor(rgba: string): ColorOptions {
        const match = rgba.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
        if (match) {
            return {
                r: parseInt(match[1], 10),
                g: parseInt(match[2], 10),
                b: parseInt(match[3], 10),
                a: parseFloat(match[4]),
            };
        }
        return { r: 255, g: 255, b: 255, a: 1 };
    }

    render(): string {
        return `rgba(${Math.round(this.r)},${Math.round(this.g)},${
            Math.round(this.b)
        },${this.a})`;
    }

    clone(): Color {
        return new Color({
            r: this.r,
            g: this.g,
            b: this.b,
            a: this.a,
        });
    }

    // 颜色插值
    interpolate(target: Color, progress: number): Color {
        return new Color({
            r: this.r + (target.r - this.r) * progress,
            g: this.g + (target.g - this.g) * progress,
            b: this.b + (target.b - this.b) * progress,
            a: this.a + (target.a - this.a) * progress,
        });
    }
}
