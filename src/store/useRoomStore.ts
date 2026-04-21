import { create } from 'zustand'
import type { RoomStore, FurnitureItem, Opening, RoomConfig, ViewMode } from '../types'

const useRoomStore = create<RoomStore>((set, get) => ({
  roomConfig: null,
  furniture: [],
  openings: [],
  selectedItemId: null,
  viewMode: 'orbit',
  isDragging: false,
  history: [],
  historyIndex: -1,

  setRoomConfig: (config: RoomConfig) => set({ roomConfig: config }),
  setDragging: (v: boolean) => set({ isDragging: v }),

  pushHistory: () => {
    const { furniture, openings, history, historyIndex } = get()
    const newEntry = {
      furniture: JSON.parse(JSON.stringify(furniture)),
      openings: JSON.parse(JSON.stringify(openings)),
    }
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(newEntry)
    set({ history: newHistory, historyIndex: newHistory.length - 1 })
  },

  addFurniture: (item: FurnitureItem) => {
    get().pushHistory()
    set((state) => ({ furniture: [...state.furniture, item] }))
  },

  updateFurniture: (id: string, updates: Partial<FurnitureItem>) => {
    set((state) => ({
      furniture: state.furniture.map((f) => (f.id === id ? { ...f, ...updates } : f)),
    }))
  },

  removeFurniture: (id: string) => {
    get().pushHistory()
    set((state) => ({
      furniture: state.furniture.filter((f) => f.id !== id),
      selectedItemId: state.selectedItemId === id ? null : state.selectedItemId,
    }))
  },

  selectItem: (id: string | null) => set({ selectedItemId: id }),

  addOpening: (opening: Opening) => {
    get().pushHistory()
    set((state) => ({ openings: [...state.openings, opening] }))
  },

  removeOpening: (id: string) => {
    get().pushHistory()
    set((state) => ({ openings: state.openings.filter((o) => o.id !== id) }))
  },

  setViewMode: (mode: ViewMode) => set({ viewMode: mode }),

  undo: () => {
    const { history, historyIndex } = get()
    if (historyIndex <= 0) return
    const newIndex = historyIndex - 1
    const entry = history[newIndex]
    set({
      furniture: JSON.parse(JSON.stringify(entry.furniture)),
      openings: JSON.parse(JSON.stringify(entry.openings)),
      historyIndex: newIndex,
    })
  },

  redo: () => {
    const { history, historyIndex } = get()
    if (historyIndex >= history.length - 1) return
    const newIndex = historyIndex + 1
    const entry = history[newIndex]
    set({
      furniture: JSON.parse(JSON.stringify(entry.furniture)),
      openings: JSON.parse(JSON.stringify(entry.openings)),
      historyIndex: newIndex,
    })
  },
}))

export default useRoomStore
