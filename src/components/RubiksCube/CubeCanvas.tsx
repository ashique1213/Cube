import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { RubiksCube3D, RubiksCubeRef } from './RubiksCube3D';
import { ViewControls } from './ViewControls';
import { CameraPreset, Face, MoveNotation } from '../../types/cube';

export interface CubeCanvasHandle extends RubiksCubeRef {
  setCameraPreset: (preset: CameraPreset) => void;
  resetCamera: () => void;
}

interface CubeCanvasProps {
  animationSpeedMs?: number;
  highlightFaces?: Face[];
  onMoveStart?: (notation: MoveNotation) => void;
  onMoveEnd?: (notation: MoveNotation) => void;
}

const CameraRig: React.FC<{
  controlsRef: React.RefObject<OrbitControlsImpl>;
}> = ({ controlsRef }) => {
  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.08}
      minDistance={4.5}
      maxDistance={14}
      target={[0, 0, 0]}
    />
  );
};

export const CubeCanvas = forwardRef<CubeCanvasHandle, CubeCanvasProps>(
  ({ animationSpeedMs = 500, highlightFaces = [], onMoveStart, onMoveEnd }, ref) => {
    const cubeRef = useRef<RubiksCubeRef>(null);
    const controlsRef = useRef<OrbitControlsImpl>(null);

    const presetPositions: Record<CameraPreset, [number, number, number]> = {
      isometric: [4.2, 5.0, 5.2],
      front: [0, 0, 7.5],
      top: [0, 7.5, 0.001],
      right: [7.5, 0, 0],
      back: [0, 0, -7.5],
      bottom: [0, -7.5, 0.001],
    };

    const handleCameraPreset = (preset: CameraPreset) => {
      if (!controlsRef.current) return;
      const [x, y, z] = presetPositions[preset];
      const camera = controlsRef.current.object;
      camera.position.set(x, y, z);
      camera.lookAt(0, 0, 0);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    };

    const handleResetCamera = () => {
      handleCameraPreset('isometric');
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
      setCameraPreset: handleCameraPreset,
      resetCamera: handleResetCamera,
    }));

    return (
      <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-50/70 via-slate-50 to-blue-50/60 rounded-2xl overflow-hidden border border-indigo-100/90 shadow-[0_10px_35px_-5px_rgba(99,102,241,0.08)]">
        {/* Quick View Controls */}
        <ViewControls
          onPresetSelect={handleCameraPreset}
          onResetView={handleResetCamera}
        />

        {/* Orbit Helper Tip */}
        <div className="absolute bottom-2.5 left-3 z-10 pointer-events-none text-[10px] sm:text-[11px] text-slate-500 bg-white/85 backdrop-blur-md px-2.5 py-1 rounded-lg border border-indigo-100/80 shadow-xs flex items-center gap-1.5 font-medium">
          <span>Rotate: Click & Drag</span>
          <span className="text-indigo-300">•</span>
          <span>Zoom: Scroll</span>
        </div>

        {/* 3D WebGL Canvas */}
        <Canvas
          shadows
          camera={{ position: [4.2, 5.0, 5.2], fov: 42 }}
          gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}
          className="w-full h-full cursor-grab active:cursor-grabbing"
        >
          {/* Studio Lighting tuned for crisp white theme */}
          <ambientLight intensity={1.1} />
          
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
            position={[0, -2.1, 0]}
            opacity={0.35}
            scale={9}
            blur={2.0}
            far={4}
          />

          {/* 3D Rubik's Cube */}
          <RubiksCube3D
            ref={cubeRef}
            animationSpeedMs={animationSpeedMs}
            highlightFaces={highlightFaces}
            onMoveStart={onMoveStart}
            onMoveEnd={onMoveEnd}
          />

          <CameraRig controlsRef={controlsRef} />
        </Canvas>
      </div>
    );
  }
);

CubeCanvas.displayName = 'CubeCanvas';
