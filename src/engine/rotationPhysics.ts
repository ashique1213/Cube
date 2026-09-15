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

// 24 unique orthogonal rotational orientations of a cube
const CUBE_ROTATIONS: THREE.Quaternion[] = (() => {
  const list: THREE.Quaternion[] = [];
  const HALF_PI = Math.PI / 2;
  for (let rx = 0; rx < 4; rx++) {
    for (let ry = 0; ry < 4; ry++) {
      for (let rz = 0; rz < 4; rz++) {
        const q = new THREE.Quaternion().setFromEuler(
          new THREE.Euler(rx * HALF_PI, ry * HALF_PI, rz * HALF_PI, 'XYZ')
        );
        if (!list.some((existing) => Math.abs(existing.dot(q)) > 0.999)) {
          list.push(q);
        }
      }
    }
  }
  return list;
})();

function getValidEdgeRotations(
  orig: [number, number, number],
  target: [number, number, number]
): THREE.Quaternion[] {
  const origNormals: THREE.Vector3[] = [];
  if (orig[0] !== 0) origNormals.push(new THREE.Vector3(orig[0], 0, 0));
  if (orig[1] !== 0) origNormals.push(new THREE.Vector3(0, orig[1], 0));
  if (orig[2] !== 0) origNormals.push(new THREE.Vector3(0, 0, orig[2]));

  const targetNormals: THREE.Vector3[] = [];
  if (target[0] !== 0) targetNormals.push(new THREE.Vector3(target[0], 0, 0));
  if (target[1] !== 0) targetNormals.push(new THREE.Vector3(0, target[1], 0));
  if (target[2] !== 0) targetNormals.push(new THREE.Vector3(0, 0, target[2]));

  return CUBE_ROTATIONS.filter((q) => {
    return origNormals.every((o) => {
      const transformed = o.clone().applyQuaternion(q);
      return targetNormals.some((t) => t.distanceTo(transformed) < 0.1);
    });
  });
}

function getValidCornerRotations(
  orig: [number, number, number],
  target: [number, number, number]
): THREE.Quaternion[] {
  const origNormals = [
    new THREE.Vector3(orig[0], 0, 0),
    new THREE.Vector3(0, orig[1], 0),
    new THREE.Vector3(0, 0, orig[2]),
  ];
  const targetNormals = [
    new THREE.Vector3(target[0], 0, 0),
    new THREE.Vector3(0, target[1], 0),
    new THREE.Vector3(0, 0, target[2]),
  ];

  return CUBE_ROTATIONS.filter((q) => {
    return origNormals.every((o) => {
      const transformed = o.clone().applyQuaternion(q);
      return targetNormals.some((t) => t.distanceTo(transformed) < 0.1);
    });
  });
}

export interface CubieTransformSetup {
  position: [number, number, number];
  quaternion: THREE.Quaternion;
}

// Generate the Daisy state on the top face (+Y) with all other sides fully shuffled
export function createDaisyShuffledSetup(randomize = false): Map<string, CubieTransformSetup> {
  const setup = new Map<string, CubieTransformSetup>();

  // 1. Centers & Core (all stay at their center positions with identity rotation)
  const centers: [number, number, number][] = [
    [0, 0, 0], // core
    [0, 1, 0], // yellow top center
    [0, -1, 0], // white bottom center
    [1, 0, 0], // red right center
    [-1, 0, 0], // orange left center
    [0, 0, 1], // green front center
    [0, 0, -1], // blue back center
  ];
  centers.forEach(([x, y, z]) => {
    setup.set(`${x}_${y}_${z}`, {
      position: [x, y, z],
      quaternion: new THREE.Quaternion(),
    });
  });

  // 2. The 4 White Edges (placed on top face +Y to form the Daisy)
  // White-Green edge (orig 0_-1_1) -> slot [0, 1, 1], White on top, Green on front
  const qFront = getValidEdgeRotations([0, -1, 1], [0, 1, 1]).find((q) => {
    const whiteNormal = new THREE.Vector3(0, -1, 0).applyQuaternion(q);
    return Math.abs(whiteNormal.y - 1) < 0.1;
  }) || new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI);
  setup.set('0_-1_1', { position: [0, 1, 1], quaternion: qFront });

  // White-Red edge (orig 1_-1_0) -> slot [1, 1, 0], White on top, Red on right
  const qRight = getValidEdgeRotations([1, -1, 0], [1, 1, 0]).find((q) => {
    const whiteNormal = new THREE.Vector3(0, -1, 0).applyQuaternion(q);
    return Math.abs(whiteNormal.y - 1) < 0.1;
  }) || new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI);
  setup.set('1_-1_0', { position: [1, 1, 0], quaternion: qRight });

  // White-Blue edge (orig 0_-1_-1) -> slot [0, 1, -1], White on top, Blue on back
  const qBack = getValidEdgeRotations([0, -1, -1], [0, 1, -1]).find((q) => {
    const whiteNormal = new THREE.Vector3(0, -1, 0).applyQuaternion(q);
    return Math.abs(whiteNormal.y - 1) < 0.1;
  }) || new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI);
  setup.set('0_-1_-1', { position: [0, 1, -1], quaternion: qBack });

  // White-Orange edge (orig -1_-1_0) -> slot [-1, 1, 0], White on top, Orange on left
  const qLeft = getValidEdgeRotations([-1, -1, 0], [-1, 1, 0]).find((q) => {
    const whiteNormal = new THREE.Vector3(0, -1, 0).applyQuaternion(q);
    return Math.abs(whiteNormal.y - 1) < 0.1;
  }) || new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI);
  setup.set('-1_-1_0', { position: [-1, 1, 0], quaternion: qLeft });

  // 3. The 8 Corner Slots (4 top corners + 4 bottom corners)
  const cornerSlots: [number, number, number][] = [
    [-1, 1, -1],
    [1, 1, -1],
    [-1, 1, 1],
    [1, 1, 1],
    [-1, -1, -1],
    [1, -1, -1],
    [-1, -1, 1],
    [1, -1, 1],
  ];

  const cornerCubies: [number, number, number][] = [
    [1, 1, 1],
    [-1, 1, 1],
    [1, 1, -1],
    [-1, 1, -1],
    [1, -1, 1],
    [-1, -1, 1],
    [1, -1, -1],
    [-1, -1, -1],
  ];

  // Shuffle or deterministic permutation
  let permCorners = [4, 7, 1, 5, 0, 6, 2, 3];
  if (randomize) {
    permCorners = [...Array(8).keys()].sort(() => Math.random() - 0.5);
  }

  cornerSlots.forEach((targetSlot, i) => {
    const cubieCoord = cornerCubies[permCorners[i]];
    const validRotations = getValidCornerRotations(cubieCoord, targetSlot);
    const twistIndex = randomize
      ? Math.floor(Math.random() * validRotations.length)
      : (i * 2) % validRotations.length;
    const q = validRotations[twistIndex] || new THREE.Quaternion();

    setup.set(`${cubieCoord[0]}_${cubieCoord[1]}_${cubieCoord[2]}`, {
      position: targetSlot,
      quaternion: q,
    });
  });

  // 4. The 8 Remaining Edge Slots (4 middle layer edges + 4 bottom edges)
  const remainingEdgeSlots: [number, number, number][] = [
    [-1, 0, -1],
    [1, 0, -1],
    [-1, 0, 1],
    [1, 0, 1],
    [0, -1, 1],
    [1, -1, 0],
    [0, -1, -1],
    [-1, -1, 0],
  ];

  const remainingEdgeCubies: [number, number, number][] = [
    // 4 middle edges
    [-1, 0, -1],
    [1, 0, -1],
    [-1, 0, 1],
    [1, 0, 1],
    // 4 top edges (which originally had yellow)
    [0, 1, 1],
    [1, 1, 0],
    [0, 1, -1],
    [-1, 1, 0],
  ];

  let permEdges = [5, 2, 7, 0, 4, 1, 6, 3];
  if (randomize) {
    permEdges = [...Array(8).keys()].sort(() => Math.random() - 0.5);
  }

  remainingEdgeSlots.forEach((targetSlot, i) => {
    const cubieCoord = remainingEdgeCubies[permEdges[i]];
    const validRotations = getValidEdgeRotations(cubieCoord, targetSlot);
    const orientIndex = randomize
      ? Math.floor(Math.random() * validRotations.length)
      : (i + 1) % validRotations.length;
    const q = validRotations[orientIndex] || new THREE.Quaternion();

    setup.set(`${cubieCoord[0]}_${cubieCoord[1]}_${cubieCoord[2]}`, {
      position: targetSlot,
      quaternion: q,
    });
  });

  return setup;
}
