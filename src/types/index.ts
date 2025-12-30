export interface PointOptions {
  x: number;
  y: number;
  z?: number;
  a?: number;
  h?: number;
}

export interface ColorOptions {
  r: number;
  g: number;
  b: number;
  a: number;
}
export interface ParticleTask {
  type:
    | "letter"
    | "circle"
    | "rectangle"
    | "image"
    | "clear"
    | "color"
    | "countdown";
  args?: any[];
  delay?: number;
  fast?: boolean;
  color?: string;
}

export interface ParticleConfig {
  color?: string;
  autoClear?: boolean;
  defaultDelay?: number;
  fonts?: string;
}
