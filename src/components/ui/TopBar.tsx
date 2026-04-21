import React from 'react'
import { useNavigate } from 'react-router-dom'
import useRoomStore from '../../store/useRoomStore'
import type { ViewMode } from '../../types'

const viewModes: { mode: ViewMode; label: string }[] = [
  { mode: 'orbit', label: '3D Orbit' },
  { mode: 'topdown', label: 'Top View' },
  { mode: 'firstperson', label: 'First Person' },
]

export default function TopBar() {
  const navigate = useNavigate()
  const { roomConfig, viewMode, setViewMode, undo, redo, historyIndex, history } = useRoomStore(
    (s) => ({
      roomConfig: s.roomConfig,
      viewMode: s.viewMode,
      setViewMode: s.setViewMode,
      undo: s.undo,
      redo: s.redo,
      historyIndex: s.historyIndex,
      history: s.history,
    })
  )

  return (
    <div className="absolute top-0 left-0 right-0 z-20 flex items-center gap-3 px-4 py-2 bg-gray-900/90 backdrop-blur border-b border-gray-800">
      <button
        onClick={() => navigate('/')}
        className="text-gray-400 hover:text-white text-sm transition-colors"
      >
        ← Back
      </button>

      <span className="text-white font-semibold truncate max-w-[160px]">
        {roomConfig?.name ?? 'Room'}
      </span>

      <div className="flex-1" />

      <div className="flex items-center gap-1 bg-gray-800 rounded-lg p-1">
        {viewModes.map(({ mode, label }) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              viewMode === mode
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={undo}
          disabled={historyIndex <= 0}
          className="px-2 py-1 text-xs text-gray-400 hover:text-white disabled:opacity-30 bg-gray-800 rounded"
          title="Undo (Ctrl+Z)"
        >
          ↩ Undo
        </button>
        <button
          onClick={redo}
          disabled={historyIndex >= history.length - 1}
          className="px-2 py-1 text-xs text-gray-400 hover:text-white disabled:opacity-30 bg-gray-800 rounded"
          title="Redo (Ctrl+Y)"
        >
          ↪ Redo
        </button>
      </div>
    </div>
  )
}
