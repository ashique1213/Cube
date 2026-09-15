import * as THREE from 'three';
import { Face, MoveNotation, ParsedMove } from '../types/cube';

export function parseMove(notation: MoveNotation): ParsedMove {
  const face = notation[0] as Face;
  const isPrime = notation.includes("'");
  const isDouble = notation.includes('2');
  const clockwise = !isPrime;

  let axis: 'x' | 'y' | 'z';
  let layerValue: number;
  let baseAngle: number; // angle for 90deg clockwise

  switch (face) {
    case 'R':
      axis = 'x';
      layerValue = 1;
      baseAngle = -Math.PI / 2;
      break;
    case 'L':
      axis = 'x';
      layerValue = -1;
      baseAngle = Math.PI / 2;
      break;
    case 'U':
      axis = 'y';
      layerValue = 1;
      baseAngle = -Math.PI / 2;
      break;
    case 'D':
      axis = 'y';
      layerValue = -1;
      baseAngle = Math.PI / 2;
      break;
    case 'F':
      axis = 'z';
      layerValue = 1;
      baseAngle = -Math.PI / 2;
      break;
    case 'B':
      axis = 'z';
      layerValue = -1;
      baseAngle = Math.PI / 2;
      break;
  }

  let angle: number;
  if (isDouble) {
    angle = baseAngle * 2;
  } else if (!clockwise) {
    angle = -baseAngle;
  } else {
    angle = baseAngle;
  }

  return {
    face,
    notation,
    clockwise,
    double: isDouble,
    angle,
    axis,
    layerValue,
  };
}

export function getInverseMove(notation: MoveNotation): MoveNotation {
  if (notation.includes('2')) return notation;
  if (notation.includes("'")) return notation.replace("'", '') as MoveNotation;
  return `${notation}'` as MoveNotation;
}

// Check if a cubie's world position belongs to a specific face layer
export function isCubieInLayer(pos: THREE.Vector3, axis: 'x' | 'y' | 'z', layerValue: number): boolean {
  const EPSILON = 0.35;
  return Math.abs(pos[axis] - layerValue) < EPSILON;
}

// Snap a position vector to exact integer coordinates (-1, 0, 1)
export function snapVector(v: THREE.Vector3): void {
  v.x = Math.round(v.x);
  v.y = Math.round(v.y);
  v.z = Math.round(v.z);
}

// Snap rotation quaternion to exact orthogonal 90-degree orientations to completely prevent floating point drift
export function snapQuaternion(q: THREE.Quaternion): void {
  const euler = new THREE.Euler().setFromQuaternion(q, 'XYZ');
  const HALF_PI = Math.PI / 2;
  euler.x = Math.round(euler.x / HALF_PI) * HALF_PI;
  euler.y = Math.round(euler.y / HALF_PI) * HALF_PI;
  euler.z = Math.round(euler.z / HALF_PI) * HALF_PI;
  q.setFromEuler(euler);
}

// Generate the 27 cubie coordinates
export function getCubieCoordinates(): [number, number, number][] {
  const coords: [number, number, number][] = [];
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        coords.push([x, y, z]);
      }
    }
  }
  return coords;
}
