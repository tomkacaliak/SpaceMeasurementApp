import React, { useState } from 'react'
import { v4 as uuid } from 'uuid'
import useRoomStore from '../../store/useRoomStore'
import type { Opening, OpeningType, WallSide } from '../../types'

const wallOptions: { value: WallSide; label: string }[] = [
  { value: 'north', label: 'North' },
  { value: 'south', label: 'South' },
  { value: 'east', label: 'East' },
  { value: 'west', label: 'West' },
]

export default function OpeningPanel() {
  const { addOpening, openings, removeOpening } = useRoomStore((s) => ({
    addOpening: s.addOpening,
    openings: s.openings,
    removeOpening: s.removeOpening,
  }))

  const [type, setType] = useState<OpeningType>('door')
  const [wall, setWall] = useState<WallSide>('north')
  const [width, setWidth] = useState(0.9)
  const [height, setHeight] = useState(2.1)
  const [offset, setOffset] = useState(1.0)

  function handleAdd() {
    const opening: Opening = {
      id: uuid(),
      type,
      wall,
      offsetFromLeft: offset,
      width,
      height,
    }
    addOpening(opening)
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Add Opening</p>

      <div className="flex gap-2">
        {(['door', 'window'] as OpeningType[]).map((t) => (
          <button
            key={t}
            onClick={() => setType(t)}
            className={`flex-1 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors border ${
              type === t
                ? 'border-blue-500 bg-blue-500/20 text-blue-300'
                : 'border-gray-600 bg-gray-800 text-gray-300 hover:border-gray-500'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {wallOptions.map((w) => (
          <button
            key={w.value}
            onClick={() => setWall(w.value)}
            className={`py-1 rounded-lg text-xs font-medium transition-colors border ${
              wall === w.value
                ? 'border-blue-500 bg-blue-500/20 text-blue-300'
                : 'border-gray-600 bg-gray-800 text-gray-400 hover:border-gray-500'
            }`}
          >
            {w.label}
          </button>
        ))}
      </div>

      {[
        { label: 'Width (m)', value: width, set: setWidth },
        { label: 'Height (m)', value: height, set: setHeight },
        { label: 'Offset from left (m)', value: offset, set: setOffset },
      ].map(({ label, value, set }) => (
        <div key={label} className="flex flex-col gap-0.5">
          <label className="text-xs text-gray-400">{label}</label>
          <input
            type="number"
            step="0.1"
            min="0"
            value={value}
            onChange={(e) => set(parseFloat(e.target.value) || 0)}
            className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-blue-500"
          />
        </div>
      ))}

      <button
        onClick={handleAdd}
        className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium py-2 rounded-lg transition-colors"
      >
        Add {type}
      </button>

      {openings.length > 0 && (
        <div className="mt-2 flex flex-col gap-1">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Placed</p>
          {openings.map((o) => (
            <div key={o.id} className="flex items-center justify-between bg-gray-800 rounded-lg px-2 py-1">
              <span className="text-xs text-gray-300 capitalize">
                {o.type} · {o.wall}
              </span>
              <button
                onClick={() => removeOpening(o.id)}
                className="text-red-400 hover:text-red-300 text-xs"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
