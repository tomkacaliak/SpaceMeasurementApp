import React, { useRef } from 'react'
import { ThreeEvent } from '@react-three/fiber'
import * as THREE from 'three'
import type { FurnitureItem } from '../../types'
import useRoomStore from '../../store/useRoomStore'

// ─── Color helpers ────────────────────────────────────────────────────────────

function darker(hex: string, f = 0.65): string {
  const c = new THREE.Color(hex).multiplyScalar(f)
  return '#' + c.getHexString()
}
function lighter(hex: string, f = 1.35): string {
  const c = new THREE.Color(hex)
  c.r = Math.min(1, c.r * f); c.g = Math.min(1, c.g * f); c.b = Math.min(1, c.b * f)
  return '#' + c.getHexString()
}

// ─── Primitive helpers ────────────────────────────────────────────────────────

type V3 = [number, number, number]

function Box({ p, s, c, r = 0.75, m = 0 }: { p: V3; s: V3; c: string; r?: number; m?: number }) {
  return (
    <mesh position={p} castShadow receiveShadow>
      <boxGeometry args={s} />
      <meshStandardMaterial color={c} roughness={r} metalness={m} />
    </mesh>
  )
}

function Cyl({ p, rt, rb, h, c, rot, m = 0 }: {
  p: V3; rt: number; rb: number; h: number; c: string; rot?: V3; m?: number
}) {
  return (
    <mesh position={p} rotation={(rot ?? [0, 0, 0]) as any} castShadow>
      <cylinderGeometry args={[rt, rb, h, 16]} />
      <meshStandardMaterial color={c} roughness={0.4} metalness={m} />
    </mesh>
  )
}

// ─── BED ─────────────────────────────────────────────────────────────────────

function BedGeometry({ w, d, h, color }: { w: number; d: number; h: number; color: string }) {
  const f = -h / 2           // local floor level
  const legH = 0.14
  const railH = 0.07
  const slatH = 0.06
  const mattH = 0.22
  const headH = 0.82
  const footH = 0.38
  const woodDark = darker(color, 0.62)
  const woodLight = lighter(color, 1.18)
  const slatsY = f + legH + railH + slatH / 2

  const legPositions: V3[] = [
    [-w / 2 + 0.06, f + legH / 2, -d / 2 + 0.08],
    [w / 2 - 0.06, f + legH / 2, -d / 2 + 0.08],
    [-w / 2 + 0.06, f + legH / 2, d / 2 - 0.08],
    [w / 2 - 0.06, f + legH / 2, d / 2 - 0.08],
  ]

  const slatsCount = Math.floor((d - 0.3) / 0.14)

  return (
    <group>
      {/* Legs */}
      {legPositions.map((lp, i) => <Box key={i} p={lp} s={[0.06, legH, 0.06]} c={woodDark} r={0.4} />)}

      {/* Long side rails */}
      <Box p={[-w / 2 + 0.03, f + legH + railH / 2, 0]} s={[0.055, railH, d - 0.16]} c={color} r={0.5} />
      <Box p={[w / 2 - 0.03, f + legH + railH / 2, 0]} s={[0.055, railH, d - 0.16]} c={color} r={0.5} />

      {/* Cross slats */}
      {Array.from({ length: slatsCount }).map((_, i) => {
        const z = -d / 2 + 0.2 + i * (d - 0.3) / (slatsCount - 1)
        return <Box key={i} p={[0, slatsY, z]} s={[w - 0.08, slatH, 0.055]} c={woodLight} r={0.8} />
      })}

      {/* Mattress */}
      <Box p={[0, f + legH + railH + slatH + mattH / 2, 0]} s={[w - 0.07, mattH, d - 0.14]} c="#F4EFE8" r={0.95} />
      {/* Mattress piping */}
      <Box p={[0, f + legH + railH + slatH + mattH - 0.005, 0]} s={[w - 0.06, 0.025, d - 0.13]} c="#E8E0D2" r={1} />
      {/* Mattress side seam lines */}
      <Box p={[-w / 2 + 0.07, f + legH + railH + slatH + mattH / 2, 0]} s={[0.012, mattH + 0.01, d - 0.14]} c="#E0D8CC" r={1} />
      <Box p={[w / 2 - 0.07, f + legH + railH + slatH + mattH / 2, 0]} s={[0.012, mattH + 0.01, d - 0.14]} c="#E0D8CC" r={1} />

      {/* Headboard body */}
      <Box p={[0, f + headH / 2, -d / 2 + 0.06]} s={[w, headH, 0.075]} c={color} r={0.55} />
      {/* Headboard top rail */}
      <Box p={[0, f + headH - 0.035, -d / 2 + 0.1]} s={[w, 0.065, 0.06]} c={woodDark} r={0.4} />
      {/* Headboard bottom rail */}
      <Box p={[0, f + legH + 0.04, -d / 2 + 0.1]} s={[w, 0.06, 0.06]} c={woodDark} r={0.4} />
      {/* Headboard vertical slats */}
      {Array.from({ length: Math.max(3, Math.round(w / 0.16)) }).map((_, i, arr) => {
        const x = -w / 2 + 0.08 + (i * (w - 0.16)) / (arr.length - 1)
        return <Box key={i} p={[x, f + headH / 2, -d / 2 + 0.1]} s={[0.032, headH - 0.15, 0.04]} c={woodLight} r={0.5} />
      })}

      {/* Footboard */}
      <Box p={[0, f + footH / 2, d / 2 - 0.04]} s={[w, footH, 0.065]} c={color} r={0.55} />
      <Box p={[0, f + footH - 0.03, d / 2 - 0.075]} s={[w, 0.055, 0.055]} c={woodDark} r={0.4} />

      {/* Pillows */}
      <Box p={[-w * 0.25, f + legH + railH + slatH + mattH + 0.07, -d / 2 + 0.4]} s={[w * 0.42, 0.11, 0.52]} c="#FFFBF7" r={1} />
      {w > 1.2 && (
        <Box p={[w * 0.25, f + legH + railH + slatH + mattH + 0.07, -d / 2 + 0.4]} s={[w * 0.42, 0.11, 0.52]} c="#FFFBF7" r={1} />
      )}
      {/* Duvet */}
      <Box p={[0, f + legH + railH + slatH + mattH + 0.045, 0.1]} s={[w - 0.08, 0.085, d - 1.05]} c="#D8E8F8" r={1} />
    </group>
  )
}

// ─── WARDROBE ────────────────────────────────────────────────────────────────

function WardrobeGeometry({ w, d, h, color, type }: {
  w: number; d: number; h: number; color: string; type: string
}) {
  const f = -h / 2
  const wood = color
  const woodDark = darker(color, 0.58)
  const woodLight = lighter(color, 1.22)
  const metal = '#BDBDBD'
  const isSliding = type === 'wardrobe-sliding'
  const doors = type === 'wardrobe-single' ? 1 : 2
  const doorW = (w - 0.04) / doors

  return (
    <group>
      {/* Plinth */}
      <Box p={[0, f + 0.055, 0]} s={[w, 0.11, d]} c={woodDark} r={0.5} />
      {/* Back panel */}
      <Box p={[0, 0, d / 2 - 0.012]} s={[w - 0.04, h - 0.11, 0.016]} c={darker(wood, 0.55)} r={0.8} />
      {/* Side panels */}
      <Box p={[-w / 2 + 0.014, 0, 0]} s={[0.022, h - 0.11, d]} c={wood} r={0.5} />
      <Box p={[w / 2 - 0.014, 0, 0]} s={[0.022, h - 0.11, d]} c={wood} r={0.5} />
      {/* Top panel */}
      <Box p={[0, f + h - 0.018, 0]} s={[w, 0.028, d]} c={wood} r={0.4} />
      {/* Crown molding */}
      <Box p={[0, f + h + 0.016, 0]} s={[w + 0.015, 0.032, d + 0.015]} c={woodDark} r={0.45} />
      {/* Bottom shelf */}
      <Box p={[0, f + 0.13, 0]} s={[w - 0.04, 0.018, d - 0.02]} c={woodLight} r={0.6} />
      {/* Mid shelf */}
      <Box p={[0, f + h * 0.48, 0]} s={[w - 0.04, 0.018, d - 0.02]} c={woodLight} r={0.6} />
      {/* Clothes rod (between mid and top shelf) */}
      <Cyl p={[0, f + h * 0.74, 0]} rt={0.012} rb={0.012} h={w - 0.06} c={metal} rot={[0, 0, Math.PI / 2]} m={0.5} />

      {/* Door panels */}
      {Array.from({ length: doors }).map((_, i) => {
        const dx = -w / 2 + 0.02 + doorW / 2 + i * doorW
        const isRight = i === doors - 1
        return (
          <group key={i}>
            {/* Door slab */}
            <Box p={[dx, f + (h - 0.11) / 2 + 0.11, isSliding ? -d / 2 + 0.015 + i * 0.018 : -d / 2 + 0.015]}
              s={[doorW - 0.006, h - 0.145, 0.019]} c={woodLight} r={0.4} />
            {/* Top inset panel */}
            <Box p={[dx, f + (h - 0.11) * 0.72 + 0.11, -d / 2 + 0.028]}
              s={[doorW - 0.07, (h - 0.11) * 0.22, 0.008]} c={lighter(wood, 1.32)} r={0.35} />
            {/* Bottom inset panel */}
            <Box p={[dx, f + (h - 0.11) * 0.3 + 0.11, -d / 2 + 0.028]}
              s={[doorW - 0.07, (h - 0.11) * 0.4, 0.008]} c={lighter(wood, 1.32)} r={0.35} />
            {/* Handle */}
            {isSliding ? (
              <Box p={[dx + doorW * (isRight ? -0.38 : 0.38), f + h * 0.48, -d / 2 + 0.03]}
                s={[0.013, 0.14, 0.016]} c={metal} m={0.65} r={0.3} />
            ) : (
              <group position={[dx + doorW * (isRight ? -0.32 : 0.32), f + h * 0.48, -d / 2 + 0.03]}>
                <Box p={[0, 0, 0]} s={[0.016, 0.13, 0.016]} c={metal} m={0.65} r={0.3} />
                <Box p={[0, -0.065, 0.01]} s={[0.025, 0.025, 0.025]} c={metal} m={0.7} r={0.3} />
                <Box p={[0, 0.065, 0.01]} s={[0.025, 0.025, 0.025]} c={metal} m={0.7} r={0.3} />
              </group>
            )}
          </group>
        )
      })}
    </group>
  )
}

// ─── DESK ────────────────────────────────────────────────────────────────────

function DeskGeometry({ w, d, h, color }: { w: number; d: number; h: number; color: string }) {
  const f = -h / 2
  const wood = color
  const woodDark = darker(color, 0.6)
  const metal = '#9E9E9E'
  const legH = h - 0.05
  const legW = 0.04

  return (
    <group>
      {/* Tabletop */}
      <Box p={[0, f + h - 0.025, 0]} s={[w, 0.042, d]} c={wood} r={0.35} />
      {/* Front lip */}
      <Box p={[0, f + h - 0.048, d / 2 - 0.004]} s={[w, 0.04, 0.008]} c={woodDark} r={0.3} />
      {/* Underframe */}
      <Box p={[0, f + legH - 0.02, 0]} s={[w - 0.1, 0.028, 0.05]} c={woodDark} r={0.4} />
      <Box p={[0, f + legH - 0.02, 0]} s={[0.05, 0.028, d - 0.1]} c={woodDark} r={0.4} />

      {/* Legs */}
      {([[-w / 2 + legW / 2 + 0.025, d / 2 - legW / 2 - 0.025],
        [w / 2 - legW / 2 - 0.025, d / 2 - legW / 2 - 0.025],
        [-w / 2 + legW / 2 + 0.025, -d / 2 + legW / 2 + 0.025],
        [w / 2 - legW / 2 - 0.025, -d / 2 + legW / 2 + 0.025]] as [number, number][])
        .map(([lx, lz], i) => (
          <Box key={i} p={[lx, f + legH / 2, lz]} s={[legW, legH, legW]} c={woodDark} r={0.3} />
        ))}

      {/* Left modesty panel */}
      <Box p={[-w / 2 + 0.02, f + legH * 0.45, 0]} s={[0.018, legH * 0.72, d - 0.06]} c={wood} r={0.5} />

      {/* Drawer pedestal */}
      <Box p={[w / 2 - 0.12, f + legH * 0.4, 0]} s={[0.21, legH * 0.65, d - 0.06]} c={lighter(wood, 1.12)} r={0.5} />
      {/* 3 drawer fronts */}
      {[0.68, 0.42, 0.16].map((yf, i) => (
        <group key={i}>
          <Box p={[w / 2 - 0.12, f + legH * yf, -d / 2 + 0.016]}
            s={[0.19, legH * 0.19, 0.016]} c={lighter(wood, 1.22)} r={0.35} />
          <Box p={[w / 2 - 0.12, f + legH * yf, -d / 2 + 0.028]}
            s={[0.07, 0.012, 0.012]} c={metal} m={0.65} r={0.3} />
        </group>
      ))}
    </group>
  )
}

// ─── CHAIR ────────────────────────────────────────────────────────────────────

function ChairGeometry({ w, d, h, color }: { w: number; d: number; h: number; color: string }) {
  const f = -h / 2
  const fabric = color
  const fabricLight = lighter(color, 1.2)
  const wood = '#C4A882'
  const woodDark = '#9A7A5A'
  const legH = 0.43
  const legW = 0.032
  const seatH = 0.1
  const seatY = f + legH + seatH / 2
  const backH = h - legH - seatH - 0.04

  return (
    <group>
      {/* Rear legs (go up to form backrest frame) */}
      <Box p={[-w / 2 + legW / 2 + 0.02, f + h * 0.5, -d / 2 + legW / 2 + 0.02]}
        s={[legW, h, legW]} c={woodDark} r={0.35} />
      <Box p={[w / 2 - legW / 2 - 0.02, f + h * 0.5, -d / 2 + legW / 2 + 0.02]}
        s={[legW, h, legW]} c={woodDark} r={0.35} />
      {/* Front legs */}
      <Box p={[-w / 2 + legW / 2 + 0.02, f + legH / 2, d / 2 - legW / 2 - 0.02]}
        s={[legW, legH, legW]} c={wood} r={0.35} />
      <Box p={[w / 2 - legW / 2 - 0.02, f + legH / 2, d / 2 - legW / 2 - 0.02]}
        s={[legW, legH, legW]} c={wood} r={0.35} />
      {/* Stretchers */}
      <Box p={[0, f + legH * 0.35, d / 2 - 0.03]} s={[w - 0.06, legW, legW]} c={wood} r={0.4} />
      <Box p={[0, f + legH * 0.35, -d / 2 + 0.03]} s={[w - 0.06, legW, legW]} c={woodDark} r={0.4} />
      <Box p={[-w / 2 + 0.03, f + legH * 0.35, 0]} s={[legW, legW, d - 0.06]} c={wood} r={0.4} />

      {/* Seat frame */}
      <Box p={[0, seatY, 0]} s={[w, seatH, d]} c={wood} r={0.5} />
      {/* Seat cushion */}
      <Box p={[0, seatY + seatH / 2 + 0.03, 0]} s={[w - 0.05, 0.055, d - 0.05]} c={fabric} r={0.95} />
      {/* Seat cushion top */}
      <Box p={[0, seatY + seatH / 2 + 0.055, 0]} s={[w - 0.08, 0.012, d - 0.08]} c={fabricLight} r={1} />

      {/* Backrest frame */}
      <Box p={[0, seatY + seatH / 2 + 0.02 + backH / 2, -d / 2 + 0.045]}
        s={[w, 0.038, 0.038]} c={woodDark} r={0.4} />
      <Box p={[0, f + h - 0.02, -d / 2 + 0.045]} s={[w, 0.038, 0.038]} c={woodDark} r={0.4} />
      {/* Backrest vertical bars */}
      {Array.from({ length: 3 }).map((_, i) => {
        const bx = -w / 2 + 0.08 + i * (w - 0.16) / 2
        return <Box key={i} p={[bx, seatY + seatH / 2 + backH / 2, -d / 2 + 0.04]}
          s={[0.024, backH, 0.024]} c={wood} r={0.4} />
      })}
      {/* Back cushion */}
      <Box p={[0, seatY + seatH / 2 + backH / 2 + 0.02, -d / 2 + 0.06]}
        s={[w - 0.07, backH - 0.06, 0.065]} c={fabric} r={0.9} />
      <Box p={[0, seatY + seatH / 2 + backH / 2 + 0.02, -d / 2 + 0.085]}
        s={[w - 0.1, backH - 0.1, 0.04]} c={fabricLight} r={1} />
    </group>
  )
}

// ─── SOFA ────────────────────────────────────────────────────────────────────

function SofaGeometry({ w, d, h, color }: { w: number; d: number; h: number; color: string }) {
  const f = -h / 2
  const fabric = color
  const fabricLight = lighter(color, 1.22)
  const legColor = '#4A3728'
  const legH = 0.1
  const baseH = 0.28
  const seatH = 0.2
  const backH = h - legH - baseH - seatH
  const armW = 0.16
  const innerW = w - armW * 2
  const seatTop = f + legH + baseH + seatH

  const cushionCount = innerW > 1.4 ? 3 : 2
  const cushW = (innerW - 0.03 * (cushionCount - 1)) / cushionCount

  return (
    <group>
      {/* Legs */}
      {([[-w / 2 + 0.09, d / 2 - 0.07], [w / 2 - 0.09, d / 2 - 0.07],
        [-w / 2 + 0.09, -d / 2 + 0.07], [w / 2 - 0.09, -d / 2 + 0.07]] as [number, number][])
        .map(([lx, lz], i) => (
          <Box key={i} p={[lx, f + legH / 2, lz]} s={[0.055, legH, 0.055]} c={legColor} r={0.3} />
        ))}

      {/* Base platform */}
      <Box p={[0, f + legH + baseH / 2, 0]} s={[w, baseH, d]} c={fabric} r={0.7} />

      {/* Seat cushions */}
      {Array.from({ length: cushionCount }).map((_, i) => {
        const cx = -innerW / 2 + cushW / 2 + i * (cushW + 0.03)
        return (
          <group key={i}>
            <Box p={[cx, f + legH + baseH + seatH / 2, 0]} s={[cushW, seatH, d - armW * 0.4]} c={fabricLight} r={0.9} />
            {/* Cushion seam */}
            <Box p={[cx, f + legH + baseH + seatH - 0.01, 0]} s={[cushW - 0.01, 0.015, d - armW * 0.4 - 0.01]} c={fabric} r={1} />
          </group>
        )
      })}

      {/* Backrest body */}
      <Box p={[0, seatTop + backH / 2, -d / 2 + 0.14]} s={[w, backH, 0.26]} c={fabric} r={0.7} />
      {/* Back cushions */}
      {Array.from({ length: cushionCount }).map((_, i) => {
        const cx = -innerW / 2 + cushW / 2 + i * (cushW + 0.03)
        return (
          <group key={i}>
            <Box p={[cx, seatTop + backH / 2, -d / 2 + 0.16]} s={[cushW, backH - 0.05, 0.22]} c={fabricLight} r={0.9} />
            <Box p={[cx, seatTop + backH / 2, -d / 2 + 0.26]} s={[cushW - 0.02, backH - 0.1, 0.04]} c={lighter(color, 1.35)} r={1} />
          </group>
        )
      })}

      {/* Armrests */}
      {[-1, 1].map((side) => {
        const ax = side * (w / 2 - armW / 2)
        return (
          <group key={side}>
            <Box p={[ax, f + legH + baseH / 2 + (backH + seatH) / 2, 0]} s={[armW, backH + seatH, d]} c={fabric} r={0.7} />
            {/* Armrest top pad */}
            <Box p={[ax, seatTop + backH + 0.025, 0]} s={[armW, 0.05, d - 0.04]} c={fabricLight} r={0.9} />
          </group>
        )
      })}

      {/* Throw pillow (decorative) */}
      <Box p={[w / 2 - armW - cushW * 0.6, seatTop + seatH / 2 + 0.12, -d / 2 + 0.25]}
        s={[0.38, 0.38, 0.08]} c={darker(color, 1.4)} r={1} />
    </group>
  )
}

// ─── BOOKSHELF ───────────────────────────────────────────────────────────────

const BOOK_WIDTHS = [0.038, 0.052, 0.031, 0.046, 0.039, 0.058, 0.034, 0.044, 0.041, 0.036]
const BOOK_COLORS = ['#C0392B', '#2471A3', '#1E8449', '#7D3C98', '#D68910', '#117A65', '#E74C3C', '#2E86C1']

function BookshelfGeometry({ w, d, h, color }: { w: number; d: number; h: number; color: string }) {
  const f = -h / 2
  const wood = color
  const woodDark = darker(color, 0.6)
  const t = 0.018  // panel thickness
  const shelfCount = Math.floor(h / 0.38) - 1
  const interiorH = h - t * 2
  const cellH = interiorH / (shelfCount + 1)

  return (
    <group>
      {/* Back panel */}
      <Box p={[0, 0, d / 2 - t / 2]} s={[w - t * 2, h, t]} c={woodDark} r={0.85} />
      {/* Side panels */}
      <Box p={[-w / 2 + t / 2, 0, 0]} s={[t, h, d]} c={wood} r={0.5} />
      <Box p={[w / 2 - t / 2, 0, 0]} s={[t, h, d]} c={wood} r={0.5} />
      {/* Top & bottom panels */}
      <Box p={[0, f + t / 2, 0]} s={[w, t, d]} c={wood} r={0.5} />
      <Box p={[0, f + h - t / 2, 0]} s={[w, t, d]} c={wood} r={0.5} />
      {/* Shelves */}
      {Array.from({ length: shelfCount }).map((_, i) => (
        <Box key={i} p={[0, f + t + cellH * (i + 1), 0]} s={[w - t * 2, t, d]} c={wood} r={0.5} />
      ))}

      {/* Books per shelf */}
      {Array.from({ length: shelfCount + 1 }).map((_, si) => {
        const shelfY = f + t + cellH * si + t / 2
        const books: React.ReactNode[] = []
        let bx = -w / 2 + t + 0.018
        let bi = si * 4
        while (bx < w / 2 - t - 0.02) {
          const bw = BOOK_WIDTHS[bi % BOOK_WIDTHS.length]
          const bh = cellH * (0.65 + (bi % 3) * 0.1) - t
          if (bx + bw > w / 2 - t - 0.02) break
          books.push(
            <Box key={bi}
              p={[bx + bw / 2, shelfY + bh / 2, 0]}
              s={[bw, bh, d - t - 0.01]}
              c={BOOK_COLORS[bi % BOOK_COLORS.length]} r={0.55} />
          )
          bx += bw + 0.003
          bi++
        }
        return books
      })}
    </group>
  )
}

// ─── DINING TABLE ────────────────────────────────────────────────────────────

function DiningTableGeometry({ w, d, h, color }: { w: number; d: number; h: number; color: string }) {
  const f = -h / 2
  const wood = color
  const woodDark = darker(color, 0.58)
  const legH = h - 0.055
  const legW = 0.065

  return (
    <group>
      {/* Tabletop */}
      <Box p={[0, f + h - 0.028, 0]} s={[w, 0.048, d]} c={wood} r={0.32} />
      {/* Tabletop underside lip */}
      <Box p={[0, f + h - 0.055, d / 2 - 0.003]} s={[w, 0.036, 0.008]} c={woodDark} r={0.3} />
      <Box p={[0, f + h - 0.055, -d / 2 + 0.003]} s={[w, 0.036, 0.008]} c={woodDark} r={0.3} />
      {/* Apron */}
      <Box p={[0, f + h - 0.09, 0]} s={[w - 0.15, 0.04, 0.04]} c={woodDark} r={0.45} />
      <Box p={[0, f + h - 0.09, 0]} s={[0.04, 0.04, d - 0.15]} c={woodDark} r={0.45} />

      {/* Legs (tapered) */}
      {([[-w / 2 + legW / 2 + 0.03, d / 2 - legW / 2 - 0.03],
        [w / 2 - legW / 2 - 0.03, d / 2 - legW / 2 - 0.03],
        [-w / 2 + legW / 2 + 0.03, -d / 2 + legW / 2 + 0.03],
        [w / 2 - legW / 2 - 0.03, -d / 2 + legW / 2 + 0.03]] as [number, number][])
        .map(([lx, lz], i) => (
          <mesh key={i} position={[lx, f + legH / 2, lz]} castShadow receiveShadow>
            <cylinderGeometry args={[legW * 0.42, legW * 0.28, legH, 8]} />
            <meshStandardMaterial color={woodDark} roughness={0.3} />
          </mesh>
        ))}
    </group>
  )
}

// ─── NIGHTSTAND ──────────────────────────────────────────────────────────────

function NightstandGeometry({ w, d, h, color }: { w: number; d: number; h: number; color: string }) {
  const f = -h / 2
  const wood = color
  const woodDark = darker(color, 0.6)
  const woodLight = lighter(color, 1.2)
  const metal = '#B0B0B0'
  const legH = 0.11
  const bodyH = h - legH

  return (
    <group>
      {/* Legs */}
      {([[-w / 2 + 0.03, d / 2 - 0.03], [w / 2 - 0.03, d / 2 - 0.03],
        [-w / 2 + 0.03, -d / 2 + 0.03], [w / 2 - 0.03, -d / 2 + 0.03]] as [number, number][])
        .map(([lx, lz], i) => (
          <Box key={i} p={[lx, f + legH / 2, lz]} s={[0.038, legH, 0.038]} c={woodDark} r={0.35} />
        ))}

      {/* Body sides, top, bottom, back */}
      <Box p={[-w / 2 + 0.012, f + legH + bodyH / 2, 0]} s={[0.018, bodyH, d]} c={wood} r={0.5} />
      <Box p={[w / 2 - 0.012, f + legH + bodyH / 2, 0]} s={[0.018, bodyH, d]} c={wood} r={0.5} />
      <Box p={[0, f + legH + 0.012, 0]} s={[w - 0.04, 0.018, d]} c={wood} r={0.5} />
      <Box p={[0, f + legH + bodyH - 0.01, 0]} s={[w, 0.022, d + 0.02]} c={woodDark} r={0.4} />
      <Box p={[0, f + legH + bodyH / 2, d / 2 - 0.01]} s={[w - 0.04, bodyH - 0.02, 0.014]} c={woodDark} r={0.7} />

      {/* Drawer divider */}
      <Box p={[0, f + legH + bodyH * 0.5, -d / 2 + 0.014]} s={[w - 0.04, 0.014, 0.012]} c={woodDark} r={0.5} />

      {/* Upper drawer face */}
      <Box p={[0, f + legH + bodyH * 0.73, -d / 2 + 0.015]} s={[w - 0.06, bodyH * 0.42, 0.018]} c={woodLight} r={0.38} />
      {/* Lower drawer face */}
      <Box p={[0, f + legH + bodyH * 0.26, -d / 2 + 0.015]} s={[w - 0.06, bodyH * 0.42, 0.018]} c={woodLight} r={0.38} />

      {/* Handles */}
      <Box p={[0, f + legH + bodyH * 0.73, -d / 2 + 0.029]} s={[0.065, 0.013, 0.013]} c={metal} m={0.7} r={0.25} />
      <Box p={[0, f + legH + bodyH * 0.26, -d / 2 + 0.029]} s={[0.065, 0.013, 0.013]} c={metal} m={0.7} r={0.25} />
    </group>
  )
}

// ─── Geometry dispatcher ─────────────────────────────────────────────────────

function FurnitureGeometry({ item }: { item: FurnitureItem }) {
  const { width: w, depth: d, height: h } = item.dimensions
  const c = item.color
  switch (item.type) {
    case 'bed-single':
    case 'bed-double':
    case 'bed-king':
      return <BedGeometry w={w} d={d} h={h} color={c} />
    case 'wardrobe-single':
    case 'wardrobe-double':
    case 'wardrobe-sliding':
      return <WardrobeGeometry w={w} d={d} h={h} color={c} type={item.type} />
    case 'desk':
      return <DeskGeometry w={w} d={d} h={h} color={c} />
    case 'chair':
      return <ChairGeometry w={w} d={d} h={h} color={c} />
    case 'sofa':
      return <SofaGeometry w={w} d={d} h={h} color={c} />
    case 'bookshelf':
      return <BookshelfGeometry w={w} d={d} h={h} color={c} />
    case 'dining-table':
      return <DiningTableGeometry w={w} d={d} h={h} color={c} />
    case 'nightstand':
      return <NightstandGeometry w={w} d={d} h={h} color={c} />
    default:
      return (
        <mesh castShadow receiveShadow>
          <boxGeometry args={[w, h, d]} />
          <meshStandardMaterial color={c} />
        </mesh>
      )
  }
}

// ─── Main component ───────────────────────────────────────────────────────────

interface Props {
  item: FurnitureItem
  isSelected: boolean
  onSelect: (id: string) => void
  onDragMove: (id: string, x: number, z: number) => void
  roomWidth: number
  roomLength: number
}

export default function FurnitureMesh({ item, isSelected, onSelect, onDragMove, roomWidth, roomLength }: Props) {
  const dragging = useRef(false)
  const setDragging = useRoomStore((s) => s.setDragging)
  const { width, depth, height } = item.dimensions
  const [px, py, pz] = item.position

  function handlePointerDown(e: ThreeEvent<PointerEvent>) {
    e.stopPropagation()
    onSelect(item.id)
    dragging.current = true
    setDragging(true)
    ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
  }

  function handlePointerMove(e: ThreeEvent<PointerEvent>) {
    if (!dragging.current) return
    e.stopPropagation()
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
    const point = new THREE.Vector3()
    e.ray.intersectPlane(plane, point)
    if (point) {
      const cx = Math.max(-roomWidth / 2 + width / 2, Math.min(roomWidth / 2 - width / 2, point.x))
      const cz = Math.max(-roomLength / 2 + depth / 2, Math.min(roomLength / 2 - depth / 2, point.z))
      onDragMove(item.id, cx, cz)
    }
  }

  function handlePointerUp(e: ThreeEvent<PointerEvent>) {
    dragging.current = false
    setDragging(false)
    ;(e.target as HTMLElement).releasePointerCapture?.(e.pointerId)
  }

  return (
    <group
      position={[px, py, pz]}
      rotation={[0, item.rotation, 0]}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <FurnitureGeometry item={item} />

      {isSelected && (
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(width + 0.05, height + 0.05, depth + 0.05)]} />
          <lineBasicMaterial color="#60a5fa" />
        </lineSegments>
      )}
    </group>
  )
}
