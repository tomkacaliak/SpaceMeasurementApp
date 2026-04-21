import React from 'react'
import * as THREE from 'three'
import type { Opening, WallSide } from '../../types'

const WALL_T = 0.12   // wall thickness

function darker(hex: string, f = 0.7): string {
  const c = new THREE.Color(hex).multiplyScalar(f)
  return '#' + c.getHexString()
}

// ─── Door ────────────────────────────────────────────────────────────────────

function DoorOpening({ o, wallH }: { o: Opening; wallH: number }) {
  const floorY = -wallH / 2       // local floor level
  const cx = o.offsetFromLeft + o.width / 2 - 0   // relative to wall-segment group, which is already offset
  const doorCY = floorY + o.height / 2
  const frameT = 0.045
  const frameD = WALL_T + 0.02
  const woodColor = '#7D5A3C'
  const woodLight = '#A07850'
  const metalColor = '#B8B8B8'
  const doorDepth = 0.038

  return (
    <group position={[0, doorCY, 0]}>
      {/* ── Void (dark fill) ── */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[o.width, o.height, WALL_T + 0.001]} />
        <meshStandardMaterial color="#111111" />
      </mesh>

      {/* ── Frame ── */}
      {/* Left jamb */}
      <mesh position={[-o.width / 2 - frameT / 2, 0, 0]} castShadow>
        <boxGeometry args={[frameT, o.height + frameT, frameD]} />
        <meshStandardMaterial color={woodColor} roughness={0.55} />
      </mesh>
      {/* Right jamb */}
      <mesh position={[o.width / 2 + frameT / 2, 0, 0]} castShadow>
        <boxGeometry args={[frameT, o.height + frameT, frameD]} />
        <meshStandardMaterial color={woodColor} roughness={0.55} />
      </mesh>
      {/* Top rail */}
      <mesh position={[0, o.height / 2 + frameT / 2, 0]} castShadow>
        <boxGeometry args={[o.width + frameT * 2, frameT, frameD]} />
        <meshStandardMaterial color={woodColor} roughness={0.55} />
      </mesh>
      {/* Threshold */}
      <mesh position={[0, -o.height / 2 + 0.018, -WALL_T / 2 - 0.005]}>
        <boxGeometry args={[o.width + frameT * 2, 0.028, 0.06]} />
        <meshStandardMaterial color={woodColor} roughness={0.45} />
      </mesh>

      {/* ── Door slab ── */}
      <group position={[-o.width / 2 + doorDepth / 2 + 0.002, 0, -WALL_T / 2 - doorDepth / 2 + 0.001]}>
        {/* Main door panel */}
        <mesh castShadow>
          <boxGeometry args={[doorDepth, o.height - 0.006, o.width - 0.01]} />
          <meshStandardMaterial color={woodLight} roughness={0.4} />
        </mesh>
        {/* Top recessed panel */}
        <mesh position={[doorDepth / 2 + 0.001, o.height * 0.2, 0]}>
          <boxGeometry args={[0.006, o.height * 0.28, o.width * 0.72]} />
          <meshStandardMaterial color={darker(woodLight, 0.75)} roughness={0.5} />
        </mesh>
        {/* Bottom recessed panel */}
        <mesh position={[doorDepth / 2 + 0.001, -o.height * 0.22, 0]}>
          <boxGeometry args={[0.006, o.height * 0.38, o.width * 0.72]} />
          <meshStandardMaterial color={darker(woodLight, 0.75)} roughness={0.5} />
        </mesh>
        {/* Handle plate */}
        <mesh position={[doorDepth / 2 + 0.002, -0.02, o.width * 0.38]}>
          <boxGeometry args={[0.008, 0.12, 0.02]} />
          <meshStandardMaterial color={metalColor} roughness={0.25} metalness={0.8} />
        </mesh>
        {/* Handle rod */}
        <mesh position={[doorDepth / 2 + 0.02, -0.02, o.width * 0.38]}
          rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.008, 0.008, 0.1, 10]} />
          <meshStandardMaterial color={metalColor} roughness={0.2} metalness={0.85} />
        </mesh>
        {/* Handle horizontal */}
        <mesh position={[doorDepth / 2 + 0.025, -0.02, o.width * 0.38]}
          rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.007, 0.007, 0.09, 10]} />
          <meshStandardMaterial color={metalColor} roughness={0.2} metalness={0.85} />
        </mesh>
      </group>

      {/* ── Swing arc on floor ── */}
      <mesh
        position={[-o.width / 2, -o.height / 2 + 0.01, -WALL_T / 2 - 0.01]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[o.width * 0.94, o.width, 32, 1, 0, Math.PI / 2]} />
        <meshBasicMaterial color="#60a5fa" transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

// ─── Window ───────────────────────────────────────────────────────────────────

function WindowOpening({ o, wallH }: { o: Opening; wallH: number }) {
  const floorY = -wallH / 2
  const sillHeight = 1.0          // window starts at 1m from floor
  const winCY = floorY + sillHeight + o.height / 2
  const frameT = 0.04
  const frameD = WALL_T + 0.018
  const frameColor = '#FFFFFF'
  const sillColor = '#ECECEC'
  const paneCount = o.width > 0.8 ? 2 : 1
  const paneW = (o.width - frameT - (paneCount - 1) * frameT) / paneCount

  return (
    <group position={[0, winCY, 0]}>
      {/* ── Void ── */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[o.width, o.height, WALL_T + 0.001]} />
        <meshStandardMaterial color="#1a2a3a" />
      </mesh>

      {/* ── Frame ── */}
      {/* Left jamb */}
      <mesh position={[-o.width / 2 - frameT / 2, 0, 0]} castShadow>
        <boxGeometry args={[frameT, o.height + frameT * 2, frameD]} />
        <meshStandardMaterial color={frameColor} roughness={0.6} />
      </mesh>
      {/* Right jamb */}
      <mesh position={[o.width / 2 + frameT / 2, 0, 0]} castShadow>
        <boxGeometry args={[frameT, o.height + frameT * 2, frameD]} />
        <meshStandardMaterial color={frameColor} roughness={0.6} />
      </mesh>
      {/* Top rail */}
      <mesh position={[0, o.height / 2 + frameT / 2, 0]} castShadow>
        <boxGeometry args={[o.width + frameT * 2, frameT, frameD]} />
        <meshStandardMaterial color={frameColor} roughness={0.6} />
      </mesh>
      {/* Bottom rail */}
      <mesh position={[0, -o.height / 2 - frameT / 2, 0]} castShadow>
        <boxGeometry args={[o.width + frameT * 2, frameT, frameD]} />
        <meshStandardMaterial color={frameColor} roughness={0.6} />
      </mesh>

      {/* ── Panes ── */}
      {Array.from({ length: paneCount }).map((_, i) => {
        const px = paneCount === 1 ? 0 : -o.width / 2 + frameT + paneW / 2 + i * (paneW + frameT)
        return (
          <group key={i} position={[px, 0, 0]}>
            {/* Glass */}
            <mesh position={[0, 0, -WALL_T / 2 - 0.002]}>
              <planeGeometry args={[paneW, o.height - frameT * 0.5]} />
              <meshStandardMaterial
                color="#9BC8E8" transparent opacity={0.35}
                roughness={0.05} metalness={0.1} side={THREE.DoubleSide}
              />
            </mesh>
            {/* Mid horizontal divider */}
            <mesh position={[0, 0, -WALL_T / 2]}>
              <boxGeometry args={[paneW, frameT * 0.6, frameD * 0.4]} />
              <meshStandardMaterial color={frameColor} roughness={0.55} />
            </mesh>
            {/* Vertical divider between panes */}
            {paneCount > 1 && i < paneCount - 1 && (
              <mesh position={[paneW / 2 + frameT / 2, 0, 0]}>
                <boxGeometry args={[frameT, o.height, frameD]} />
                <meshStandardMaterial color={frameColor} roughness={0.6} />
              </mesh>
            )}
          </group>
        )
      })}

      {/* ── Window sill (interior) ── */}
      <mesh position={[0, -o.height / 2 - frameT - 0.02, -WALL_T / 2 - 0.05]} castShadow>
        <boxGeometry args={[o.width + frameT * 2 + 0.04, 0.035, 0.14]} />
        <meshStandardMaterial color={sillColor} roughness={0.45} />
      </mesh>
      {/* Sill front lip */}
      <mesh position={[0, -o.height / 2 - frameT - 0.038, -WALL_T / 2 - 0.115]}>
        <boxGeometry args={[o.width + frameT * 2 + 0.04, 0.02, 0.01]} />
        <meshStandardMaterial color={darker(sillColor, 0.85)} roughness={0.4} />
      </mesh>
    </group>
  )
}

// ─── Wall ────────────────────────────────────────────────────────────────────

interface Props {
  side: WallSide
  roomWidth: number
  roomLength: number
  roomHeight: number
  wallColor: string
  openings: Opening[]
}

export default function Wall({ side, roomWidth, roomLength, roomHeight, wallColor, openings }: Props) {
  const wallOpenings = openings.filter((o) => o.wall === side)

  let wallWidth: number
  let position: [number, number, number]
  let rotation: [number, number, number]

  switch (side) {
    case 'north':
      wallWidth = roomWidth; position = [0, roomHeight / 2, -roomLength / 2]; rotation = [0, 0, 0]; break
    case 'south':
      wallWidth = roomWidth; position = [0, roomHeight / 2, roomLength / 2]; rotation = [0, Math.PI, 0]; break
    case 'east':
      wallWidth = roomLength; position = [roomWidth / 2, roomHeight / 2, 0]; rotation = [0, -Math.PI / 2, 0]; break
    case 'west':
      wallWidth = roomLength; position = [-roomWidth / 2, roomHeight / 2, 0]; rotation = [0, Math.PI / 2, 0]; break
  }

  return (
    <group position={position} rotation={rotation}>
      {/* Wall slab */}
      <mesh receiveShadow castShadow>
        <boxGeometry args={[wallWidth, roomHeight, WALL_T]} />
        <meshStandardMaterial color={wallColor} roughness={0.88} />
      </mesh>

      {/* Openings — each positioned along the wall width */}
      {wallOpenings.map((o) => {
        const localX = o.offsetFromLeft + o.width / 2 - wallWidth / 2
        return (
          <group key={o.id} position={[localX, 0, 0]}>
            {o.type === 'door'
              ? <DoorOpening o={o} wallH={roomHeight} />
              : <WindowOpening o={o} wallH={roomHeight} />
            }
          </group>
        )
      })}
    </group>
  )
}
