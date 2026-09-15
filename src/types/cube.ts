export type Face = 'U' | 'D' | 'R' | 'L' | 'F' | 'B';

export type MoveNotation =
  | 'U' | "U'" | 'U2'
  | 'D' | "D'" | 'D2'
  | 'R' | "R'" | 'R2'
  | 'L' | "L'" | 'L2'
  | 'F' | "F'" | 'F2'
  | 'B' | "B'" | 'B2';

export interface ParsedMove {
  face: Face;
  notation: MoveNotation;
  clockwise: boolean;
  double: boolean;
  angle: number; // in radians
  axis: 'x' | 'y' | 'z';
  layerValue: number; // 1 for R, U, F; -1 for L, D, B
}

export type StickerColor = 'white' | 'yellow' | 'red' | 'orange' | 'blue' | 'green' | 'core';

export interface CubieFaceInfo {
  direction: [number, number, number]; // normal vector
  color: StickerColor;
  faceName: Face;
}

export interface CubieConfig {
  id: string;
  initialPos: [number, number, number]; // [x, y, z] in {-1, 0, 1}
  faces: Partial<Record<Face, StickerColor>>;
}

export interface SolvingStep {
  id: number;
  title: string;
  subtitle?: string;
  instruction: string;
  subInstructions?: string[];
  algorithm?: string;
  moves: MoveNotation[];
  tip?: string;
  warning?: string;
  highlightFaces?: Face[];
  stageDiagram?: string[];
  setupScramble?: MoveNotation[]; // moves to apply to solve state to set up this step
}

export type CameraPreset = 'front' | 'top' | 'right' | 'isometric' | 'back' | 'bottom';
