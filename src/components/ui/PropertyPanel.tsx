import React from 'react'
import useRoomStore from '../../store/useRoomStore'
import { getCatalogEntry } from '../furniture/catalogData'

export default function PropertyPanel() {
  const { furniture, selectedItemId, updateFurniture, removeFurniture } = useRoomStore((s) => ({
    furniture: s.furniture,
    selectedItemId: s.selectedItemId,
    updateFurniture: s.updateFurniture,
    removeFurniture: s.removeFurniture,
  }))

  const item = furniture.find((f) => f.id === selectedItemId)
  if (!item) {
    return (
      <div className="text-gray-500 text-xs text-center py-4">
        Click a furniture item to see properties
      </div>
    )
  }

  const entry = getCatalogEntry(item.type)

  function updatePos(axis: 'x' | 'z', val: number) {
    const pos: [number, number, number] = [...item!.position]
    if (axis === 'x') pos[0] = val
    else pos[2] = val
    updateFurniture(item!.id, { position: pos })
  }

  function rotate() {
    updateFurniture(item!.id, { rotation: item!.rotation + Math.PI / 2 })
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Properties</p>
        <button
          onClick={() => removeFurniture(item.id)}
          className="text-red-400 hover:text-red-300 text-xs bg-red-900/20 border border-red-900 px-2 py-0.5 rounded"
        >
          Delete
        </button>
      </div>

      <div className="bg-gray-800 rounded-lg p-3">
        <p className="text-sm font-medium text-white mb-1">{entry.label}</p>
        <p className="text-xs text-gray-400">
          {item.dimensions.width}m × {item.dimensions.depth}m × {item.dimensions.height}m
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-gray-400">Position X (m)</label>
          <input
            type="number"
            step="0.1"
            value={Math.round(item.position[0] * 100) / 100}
            onChange={(e) => updatePos('x', parseFloat(e.target.value) || 0)}
            className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="text-xs text-gray-400">Position Z (m)</label>
          <input
            type="number"
            step="0.1"
            value={Math.round(item.position[2] * 100) / 100}
            onChange={(e) => updatePos('z', parseFloat(e.target.value) || 0)}
            className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="text-xs text-gray-400">Rotation</label>
        <p className="text-sm text-gray-200">{Math.round((item.rotation * 180) / Math.PI) % 360}°</p>
      </div>

      <button
        onClick={rotate}
        className="bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium py-2 rounded-lg transition-colors"
      >
        ↻ Rotate 90°
      </button>

      <div className="flex items-center gap-2">
        <label className="text-xs text-gray-400">Color</label>
        <input
          type="color"
          value={item.color}
          onChange={(e) => updateFurniture(item.id, { color: e.target.value })}
          className="w-8 h-8 rounded cursor-pointer bg-transparent border-0"
        />
      </div>
    </div>
  )
}
