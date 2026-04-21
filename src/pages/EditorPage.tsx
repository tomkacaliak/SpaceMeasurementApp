import React, { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import useRoomStore from '../store/useRoomStore'
import Room3D from '../components/room/Room3D'
import CameraController from '../components/room/CameraController'
import FurnitureCatalog from '../components/furniture/FurnitureCatalog'
import OpeningPanel from '../components/openings/OpeningPanel'
import PropertyPanel from '../components/ui/PropertyPanel'
import TopBar from '../components/ui/TopBar'
import BottomBar from '../components/ui/BottomBar'
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts'

type LeftTab = 'furniture' | 'openings'

export default function EditorPage() {
  const roomConfig = useRoomStore((s) => s.roomConfig)
  const [leftTab, setLeftTab] = useState<LeftTab>('furniture')

  useKeyboardShortcuts()

  if (!roomConfig) return <Navigate to="/" replace />

  return (
    <div className="w-screen h-screen bg-gray-950 flex flex-col overflow-hidden">
      <TopBar />

      <div className="flex flex-1 overflow-hidden pt-[44px] pb-[28px]">
        {/* Left sidebar */}
        <div className="w-56 flex-shrink-0 bg-gray-900 border-r border-gray-800 flex flex-col">
          <div className="flex border-b border-gray-800">
            {(['furniture', 'openings'] as LeftTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setLeftTab(tab)}
                className={`flex-1 py-2 text-xs font-medium capitalize transition-colors ${
                  leftTab === tab
                    ? 'text-white bg-gray-800'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-3">
            {leftTab === 'furniture' ? <FurnitureCatalog /> : <OpeningPanel />}
          </div>
        </div>

        {/* 3D Canvas */}
        <div className="flex-1 relative">
          <Canvas
            shadows
            camera={{ position: [8, 8, 8], fov: 50 }}
            gl={{ antialias: true }}
            style={{ background: '#111827' }}
          >
            <Suspense fallback={null}>
              <Room3D />
              <CameraController />
            </Suspense>
          </Canvas>
        </div>

        {/* Right sidebar */}
        <div className="w-52 flex-shrink-0 bg-gray-900 border-l border-gray-800 p-3 overflow-y-auto">
          <PropertyPanel />
        </div>
      </div>

      <BottomBar />
    </div>
  )
}
