import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useRoomStore from '../store/useRoomStore'
import type { FloorMaterial, RoomConfig } from '../types'

const floorMaterials: { value: FloorMaterial; label: string }[] = [
  { value: 'parquet', label: 'Parquet Wood' },
  { value: 'tile', label: 'Tile' },
  { value: 'concrete', label: 'Concrete' },
  { value: 'carpet', label: 'Carpet' },
]

export default function SetupPage() {
  const navigate = useNavigate()
  const setRoomConfig = useRoomStore((s) => s.setRoomConfig)

  const [form, setForm] = useState<RoomConfig>({
    name: 'My Room',
    width: 5,
    length: 6,
    height: 2.8,
    wallColor: '#d4c5b0',
    floorMaterial: 'parquet',
  })

  const [errors, setErrors] = useState<Partial<Record<keyof RoomConfig, string>>>({})

  function validate(): boolean {
    const e: Partial<Record<keyof RoomConfig, string>> = {}
    if (!form.name.trim()) e.name = 'Room name is required'
    if (form.width <= 0 || form.width > 50) e.width = 'Width must be 0–50 m'
    if (form.length <= 0 || form.length > 50) e.length = 'Length must be 0–50 m'
    if (form.height <= 0 || form.height > 10) e.height = 'Height must be 0–10 m'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setRoomConfig(form)
    navigate('/editor')
  }

  function field(label: string, key: keyof RoomConfig, type = 'text', step?: string) {
    return (
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-300">{label}</label>
        <input
          type={type}
          step={step}
          value={form[key] as string | number}
          onChange={(e) =>
            setForm((f) => ({
              ...f,
              [key]: type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value,
            }))
          }
          className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
        />
        {errors[key] && <span className="text-red-400 text-xs">{errors[key]}</span>}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">3D Room Planner</h1>
          <p className="text-gray-400">Set up your room dimensions and style</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-gray-900 rounded-2xl p-8 border border-gray-800 shadow-2xl flex flex-col gap-5"
        >
          {field('Room Name', 'name')}

          <div className="grid grid-cols-3 gap-4">
            {field('Width (m)', 'width', 'number', '0.1')}
            {field('Length (m)', 'length', 'number', '0.1')}
            {field('Height (m)', 'height', 'number', '0.1')}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-300">Wall Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={form.wallColor}
                onChange={(e) => setForm((f) => ({ ...f, wallColor: e.target.value }))}
                className="w-12 h-10 rounded cursor-pointer bg-transparent border-0"
              />
              <span className="text-gray-400 text-sm">{form.wallColor}</span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-300">Floor Material</label>
            <div className="grid grid-cols-2 gap-2">
              {floorMaterials.map((m) => (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, floorMaterial: m.value }))}
                  className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                    form.floorMaterial === m.value
                      ? 'border-blue-500 bg-blue-500/20 text-blue-300'
                      : 'border-gray-600 bg-gray-800 text-gray-300 hover:border-gray-500'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="mt-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl transition-colors shadow-lg"
          >
            Create Room →
          </button>
        </form>
      </div>
    </div>
  )
}
