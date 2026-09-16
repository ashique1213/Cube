import React, { useRef, useImperativeHandle, forwardRef, useEffect, useCallback } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, ContactShadows } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, RotateCw } from 'lucide-react';
import { RubiksCube3D, RubiksCubeRef } from './RubiksCube3D';
import { ViewControls } from './ViewControls';
import { CameraPreset, Face, MoveNotation } from '../../types/cube';
import { computeViewFaceMapping, ViewFaceMapping } from '../../engine/rotationPhysics';

export interface CubeCanvasHandle extends RubiksCubeRef {
  setCameraPreset: (preset: CameraPreset) => void;
  resetCamera: () => void;
  rotateView: (direction: 'left' | 'right' | 'up' | 'down') => void;
}

interface CubeCanvasProps {
  animationSpeedMs?: number;
  highlightFaces?: Face[];
  onMoveStart?: (notation: MoveNotation) => void;
  onMoveEnd?: (notation: MoveNotation) => void;
  onViewMappingChange?: (mapping: ViewFaceMapping) => void;
}

const CameraRig: React.FC<{
  controlsRef: React.RefObject<OrbitControlsImpl>;
  onCameraChange?: () => void;
}> = ({ controlsRef, onCameraChange }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onCameraChange?.();
    }, 50);
    return () => clearTimeout(timer);
  }, [controlsRef, onCameraChange]);

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.08}
      minDistance={3.2}
      maxDistance={12}
      target={[0, 0, 0]}
      onChange={onCameraChange}
    />
  );
};

// Dynamically scale camera FOV on portrait mobile screens so cube is clear & properly sized
const ResponsiveCameraManager: React.FC = () => {
  const { camera, size } = useThree();
  useEffect(() => {
    const aspect = size.width / size.height;
    const perspCamera = camera as THREE.PerspectiveCamera;
    if (perspCamera && perspCamera.isPerspectiveCamera) {
      if (aspect < 0.75) {
        perspCamera.fov = 48;
      } else if (aspect < 1.0) {
        perspCamera.fov = 42;
      } else {
        perspCamera.fov = 38;
      }
      perspCamera.updateProjectionMatrix();
    }
  }, [camera, size.width, size.height]);

  return null;
};

export const CubeCanvas = forwardRef<CubeCanvasHandle, CubeCanvasProps>(
  ({ animationSpeedMs = 500, highlightFaces = [], onMoveStart, onMoveEnd, onViewMappingChange }, ref) => {
    const cubeRef = useRef<RubiksCubeRef>(null);
    const controlsRef = useRef<OrbitControlsImpl>(null);
    const lastMappingKeyRef = useRef<string>('');

    const notifyViewMapping = useCallback(() => {
      if (!controlsRef.current) return;
      const mapping = computeViewFaceMapping(controlsRef.current.object);
      const key = `${mapping.U}_${mapping.D}_${mapping.R}_${mapping.L}_${mapping.F}_${mapping.B}`;
      if (key !== lastMappingKeyRef.current) {
        lastMappingKeyRef.current = key;
        onViewMappingChange?.(mapping);
      }
    }, [onViewMappingChange]);

    // Closer camera presets to eliminate excess whitespace and make the cube prominent
    const presetPositions: Record<CameraPreset, [number, number, number]> = {
      isometric: [2.9, 3.4, 3.6],
      front: [0, 0, 4.8],
      top: [0, 4.8, 0.001],
      right: [4.8, 0, 0],
      back: [0, 0, -4.8],
      bottom: [0, -4.8, 0.001],
    };

    const handleCameraPreset = (preset: CameraPreset) => {
      if (!controlsRef.current) return;
      const [x, y, z] = presetPositions[preset];
      const camera = controlsRef.current.object;
      camera.position.set(x, y, z);
      camera.lookAt(0, 0, 0);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
      notifyViewMapping();
    };

    const handleResetCamera = () => {
      handleCameraPreset('isometric');
    };

    // Rotate the whole cube / camera view in 4 directions
    const rotateView = (direction: 'left' | 'right' | 'up' | 'down') => {
      if (!controlsRef.current) return;
      const camera = controlsRef.current.object;
      const target = controlsRef.current.target;

      const offset = camera.position.clone().sub(target);
      const radius = offset.length();
      let theta = Math.atan2(offset.x, offset.z);
      let phi = Math.acos(Math.max(-0.99, Math.min(0.99, offset.y / radius)));

      const stepAzimuth = Math.PI / 4; // 45° rotation around Y
      const stepPolar = Math.PI / 6; // 30° tilt

      if (direction === 'left') {
        theta += stepAzimuth;
      } else if (direction === 'right') {
        theta -= stepAzimuth;
      } else if (direction === 'up') {
        phi = Math.max(0.15, phi - stepPolar);
      } else if (direction === 'down') {
        phi = Math.min(Math.PI - 0.15, phi + stepPolar);
      }

      offset.x = radius * Math.sin(phi) * Math.sin(theta);
      offset.y = radius * Math.cos(phi);
      offset.z = radius * Math.sin(phi) * Math.cos(theta);

      camera.position.copy(target).add(offset);
      camera.lookAt(target);
      controlsRef.current.update();
      notifyViewMapping();
    };

    useImperativeHandle(ref, () => ({
      executeMove: (notation: MoveNotation, duration?: number) => {
        return cubeRef.current?.executeMove(notation, duration) ?? Promise.resolve();
      },
      resetToSolved: () => {
        cubeRef.current?.resetToSolved();
      },
      resetToDaisy: (randomize = false) => {
        cubeRef.current?.resetToDaisy(randomize);
      },
      applyScramble: (moves: MoveNotation[]) => {
        return cubeRef.current?.applyScramble(moves) ?? Promise.resolve();
      },
      isAnimating: () => {
        return cubeRef.current?.isAnimating() ?? false;
      },
      checkIsSolved: () => {
        return cubeRef.current?.checkIsSolved() ?? false;
      },
      setCameraPreset: handleCameraPreset,
      resetCamera: handleResetCamera,
      rotateView: rotateView,
    }));

    return (
      <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-50/70 via-slate-50 to-blue-50/60 rounded-2xl sm:rounded-3xl overflow-hidden border border-indigo-100/90 shadow-sm">
        {/* Quick View Presets (Top Left) */}
        <ViewControls
          onPresetSelect={handleCameraPreset}
          onResetView={handleResetCamera}
        />

        {/* 4-Way Tactile Cube Rotation Controller (Bottom Right) */}
        <div className="absolute bottom-1.5 right-1.5 sm:bottom-2.5 sm:right-2.5 z-20 flex flex-col items-center gap-0.5 bg-white/90 backdrop-blur-md p-1 sm:p-1.5 rounded-xl sm:rounded-2xl border border-indigo-100 shadow-sm">
          <div className="flex items-center gap-0.5 sm:gap-1 text-[7px] sm:text-[8px] font-black uppercase text-indigo-700 tracking-wider mb-0.5">
            <RotateCw className="w-2 h-2 sm:w-2.5 sm:h-2.5" />
            <span>ROTATE</span>
          </div>

          <button
            onClick={() => rotateView('up')}
            className="w-6 h-5 sm:w-7 sm:h-6 rounded-md sm:rounded-lg bg-slate-100 hover:bg-indigo-100 text-slate-700 hover:text-indigo-700 transition-all flex items-center justify-center font-bold shadow-2xs active:scale-95 cursor-pointer"
            title="Rotate Up / Top View (Arrow Up)"
            aria-label="Rotate cube up"
          >
            <ChevronUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          <div className="flex items-center gap-0.5 sm:gap-1">
            <button
              onClick={() => rotateView('left')}
              className="w-6 h-5 sm:w-7 sm:h-6 rounded-md sm:rounded-lg bg-slate-100 hover:bg-indigo-100 text-slate-700 hover:text-indigo-700 transition-all flex items-center justify-center font-bold shadow-2xs active:scale-95 cursor-pointer"
              title="Rotate Left (Arrow Left)"
              aria-label="Rotate cube left"
            >
              <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            <span className="text-[6px] sm:text-[7px] font-mono font-bold text-slate-400 px-0.5">3D</span>

            <button
              onClick={() => rotateView('right')}
              className="w-6 h-5 sm:w-7 sm:h-6 rounded-md sm:rounded-lg bg-slate-100 hover:bg-indigo-100 text-slate-700 hover:text-indigo-700 transition-all flex items-center justify-center font-bold shadow-2xs active:scale-95 cursor-pointer"
              title="Rotate Right (Arrow Right)"
              aria-label="Rotate cube right"
            >
              <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>

          <button
            onClick={() => rotateView('down')}
            className="w-6 h-5 sm:w-7 sm:h-6 rounded-md sm:rounded-lg bg-slate-100 hover:bg-indigo-100 text-slate-700 hover:text-indigo-700 transition-all flex items-center justify-center font-bold shadow-2xs active:scale-95 cursor-pointer"
            title="Rotate Down / Bottom View (Arrow Down)"
            aria-label="Rotate cube down"
          >
            <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* Orbit Helper Tip (Bottom Left) */}
        <div className="absolute bottom-1.5 left-1.5 sm:bottom-2.5 sm:left-2.5 z-10 pointer-events-none text-[8px] sm:text-[10px] text-slate-500 bg-white/80 backdrop-blur-md px-1.5 sm:px-2 py-0.5 rounded-md sm:rounded-lg border border-indigo-100/80 shadow-2xs flex items-center gap-1 font-medium">
          <span>Drag: Orbit</span>
          <span className="text-indigo-300">•</span>
          <span>Arrows: Rotate</span>
        </div>

        {/* 3D WebGL Canvas with Responsive FOV */}
        <Canvas
          shadows
          camera={{ position: [2.9, 3.4, 3.6], fov: 38 }}
          gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}
          className="w-full h-full cursor-grab active:cursor-grabbing"
        >
          <ResponsiveCameraManager />
          {/* Studio Lighting */}
          <ambientLight intensity={1.15} />

          <directionalLight
            position={[8, 14, 8]}
            intensity={1.8}
            castShadow
            shadow-mapSize={[1024, 1024]}
            shadow-camera-near={1}
            shadow-camera-far={25}
            shadow-camera-left={-6}
            shadow-camera-right={6}
            shadow-camera-top={6}
            shadow-camera-bottom={-6}
          />

          <directionalLight
            position={[-8, 6, -6]}
            intensity={0.7}
            color="#e2e8f0"
          />

          <directionalLight
            position={[0, -6, 6]}
            intensity={0.4}
            color="#cbd5e1"
          />

          {/* Contact Shadows beneath the Rubik's Cube */}
          <ContactShadows
            position={[0, -1.9, 0]}
            opacity={0.35}
            scale={7.5}
            blur={1.8}
            far={3.5}
          />

          {/* 3D Rubik's Cube */}
          <RubiksCube3D
            ref={cubeRef}
            animationSpeedMs={animationSpeedMs}
            highlightFaces={highlightFaces}
            onMoveStart={onMoveStart}
            onMoveEnd={onMoveEnd}
          />

          <CameraRig controlsRef={controlsRef} onCameraChange={notifyViewMapping} />
        </Canvas>
      </div>
    );
  }
);

CubeCanvas.displayName = 'CubeCanvas';

