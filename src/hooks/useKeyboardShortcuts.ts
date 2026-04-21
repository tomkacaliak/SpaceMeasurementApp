import { useEffect } from 'react'
import useRoomStore from '../store/useRoomStore'

export function useKeyboardShortcuts() {
  const { selectedItemId, furniture, updateFurniture, removeFurniture, undo, redo } = useRoomStore(
    (s) => ({
      selectedItemId: s.selectedItemId,
      furniture: s.furniture,
      updateFurniture: s.updateFurniture,
      removeFurniture: s.removeFurniture,
      undo: s.undo,
      redo: s.redo,
    })
  )

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedItemId) removeFurniture(selectedItemId)
      }

      if (e.key === 'r' || e.key === 'R') {
        if (selectedItemId) {
          const item = furniture.find((f) => f.id === selectedItemId)
          if (item) updateFurniture(item.id, { rotation: item.rotation + Math.PI / 2 })
        }
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault()
        undo()
      }

      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'z'))) {
        e.preventDefault()
        redo()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [selectedItemId, furniture, updateFurniture, removeFurniture, undo, redo])
}
