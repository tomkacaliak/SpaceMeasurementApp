import { useEffect, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import useRoomStore from '../../store/useRoomStore'

export default function CameraController() {
  const viewMode = useRoomStore((s) => s.viewMode)
  const roomConfig = useRoomStore((s) => s.roomConfig)
  const isDragging = useRoomStore((s) => s.isDragging)
  const { camera } = useThree()
  const controlsRef = useRef<any>(null)

  useEffect(() => {
    if (!roomConfig) return
    const { width, length, height } = roomConfig

    if (viewMode === 'orbit') {
      camera.position.set(width * 0.8, height * 1.5, length * 0.8)
      camera.lookAt(0, 0, 0)
      if (controlsRef.current) {
        controlsRef.current.enabled = true
        controlsRef.current.target.set(0, 0, 0)
        controlsRef.current.update()
      }
    } else if (viewMode === 'topdown') {
      camera.position.set(0, Math.max(width, length) * 1.2, 0.001)
      camera.lookAt(0, 0, 0)
      if (controlsRef.current) {
        controlsRef.current.enabled = true
        controlsRef.current.target.set(0, 0, 0)
        controlsRef.current.update()
      }
    } else if (viewMode === 'firstperson') {
      camera.position.set(0, 1.6, length / 2 - 0.5)
      camera.lookAt(0, 1.6, 0)
      if (controlsRef.current) {
        controlsRef.current.enabled = true
        controlsRef.current.target.set(0, 1.6, 0)
        controlsRef.current.update()
      }
    }
  }, [viewMode, roomConfig])

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enabled={!isDragging}
      minPolarAngle={viewMode === 'topdown' ? 0 : 0}
      maxPolarAngle={viewMode === 'topdown' ? 0.1 : Math.PI / 2}
      enablePan
      enableZoom
    />
  )
}
