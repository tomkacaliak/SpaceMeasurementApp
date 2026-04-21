export type FloorMaterial = 'parquet' | 'tile' | 'concrete' | 'carpet'

export type FurnitureType =
  | 'bed-single'
  | 'bed-double'
  | 'bed-king'
  | 'wardrobe-single'
  | 'wardrobe-double'
  | 'wardrobe-sliding'
  | 'desk'
  | 'chair'
  | 'sofa'
  | 'bookshelf'
  | 'dining-table'
  | 'nightstand'

export type WallSide = 'north' | 'south' | 'east' | 'west'
export type OpeningType = 'door' | 'window'
export type ViewMode = 'orbit' | 'topdown' | 'firstperson'

export interface RoomConfig {
  name: string
  width: number
  length: number
  height: number
  wallColor: string
  floorMaterial: FloorMaterial
}

export interface FurnitureDimensions {
  width: number
  depth: number
  height: number
}

export interface FurnitureItem {
  id: string
  type: FurnitureType
  position: [number, number, number]
  rotation: number
  dimensions: FurnitureDimensions
  color: string
}

export interface Opening {
  id: string
  type: OpeningType
  wall: WallSide
  offsetFromLeft: number
  width: number
  height: number
}

export interface HistoryEntry {
  furniture: FurnitureItem[]
  openings: Opening[]
}

export interface RoomStore {
  roomConfig: RoomConfig | null
  furniture: FurnitureItem[]
  openings: Opening[]
  selectedItemId: string | null
  viewMode: ViewMode
  history: HistoryEntry[]
  historyIndex: number

  setRoomConfig: (config: RoomConfig) => void
  addFurniture: (item: FurnitureItem) => void
  updateFurniture: (id: string, updates: Partial<FurnitureItem>) => void
  removeFurniture: (id: string) => void
  selectItem: (id: string | null) => void
  addOpening: (opening: Opening) => void
  removeOpening: (id: string) => void
  isDragging: boolean
  setDragging: (v: boolean) => void
  setViewMode: (mode: ViewMode) => void
  undo: () => void
  redo: () => void
  pushHistory: () => void
}
