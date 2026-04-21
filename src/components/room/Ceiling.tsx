import React from 'react'

interface Props {
  width: number
  length: number
  height: number
}

export default function Ceiling({ width, length, height }: Props) {
  return (
    <mesh position={[0, height, 0]} rotation={[Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[width, length]} />
      <meshStandardMaterial color="#e8e0d8" transparent opacity={0.15} side={2} />
    </mesh>
  )
}
