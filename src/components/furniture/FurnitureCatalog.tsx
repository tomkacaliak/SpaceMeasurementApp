import React from 'react'
import { v4 as uuid } from 'uuid'
import useRoomStore from '../../store/useRoomStore'
import { CATALOG } from './catalogData'
import type { FurnitureItem } from '../../types'

const categories = ['Beds', 'Storage', 'Office', 'Living', 'Dining']

export default function FurnitureCatalog() {
  const { addFurniture, roomConfig } = useRoomStore((s) => ({
    addFurniture: s.addFurniture,
    roomConfig: s.roomConfig,
  }))

  function place(entry: (typeof CATALOG)[0]) {
    if (!roomConfig) return
    const item: FurnitureItem = {
      id: uuid(),
      type: entry.type,
      position: [0, entry.dimensions.height / 2, 0],
      rotation: 0,
      dimensions: entry.dimensions,
      color: entry.color,
    }
    addFurniture(item)
  }

  return (
    <div className="flex flex-col gap-3 overflow-y-auto h-full pb-4">
      {categories.map((cat) => {
        const items = CATALOG.filter((c) => c.category === cat)
        return (
          <div key={cat}>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 px-1">{cat}</p>
            <div className="flex flex-col gap-1">
              {items.map((entry) => (
                <button
                  key={entry.type}
                  onClick={() => place(entry)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors text-left text-sm text-gray-200 border border-gray-700 hover:border-gray-600"
                >
                  <span
                    className="w-3 h-3 rounded-sm flex-shrink-0"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="flex-1">{entry.label}</span>
                  <span className="text-xs text-gray-500">
                    {entry.dimensions.width}×{entry.dimensions.depth}m
                  </span>
                </button>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
