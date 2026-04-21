import React from 'react'
import useRoomStore from '../../store/useRoomStore'

export default function BottomBar() {
  const roomConfig = useRoomStore((s) => s.roomConfig)

  if (!roomConfig) return null

  return (
    <div className="absolute bottom-0 left-0 right-0 z-20 flex items-center justify-between px-4 py-1.5 bg-gray-900/80 backdrop-blur border-t border-gray-800 text-xs text-gray-500">
      <span>1 unit = 1 meter</span>
      <span>
        Room: {roomConfig.width}m × {roomConfig.length}m × {roomConfig.height}m
      </span>
      <span>Click furniture to select · Drag to move · R to rotate · Del to delete</span>
    </div>
  )
}
