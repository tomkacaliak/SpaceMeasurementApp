import React from 'react'
import { Grid } from '@react-three/drei'
import type { FloorMaterial } from '../../types'

const floorColors: Record<FloorMaterial, string> = {
  parquet: '#c8a46e',
  tile: '#b0b8c1',
  concrete: '#808080',
  carpet: '#6b5b95',
}

interface Props {
  width: number
  length: number
  material: FloorMaterial
}

export default function Floor({ width, length, material }: Props) {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[width, length]} />
        <meshStandardMaterial color={floorColors[material]} roughness={0.8} />
      </mesh>
      <Grid
        position={[0, 0.001, 0]}
        args={[width, length]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#555"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#777"
        fadeDistance={30}
        fadeStrength={1}
        infiniteGrid={false}
      />
    </group>
  )
}
