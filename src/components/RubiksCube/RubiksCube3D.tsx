import React, { useRef, useImperativeHandle, forwardRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { CubiePiece } from './CubiePiece';
import { getCubieCoordinates, parseMove, snapVector, snapQuaternion, isCubieInLayer } from '../../engine/rotationPhysics';
import { soundEngine } from '../../engine/soundEffects';
import { Face, MoveNotation } from '../../types/cube';

export interface RubiksCubeRef {
  executeMove: (notation: MoveNotation, duration?: number) => Promise<void>;
  resetToSolved: () => void;
  resetToDaisy: () => Promise<void>;
  applyScramble: (moves: MoveNotation[]) => Promise<void>;
  isAnimating: () => boolean;
}

interface RubiksCube3DProps {
  animationSpeedMs?: number;
  highlightFaces?: Face[];
  onMoveStart?: (notation: MoveNotation) => void;
  onMoveEnd?: (notation: MoveNotation) => void;
}

export const RubiksCube3D = forwardRef<RubiksCubeRef, RubiksCube3DProps>(
  ({ animationSpeedMs = 500, highlightFaces = [], onMoveStart, onMoveEnd }, ref) => {
    const cubeGroupRef = useRef<THREE.Group>(null);
    const pivotRef = useRef<THREE.Group>(null);
    const cubieRefs = useRef<Map<string, THREE.Group>>(new Map());

    // Active animation state
    const animationState = useRef<{
      isBusy: boolean;
      axis: 'x' | 'y' | 'z';
      startAngle: number;
      targetAngle: number;
      startTime: number;
      duration: number;
      activeCubies: THREE.Group[];
      currentNotation: MoveNotation | null;
      resolvePromise: (() => void) | null;
    }>({
      isBusy: false,
      axis: 'y',
      startAngle: 0,
      targetAngle: 0,
      startTime: 0,
      duration: 500,
      activeCubies: [],
      currentNotation: null,
      resolvePromise: null,
    });

    const moveQueue = useRef<Array<{ notation: MoveNotation; duration: number; resolve: () => void }>>([]);

    // 27 coordinate definitions
    const coordinates = useMemo(() => getCubieCoordinates(), []);

    // Helper to run next queued move
    const processNextMove = () => {
      if (animationState.current.isBusy || moveQueue.current.length === 0) {
        return;
      }
      const next = moveQueue.current.shift();
      if (!next) return;

      const { notation, duration, resolve } = next;
      const parsed = parseMove(notation);
      const cubeGroup = cubeGroupRef.current;
      const pivot = pivotRef.current;

      if (!cubeGroup || !pivot) {
        resolve();
        return;
      }

      onMoveStart?.(notation);

      // Find the 9 cubies in the target layer
      const layerCubies: THREE.Group[] = [];
      cubieRefs.current.forEach((cubie) => {
        if (!cubie) return;
        const worldPos = new THREE.Vector3();
        cubie.getWorldPosition(worldPos);
        // Cube root is at (0,0,0), so world coordinate matches cube space coordinate
        if (isCubieInLayer(worldPos, parsed.axis, parsed.layerValue)) {
          layerCubies.push(cubie);
        }
      });

      // Reset pivot
      pivot.rotation.set(0, 0, 0);
      pivot.position.set(0, 0, 0);
      pivot.quaternion.identity();
      pivot.updateMatrixWorld();

      // Attach cubies to pivot
      layerCubies.forEach((cubie) => {
        pivot.attach(cubie);
      });

      // If duration is 0, execute instantly
      if (duration <= 0) {
        pivot.rotation[parsed.axis] = parsed.angle;
        pivot.updateMatrixWorld();

        layerCubies.forEach((cubie) => {
          cubeGroup.attach(cubie);
          snapVector(cubie.position);
          snapQuaternion(cubie.quaternion);
          cubie.updateMatrixWorld();
        });

        pivot.rotation.set(0, 0, 0);
        pivot.quaternion.identity();

        onMoveEnd?.(notation);
        resolve();
        processNextMove();
        return;
      }

      // Initialize smooth animation
      animationState.current = {
        isBusy: true,
        axis: parsed.axis,
        startAngle: 0,
        targetAngle: parsed.angle,
        startTime: performance.now(),
        duration,
        activeCubies: layerCubies,
        currentNotation: notation,
        resolvePromise: resolve,
      };
    };

    // Smooth cubic ease in-out curve
    const easeInOutCubic = (t: number): number => {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

    // Frame update loop
    useFrame(() => {
      const state = animationState.current;
      if (!state.isBusy) return;

      const pivot = pivotRef.current;
      const cubeGroup = cubeGroupRef.current;
      if (!pivot || !cubeGroup) return;

      const now = performance.now();
      const elapsed = now - state.startTime;
      const progress = Math.min(elapsed / state.duration, 1.0);
      const eased = easeInOutCubic(progress);

      // Rotate pivot along active axis
      pivot.rotation[state.axis] = state.startAngle + (state.targetAngle - state.startAngle) * eased;
      pivot.updateMatrixWorld();

      // When animation finishes
      if (progress >= 1.0) {
        pivot.rotation[state.axis] = state.targetAngle;
        pivot.updateMatrixWorld();

        // Reparent cubies back to cube group
        state.activeCubies.forEach((cubie) => {
          cubeGroup.attach(cubie);
          snapVector(cubie.position);
          snapQuaternion(cubie.quaternion);
          cubie.updateMatrixWorld();
        });

        // Reset pivot orientation
        pivot.rotation.set(0, 0, 0);
        pivot.quaternion.identity();
        pivot.updateMatrixWorld();

        // Play physical click sound
        soundEngine.playTurn();

        const completedNotation = state.currentNotation;
        const resolve = state.resolvePromise;

        // Reset state
        animationState.current.isBusy = false;
        animationState.current.activeCubies = [];
        animationState.current.currentNotation = null;
        animationState.current.resolvePromise = null;

        if (completedNotation) {
          onMoveEnd?.(completedNotation);
        }
        if (resolve) {
          resolve();
        }

        // Trigger next queued move
        processNextMove();
      }
    });

    // Expose methods via ref
    useImperativeHandle(ref, () => ({
      executeMove: (notation: MoveNotation, duration = animationSpeedMs) => {
        return new Promise<void>((resolve) => {
          moveQueue.current.push({ notation, duration, resolve });
          processNextMove();
        });
      },
      resetToSolved: () => {
        // Clear move queue
        moveQueue.current = [];
        animationState.current.isBusy = false;

        const cubeGroup = cubeGroupRef.current;
        const pivot = pivotRef.current;
        if (!cubeGroup || !pivot) return;

        // Make sure all cubies are attached to cubeGroup
        cubieRefs.current.forEach((cubie, id) => {
          if (!cubie) return;
          cubeGroup.attach(cubie);
          const [x, y, z] = id.split('_').map(Number);
          cubie.position.set(x, y, z);
          cubie.rotation.set(0, 0, 0);
          cubie.quaternion.identity();
          cubie.updateMatrixWorld();
        });

        pivot.rotation.set(0, 0, 0);
        pivot.quaternion.identity();
      },
      resetToDaisy: async () => {
        moveQueue.current = [];
        animationState.current.isBusy = false;

        const cubeGroup = cubeGroupRef.current;
        const pivot = pivotRef.current;
        if (!cubeGroup || !pivot) return;

        cubieRefs.current.forEach((cubie, id) => {
          if (!cubie) return;
          cubeGroup.attach(cubie);
          const [x, y, z] = id.split('_').map(Number);
          cubie.position.set(x, y, z);
          cubie.rotation.set(0, 0, 0);
          cubie.quaternion.identity();
          cubie.updateMatrixWorld();
        });

        pivot.rotation.set(0, 0, 0);
        pivot.quaternion.identity();

        // Perform F2, R2, B2, L2 with duration 0 to position the 4 white edges around the yellow center
        const daisyMoves: MoveNotation[] = ['F2', 'R2', 'B2', 'L2'];
        for (const move of daisyMoves) {
          await new Promise<void>((res) => {
            moveQueue.current.push({ notation: move, duration: 0, resolve: res });
            processNextMove();
          });
        }
      },
      applyScramble: async (moves: MoveNotation[]) => {
        moveQueue.current = [];
        for (const move of moves) {
          await new Promise<void>((res) => {
            moveQueue.current.push({ notation: move, duration: 0, resolve: res });
            processNextMove();
          });
        }
      },
      isAnimating: () => animationState.current.isBusy || moveQueue.current.length > 0,
    }));

    // Reset when component mounts to guarantee clean state
    useEffect(() => {
      const cubeGroup = cubeGroupRef.current;
      if (!cubeGroup) return;
      cubieRefs.current.forEach((cubie, id) => {
        if (!cubie) return;
        const [x, y, z] = id.split('_').map(Number);
        cubie.position.set(x, y, z);
        cubie.rotation.set(0, 0, 0);
        cubie.quaternion.identity();
      });
    }, []);

    return (
      <group>
        {/* Main Static/Default Cube Group */}
        <group ref={cubeGroupRef} position={[0, 0, 0]}>
          {coordinates.map(([x, y, z]) => {
            const key = `${x}_${y}_${z}`;
            return (
              <CubiePiece
                key={key}
                initialPosition={[x, y, z]}
                isHighlighted={false}
                ref={(el) => {
                  if (el) cubieRefs.current.set(key, el);
                  else cubieRefs.current.delete(key);
                }}
              />
            );
          })}
        </group>

        {/* Dynamic Rotation Pivot (cubies are temporarily attached here during animation) */}
        <group ref={pivotRef} position={[0, 0, 0]} />
      </group>
    );
  }
);

RubiksCube3D.displayName = 'RubiksCube3D';
