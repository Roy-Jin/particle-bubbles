import { Drawing } from "./core/Drawing";
import { ShapeBuilded, ShapeBuilder } from "./core/ShapeBuilder";
import { Shape } from "./core/Shape";
import { Color } from "./core/Color";
import { ParticleConfig, ParticleTask } from "./types";

export default class ParticleBubbles {
  private shapeBuilder: ShapeBuilder;
  private shape: Shape;
  private timerId: number | null = null;
  private activeTimers: Set<number> = new Set();

  config: ParticleConfig;
  taskQueue: ParticleTask[] = [];
  isRunning: boolean = false;

  constructor(
    canvas: HTMLCanvasElement,
    config: ParticleConfig = {},
  ) {
    this.config = {
      color: "#fff",
      autoClear: true,
      defaultDelay: 2000,
      ...config,
    };

    const drawing = new Drawing(canvas);
    this.shapeBuilder = new ShapeBuilder(drawing, config.fonts);
    this.shape = new Shape(drawing, this.config.color!);

    drawing.loop(() => {
      this.shape.render();
    });
  }

  /**
   * 清除所有活跃的定时器
   */
  private clearAllTimers(): void {
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
  private registerTimer(timerId: number): number {
    this.activeTimers.add(timerId);
    return timerId;
  }

  /**
   * 取消注册的定时器
   */
  private unregisterTimer(timerId: number): void {
    this.activeTimers.delete(timerId);
  }

  // 核心命令方法
  private commands = {
    letter: async (text: string, fast: boolean = false) => {
      this.shape.switchShape(this.shapeBuilder.letter(text), fast);
      // 字母显示不需要额外延迟，延迟由任务间的 delay 控制
    },

    image: async (url: string, fast: boolean = false) => {
      return new Promise<void>((resolve) => {
        this.shapeBuilder.imageFile(url, (obj: ShapeBuilded) => {
          this.shape.switchShape(obj, fast);
          resolve();
        });
      });
    },

    circle: async (diameter: number, fast: boolean = false) => {
      this.shape.switchShape(this.shapeBuilder.circle(diameter), fast);
    },

    rectangle: async (width: number, height: number, fast: boolean = false) => {
      this.shape.switchShape(this.shapeBuilder.rectangle(width, height), fast);
    },

    clear: () => {
      this.shape.dots = this.shape.dots.filter((dot) => dot.s);
    },

    color: (color: string) => {
      this.config.color = color;
      const newColor = new Color(color);
      this.shape.color = newColor;
      this.shape.dots.forEach((dot) => {
        dot.color = newColor;
      });
    },

    countdown: async (
      from: number,
      interval: number = 1000,
      fast: boolean = false,
    ) => {
      return new Promise<void>((resolve) => {
        let current = from;

        const showNextNumber = () => {
          if (current < 0) {
            resolve();
            return;
          }

          this.shape.switchShape(
            this.shapeBuilder.letter(current.toString()),
            fast,
          );

          if (current === 0) {
            // 显示0后结束
            resolve();
          } else {
            current--;
            this.registerTimer(
              window.setTimeout(showNextNumber, interval),
            );
          }
        };

        showNextNumber();
      });
    },
  };

  /**
   * 执行单个任务
   */
  private async runTask(task: ParticleTask): Promise<void> {
    if (this.config.autoClear && task.type !== "clear") {
      this.commands.clear();
    }

    switch (task.type) {
      case "letter": {
        const text = task.args?.[0] || "";
        await this.commands.letter(text, task.fast || false);
        break;
      }

      case "circle": {
        const diameter = task.args?.[0] || 20;
        await this.commands.circle(diameter, task.fast || false);
        break;
      }

      case "rectangle": {
        const width = task.args?.[0] || 20;
        const height = task.args?.[1] || 20;
        await this.commands.rectangle(width, height, task.fast || false);
        break;
      }

      case "image": {
        const url = task.args?.[0];
        if (url) {
          await this.commands.image(url, task.fast || false);
        } else {
          await this.commands.letter("?", task.fast || false);
        }
        break;
      }

      case "clear": {
        this.commands.clear();
        break;
      }

      case "color": {
        const color = task.args?.[0] || this.config.color || "#fff";
        this.commands.color(color);
        break;
      }

      case "countdown": {
        const from = task.args?.[0] || 5;
        const interval = task.args?.[1] || 1000; // 第二个参数作为间隔时间
        await this.commands.countdown(from, interval, task.fast || false);
        break;
      }
    }
  }

  private parseStringTask(taskString: string): ParticleTask {
    if (taskString.startsWith("#")) {
      const parts = taskString.slice(1).trim().split(/\s+/);
      const type = parts[0] as ParticleTask["type"];

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
    } else {
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
  async start(tasks?: (ParticleTask | string)[]): Promise<void> {
    this.stop();

    if (tasks && tasks.length > 0) {
      this.taskQueue = tasks.map((task) =>
        typeof task === "string" ? this.parseStringTask(task) : task
      );
    }

    if (this.taskQueue.length === 0) return;

    this.isRunning = true;
    await this.processNextTask();
  }

  /**
   * 处理下一个任务
   */
  private async processNextTask(): Promise<void> {
    while (this.taskQueue.length > 0 && this.isRunning) {
      const task = this.taskQueue.shift()!;

      // 执行当前任务
      await this.runTask(task);
      const ConfigColor: string = this.config.color!;
      if (task.color) this.commands.color(task.color);

      // 任务执行完成后，等待delay时间再执行下一个任务
      if (this.taskQueue.length > 0 && this.isRunning) {
        const delay: number = task.delay != null
          ? task.delay
          : this.config.defaultDelay ?? 2000;

        if (delay > 0) {
          // 使用Promise和setTimeout结合，支持取消
          await new Promise<void>((resolve) => {
            const timerId = this.registerTimer(
              window.setTimeout(() => {
                this.unregisterTimer(timerId);
                this.commands.color(ConfigColor);
                resolve();
              }, delay),
            );

            this.timerId = timerId;
          });
        }
      }
    }

    this.isRunning = false;
  }

  /**
   * 停止执行
   */
  stop(): void {
    this.isRunning = false;
    this.clearAllTimers();

    if (this.config.autoClear) {
      this.commands.clear();
    }
  }

  /**
   * 添加任务到队列
   */
  addTask(task: ParticleTask | string): ParticleBubbles {
    const parsedTask = typeof task === "string"
      ? this.parseStringTask(task)
      : task;

    this.taskQueue.push(parsedTask);
    return this;
  }

  /**
   * 批量添加任务
   */
  addTasks(tasks: (ParticleTask | string)[]): ParticleBubbles {
    tasks.forEach((task) => this.addTask(task));
    return this;
  }

  /**
   * 立即执行单个任务（不加入队列）
   */
  async exec(task: ParticleTask | string): Promise<void> {
    const parsedTask = typeof task === "string"
      ? this.parseStringTask(task)
      : task;

    await this.runTask(parsedTask);
  }

  /**
   * 清空任务队列
   */
  clearQueue(): void {
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
      currentConfig: { ...this.config },
    };
  }

  /**
   * 便捷方法：创建预设任务
   */
  createTask(
    type: ParticleTask["type"],
    args?: any[],
    options?: { delay?: number; fast?: boolean; color?: string },
  ): ParticleTask {
    return {
      type,
      args,
      delay: options?.delay,
      fast: options?.fast,
      color: options?.color,
    };
  }

  /**
   * 便捷方法：快速创建字母任务
   */
  letter(
    text: string,
    options?: { delay?: number; fast?: boolean; color?: string },
  ): ParticleTask {
    return {
      type: "letter",
      args: [text],
      delay: options?.delay,
      fast: options?.fast,
      color: options?.color,
    };
  }

  /**
   * 便捷方法：快速创建圆形任务
   */
  circle(
    diameter: number,
    options?: { delay?: number; fast?: boolean; color?: string },
  ): ParticleTask {
    return {
      type: "circle",
      args: [diameter],
      delay: options?.delay,
      fast: options?.fast,
      color: options?.color,
    };
  }

  /**
   * 便捷方法：快速创建矩形任务
   */
  rectangle(
    width: number,
    height: number,
    options?: { delay?: number; fast?: boolean; color?: string },
  ): ParticleTask {
    return {
      type: "rectangle",
      args: [width, height],
      delay: options?.delay,
      fast: options?.fast,
      color: options?.color,
    };
  }

  /**
   * 便捷方法：快速创建倒计时任务
   */
  countdown(from: number = 5, options?: {
    interval?: number;
    delay?: number;
    fast?: boolean;
    color?: string;
  }): ParticleTask {
    return {
      type: "countdown",
      args: [from, options?.interval || 1000],
      delay: options?.delay,
      fast: options?.fast,
      color: options?.color,
    };
  }
}

// 导出类型
export type { ParticleConfig, ParticleTask };
