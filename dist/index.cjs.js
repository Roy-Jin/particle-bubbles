'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

class Drawing {
    constructor(el) {
        this.renderFn = null;
        this.canvas = el;
        this.context = this.canvas.getContext("2d");
        this.adjustCanvas();
        window.addEventListener("resize", () => {
            this.adjustCanvas();
        });
    }
    loop(fn) {
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
    drawCircle(p, c) {
        this.context.fillStyle = c.render();
        this.context.beginPath();
        this.context.arc(p.x, p.y, p.z, 0, 2 * Math.PI, true);
        this.context.closePath();
        this.context.fill();
    }
}

class Point {
    constructor(options) {
        this.x = options.x;
        this.y = options.y;
        this.z = options.z || 5;
        this.a = options.a || 1;
        this.h = options.h || 0;
    }
    clone() {
        return new Point({
            x: this.x,
            y: this.y,
            z: this.z,
            a: this.a,
            h: this.h,
        });
    }
    distanceTo(other) {
        const dx = this.x - other.x;
        const dy = this.y - other.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return { dx, dy, distance };
    }
}

class ShapeBuilder {
    constructor(drawing, fontFamily) {
        this.gap = 13;
        this.shapeCanvas = document.createElement("canvas");
        this.shapeContext = this.shapeCanvas.getContext("2d", { willReadFrequently: true });
        this.fontSize = 500;
        this.fit();
        this.drawing = drawing;
        this.fontFamily = fontFamily || "sans-serif";
        window.addEventListener("resize", () => {
            this.fit();
        });
    }
    imageFile(url, callback) {
        let image = new Image(), a = this.drawing.getArea();
        image.onload = () => {
            this.shapeContext.clearRect(0, 0, this.shapeCanvas.width, this.shapeCanvas.height);
            this.shapeContext.drawImage(image, 0, 0, a.h * 0.6, a.h * 0.6);
            callback(this.processCanvas());
        };
        image.onerror = () => {
            callback(this.letter("#IMAGE"));
        };
        image.src = url;
    }
    circle(d) {
        var r = Math.max(0, d) / 2;
        this.shapeContext.clearRect(0, 0, this.shapeCanvas.width, this.shapeCanvas.height);
        this.shapeContext.beginPath();
        this.shapeContext.arc(r * this.gap, r * this.gap, r * this.gap, 0, 2 * Math.PI, false);
        this.shapeContext.fill();
        this.shapeContext.closePath();
        return this.processCanvas();
    }
    letter(l) {
        var s = 0;
        this.setFontSize(this.fontSize);
        s = Math.min(this.fontSize, (this.shapeCanvas.width / this.shapeContext.measureText(l).width) *
            0.8 *
            this.fontSize, (this.shapeCanvas.height / this.fontSize) *
            (this.isNumber(l) ? 1 : 0.45) *
            this.fontSize);
        this.setFontSize(s);
        this.shapeContext.clearRect(0, 0, this.shapeCanvas.width, this.shapeCanvas.height);
        this.shapeContext.fillText(l, this.shapeCanvas.width / 2, this.shapeCanvas.height / 2);
        return this.processCanvas();
    }
    rectangle(w, h) {
        var dots = [], width = this.gap * w, height = this.gap * h;
        for (var y = 0; y < height; y += this.gap) {
            for (var x = 0; x < width; x += this.gap) {
                dots.push(new Point({
                    x: x,
                    y: y,
                }));
            }
        }
        return { dots: dots, w: width, h: height };
    }
    fit() {
        try {
            this.shapeCanvas.width = Math.floor(window.innerWidth / this.gap) *
                this.gap;
            this.shapeCanvas.height =
                Math.floor(window.innerHeight / this.gap) *
                    this.gap;
            this.shapeContext.fillStyle = "red";
            this.shapeContext.textBaseline = "middle";
            this.shapeContext.textAlign = "center";
        }
        catch (e) { }
    }
    processCanvas() {
        let pixels = this.shapeContext.getImageData(0, 0, this.shapeCanvas.width, this.shapeCanvas.height).data, dots = [], x = 0, y = 0, fx = this.shapeCanvas.width, fy = this.shapeCanvas.height, w = 0, h = 0;
        for (var p = 0; p < pixels.length; p += 4 * this.gap) {
            if (pixels[p + 3] > 0) {
                dots.push(new Point({
                    x: x,
                    y: y,
                }));
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
    setFontSize(s) {
        this.shapeContext.font = "bold " + s + "px " + this.fontFamily;
    }
    isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }
}

class Color {
    constructor(options) {
        if (typeof options === "string") {
            const rgba = this.parseColorString(options);
            this.r = rgba.r;
            this.g = rgba.g;
            this.b = rgba.b;
            this.a = rgba.a;
        }
        else {
            this.r = options.r;
            this.g = options.g;
            this.b = options.b;
            this.a = options.a;
        }
    }
    parseColorString(colorStr) {
        // 简单解析常见颜色格式
        if (colorStr.startsWith("#")) {
            return this.parseHexColor(colorStr);
        }
        else if (colorStr.startsWith("rgba")) {
            return this.parseRgbaColor(colorStr);
        }
        else if (colorStr.startsWith("rgb")) {
            return this.parseRgbColor(colorStr);
        }
        // 默认返回白色
        return { r: 255, g: 255, b: 255, a: 1 };
    }
    parseHexColor(hex) {
        hex = hex.replace("#", "");
        let r = 255, g = 255, b = 255;
        if (hex.length === 3) {
            r = parseInt(hex[0] + hex[0], 16);
            g = parseInt(hex[1] + hex[1], 16);
            b = parseInt(hex[2] + hex[2], 16);
        }
        else if (hex.length === 6) {
            r = parseInt(hex.substring(0, 2), 16);
            g = parseInt(hex.substring(2, 4), 16);
            b = parseInt(hex.substring(4, 6), 16);
        }
        return { r, g, b, a: 1 };
    }
    parseRgbColor(rgb) {
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
    parseRgbaColor(rgba) {
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
    render() {
        return `rgba(${Math.round(this.r)},${Math.round(this.g)},${Math.round(this.b)},${this.a})`;
    }
    clone() {
        return new Color({
            r: this.r,
            g: this.g,
            b: this.b,
            a: this.a,
        });
    }
    // 颜色插值
    interpolate(target, progress) {
        return new Color({
            r: this.r + (target.r - this.r) * progress,
            g: this.g + (target.g - this.g) * progress,
            b: this.b + (target.b - this.b) * progress,
            a: this.a + (target.a - this.a) * progress,
        });
    }
}

class Dot {
    constructor(x, y, drawing, color) {
        this.q = [];
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
    draw() {
        this.color.a = this.point.a;
        this.drawing.drawCircle(this.point, this.color);
    }
    moveTowards(n) {
        let details = this.distanceTo(n, true), dx = details[0], dy = details[1], d = details[2], e = this.e * d;
        if (this.point.h === -1) {
            this.point.x = n.x;
            this.point.y = n.y;
            return true;
        }
        if (d > 1) {
            this.point.x -= (dx / d) * e;
            this.point.y -= (dy / d) * e;
        }
        else {
            if (this.point.h > 0) {
                this.point.h--;
            }
            else {
                return true;
            }
        }
        return false;
    }
    update() {
        let p, d;
        if (this.moveTowards(this.t)) {
            p = this.q.shift();
            if (p) {
                this.t.x = p.x || this.point.x;
                this.t.y = p.y || this.point.y;
                this.t.z = p.z || this.point.z;
                this.t.a = p.a || this.point.a;
                this.point.h = p.h || 0;
            }
            else {
                if (this.s) {
                    this.point.x -= Math.sin(Math.random() * 3.14);
                    this.point.y -= Math.sin(Math.random() * 3.14);
                }
                else {
                    this.move(new Point({
                        x: this.point.x + (Math.random() * 50) - 25,
                        y: this.point.y + (Math.random() * 50) - 25,
                    }));
                }
            }
        }
        d = this.point.a - this.t.a;
        this.point.a = Math.max(0.1, this.point.a - (d * 0.05));
        d = this.point.z - this.t.z;
        this.point.z = Math.max(1, this.point.z - (d * 0.05));
    }
    distanceTo(n, details) {
        let dx = this.point.x - n.x, dy = this.point.y - n.y, d = Math.sqrt(dx * dx + dy * dy);
        if (details) {
            return [dx, dy, d];
        }
        return d;
    }
    move(p, avoidStatic = false) {
        if (!avoidStatic || (avoidStatic && (this.distanceTo(p)) > 1)) {
            this.q.push(p);
        }
    }
    render() {
        this.update();
        this.draw();
    }
}

class Shape {
    constructor(drawing, color) {
        this.dots = [];
        this.width = 0;
        this.height = 0;
        this.cx = 0;
        this.cy = 0;
        this.drawing = drawing;
        this.color = color;
    }
    compensate() {
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
    switchShape(n, fast = false) {
        let size, a = this.drawing.getArea(), d = 0, i = 0;
        this.width = n.w;
        this.height = n.h;
        this.compensate();
        if (n.dots.length > this.dots.length) {
            size = n.dots.length - this.dots.length;
            for (d = 1; d <= size; d++) {
                this.dots.push(new Dot(a.w / 2, a.h / 2, this.drawing, this.color));
            }
        }
        d = 0;
        while (n.dots.length > 0) {
            i = Math.floor(Math.random() * n.dots.length);
            this.dots[d].e = fast ? 0.25 : (this.dots[d].s ? 0.14 : 0.11);
            if (this.dots[d].s) {
                this.dots[d].move(new Point({
                    z: Math.random() * 20 + 10,
                    a: Math.random(),
                    h: 18,
                }));
            }
            else {
                this.dots[d].move(new Point({
                    z: Math.random() * 5 + 5,
                    h: fast ? 18 : 30,
                }));
            }
            this.dots[d].s = true;
            this.dots[d].move(new Point({
                x: n.dots[i].x + this.cx,
                y: n.dots[i].y + this.cy,
                a: 1,
                z: 5,
                h: 0,
            }));
            n.dots = n.dots.slice(0, i).concat(n.dots.slice(i + 1));
            d++;
        }
        for (i = d; i < this.dots.length; i++) {
            if (this.dots[i].s) {
                this.dots[i].move(new Point({
                    z: Math.random() * 20 + 10,
                    a: Math.random(),
                    h: 20,
                }));
                this.dots[i].s = false;
                this.dots[i].e = 0.04;
                this.dots[i].move(new Point({
                    x: Math.random() * a.w,
                    y: Math.random() * a.h,
                    a: 0.3, //.4
                    z: Math.random() * 4,
                    h: 0,
                }));
            }
        }
    }
    render() {
        for (var d = 0; d < this.dots.length; d++) {
            this.dots[d].render();
        }
    }
}

class ParticleBubbles {
    constructor(canvas, config = {}) {
        this.timerId = null;
        this.activeTimers = new Set();
        this.taskQueue = [];
        this.isRunning = false;
        // 核心命令方法
        this.commands = {
            letter: (text_1, ...args_1) => __awaiter(this, [text_1, ...args_1], void 0, function* (text, fast = false) {
                this.shape.switchShape(this.shapeBuilder.letter(text), fast);
                // 字母显示不需要额外延迟，延迟由任务间的 delay 控制
            }),
            image: (url_1, ...args_1) => __awaiter(this, [url_1, ...args_1], void 0, function* (url, fast = false) {
                return new Promise((resolve) => {
                    this.shapeBuilder.imageFile(url, (obj) => {
                        this.shape.switchShape(obj, fast);
                        resolve();
                    });
                });
            }),
            circle: (diameter_1, ...args_1) => __awaiter(this, [diameter_1, ...args_1], void 0, function* (diameter, fast = false) {
                this.shape.switchShape(this.shapeBuilder.circle(diameter), fast);
            }),
            rectangle: (width_1, height_1, ...args_1) => __awaiter(this, [width_1, height_1, ...args_1], void 0, function* (width, height, fast = false) {
                this.shape.switchShape(this.shapeBuilder.rectangle(width, height), fast);
            }),
            clear: () => {
                this.shape.dots = this.shape.dots.filter((dot) => dot.s);
            },
            color: (color) => {
                this.config.color = color;
                const newColor = new Color(color);
                this.shape.color = newColor;
                this.shape.dots.forEach((dot) => {
                    dot.color = newColor;
                });
            },
            countdown: (from_1, ...args_1) => __awaiter(this, [from_1, ...args_1], void 0, function* (from, interval = 1000, fast = false) {
                return new Promise((resolve) => {
                    let current = from;
                    const showNextNumber = () => {
                        if (current < 0) {
                            resolve();
                            return;
                        }
                        this.shape.switchShape(this.shapeBuilder.letter(current.toString()), fast);
                        if (current === 0) {
                            // 显示0后结束
                            resolve();
                        }
                        else {
                            current--;
                            this.registerTimer(window.setTimeout(showNextNumber, interval));
                        }
                    };
                    showNextNumber();
                });
            }),
        };
        this.config = Object.assign({ color: "#fff", autoClear: true, defaultDelay: 2000 }, config);
        const drawing = new Drawing(canvas);
        this.shapeBuilder = new ShapeBuilder(drawing, config.fonts);
        this.shape = new Shape(drawing, this.config.color);
        drawing.loop(() => {
            this.shape.render();
        });
    }
    /**
     * 清除所有活跃的定时器
     */
    clearAllTimers() {
        this.activeTimers.forEach((timerId) => {
            clearTimeout(timerId);
            clearInterval(timerId);
        });
        this.activeTimers.clear();
        if (this.timerId !== null) {
            clearTimeout(this.timerId);
            this.timerId = null;
        }
    }
    /**
     * 注册定时器，便于统一清理
     */
    registerTimer(timerId) {
        this.activeTimers.add(timerId);
        return timerId;
    }
    /**
     * 取消注册的定时器
     */
    unregisterTimer(timerId) {
        this.activeTimers.delete(timerId);
    }
    /**
     * 延迟执行函数
     */
    delay(ms) {
        return new Promise((resolve) => {
            const timerId = this.registerTimer(window.setTimeout(() => {
                this.unregisterTimer(timerId);
                resolve();
            }, ms));
        });
    }
    /**
     * 执行单个任务
     */
    runTask(task) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            if (this.config.autoClear && task.type !== "clear") {
                this.commands.clear();
            }
            switch (task.type) {
                case "letter": {
                    const text = ((_a = task.args) === null || _a === void 0 ? void 0 : _a[0]) || "";
                    yield this.commands.letter(text, task.fast || false);
                    break;
                }
                case "circle": {
                    const diameter = ((_b = task.args) === null || _b === void 0 ? void 0 : _b[0]) || 20;
                    yield this.commands.circle(diameter, task.fast || false);
                    break;
                }
                case "rectangle": {
                    const width = ((_c = task.args) === null || _c === void 0 ? void 0 : _c[0]) || 20;
                    const height = ((_d = task.args) === null || _d === void 0 ? void 0 : _d[1]) || 20;
                    yield this.commands.rectangle(width, height, task.fast || false);
                    break;
                }
                case "image": {
                    const url = (_e = task.args) === null || _e === void 0 ? void 0 : _e[0];
                    if (url) {
                        yield this.commands.image(url, task.fast || false);
                    }
                    else {
                        yield this.commands.letter("?", task.fast || false);
                    }
                    break;
                }
                case "clear": {
                    this.commands.clear();
                    break;
                }
                case "color": {
                    const color = ((_f = task.args) === null || _f === void 0 ? void 0 : _f[0]) || this.config.color || "#fff";
                    this.commands.color(color);
                    break;
                }
                case "countdown": {
                    const from = ((_g = task.args) === null || _g === void 0 ? void 0 : _g[0]) || 5;
                    const interval = ((_h = task.args) === null || _h === void 0 ? void 0 : _h[1]) || 1000; // 第二个参数作为间隔时间
                    yield this.commands.countdown(from, interval, task.fast || false);
                    break;
                }
            }
        });
    }
    parseStringTask(taskString) {
        if (taskString.startsWith("#")) {
            const parts = taskString.slice(1).trim().split(/\s+/);
            const type = parts[0];
            switch (type) {
                case "letter":
                    return {
                        type: "letter",
                        args: [parts.slice(1).join(" ")],
                        delay: this.config.defaultDelay,
                    };
                case "circle":
                    return {
                        type: "circle",
                        args: [Number(parts[1]) || 20],
                        delay: this.config.defaultDelay,
                    };
                case "rectangle":
                    return {
                        type: "rectangle",
                        args: [
                            Number(parts[1]) || 20,
                            Number(parts[2]) || 20,
                        ],
                        delay: this.config.defaultDelay,
                    };
                case "image":
                    return {
                        type: "image",
                        args: [parts[1]],
                        delay: this.config.defaultDelay,
                    };
                case "clear":
                    return {
                        type: "clear",
                        delay: this.config.defaultDelay,
                    };
                case "color":
                    return {
                        type: "color",
                        args: [parts[1] || "#fff"],
                        delay: this.config.defaultDelay,
                    };
                case "countdown": {
                    const from = Number(parts[1]) || 5;
                    const interval = Number(parts[2]) || 1000;
                    return {
                        type: "countdown",
                        args: [from, interval],
                        delay: from * interval + 1000, // 计算倒计时总时间 + 额外延迟
                    };
                }
                default:
                    return {
                        type: "letter",
                        args: [taskString.trim()],
                        delay: this.config.defaultDelay,
                    };
            }
        }
        else {
            return {
                type: "letter",
                args: [taskString.trim()],
                delay: this.config.defaultDelay,
            };
        }
    }
    /**
     * 开始执行任务队列
     */
    start(tasks) {
        return __awaiter(this, void 0, void 0, function* () {
            this.stop();
            if (tasks && tasks.length > 0) {
                this.taskQueue = tasks.map((task) => typeof task === "string" ? this.parseStringTask(task) : task);
            }
            if (this.taskQueue.length === 0)
                return;
            this.isRunning = true;
            yield this.processNextTask();
        });
    }
    /**
     * 处理下一个任务
     */
    processNextTask() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            while (this.taskQueue.length > 0 && this.isRunning) {
                const task = this.taskQueue.shift();
                // 执行当前任务
                yield this.runTask(task);
                const ConfigColor = this.config.color;
                if (task.color)
                    this.commands.color(task.color);
                // 任务执行完成后，等待delay时间再执行下一个任务
                if (this.taskQueue.length > 0 && this.isRunning) {
                    const delay = task.delay != null
                        ? task.delay
                        : (_a = this.config.defaultDelay) !== null && _a !== void 0 ? _a : 2000;
                    if (delay > 0) {
                        // 使用Promise和setTimeout结合，支持取消
                        yield new Promise((resolve) => {
                            const timerId = this.registerTimer(window.setTimeout(() => {
                                this.unregisterTimer(timerId);
                                this.commands.color(ConfigColor);
                                resolve();
                            }, delay));
                            this.timerId = timerId;
                        });
                    }
                }
            }
            this.isRunning = false;
        });
    }
    /**
     * 停止执行
     */
    stop() {
        this.isRunning = false;
        this.clearAllTimers();
        if (this.config.autoClear) {
            this.commands.clear();
        }
    }
    /**
     * 添加任务到队列
     */
    addTask(task) {
        const parsedTask = typeof task === "string"
            ? this.parseStringTask(task)
            : task;
        this.taskQueue.push(parsedTask);
        // 如果当前没有运行，且只有一个任务，则立即执行
        if (!this.isRunning && this.taskQueue.length === 1) {
            this.start();
        }
    }
    /**
     * 批量添加任务
     */
    addTasks(tasks) {
        tasks.forEach((task) => this.addTask(task));
    }
    /**
     * 立即执行单个任务（不加入队列）
     */
    exec(task) {
        return __awaiter(this, void 0, void 0, function* () {
            const parsedTask = typeof task === "string"
                ? this.parseStringTask(task)
                : task;
            yield this.runTask(parsedTask);
        });
    }
    /**
     * 清空任务队列
     */
    clearQueue() {
        this.taskQueue = [];
        this.stop();
    }
    /**
     * 获取当前队列状态
     */
    getStatus() {
        return {
            isRunning: this.isRunning,
            queueLength: this.taskQueue.length,
            activeTimers: this.activeTimers.size,
            currentConfig: Object.assign({}, this.config),
        };
    }
    /**
     * 便捷方法：创建预设任务
     */
    createTask(type, args, options) {
        return {
            type,
            args,
            delay: options === null || options === void 0 ? void 0 : options.delay,
            fast: options === null || options === void 0 ? void 0 : options.fast,
            color: options === null || options === void 0 ? void 0 : options.color,
        };
    }
    /**
     * 便捷方法：快速创建字母任务
     */
    letter(text, options) {
        return {
            type: "letter",
            args: [text],
            delay: options === null || options === void 0 ? void 0 : options.delay,
            fast: options === null || options === void 0 ? void 0 : options.fast,
            color: options === null || options === void 0 ? void 0 : options.color,
        };
    }
    /**
     * 便捷方法：快速创建圆形任务
     */
    circle(diameter, options) {
        return {
            type: "circle",
            args: [diameter],
            delay: options === null || options === void 0 ? void 0 : options.delay,
            fast: options === null || options === void 0 ? void 0 : options.fast,
            color: options === null || options === void 0 ? void 0 : options.color,
        };
    }
    /**
     * 便捷方法：快速创建矩形任务
     */
    rectangle(width, height, options) {
        return {
            type: "rectangle",
            args: [width, height],
            delay: options === null || options === void 0 ? void 0 : options.delay,
            fast: options === null || options === void 0 ? void 0 : options.fast,
            color: options === null || options === void 0 ? void 0 : options.color,
        };
    }
    /**
     * 便捷方法：快速创建倒计时任务
     */
    countdown(from = 5, options) {
        return {
            type: "countdown",
            args: [from, (options === null || options === void 0 ? void 0 : options.interval) || 1000],
            delay: options === null || options === void 0 ? void 0 : options.delay,
            fast: options === null || options === void 0 ? void 0 : options.fast,
            color: options === null || options === void 0 ? void 0 : options.color,
        };
    }
}

exports.default = ParticleBubbles;
//# sourceMappingURL=index.cjs.js.map
