import React from 'react'
import Floor from './Floor'
import Wall from './Wall'
import Ceiling from './Ceiling'
import FurnitureMesh from '../furniture/FurnitureMesh'
import useRoomStore from '../../store/useRoomStore'

export default function Room3D() {
  const { roomConfig, furniture, openings, selectedItemId, selectItem, updateFurniture } =
    useRoomStore((s) => ({
      roomConfig: s.roomConfig,
      furniture: s.furniture,
      openings: s.openings,
      selectedItemId: s.selectedItemId,
      selectItem: s.selectItem,
      updateFurniture: s.updateFurniture,
    }))

  if (!roomConfig) return null

  const { width, length, height, wallColor, floorMaterial } = roomConfig

  function handleDragMove(id: string, x: number, z: number) {
    const item = furniture.find((f) => f.id === id)
    if (!item) return
    updateFurniture(id, { position: [x, item.position[1], z] })
  }

  return (
    <group>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
      <pointLight position={[0, height - 0.3, 0]} intensity={0.8} />

      <Floor width={width} length={length} material={floorMaterial} />
      <Ceiling width={width} length={length} height={height} />

      {(['north', 'south', 'east', 'west'] as const).map((side) => (
        <Wall
          key={side}
          side={side}
          roomWidth={width}
          roomLength={length}
          roomHeight={height}
          wallColor={wallColor}
          openings={openings}
        />
      ))}

      {furniture.map((item) => (
        <FurnitureMesh
          key={item.id}
          item={item}
          isSelected={selectedItemId === item.id}
          onSelect={selectItem}
          onDragMove={handleDragMove}
          roomWidth={width}
          roomLength={length}
        />
      ))}

      {/* Deselect on floor click */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.01, 0]}
        onPointerDown={() => selectItem(null)}
      >
        <planeGeometry args={[width, length]} />
        <meshStandardMaterial visible={false} />
      </mesh>
    </group>
  )
}
