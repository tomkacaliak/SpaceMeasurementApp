import type { FurnitureType, FurnitureDimensions } from '../../types'

export interface CatalogEntry {
  type: FurnitureType
  label: string
  dimensions: FurnitureDimensions
  color: string
  category: string
}

export const CATALOG: CatalogEntry[] = [
  // Beds
  { type: 'bed-single', label: 'Single Bed', dimensions: { width: 0.9, depth: 2.0, height: 0.5 }, color: '#8B7355', category: 'Beds' },
  { type: 'bed-double', label: 'Double Bed', dimensions: { width: 1.6, depth: 2.0, height: 0.5 }, color: '#8B7355', category: 'Beds' },
  { type: 'bed-king', label: 'King Bed', dimensions: { width: 1.8, depth: 2.0, height: 0.5 }, color: '#8B7355', category: 'Beds' },
  // Wardrobes
  { type: 'wardrobe-single', label: 'Single Wardrobe', dimensions: { width: 0.8, depth: 0.6, height: 2.0 }, color: '#A0856C', category: 'Storage' },
  { type: 'wardrobe-double', label: 'Double Wardrobe', dimensions: { width: 1.6, depth: 0.6, height: 2.0 }, color: '#A0856C', category: 'Storage' },
  { type: 'wardrobe-sliding', label: 'Sliding Wardrobe', dimensions: { width: 2.4, depth: 0.65, height: 2.1 }, color: '#B0B8C1', category: 'Storage' },
  // Desk & Chair
  { type: 'desk', label: 'Desk', dimensions: { width: 1.2, depth: 0.6, height: 0.75 }, color: '#C8A882', category: 'Office' },
  { type: 'chair', label: 'Chair', dimensions: { width: 0.5, depth: 0.5, height: 0.9 }, color: '#6B7280', category: 'Office' },
  // Living
  { type: 'sofa', label: 'Sofa', dimensions: { width: 2.2, depth: 0.9, height: 0.85 }, color: '#4B5563', category: 'Living' },
  { type: 'bookshelf', label: 'Bookshelf', dimensions: { width: 0.8, depth: 0.3, height: 1.8 }, color: '#92400E', category: 'Storage' },
  // Dining
  { type: 'dining-table', label: 'Dining Table', dimensions: { width: 1.6, depth: 0.9, height: 0.75 }, color: '#D4A574', category: 'Dining' },
  // Bedroom
  { type: 'nightstand', label: 'Nightstand', dimensions: { width: 0.5, depth: 0.4, height: 0.55 }, color: '#A0856C', category: 'Beds' },
]

export function getCatalogEntry(type: FurnitureType): CatalogEntry {
  return CATALOG.find((c) => c.type === type)!
}
