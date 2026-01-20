# Mold Generator Feature - Implementation Plan

## Overview

Add a "Mold Generator" tool that creates two-part molds from uploaded STL files. Supports both standard casting molds and forged carbon compression molds (piston + bucket).

**Approach:** Minimal changes with maximum reuse of existing infrastructure. Deterministic OpenSCAD templates (no AI involvement in geometry generation).

---

## Requirements Summary

| Requirement       | Decision                                              |
| ----------------- | ----------------------------------------------------- |
| **Access**        | Sidebar "Tools" section with "Mold Generator" entry   |
| **Output**        | Creates new "Creation" entry (appears in sidebar)     |
| **STL Source**    | Upload new OR select from existing creations          |
| **Parting Plane** | Choose axis (X, Y, or Z split)                        |
| **Dimensions**    | Auto-calculate from bounding box with manual override |
| **Result View**   | Side-by-side in 3D viewer (original + mold halves)    |

---

## Mold Types

### Standard Casting Mold

- Two halves that fit together along a parting line
- **Pour hole** for injecting liquid material (resin, gelatin, etc.)
- Registration keys (spheres) with fettle (tolerance) for alignment
- Material flows in, cures, then demolded

```
┌─────────────────┐  ┌─────────────────┐
│    TOP HALF     │  │   BOTTOM HALF   │
│  ┌───────────┐  │  │  ┌───────────┐  │
│  │  cavity   │  │  │  │  cavity   │  │
│  │  (part)   │  │  │  │  (part)   │  │
│  └───────────┘  │  │  └───────────┘  │
│ ●             ○ │  │ ○             ● │  ← Keys (● pos, ○ neg)
│      ╱╲         │  │                 │
│     pour hole   │  │                 │
└─────────────────┘  └─────────────────┘
```

### Forged Carbon Mold (Piston + Bucket)

- **Bucket**: Bottom mold with cavity for the part
- **Piston**: Top mold that fits INSIDE the bucket
- **No pour hole** - carbon fiber + resin is pre-loaded
- Piston compresses down, squishing the fibers
- Needs clearance tolerance for piston-bucket interface

```
     PISTON                    BUCKET
  ┌─────────┐              ┌───────────┐
  │ ╔═════╗ │              │           │
  │ ║part ║ │   fits into  │ ┌───────┐ │
  │ ║cavity║│ ──────────►  │ │       │ │
  │ ╚═════╝ │              │ │cavity │ │
  └─────────┘              │ │+part  │ │
                           │ └───────┘ │
                           └───────────┘
```

---

## UI Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  SIDEBAR                │  MOLD GENERATOR VIEW                  │
│  ───────                │  ──────────────────                   │
│  adam                   │  ┌─────────────────┬─────────────────┐│
│                         │  │  CONFIG PANEL   │  DUAL VIEWER    ││
│  + New Creation         │  │                 │                 ││
│                         │  │  STL Source:    │  ┌───┐  ┌───┐   ││
│  📁 Creations           │  │  [Upload][Pick] │  │ O │  │ M │   ││
│    └─ ...               │  │                 │  │ r │  │ o │   ││
│                         │  │  Mold Type:     │  │ i │  │ l │   ││
│  🧊 Tools               │  │  ○ Standard     │  │ g │  │ d │   ││
│    └─ Mold Generator    │  │  ● Forged Carbon│  └───┘  └───┘   ││
│                         │  │                 │                 ││
│  GitHub                 │  │  Split Axis:    │  Original  Mold ││
│  God Mode               │  │  [X] [Y] [Z]    │                 ││
│                         │  │                 │                 ││
│                         │  │  [Generate]     │                 ││
│                         │  └─────────────────┴─────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

---

## Files to Create

### 1. `src/types/mold.ts` (~50 lines)

Type definitions for mold configuration.

```typescript
export type MoldType = 'standard' | 'forged-carbon';
export type MoldShape = 'rectangular' | 'circular';
export type SplitAxis = 'x' | 'y' | 'z';

export interface MoldConfig {
  type: MoldType;
  shape: MoldShape;
  splitAxis: SplitAxis;
  wallThickness: number; // mm
  keySize: number; // mm (sphere radius)
  keyFettle: number; // mm (tolerance on negative keys)
  // Standard mold only
  pourHoleDiameter?: number; // mm
  // Forged carbon only
  pistonClearance?: number; // mm (gap between piston and bucket)
  // Dimensions (auto-calculated or manual override)
  dimensions: {
    width: number;
    depth: number;
    height: number;
    autoCalculated: boolean;
  };
}

export interface MoldGeneratorState {
  stlSource: STLSource | null;
  boundingBox: BoundingBox | null;
  config: MoldConfig;
  generatedCode: string | null;
  compiledBlob: Blob | null;
  isCompiling: boolean;
  error: string | null;
}

export type STLSource =
  | { type: 'upload'; file: File; filename: string }
  | {
      type: 'creation';
      conversationId: string;
      meshId: string;
      filename: string;
    };

export interface BoundingBox {
  x: number;
  y: number;
  z: number;
}
```

### 2. `src/utils/moldTemplates.ts` (~400 lines)

Deterministic OpenSCAD code generation for all mold variants.

**Functions:**

- `generateMoldCode(config, boundingBox, meshFilename): string` - Main entry point
- `generateStandardRectangularMold(...)` - Standard casting, rectangular shape
- `generateStandardCircularMold(...)` - Standard casting, circular shape
- `generateForgedCarbonRectangularMold(...)` - Piston + bucket, rectangular
- `generateForgedCarbonCircularMold(...)` - Piston + bucket, circular
- `calculateMoldDimensions(boundingBox, config): Dimensions` - Auto-calculate from bbox
- `generateKeyPositions(dimensions, keySize, margin): Position[]` - Registration key placement
- `rotateMeshForSplitAxis(axis): string` - OpenSCAD rotation for split axis

**Template Structure:**

```openscad
include <BOSL2/std.scad>

// === PARAMETERS ===
wall_thickness = ${config.wallThickness};
key_size = ${config.keySize};
key_fettle = ${config.keyFettle};
// ... etc

// === IMPORTED MESH ===
module original_part() {
  ${axisRotation}
  import("${meshFilename}", convexity=10);
}

// === MOLD HALVES ===
module bottom_half() {
  difference() {
    // Outer shell
    // Part cavity (upper half)
    // Key holes (negative)
  }
  // Keys (positive)
}

module top_half() {
  difference() {
    // Outer shell
    // Part cavity (lower half)
    // Key holes (negative)
    // Pour hole (standard only)
  }
  // Keys (positive)
}

// === OUTPUT (side by side) ===
bottom_half();
translate([${spacing}, 0, 0]) rotate([180, 0, 0]) top_half();
```

### 3. `src/components/mold/STLSourcePicker.tsx` (~200 lines)

Component for selecting STL source (upload or pick from creations).

**Props:**

```typescript
interface STLSourcePickerProps {
  value: STLSource | null;
  onChange: (source: STLSource, boundingBox: BoundingBox) => void;
  disabled?: boolean;
}
```

**Features:**

- Tabs: "Upload" | "My Creations"
- Upload tab: Drag-and-drop zone, file picker
- Creations tab: Grid of recent creations with STL files
- Parses STL and extracts bounding box on selection
- Shows selected file name and dimensions

**Dependencies:**

- Reuse `parseSTL()` from `src/utils/meshUtils.ts`
- Reuse `isValidSTL()` from `src/utils/meshUtils.ts`
- Query conversations with mesh attachments

### 4. `src/components/mold/MoldConfigPanel.tsx` (~250 lines)

Form component for configuring mold parameters.

**Props:**

```typescript
interface MoldConfigPanelProps {
  config: MoldConfig;
  onChange: (config: MoldConfig) => void;
  boundingBox: BoundingBox | null;
  disabled?: boolean;
}
```

**Form Sections:**

1. **Mold Type** (radio group)
   - Standard Casting
   - Forged Carbon (Piston + Bucket)

2. **Shape** (radio group)
   - Rectangular
   - Circular

3. **Split Axis** (toggle group)
   - X (vertical, side split)
   - Y (vertical, front/back split)
   - Z (horizontal split) - default

4. **Dimensions** (with auto-calculate)
   - Wall Thickness: slider 2-15mm, default 5mm
   - Auto-calculated dimensions display (from bbox + wall)
   - Manual override toggle + inputs

5. **Registration Keys**
   - Key Size: slider 2-8mm, default 3mm
   - Key Tolerance: slider 0.2-1.0mm, default 0.4mm

6. **Type-Specific Options**
   - Standard: Pour Hole Diameter (5-20mm, default 10mm)
   - Forged Carbon: Piston Clearance (0.2-1.0mm, default 0.4mm)

### 5. `src/views/MoldGeneratorView.tsx` (~300 lines)

Main view orchestrating the mold generation workflow.

**State:**

```typescript
const [stlSource, setStlSource] = useState<STLSource | null>(null);
const [boundingBox, setBoundingBox] = useState<BoundingBox | null>(null);
const [config, setConfig] = useState<MoldConfig>(DEFAULT_MOLD_CONFIG);
const [generatedCode, setGeneratedCode] = useState<string | null>(null);

const { compileScad, writeFile, output, isCompiling, error } = useOpenSCAD();
```

**Layout:**

```tsx
<div className="flex h-full">
  {/* Left Panel - Config */}
  <div className="w-80 overflow-y-auto border-r p-4">
    <h1>Mold Generator</h1>
    <STLSourcePicker value={stlSource} onChange={handleSTLSelect} />
    <MoldConfigPanel
      config={config}
      onChange={setConfig}
      boundingBox={boundingBox}
    />
    <Button onClick={handleGenerate} disabled={!stlSource || isCompiling}>
      {isCompiling ? 'Generating...' : 'Generate Mold'}
    </Button>
    <Button onClick={handleSaveAsCreation} disabled={!output}>
      Save as Creation
    </Button>
  </div>

  {/* Right Panel - Viewer */}
  <div className="grid flex-1 grid-cols-2 gap-4 p-4">
    <div>
      <h3>Original Model</h3>
      <ThreeScene geometry={originalGeometry} />
    </div>
    <div>
      <h3>Generated Mold</h3>
      <OpenSCADViewer output={output} error={error} />
    </div>
  </div>
</div>
```

**Key Functions:**

```typescript
// Handle STL selection (upload or from creation)
const handleSTLSelect = async (source: STLSource, bbox: BoundingBox) => {
  setStlSource(source);
  setBoundingBox(bbox);
  // Auto-update config dimensions
  setConfig((prev) => ({
    ...prev,
    dimensions: {
      ...calculateMoldDimensions(bbox, prev),
      autoCalculated: true,
    },
  }));
};

// Generate mold
const handleGenerate = async () => {
  // 1. Write STL to OpenSCAD worker filesystem
  const stlData = await getSTLData(stlSource);
  await writeFile('/input.stl', stlData);

  // 2. Generate OpenSCAD code from template
  const code = generateMoldCode(config, boundingBox, '/input.stl');
  setGeneratedCode(code);

  // 3. Compile
  await compileScad(code);
};

// Save as creation
const handleSaveAsCreation = async () => {
  // 1. Create conversation
  const { data: conversation } = await supabase
    .from('conversations')
    .insert({ user_id: user.id, title: `Mold: ${stlSource.filename}` })
    .select()
    .single();

  // 2. Create user message (config summary)
  await supabase.from('messages').insert({
    conversation_id: conversation.id,
    role: 'user',
    content: { text: formatConfigSummary(config, stlSource) },
  });

  // 3. Create assistant message (mold artifact)
  await supabase.from('messages').insert({
    conversation_id: conversation.id,
    role: 'assistant',
    content: {
      text: 'Generated two-part mold.',
      artifact: {
        title: `Mold for ${stlSource.filename}`,
        code: generatedCode,
        parameters: extractParameters(generatedCode),
      },
    },
  });

  // 4. Navigate to editor
  navigate(`/editor/${conversation.id}`);
};
```

---

## Files to Modify

### 1. `src/main.tsx`

Add route for mold generator.

```typescript
// Add import
import { MoldGeneratorView } from '@/views/MoldGeneratorView';

// Add route (after /history, before catch-all)
{
  path: '/mold-generator',
  element: <MoldGeneratorView />,
  errorElement: <ErrorView />,
},
```

### 2. `src/components/Sidebar.tsx`

Add "Tools" section with Mold Generator entry.

```typescript
// Add import
import { Box, Wrench } from 'lucide-react';

// Modify nav array (line ~165) to add Tools section
{[
  {
    icon: LayoutGrid,
    label: 'Creations',
    href: '/history',
    description: 'View past creations',
    submenu: recentConversations,
  },
  {
    icon: Wrench,
    label: 'Tools',
    description: 'Generation tools',
    submenu: [
      { id: 'mold-generator', title: 'Mold Generator', href: '/mold-generator' }
    ],
  },
].map(...)}
```

**Alternative:** Add Tools as a separate section below Creations with its own styling.

---

## Data Flow

```
1. User clicks "Mold Generator" in sidebar
   └─► navigate('/mold-generator')

2. MoldGeneratorView renders
   └─► Shows STLSourcePicker + MoldConfigPanel + empty viewer

3. User uploads STL (or picks from creations)
   └─► parseSTL() extracts geometry + bounding box
   └─► setBoundingBox() triggers dimension auto-calculation
   └─► Original model appears in left viewer

4. User configures parameters
   └─► MoldConfigPanel updates config state
   └─► Can override auto-calculated dimensions

5. User clicks "Generate"
   └─► writeFile() writes STL to WASM filesystem
   └─► generateMoldCode() creates OpenSCAD code
   └─► compileScad() compiles to STL blob
   └─► Mold appears in right viewer (side-by-side halves)

6. User clicks "Save as Creation"
   └─► Creates conversation record
   └─► Creates user message (config summary)
   └─► Creates assistant message (OpenSCAD artifact)
   └─► navigate(`/editor/${id}`)
   └─► Creation appears in sidebar
```

---

## Build Sequence

### Phase 1: Core Types & Templates

- [ ] Create `src/types/mold.ts`
- [ ] Create `src/utils/moldTemplates.ts`
  - [ ] `calculateMoldDimensions()`
  - [ ] `generateKeyPositions()`
  - [ ] `generateStandardRectangularMold()`
  - [ ] `generateStandardCircularMold()`
  - [ ] `generateForgedCarbonRectangularMold()`
  - [ ] `generateForgedCarbonCircularMold()`
  - [ ] `generateMoldCode()` (main entry point)

### Phase 2: UI Components

- [ ] Create `src/components/mold/STLSourcePicker.tsx`
  - [ ] Upload tab with drag-and-drop
  - [ ] Creations tab with grid
  - [ ] STL parsing and bbox extraction
- [ ] Create `src/components/mold/MoldConfigPanel.tsx`
  - [ ] Mold type selector
  - [ ] Shape selector
  - [ ] Split axis selector
  - [ ] Dimension inputs with auto-calculate
  - [ ] Key parameters
  - [ ] Type-specific options

### Phase 3: Main View

- [ ] Create `src/views/MoldGeneratorView.tsx`
  - [ ] State management
  - [ ] STL source handling
  - [ ] OpenSCAD compilation integration
  - [ ] Dual viewer layout
  - [ ] Save as creation flow

### Phase 4: Integration

- [ ] Modify `src/main.tsx` - add route
- [ ] Modify `src/components/Sidebar.tsx` - add Tools section

### Phase 5: Testing & Polish

- [ ] Test with various STL files
- [ ] Test all mold type/shape/axis combinations
- [ ] Add loading states
- [ ] Add error handling
- [ ] Test save as creation flow

---

## OpenSCAD Template Reference

### Standard Rectangular Mold Template

```openscad
include <BOSL2/std.scad>

// === PARAMETERS ===
wall_thickness = 5;
key_size = 3;
key_fettle = 0.4;
key_margin = 7;
pour_hole_d1 = 10;
pour_hole_d2 = 5;
pour_hole_height = 20;
mold_width = 60;
mold_depth = 60;
mold_height = 40;
spacing = 10;

// === IMPORTED MESH ===
module original_part() {
  // Centered at origin, split plane at Z=0
  import("/input.stl", convexity=10);
}

// === BOTTOM HALF ===
module bottom_half() {
  difference() {
    // Outer shell (bottom half only)
    translate([0, 0, -mold_height/2])
      cuboid([mold_width, mold_depth, mold_height/2], anchor=BOTTOM);

    // Part cavity (bottom half)
    original_part();

    // Key holes (negative) - diagonal corners
    translate([-mold_width/2 + key_margin, -mold_depth/2 + key_margin, 0])
      sphere(r=key_size + key_fettle, $fn=30);
    translate([mold_width/2 - key_margin, mold_depth/2 - key_margin, 0])
      sphere(r=key_size + key_fettle, $fn=30);
  }

  // Keys (positive) - opposite diagonal
  translate([-mold_width/2 + key_margin, mold_depth/2 - key_margin, 0])
    sphere(r=key_size, $fn=30);
  translate([mold_width/2 - key_margin, -mold_depth/2 + key_margin, 0])
    sphere(r=key_size, $fn=30);
}

// === TOP HALF ===
module top_half() {
  difference() {
    // Outer shell (top half only)
    cuboid([mold_width, mold_depth, mold_height/2], anchor=BOTTOM);

    // Part cavity (top half)
    original_part();

    // Key holes (negative) - opposite diagonal from bottom's positives
    translate([-mold_width/2 + key_margin, mold_depth/2 - key_margin, 0])
      sphere(r=key_size + key_fettle, $fn=30);
    translate([mold_width/2 - key_margin, -mold_depth/2 + key_margin, 0])
      sphere(r=key_size + key_fettle, $fn=30);

    // Pour hole
    translate([0, 0, mold_height/4])
      cyl(h=pour_hole_height, d1=pour_hole_d1, d2=pour_hole_d2, anchor=BOTTOM, $fn=32);
  }

  // Keys (positive) - same diagonal as bottom's negatives
  translate([-mold_width/2 + key_margin, -mold_depth/2 + key_margin, 0])
    sphere(r=key_size, $fn=30);
  translate([mold_width/2 - key_margin, mold_depth/2 - key_margin, 0])
    sphere(r=key_size, $fn=30);
}

// === OUTPUT ===
bottom_half();
translate([mold_width + spacing, 0, mold_height/2])
  rotate([180, 0, 0])
    top_half();
```

### Forged Carbon Rectangular Mold Template

```openscad
include <BOSL2/std.scad>

// === PARAMETERS ===
wall_thickness = 5;
piston_clearance = 0.4;
key_size = 3;
key_fettle = 0.4;
key_margin = 7;
mold_width = 60;
mold_depth = 60;
mold_height = 40;
spacing = 10;

// Bucket inner dimensions (part + clearance for piston)
bucket_inner_w = mold_width - wall_thickness * 2;
bucket_inner_d = mold_depth - wall_thickness * 2;

// Piston outer dimensions (fits inside bucket)
piston_outer_w = bucket_inner_w - piston_clearance * 2;
piston_outer_d = bucket_inner_d - piston_clearance * 2;

// === IMPORTED MESH ===
module original_part() {
  import("/input.stl", convexity=10);
}

// === BUCKET (Bottom) ===
module bucket() {
  difference() {
    // Outer shell
    cuboid([mold_width, mold_depth, mold_height], anchor=BOTTOM);

    // Inner cavity (for piston to enter)
    translate([0, 0, wall_thickness])
      cuboid([bucket_inner_w, bucket_inner_d, mold_height], anchor=BOTTOM);

    // Part cavity at bottom
    translate([0, 0, wall_thickness])
      original_part();
  }

  // Registration keys on outer walls
  translate([mold_width/2, 0, mold_height/2])
    rotate([0, 90, 0])
      cyl(h=key_size, d=key_size*2, anchor=BOTTOM, $fn=30);
  translate([-mold_width/2, 0, mold_height/2])
    rotate([0, -90, 0])
      cyl(h=key_size, d=key_size*2, anchor=BOTTOM, $fn=30);
}

// === PISTON (Top) ===
module piston() {
  piston_height = mold_height - wall_thickness;

  difference() {
    // Piston body (fits inside bucket)
    cuboid([piston_outer_w, piston_outer_d, piston_height], anchor=BOTTOM);

    // Part cavity (inverted)
    translate([0, 0, 0])
      original_part();

    // Key slots
    translate([piston_outer_w/2 + piston_clearance, 0, piston_height/2])
      rotate([0, 90, 0])
        cyl(h=key_size + key_fettle, d=key_size*2 + key_fettle*2, anchor=BOTTOM, $fn=30);
    translate([-piston_outer_w/2 - piston_clearance, 0, piston_height/2])
      rotate([0, -90, 0])
        cyl(h=key_size + key_fettle, d=key_size*2 + key_fettle*2, anchor=BOTTOM, $fn=30);
  }

  // Handle/grip on top
  translate([0, 0, piston_height])
    cuboid([piston_outer_w * 0.6, piston_outer_d * 0.6, wall_thickness], anchor=BOTTOM);
}

// === OUTPUT ===
bucket();
translate([mold_width + spacing, 0, 0])
  piston();
```

---

## Error Handling

| Error                      | Handling                                                    |
| -------------------------- | ----------------------------------------------------------- |
| Invalid STL format         | Toast: "Invalid STL file. Please upload a valid .stl file." |
| STL too large              | Toast: "File too large. Maximum size is 50MB."              |
| OpenSCAD compilation error | Show error in viewer, allow config adjustment               |
| Supabase storage error     | Toast with retry option                                     |
| Save as creation failure   | Toast with retry option                                     |

---

## Future Enhancements (Out of Scope)

- [ ] Parting line preview/visualization
- [ ] Vent holes for air escape
- [ ] Multiple pour holes
- [ ] Custom key shapes (not just spheres)
- [ ] Mold release angle (draft)
- [ ] Export mold halves as separate STL files
- [ ] Mold cost estimation based on volume
- [ ] Integration with slicer for print time estimation
