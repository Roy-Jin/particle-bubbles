<div align="center">

# Particle Bubbles 🎨

[![npm version](https://img.shields.io/npm/v/particle-bubbles)](https://www.npmjs.com/package/particle-bubbles)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue)](https://www.typescriptlang.org/)
[![license](https://img.shields.io/npm/l/particle-bubbles)](https://github.com/Roy-Jin/particle-bubbles/blob/main/LICENSE)
[![bundle size](https://img.shields.io/bundlephobia/min/particle-bubbles)](https://bundlephobia.com/package/particle-bubbles)

一个优雅的粒子动画库，可在 Canvas 上为文本、形状和图像创建流畅的粒子效果。轻松实现视觉吸引力的动画序列。

[English](README.md) | [中文](README_zh.md)

</div>

## ✨ 特性

- **🎨 多内容支持**: 文字、图像、圆形、矩形、倒计时
- **⚡ 平滑粒子动画**: 粒子间智能移动和过渡
- **📋 任务队列系统**: 链式调用和延迟控制
- **🎛️ 高度可配置**: 颜色、速度、字体等参数
- **🛡️ TypeScript 支持**: 完整的类型定义
- **🌐 跨浏览器兼容**: 支持所有现代浏览器

## 📦 安装

### NPM

```bash
npm install particle-bubbles
```

### CDN 直接使用

```html
<!-- unpkg -->
<script src="https://unpkg.com/particle-bubbles/dist/index.global.js"></script>

<!-- jsDelivr -->
<script
    src="https://cdn.jsdelivr.net/npm/particle-bubbles/dist/index.global.js"
></script>
```

## 🚀 快速开始

### HTML 结构

```html
<canvas id="particleCanvas"></canvas>
```

### JavaScript 使用

#### ES6 模块

```javascript
import ParticleBubbles from "particle-bubbles";

const canvas = document.getElementById("particleCanvas");
const particle = new ParticleBubbles(canvas, {
    color: "#fff",
    defaultDelay: 2000,
});

// 添加动画序列
particle.addTasks([
    "Hello",
    "Particle",
    "Bubbles",
    "#color #e74c3c",
    "#countdown 3",
    "End!",
]);

// 开始动画
particle.start();
```

#### CDN 全局变量

```javascript
const canvas = document.getElementById("particleCanvas");
const particle = new ParticleBubbles(canvas);

// 简洁的字符串格式
particle.addTask("Hello World");
particle.addTask("#color #9b59b6");
particle.addTask("#circle 20");
```

## ⚙️ 配置选项

| 参数           | 类型      | 默认值         | 说明                         |
| -------------- | --------- | -------------- | ---------------------------- |
| `color`        | `string`  | `"#fff"`       | 默认粒子颜色                 |
| `autoClear`    | `boolean` | `true`         | 每次任务前自动清除闲置的粒子 |
| `defaultDelay` | `number`  | `2000`         | 任务间默认延迟（毫秒）       |
| `fonts`        | `string`  | `"sans-serif"` | 字体配置                     |

## 📋 任务类型

### 1️⃣ 文字显示

```javascript
// 字符串格式（简洁）
particle.addTask("Hello World");

// 对象格式（完整配置）
particle.addTask({
    type: "letter",
    args: ["Hello"],
    delay: 2000,
    fast: false,
    color: "#ff4757",
});

// 快捷方法
particle.addTask(particle.letter("Hello", { color: "#ff4757" }));

// 支持使用"#"指令
particle.addTask("#letter Hello");
```

### 2️⃣ 图形显示

```javascript
// 圆形
particle.addTask("#circle 20"); // 直径20像素

// 矩形
particle.addTask("#rectangle 30 20"); // 宽30，高20
```

### 3️⃣ 图像显示

```javascript
particle.addTask("#image ./photo.png");

particle.addTask(particle.createTask("image", ["./photo.png"]));
```

### 4️⃣ 倒计时

```javascript
particle.addTask("#countdown 5"); // 从5开始

particle.addTask(particle.countdown(5, {
    interval: 1000, // 数字间间隔1000ms
}));
```

### 5️⃣ 颜色切换

```javascript
particle.addTask("#color #ff6b81");

particle.addTask({
    type: "color",
    args: ["#3742fa"],
});
```

### 6️⃣ 清除粒子

```javascript
particle.addTask("#clear");
```

## 🔧 API 参考

### ParticleBubbles 类

#### 构造函数

```typescript
new ParticleBubbles(canvas: HTMLCanvasElement, config?: ParticleConfig)
```

#### 核心方法

| 方法              | 参数                         | 返回值          | 说明             |
| ----------------- | ---------------------------- | --------------- | ---------------- |
| `start(tasks?)`   | `(ParticleTask \| string)[]` | `Promise<void>` | 开始执行任务队列 |
| `stop()`          | -                            | `void`          | 停止所有动画     |
| `addTask(task)`   | `ParticleTask \| string`     | `this`          | 添加单个任务     |
| `addTasks(tasks)` | `(ParticleTask \| string)[]` | `this`          | 批量添加任务     |
| `exec(task)`      | `ParticleTask \| string`     | `Promise<void>` | 立即执行单个任务 |
| `clearQueue()`    | -                            | `void`          | 清空任务队列     |
| `getStatus()`     | -                            | `object`        | 获取当前状态     |

#### 状态对象

```typescript
{
    isRunning: boolean; // 是否正在运行
    queueLength: number; // 队列长度
    activeTimers: number; // 活跃定时器数量
    currentConfig: ParticleConfig; // 当前配置
}
```

### 任务对象接口

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
    args?: any[]; // 任务参数
    delay?: number; // 延迟时间（毫秒）
    fast?: boolean; // 快速模式（更快动画）
    color?: string; // 临时颜色（覆盖默认）
}
```

## 🎨 高级用法

### 复杂动画序列

```javascript
// 创建完整的故事线
const storyAnimation = [
    // 第一部分：欢迎
    particle.letter("Welcome", { color: "#3498db", delay: 2000 }),

    // 第二部分：倒计时开始
    "#color #e74c3c",
    particle.countdown(3),

    // 第三部分：展示图形
    "#color #2ecc71",
    particle.circle(50, { delay: 1500 }),
    particle.rectangle(70, 30, { delay: 1500 }),

    // 第四部分：展示图片
    "#image ./photo.png",

    // 结尾
    particle.letter("The End", { color: "#9b59b6", delay: 3000 }),
];

particle.addTasks(storyAnimation);
particle.start();
```

### 动态控制

```javascript
// 实时控制动画
const particle = new ParticleBubbles(canvas, {
    autoClear: false, // 手动控制清除闲置粒子
    defaultDelay: 500, // 快速切换
});

// 开始动画
particle.start([
    "Frame 1",
    "Frame 2",
    "Frame 3",
]);

// 5秒后停止
setTimeout(() => {
    particle.stop();
    console.log(particle.getStatus());
}, 5000);

// 10秒后继续
setTimeout(() => {
    particle.addTasks(["Resumed", "Animation"]).start();
}, 10000);
```

### 事件驱动的动画

```javascript
// 根据用户交互触发动画
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

## 🌐 浏览器兼容性

支持所有*现代*浏览器

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 11+
- ✅ Edge 79+
- ❌ 不支持 IE

## 📄 许可证

MIT License - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🤝 贡献

欢迎贡献！

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 🐛 问题反馈

发现bug或有功能建议？请提交到 [GitHub Issues](https://github.com/Roy-Jin/particle-bubbles/issues)。

**报告问题时请提供：**

- 重现步骤
- 期望行为
- 实际行为
- 浏览器和环境信息
- 相关代码片段

## 📞 联系与支持

- **作者**: Roy-Jin
- **GitHub**: [@Roy-Jin](https://github.com/Roy-Jin)
- **项目地址**: [https://github.com/Roy-Jin/particle-bubbles](https://github.com/Roy-Jin/particle-bubbles)
- **在线演示**: [https://particle-bubbles.pages.dev](https://particle-bubbles.pages.dev)

---

**让粒子为你的创意赋予生命！用 Particle Bubbles 创建令人惊叹的视觉体验。** ✨