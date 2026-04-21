# 3D Room Planner

A browser-based 3D room planning app built with React, Three.js and TypeScript. Design and furnish rooms interactively in a real-time 3D environment.

## Features

### Room Setup
- Set room name, width, length and height (in meters)
- Choose wall color via color picker
- Choose floor material: Parquet, Tile, Concrete or Carpet

### 3D Editor
- Interactive 3D room rendered with Three.js (`@react-three/fiber`)
- Orbit, top-down (2D plan) and first-person camera modes
- Grid overlay on the floor for alignment

### Furniture
- Catalog with 12 furniture types across 4 categories:
  - **Beds** — Single, Double, King, Nightstand
  - **Storage** — Single/Double/Sliding Wardrobe, Bookshelf
  - **Office** — Desk, Chair
  - **Living/Dining** — Sofa, Dining Table
- Click to place furniture in the center of the room
- Drag furniture on the floor plane (XZ axis)
- Rotate 90° with `R` key or UI button
- Delete with `Delete` key or UI button
- Click to select — shows properties in the right panel

### Doors & Windows
- Add openings to any wall (North / South / East / West)
- Configure width, height and offset from the left edge
- Doors display a swing arc indicator
- Windows display a light blue pane

### UI
- Left sidebar: Furniture catalog + Openings panel
- Right sidebar: Selected item properties (position, rotation, dimensions)
- Top bar: Room name, camera view toggle, undo/redo buttons
- Bottom bar: Scale reference (1 unit = 1 meter)
- Keyboard shortcuts: `R` rotate, `Delete` remove, `Ctrl+Z` undo, `Ctrl+Y` redo

## Tech Stack

| Layer | Library |
|---|---|
| UI framework | React 18 + TypeScript |
| Build tool | Vite |
| 3D rendering | Three.js + @react-three/fiber + @react-three/drei |
| State management | Zustand |
| Styling | Tailwind CSS |
| Routing | React Router v6 |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
src/
├── components/
│   ├── furniture/   # FurnitureCatalog, FurnitureMesh, catalogData
│   ├── openings/    # OpeningPanel, door/window rendering
│   ├── room/        # Room3D, Wall, Floor, Ceiling, CameraController
│   └── ui/          # TopBar, BottomBar, PropertyPanel
├── hooks/           # useKeyboardShortcuts
├── pages/           # SetupPage, EditorPage
├── store/           # useRoomStore (Zustand)
└── types/           # Shared TypeScript interfaces
```
