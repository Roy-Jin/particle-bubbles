<div align="center">

# Particle Bubbles 🎨

[![npm version](https://img.shields.io/npm/v/particle-bubbles)](https://www.npmjs.com/package/particle-bubbles)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue)](https://www.typescriptlang.org/)
[![license](https://img.shields.io/npm/l/particle-bubbles)](https://github.com/Roy-Jin/particle-bubbles/blob/main/LICENSE)
[![bundle size](https://img.shields.io/bundlephobia/min/particle-bubbles)](https://bundlephobia.com/package/particle-bubbles)

An elegant particle animation library that creates smooth particle effects on Canvas for text, shapes, and images. Easily implement visually appealing animation sequences.

[English](README.md) | [中文](README_zh.md)

</div>

## ✨ Features

- **🎨 Multi-content Support**: Text, images, circles, rectangles, countdowns
- **⚡ Smooth Particle Animation**: Intelligent particle movement and transitions
- **📋 Task Queue System**: Chain calls and delay control
- **🎛️ Highly Configurable**: Color, speed, font, and other parameters
- **🛡️ TypeScript Support**: Complete type definitions
- **🌐 Cross-browser Compatibility**: Supports all modern browsers

## 📦 Installation

### NPM

```bash
npm install particle-bubbles
```

### CDN Direct Usage

```html
<!-- unpkg -->
<script src="https://unpkg.com/particle-bubbles/dist/index.global.js"></script>

<!-- jsDelivr -->
<script
    src="https://cdn.jsdelivr.net/npm/particle-bubbles/dist/index.global.js"
></script>
```

## 🚀 Quick Start

### HTML Structure

```html
<canvas id="particleCanvas"></canvas>
```

### JavaScript Usage

#### ES6 Modules

```javascript
import ParticleBubbles from "particle-bubbles";

const canvas = document.getElementById("particleCanvas");
const particle = new ParticleBubbles(canvas, {
    color: "#fff",
    defaultDelay: 2000,
});

// Add animation sequence
particle.addTasks([
    "Hello",
    "Particle",
    "Bubbles",
    "#color #e74c3c",
    "#countdown 3",
    "End!",
]);

// Start animation
particle.start();
```

#### CDN Global Variable

```javascript
const canvas = document.getElementById("particleCanvas");
const particle = new ParticleBubbles(canvas);

// Concise string format
particle.addTask("Hello World");
particle.addTask("#color #9b59b6");
particle.addTask("#circle 20");
```

## ⚙️ Configuration Options

| Parameter       | Type      | Default       | Description                          |
| --------------- | --------- | ------------- | ------------------------------------ |
| `color`         | `string`  | `"#fff"`      | Default particle color               |
| `autoClear`     | `boolean` | `true`        | Automatically clear idle particles before each task |
| `defaultDelay`  | `number`  | `2000`        | Default delay between tasks (milliseconds) |
| `fonts`         | `string`  | `"sans-serif"`| Font configuration                   |

## 📋 Task Types

### 1️⃣ Text Display

```javascript
// String format (concise)
particle.addTask("Hello World");

// Object format (full configuration)
particle.addTask({
    type: "letter",
    args: ["Hello"],
    delay: 2000,
    fast: false,
    color: "#ff4757",
});

// Shortcut method
particle.addTask(particle.letter("Hello", { color: "#ff4757" }));

// Support for "#" commands
particle.addTask("#letter Hello");
```

### 2️⃣ Shape Display

```javascript
// Circle
particle.addTask("#circle 20"); // 20px diameter

// Rectangle
particle.addTask("#rectangle 30 20"); // 30px width, 20px height
```

### 3️⃣ Image Display

```javascript
particle.addTask("#image ./photo.png");

particle.addTask(particle.createTask("image", ["./photo.png"]));
```

### 4️⃣ Countdown

```javascript
particle.addTask("#countdown 5"); // Countdown from 5

particle.addTask(particle.countdown(5, {
    interval: 1000, // 1000ms interval between numbers
}));
```

### 5️⃣ Color Switching

```javascript
particle.addTask("#color #ff6b81");

particle.addTask({
    type: "color",
    args: ["#3742fa"],
});
```

### 6️⃣ Clear Particles

```javascript
particle.addTask("#clear");
```

## 🔧 API Reference

### ParticleBubbles Class

#### Constructor

```typescript
new ParticleBubbles(canvas: HTMLCanvasElement, config?: ParticleConfig)
```

#### Core Methods

| Method            | Parameters                      | Return Type     | Description                     |
| ----------------- | ------------------------------- | --------------- | ------------------------------- |
| `start(tasks?)`   | `(ParticleTask \| string)[]`    | `Promise<void>` | Start executing task queue      |
| `stop()`          | -                               | `void`          | Stop all animations             |
| `addTask(task)`   | `ParticleTask \| string`        | `this`          | Add a single task               |
| `addTasks(tasks)` | `(ParticleTask \| string)[]`    | `this`          | Add multiple tasks              |
| `exec(task)`      | `ParticleTask \| string`        | `Promise<void>` | Execute a single task immediately |
| `clearQueue()`    | -                               | `void`          | Clear the task queue            |
| `getStatus()`     | -                               | `object`        | Get current status              |

#### Status Object

```typescript
{
    isRunning: boolean; // Whether animation is running
    queueLength: number; // Queue length
    activeTimers: number; // Number of active timers
    currentConfig: ParticleConfig; // Current configuration
}
```

### Task Object Interface

```typescript
interface ParticleTask {
    type:
        | "letter"
        | "circle"
        | "rectangle"
        | "image"
        | "clear"
        | "color"
        | "countdown";
    args?: any[]; // Task arguments
    delay?: number; // Delay time (milliseconds)
    fast?: boolean; // Fast mode (faster animation)
    color?: string; // Temporary color (overrides default)
}
```

## 🎨 Advanced Usage

### Complex Animation Sequences

```javascript
// Create a complete storyline
const storyAnimation = [
    // Part 1: Welcome
    particle.letter("Welcome", { color: "#3498db", delay: 2000 }),

    // Part 2: Countdown start
    "#color #e74c3c",
    particle.countdown(3),

    // Part 3: Display shapes
    "#color #2ecc71",
    particle.circle(50, { delay: 1500 }),
    particle.rectangle(70, 30, { delay: 1500 }),

    // Part 4: Display image
    "#image ./photo.png",

    // Ending
    particle.letter("The End", { color: "#9b59b6", delay: 3000 }),
];

particle.addTasks(storyAnimation);
particle.start();
```

### Dynamic Control

```javascript
// Real-time animation control
const particle = new ParticleBubbles(canvas, {
    autoClear: false, // Manual control of idle particle clearing
    defaultDelay: 500, // Fast switching
});

// Start animation
particle.start([
    "Frame 1",
    "Frame 2",
    "Frame 3",
]);

// Stop after 5 seconds
setTimeout(() => {
    particle.stop();
    console.log(particle.getStatus());
}, 5000);

// Resume after 10 seconds
setTimeout(() => {
    particle.addTasks(["Resumed", "Animation"]).start();
}, 10000);
```

### Event-Driven Animation

```javascript
// Trigger animations based on user interaction
document.getElementById("showText").addEventListener("click", () => {
    particle.exec("Click Me!");
});

document.getElementById("showCircle").addEventListener("click", () => {
    particle.exec(particle.circle(30, { color: "#f1c40f" }));
});

document.getElementById("showImage").addEventListener("click", () => {
    particle.exec({
        type: "image",
        args: ["./photo.png"],
        delay: 2000,
    });
});
```

## 🌐 Browser Compatibility

Supports all *modern* browsers

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 11+
- ✅ Edge 79+
- ❌ No IE support

## 📄 License

MIT License - See the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🐛 Issue Reporting

Found a bug or have a feature suggestion? Please submit to [GitHub Issues](https://github.com/Roy-Jin/particle-bubbles/issues).

**When reporting issues, please provide:**

- Steps to reproduce
- Expected behavior
- Actual behavior
- Browser and environment information
- Relevant code snippets

## 📞 Contact & Support

- **Author**: Roy-Jin
- **GitHub**: [@Roy-Jin](https://github.com/Roy-Jin)
- **Repository**: [https://github.com/Roy-Jin/particle-bubbles](https://github.com/Roy-Jin/particle-bubbles)
- **Live Demo**: [https://particle-bubbles.pages.dev](https://particle-bubbles.pages.dev)

---

**Bring particles to life for your creativity! Create stunning visual experiences with Particle Bubbles.** ✨