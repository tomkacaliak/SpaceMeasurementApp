You are an expert TypeScript + React developer. Build a 3D Room Planner web app.

## Tech Stack
- React + TypeScript (Vite)
- Three.js + @react-three/fiber + @react-three/drei
- Zustand (state management)
- Tailwind CSS (UI)
- shadcn/ui (components)

## App Structure

### Page 1 — Room Setup
A clean form where the user inputs:
- Room name
- Room dimensions: width (m), length (m), height (m)
- Wall color picker
- Floor material selector (parquet, tile, concrete, carpet)
- Submit button → navigates to 3D view

### Page 2 — 3D Room Editor
A full 3D interactive room using @react-three/fiber with:

**Room rendering:**
- 4 walls, floor, ceiling rendered as Box geometries
- Walls semi-transparent or with option to hide them
- Grid on floor for alignment

**Furniture system:**
- Sidebar panel with furniture catalog:
  - Bed (single 90x200, double 160x200, king 180x200)
  - Wardrobe (single door, double door, sliding)
  - Desk
  - Chair
  - Sofa
  - Bookshelf
  - Dining table
  - Nightstand
- Click furniture item → places it in the center of the room
- Each furniture piece:
  - Draggable on the floor plane (XZ axis)
  - Rotatable (R key or UI button, 90° increments)
  - Selectable (click to select, shows bounding box highlight)
  - Deletable (Delete key or UI button)
  - Has realistic proportions and simple colored geometry (no textures needed, use color-coded materials)

**Doors & Windows system:**
- Separate panel: "Add Opening"
- Select: Door or Window
- Select which wall: North, South, East, West
- Input: width (m), height (m), distance from left edge (m)
- Renders as a rectangular cutout/gap in the wall (use CSG or simply render a lighter colored rectangle on the wall surface)
- Door shows a swing arc indicator
- Window shows a light blue pane

**Camera & Controls:**
- OrbitControls for rotating/zooming
- Toggle between: Orbit view, Top-down 2D plan view, First-person walk mode
- Camera reset button

**UI Panel:**
- Left sidebar: furniture catalog
- Right sidebar: selected item properties (position X/Z, rotation, dimensions display)
- Top bar: room name, view toggle buttons, undo/redo (Ctrl+Z / Ctrl+Y)
- Bottom bar: scale reference (e.g. "1 unit = 1 meter")

## State Management (Zustand)
Store:
- roomConfig: { width, length, height, wallColor, floorMaterial }
- furniture: array of { id, type, position, rotation, dimensions, color }
- openings: array of { id, type (door/window), wall, offsetFromLeft, width, height }
- selectedItemId
- History stack for undo/redo

## Code Requirements
- Full TypeScript with proper interfaces/types
- Modular component structure:
  /src
    /components
      /room — Room3D, Wall, Floor, Ceiling
      /furniture — FurnitureItem, FurnitureCatalog, FurnitureMesh
      /openings — DoorMesh, WindowMesh, OpeningPanel
      /ui — Sidebar, TopBar, BottomBar, PropertyPanel
    /pages — SetupPage, EditorPage
    /store — useRoomStore (Zustand)
    /types — index.ts with all interfaces
    /hooks — useFurnitureDrag, useKeyboardShortcuts
- React Router for navigation between pages

## Start
Scaffold the full project. Begin with:
1. Vite + React + TypeScript setup
2. Install all dependencies
3. Implement SetupPage fully
4. Implement EditorPage with working room + furniture placement
5. Add doors/windows last

Make the UI clean, modern, dark theme preferred.