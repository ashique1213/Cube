import React, { useMemo } from 'react';
import * as THREE from 'three';
import { RoundedBox } from '@react-three/drei';
import { Face } from '../../types/cube';

interface CubiePieceProps {
  initialPosition: [number, number, number];
  isHighlighted?: boolean;
}

// Color palette matching authentic WCA Rubik's Cube competition specs
export const STICKER_COLORS: Record<Face, string> = {
  U: '#ffd500', // Yellow
  D: '#ffffff', // White
  R: '#dc2626', // Red
  L: '#ff5800', // Orange
  F: '#16a34a', // Green
  B: '#2563eb', // Blue
};

export const CubiePiece = React.forwardRef<THREE.Group, CubiePieceProps>(
  ({ initialPosition, isHighlighted = false }, ref) => {
    const [x, y, z] = initialPosition;

    // Determine which faces of this cubie are on the outside of the 3x3x3 cube
    const stickers = useMemo(() => {
      const list: Array<{
        face: Face;
        position: [number, number, number];
        rotation: [number, number, number];
        color: string;
      }> = [];

      const STICKER_OFFSET = 0.485; // slightly proud of the 0.96 cubie body

      // Right Face (+X)
      if (x === 1) {
        list.push({
          face: 'R',
          position: [STICKER_OFFSET, 0, 0],
          rotation: [0, Math.PI / 2, 0],
          color: STICKER_COLORS.R,
        });
      }
      // Left Face (-X)
      if (x === -1) {
        list.push({
          face: 'L',
          position: [-STICKER_OFFSET, 0, 0],
          rotation: [0, -Math.PI / 2, 0],
          color: STICKER_COLORS.L,
        });
      }
      // Up Face (+Y)
      if (y === 1) {
        list.push({
          face: 'U',
          position: [0, STICKER_OFFSET, 0],
          rotation: [-Math.PI / 2, 0, 0],
          color: STICKER_COLORS.U,
        });
      }
      // Down Face (-Y)
      if (y === -1) {
        list.push({
          face: 'D',
          position: [0, -STICKER_OFFSET, 0],
          rotation: [Math.PI / 2, 0, 0],
          color: STICKER_COLORS.D,
        });
      }
      // Front Face (+Z)
      if (z === 1) {
        list.push({
          face: 'F',
          position: [0, 0, STICKER_OFFSET],
          rotation: [0, 0, 0],
          color: STICKER_COLORS.F,
        });
      }
      // Back Face (-Z)
      if (z === -1) {
        list.push({
          face: 'B',
          position: [0, 0, -STICKER_OFFSET],
          rotation: [0, Math.PI, 0],
          color: STICKER_COLORS.B,
        });
      }

      return list;
    }, [x, y, z]);

    return (
      <group ref={ref} position={initialPosition}>
        {/* Core Cubie Plastic Body - Rounded Box with matte charcoal obsidian finish */}
        <RoundedBox
          args={[0.96, 0.96, 0.96]}
          radius={0.06}
          smoothness={4}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial
            color={isHighlighted ? '#2a2f3e' : '#12141a'}
            roughness={0.45}
            metalness={0.15}
          />
        </RoundedBox>

        {/* Realistic Inset Colored Stickers */}
        {stickers.map((sticker) => (
          <group
            key={sticker.face}
            position={sticker.position}
            rotation={sticker.rotation}
          >
            {/* Sticker plate with rounded bevel */}
            <RoundedBox
              args={[0.82, 0.82, 0.015]}
              radius={0.05}
              smoothness={3}
              receiveShadow
            >
              <meshStandardMaterial
                color={sticker.color}
                roughness={0.22}
                metalness={0.08}
                emissive={isHighlighted ? sticker.color : '#000000'}
                emissiveIntensity={isHighlighted ? 0.25 : 0}
              />
            </RoundedBox>
          </group>
        ))}
      </group>
    );
  }
);

CubiePiece.displayName = 'CubiePiece';
