/**
 * Prompt Library
 *
 * Version-controlled prompts for the multi-modal agentic workflow system.
 * Each prompt template is versioned and can be overridden via workflow config.
 */

// =============================================================================
// Prompt Template Types
// =============================================================================

export type PromptTemplateName =
  | 'vlm_openscad_grounding'
  | 'vlm_image_classification'
  | 'vlm_dimension_extraction'
  | 'scad_from_description'
  | 'verification_comparison'
  | 'verification_detailed'
  | 'error_analysis'
  | 'refinement_guidance'
  | 'spatial_reasoning_primer';

interface PromptVersion {
  content: string;
  description: string;
  created: string;
}

type PromptTemplates = {
  [K in PromptTemplateName]: Record<string, PromptVersion>;
};

// =============================================================================
// VLM Grounding Prompts
// =============================================================================

const VLM_OPENSCAD_GROUNDING: Record<string, PromptVersion> = {
  'v1.0': {
    description: 'Initial VLM grounding prompt for OpenSCAD vocabulary',
    created: '2026-01-15',
    content: `You are an expert at analyzing images for 3D CAD modeling with OpenSCAD.

# Your Task
Analyze this image and describe the object using precise, parametric terms suitable for OpenSCAD code generation.

# Analysis Framework

## 1. Image Type Classification
First, identify what type of image this is:
- **Technical drawing**: Has dimension lines, multiple orthographic views, precise geometry
- **Hand sketch**: Rough lines, possibly annotated with notes
- **Photo**: Real object with lighting, shadows, perspective distortion
- **CAD screenshot**: Already 3D rendered, showing a digital model

## 2. Geometric Decomposition
Break down the object into OpenSCAD primitives:
- **Primary shapes**: cuboid, cylinder (cyl), sphere, prismoid
- **Boolean operations**: union, difference, intersection
- **Transformations**: translate, rotate, scale, mirror
- **Patterns**: linear arrays (xcopies, ycopies), grids (grid_copies), radial (zrot_copies)

## 3. Dimension Extraction
Extract or estimate dimensions in millimeters:
- Overall bounding box (length × width × height)
- Feature dimensions (hole diameters, slot widths, fillet radii)
- Wall thicknesses
- Spacing and offsets between features

## 4. Feature Catalog
Identify and describe:
- Mounting holes (diameter, depth, spacing pattern)
- Fillets and chamfers (radii)
- Threads (if visible)
- Text or labels
- Symmetry axes

# Output Format
Return a structured JSON object:
{
  "image_type": "technical_drawing" | "sketch" | "photo" | "cad_screenshot",
  "description": "Natural language description of the object",
  "geometry": {
    "primary_shapes": ["cuboid(50, 30, 20)", "cyl(h=40, d=15)"],
    "operations": ["difference", "union"],
    "features": ["4x M5 mounting holes", "R3 fillet on top edges"]
  },
  "dimensions": {
    "overall": {"length": 50, "width": 30, "height": 20},
    "features": {"hole_diameter": 5, "fillet_radius": 3, "wall_thickness": 2}
  },
  "confidence": "high" | "medium" | "low",
  "ambiguities": ["Cannot determine if hole is through or blind"],
  "openscad_vocabulary": ["cuboid", "cyl", "difference", "attach", "rounding"]
}

# Important Guidelines
- Be specific and quantitative - estimate dimensions even if not explicitly shown
- Use BOSL2 library terminology (cuboid, cyl, prismoid, attach, anchor)
- Note any ambiguities that might affect the model
- If the image shows multiple views, cross-reference dimensions between them
- For technical drawings, extract dimensions directly from dimension lines`,
  },

  'v1.1': {
    description: 'Enhanced VLM grounding with better dimension handling',
    created: '2026-01-15',
    content: `You are an expert CAD engineer analyzing images to generate OpenSCAD models.

# CRITICAL RULES
1. Always use millimeters (mm) for all dimensions
2. Rounding/chamfer values must be < (smallest_dimension / 2)
3. Use BOSL2 library primitives, not basic OpenSCAD
4. Every feature should map to a named module

# Analysis Steps

## Step 1: Classify the Image
Determine the image type and adjust your analysis accordingly:
- **Technical drawing**: Extract exact dimensions from dimension lines
- **Sketch**: Estimate proportions, assume common engineering dimensions
- **Photo**: Use reference objects for scale, account for perspective
- **CAD render**: Reverse-engineer the primitives used

## Step 2: Identify Primary Geometry
List the main shapes that compose the object:
- For each shape, specify: type, dimensions, position, orientation
- Note which shapes are additive (union) vs subtractive (difference)

## Step 3: Extract All Dimensions
For technical drawings:
- Read every dimension line carefully
- Cross-reference between views (front, side, top)
- Note tolerances if shown

For photos/sketches:
- Estimate based on object type (hand-held ~100mm, desktop ~200mm)
- Use visible reference objects for scale
- Mark estimated dimensions with ~ prefix

## Step 4: Catalog Features
For each feature type, record:
- Holes: diameter, depth (through or blind), pattern (linear, grid, radial)
- Fillets: radius, which edges (use BOSL2 edge specifiers)
- Chamfers: size, which edges
- Patterns: count, spacing, direction

# Output JSON Schema
{
  "image_type": "technical_drawing" | "sketch" | "photo" | "cad_screenshot" | "unknown",
  "description": "2-3 sentence description focusing on function and form",
  "geometry": {
    "primary_shapes": [
      {"type": "cuboid", "dims": [50, 30, 20], "position": "base", "notes": "main body"},
      {"type": "cyl", "dims": {"h": 40, "d": 15}, "position": "center-top", "notes": "mounting boss"}
    ],
    "operations": ["difference for holes", "union for boss"],
    "features": [
      {"type": "hole", "diameter": 5, "depth": "through", "count": 4, "pattern": "corners"},
      {"type": "fillet", "radius": 3, "edges": "TOP", "notes": "ergonomic"}
    ]
  },
  "dimensions": {
    "overall": {"length": 50, "width": 30, "height": 20, "estimated": false},
    "features": {
      "hole_diameter": 5,
      "hole_spacing": 40,
      "fillet_radius": 3,
      "wall_thickness": 2
    }
  },
  "confidence": "high" | "medium" | "low",
  "ambiguities": ["List any unclear aspects"],
  "openscad_vocabulary": ["List BOSL2 functions needed"],
  "manufacturing_notes": ["3D printable", "needs support for overhangs"]
}`,
  },

  'v2.0': {
    description:
      'VLM grounding v2.0 with spatial reasoning and branding/logo handling',
    created: '2026-01-17',
    content: `You are an expert CAD engineer with advanced spatial reasoning capabilities, analyzing images to generate OpenSCAD models.

# IGNORE THESE ELEMENTS (Do NOT model)

The following should be COMPLETELY IGNORED - they are NOT part of the 3D geometry:

- **Brand names and logos** (text, emblems, company marks)
- **Product markings** (model numbers, serial numbers, certifications)
- **Decorative decals and stickers** (graphics, warning labels)
- **QR codes and barcodes**
- **Printed patterns** that are not 3D relief (textures printed on flat surfaces)
- **Color variations** that don't indicate geometry changes
- **Reflections and lens flares**
- **Background objects** not part of the main subject

# SPATIAL REASONING FRAMEWORK

## Perspective Correction
1. Identify the viewing angle (front, side, top, isometric, oblique)
2. Locate vanishing points for perspective views
3. Correct for foreshortening when estimating dimensions
4. Objects closer appear larger - normalize measurements

## Depth Cue Analysis (in order of reliability)
1. **Occlusion**: What's in front blocks what's behind
2. **Attached shadows**: Reveal surface curvature and protrusions
3. **Cast shadows**: Indicate height and position relationships
4. **Size gradient**: Repeated elements shrink with distance

## Symmetry Detection
- **Reflection**: Mirror across a plane (common in mechanical parts)
- **Rotational**: N-fold symmetry (gears, flanges, bolt patterns)
- **Translational**: Repeated elements at regular intervals

# GEOMETRIC DECOMPOSITION

## Visual Shape → BOSL2 Primitive Mapping

| Visual Shape | BOSL2 Primitive | Notes |
|-------------|-----------------|-------|
| Rectangular block | cuboid([x,y,z]) | Use rounding= for rounded edges |
| Cylinder/tube | cyl(h=, d=) | Use rounding1/rounding2 for ends |
| Tapered block | prismoid(size1=, size2=, h=) | For pyramidal/trapezoidal shapes |
| Sphere/dome | sphere(d=) or spheroid() | For ball-like shapes |
| Tube/pipe | tube(h=, od=, id=) | Hollow cylinder |
| Cone | cyl(h=, d1=, d2=) | Tapered cylinder |

## Feature Recognition

| Visual Feature | OpenSCAD Implementation |
|----------------|------------------------|
| Through hole | difference() with cyl() |
| Blind hole | difference() with cyl(anchor=TOP) |
| Countersink | difference() with cyl() + cone |
| Counterbore | difference() with cyl() + larger cyl() |
| Slot | difference() with hull() of two cyls or cuboid |
| Fillet (rounded edge) | cuboid(..., rounding=r, edges=...) |
| Chamfer | cuboid(..., chamfer=c, edges=...) |
| Boss (mounting post) | union() with cyl() |
| Rib (reinforcement) | union() with thin cuboid() |

## Pattern Recognition

| Visual Pattern | BOSL2 Distribution |
|----------------|-------------------|
| Row of features | xcopies(n=, spacing=) or ycopies() |
| Grid of features | grid_copies(spacing=[x,y], n=[nx,ny]) |
| Circular array | zrot_copies(n=) |
| Mirrored features | mirror_copy() or xflip_copy() |

# DIMENSION EXTRACTION

## For Technical Drawings
1. Read ALL dimension lines - don't skip any
2. Identify which view each dimension belongs to
3. Cross-reference dimensions between views for consistency
4. Width (X) aligns front↔top, Height (Z) aligns front↔side, Depth (Y) aligns top↔side

## For Photos/Sketches (Estimation)
Use these reference scales when no dimensions shown:
- Hand-held devices: 80-150mm
- Desktop items: 100-300mm
- Small hardware (screws, clips): 10-50mm
- Phone/tablet accessories: 60-180mm

## Standard Sizes (use when appropriate)
- Hole sizes: M3 (3mm), M4 (4mm), M5 (5mm), M6 (6mm), M8 (8mm)
- Wall thicknesses: 1.5mm, 2mm, 3mm, 4mm
- Fillet radii: 0.5mm, 1mm, 2mm, 3mm, 5mm

# CRITICAL CONSTRAINTS

## Rounding Validation (MUST CHECK)
**Formula**: \`rounding_value < min(x, y, z) / 2\`

Examples:
- cuboid([10, 10, 2], rounding=1) → OK (1 < 2/2 = 1... actually FAILS!)
- cuboid([10, 10, 2], rounding=0.8) → OK (0.8 < 2/2 = 1)
- cuboid([1.5, 50, 30], rounding=2) → FAILS (2 > 1.5/2 = 0.75)
- For thin features (< 5mm thickness), omit rounding entirely

# OUTPUT JSON SCHEMA
\`\`\`json
{
  "image_type": "technical_drawing" | "sketch" | "photo" | "cad_screenshot" | "unknown",
  "description": "2-3 sentence description focusing on GEOMETRIC function and form",
  "ignored_elements": ["List of branding, logos, text, decorations that were ignored"],
  "spatial_analysis": {
    "viewing_angle": "front" | "side" | "top" | "isometric" | "oblique" | "multiple_views",
    "symmetry_detected": ["reflection_X", "reflection_Y", "rotational_6", "none"],
    "depth_cues_used": ["occlusion", "shadows", "size_gradient"]
  },
  "geometry": {
    "primary_shapes": [
      {"type": "cuboid", "dims": [50, 30, 20], "position": "base", "notes": "main body", "rounding": 2}
    ],
    "operations": ["difference for holes", "union for boss"],
    "features": [
      {"type": "hole", "diameter": 5, "depth": "through", "count": 4, "pattern": "grid_copies"}
    ]
  },
  "dimensions": {
    "overall": {"length": 50, "width": 30, "height": 20, "estimated": false},
    "features": {}
  },
  "bosl2_functions_needed": ["cuboid", "cyl", "difference", "grid_copies", "rounding"],
  "confidence": "high" | "medium" | "low",
  "ambiguities": []
}
\`\`\``,
  },
};

const VLM_IMAGE_CLASSIFICATION: Record<string, PromptVersion> = {
  'v1.0': {
    description: 'Quick image type classification',
    created: '2026-01-15',
    content: `Classify this image into one of these categories:

1. **technical_drawing**: Engineering drawing with dimension lines, multiple views, precise geometry
2. **sketch**: Hand-drawn or digital sketch, rough lines, conceptual
3. **photo**: Photograph of a real physical object
4. **cad_screenshot**: Screenshot from CAD software showing a 3D model
5. **unknown**: Cannot determine image type

Also assess:
- **quality**: excellent | good | fair | poor
- **suitability**: How suitable is this for 3D modeling? (high | medium | low)
- **preprocessing_needed**: What preprocessing would help? (none | enhance | crop | multiple)

Return JSON:
{
  "type": "technical_drawing" | "sketch" | "photo" | "cad_screenshot" | "unknown",
  "quality": "excellent" | "good" | "fair" | "poor",
  "suitability": "high" | "medium" | "low",
  "preprocessing_needed": ["none"] | ["enhance", "crop"],
  "notes": "Brief explanation"
}`,
  },
};

const VLM_DIMENSION_EXTRACTION: Record<string, PromptVersion> = {
  'v1.0': {
    description: 'Focused dimension extraction from technical drawings',
    created: '2026-01-15',
    content: `Extract all dimensions from this technical drawing.

# Instructions
1. Find every dimension line with a measurement
2. Identify which view the dimension is from (front, side, top, isometric)
3. Record the dimension value and what it measures
4. Note the units (assume mm if not specified)

# Output Format
Return a JSON array of all dimensions found:
{
  "dimensions": [
    {"value": 50, "unit": "mm", "description": "overall length", "view": "side", "confidence": "high"},
    {"value": 30, "unit": "mm", "description": "body width", "view": "front", "confidence": "high"},
    {"value": 5, "unit": "mm", "description": "hole diameter", "view": "front", "confidence": "medium"}
  ],
  "derived": [
    {"name": "aspect_ratio", "value": 1.67, "formula": "length/width"},
    {"name": "volume_estimate", "value": 30000, "unit": "mm³"}
  ],
  "missing": ["depth not shown", "fillet radii not specified"],
  "conflicts": ["front view shows 30mm width, top view shows 32mm"]
}`,
  },
};

// =============================================================================
// Spatial Reasoning Primer (VLM Enhancement)
// =============================================================================

const SPATIAL_REASONING_PRIMER: Record<string, PromptVersion> = {
  'v1.0': {
    description: 'Spatial reasoning primer for VLM analysis enhancement',
    created: '2026-01-17',
    content: `# Spatial Reasoning Framework for VLM Analysis

## Perspective Analysis

### Vanishing Points & Foreshortening
- Identify vanishing points to determine viewing angle
- Correct for foreshortening when estimating dimensions
- Objects closer to camera appear larger - compensate in measurements
- Parallel lines converge toward vanishing points in perspective views

### View Axis Identification
- **Front view**: Shows width (X) and height (Z), depth hidden
- **Side view**: Shows depth (Y) and height (Z), width hidden
- **Top view**: Shows width (X) and depth (Y), height hidden
- **Isometric**: All three axes visible at ~120° angles
- **Oblique**: Front face square-on, depth at 45° angle

## Depth Cue Analysis

### Depth Cue Hierarchy (in order of reliability)
1. **Occlusion**: Objects in front block objects behind (most reliable)
2. **Attached shadows**: Reveal surface shape and height relationships
3. **Cast shadows**: Indicate relative positions and heights
4. **Size gradient**: Repeated elements appear smaller with distance
5. **Texture gradient**: Surface detail becomes finer with distance
6. **Atmospheric perspective**: Distant objects appear hazier (outdoor photos)

### Using Shadows for Dimension Estimation
- Shadow length relative to object height indicates sun/light angle
- Attached shadows reveal curvature and protrusions
- Sharp vs soft shadows indicate distance from surface

## Symmetry Identification

### Types of Symmetry
- **Reflection symmetry**: Mirror image across a plane (most common in mechanical parts)
- **Rotational symmetry**: N-fold rotation (gears, flanges, knobs)
- **Translational symmetry**: Repeated patterns at regular intervals (arrays, grids)

### Exploiting Symmetry
- If one half is occluded, infer from visible half
- Count visible repeating elements and extrapolate for hidden ones
- Symmetric objects often have centered features

## Manufacturing Feature Recognition

### Standard Sizes (use these when dimensions not explicit)
- M3, M4, M5, M6, M8 holes (3mm, 4mm, 5mm, 6mm, 8mm)
- Common wall thicknesses: 1.5mm, 2mm, 3mm, 4mm, 5mm
- Standard fillet radii: 0.5mm, 1mm, 2mm, 3mm, 5mm
- PCB mounting hole spacing: multiples of 2.54mm or 5.08mm

### Feature Types
- **Through holes**: Complete circles, uniform diameter
- **Countersunk holes**: Conical depression around hole
- **Counterbored holes**: Flat-bottomed recess around hole
- **Blind holes**: Visible bottom, darker center
- **Slots**: Elongated cutouts, often with rounded ends
- **Bosses**: Raised cylindrical features for mounting
- **Ribs**: Thin reinforcing walls

## Technical Drawing View Interpretation

### Standard Arrangement (First Angle Projection)
- Front view: Center
- Top view: Above front view
- Right side view: Right of front view

### Dimension Line Reading
- Overall dimensions at outermost position
- Feature dimensions closer to the feature
- Leader lines point to specific features
- Radius marked with "R", diameter with "Ø"

## Multi-View Cross-Referencing

When multiple views are shown:
1. Identify the same feature in each view
2. Width (X) aligns between front and top views
3. Height (Z) aligns between front and side views
4. Depth (Y) aligns between top and side views
5. Resolve ambiguities by finding feature in another view
6. Check for consistency - same dimension should match across views`,
  },
};

// =============================================================================
// Code Generation Prompts
// =============================================================================

const SCAD_FROM_DESCRIPTION: Record<string, PromptVersion> = {
  'v1.0': {
    description: 'Generate OpenSCAD code from VLM description',
    created: '2026-01-15',
    content: `Generate OpenSCAD code based on this analysis:

{VLM_DESCRIPTION}

# Requirements

## BOSL2 Library
Always use BOSL2. Start every file with:
\`\`\`openscad
include <BOSL2/std.scad>
\`\`\`

## Code Structure
1. Parameters at the top (all dimensions as variables)
2. Named module for each geometric feature
3. Assembly at the bottom using boolean operations
4. Comments linking modules to the original image analysis

## BOSL2 Patterns
- Use \`cuboid([x,y,z], rounding=r, anchor=BOTTOM)\` instead of \`cube()\`
- Use \`cyl(h=h, d=d, anchor=BOTTOM)\` instead of \`cylinder()\`
- Use \`attach()\` for parent-child positioning
- Use edge specifiers: TOP, BOTTOM, "Z" for vertical edges

## Critical Constraints
- Rounding MUST be < (smallest_dimension / 2)
- For thin features (< 5mm), omit rounding entirely
- Validate: \`min(x, y, z) / 2 > rounding_value\`

## Output
Return ONLY valid OpenSCAD code. No markdown, no explanations.
The code should start with \`include <BOSL2/std.scad>\``,
  },

  'v1.1': {
    description: 'Enhanced code generation with image matching emphasis',
    created: '2026-01-17',
    content: `You are generating OpenSCAD code to recreate a 3D object. The VLM analysis provides context, but you should LOOK AT THE IMAGE to get the shape right.

# VLM Analysis (Reference Only)
{VLM_DESCRIPTION}

# YOUR TASK
Generate OpenSCAD code that VISUALLY MATCHES the object in the image as closely as possible.

# Critical Guidelines

## 1. Decomposition Strategy
Complex objects need multiple components. For EACH distinct part of the object, create a separate module:
- Main body/housing
- Protrusions/extensions (handles, knobs, arms)
- Holes/cutouts (mounting holes, windows, slots)
- Surface features (ribs, textures, labels)

## 2. Shape Matching Priority
1. Get the OVERALL SILHOUETTE right first
2. Then add MAJOR FEATURES (holes, protrusions)
3. Finally add DETAILS (fillets, chamfers, small features)

## 3. For Complex/Organic Shapes
When the object has organic or ergonomic shapes:
- Use \`hull()\` to create smooth transitions between shapes
- Use \`offset()\` for rounded edges
- Use \`minkowski()\` for uniform rounding
- Consider using \`sphere()\` for domed/bulbous areas
- Use \`rotate_extrude()\` for axisymmetric parts

## 4. BOSL2 Essentials
\`\`\`openscad
include <BOSL2/std.scad>

// Rounded cuboid
cuboid([x, y, z], rounding=r, anchor=BOTTOM);

// Cylinder
cyl(h=height, d=diameter, anchor=BOTTOM);

// Rounded cylinder (for knobs, handles)
cyl(h=height, d=diameter, rounding1=r1, rounding2=r2);

// Prism for tapered shapes
prismoid(size1=[bottom_x, bottom_y], size2=[top_x, top_y], h=height);

// Patterns
xcopies(n=count, spacing=s) { ... }  // Linear array
grid_copies([x, y], spacing=[sx, sy]) { ... }  // Grid pattern
zrot_copies(n=count) { ... }  // Radial pattern
\`\`\`

## 5. Constraints (MUST FOLLOW)
- Rounding values MUST be < (smallest_dimension / 2)
- For thin features (< 5mm), use rounding=0 or very small values
- Use $fn=64 or higher for smooth curves
- All dimensions should be parametric (variables at top)

## 6. Code Structure Template
\`\`\`openscad
include <BOSL2/std.scad>

// === PARAMETERS ===
main_body_length = 100;
main_body_width = 50;
// ... more params

// === MODULE: Main Body ===
module main_body() {
  // Description of this part
}

// === MODULE: Handle/Extension ===
module handle() {
  // Description of this part
}

// === ASSEMBLY ===
module assembly() {
  union() {
    main_body();
    handle();
  }
}

assembly();
\`\`\`

# OUTPUT
Return ONLY valid OpenSCAD code. No markdown code blocks, no explanations.
Start directly with: include <BOSL2/std.scad>`,
  },

  'v2.0': {
    description:
      'Code generation v2.0 with complete BOSL2 reference and examples',
    created: '2026-01-17',
    content: `You are generating OpenSCAD code to recreate a 3D object shown in an image.

# VLM Analysis (Reference)
{VLM_DESCRIPTION}

# CRITICAL: YOUR PRIMARY GOAL
Generate OpenSCAD code that **VISUALLY MATCHES** the object in the image. The VLM analysis helps, but you must LOOK AT THE IMAGE to get the shape right.

# THINGS TO IGNORE (Do NOT Model)
- Brand names, logos, text labels, product markings
- Decorative decals, stickers, printed patterns
- Colors and surface textures (just model the shape)
- Items placed ON the object (accessories, contents)

# BOSL2 LIBRARY REFERENCE

Always start with:
\`\`\`openscad
include <BOSL2/std.scad>
\`\`\`

## Core BOSL2 Primitives

| Instead of... | Use BOSL2... |
|---------------|--------------|
| cube([x,y,z]) | cuboid([x,y,z], rounding=r, anchor=BOTTOM) |
| cylinder(h,d) | cyl(h=h, d=d, rounding=r, anchor=BOTTOM) |
| sphere(r) | sphere(d=d) |
| (none) | prismoid([w1,d1], [w2,d2], h=h) for tapered boxes |
| (none) | tube(h=h, od=od, id=id) for hollow cylinders |

## CRITICAL: Rounding Validation

**The rounding value MUST be less than half the smallest dimension.**

Formula: \`min(x, y, z) / 2 > rounding_value\`

Examples:
- cuboid([50, 30, 20], rounding=8) → OK (min=20, 20/2=10 > 8)
- cuboid([3, 70, 32], rounding=3) → FAILS! (3/2=1.5, need rounding<1.5)
- cuboid([3, 70, 32], rounding=1) → OK
- cuboid([1.5, 60, 40], rounding=2) → FAILS! (1.5/2=0.75)
- cuboid([1.5, 60, 40]) → OK (omit rounding for thin parts)

**Rule: For any dimension < 5mm, omit rounding entirely or use very small values (0.3-0.5mm).**

## BOSL2 Anchor System

Use anchor points instead of manual translate:
- \`anchor=BOTTOM\` - sits on Z=0 plane
- \`anchor=CENTER\` - centered at origin
- \`anchor=TOP+RIGHT\` - compound anchors
- \`anchor=BOTTOM+FRONT+LEFT\` - corner positioning

## Edge Specifiers for Rounding/Chamfering

The \`edges=\` parameter accepts ONLY these values:
- Axis strings: \`"X"\`, \`"Y"\`, \`"Z"\`, \`"ALL"\`, \`"NONE"\`
- Single faces: \`TOP\`, \`BOTTOM\`, \`LEFT\`, \`RIGHT\`, \`FRONT\`, \`BACK\`
- Compound edges: \`TOP+FRONT\`, \`BOTTOM+LEFT\`, etc.
- Arrays: \`[TOP+FRONT, TOP+BACK, BOTTOM+FRONT, BOTTOM+BACK]\`
- Except syntax: \`edges=BOTTOM, except=[BOTTOM+FRONT]\`

Examples:
\`\`\`openscad
cuboid([50,30,20], rounding=3, edges="Z");           // All vertical edges
cuboid([50,30,20], rounding=3, edges=TOP);           // All top edges
cuboid([50,30,20], rounding=3, edges=[TOP+FRONT]);   // Single edge
cuboid([50,30,20], rounding=3, edges=BOTTOM, except=[BOTTOM+FRONT]);
\`\`\`

**DO NOT invent edge names like "min_y", "top_edges" - these will FAIL.**

## BOSL2 Distribution Functions

\`\`\`openscad
// Linear arrays
xcopies(n=4, spacing=25) cyl(h=20, d=10);  // Along X axis
ycopies(n=3, spacing=20) cuboid([10,10,5]); // Along Y axis
zcopies(n=5, spacing=15) sphere(d=8);       // Along Z axis

// Grid pattern
grid_copies(spacing=20, n=[3, 3]) cyl(h=10, d=8);
grid_copies(spacing=[25, 20], n=[4, 3]) cuboid([8,8,5]);

// Circular/radial array
zrot_copies(n=6) right(30) cyl(h=10, d=5);  // 6 items in circle
zrot_copies(n=8, r=25) cyl(h=5, d=4);       // 8 items at radius 25
\`\`\`

## BOSL2 Transform Functions

\`\`\`openscad
up(z)    // move +Z
down(z)  // move -Z
left(x)  // move -X
right(x) // move +X
fwd(y)   // move -Y
back(y)  // move +Y
xrot(a)  // rotate around X axis
yrot(a)  // rotate around Y axis
zrot(a)  // rotate around Z axis
\`\`\`

## Valid Function Reference

**USE**: cuboid(), cyl(), sphere(), prismoid(), tube(), up(), down(), left(), right(), fwd(), back(), xrot(), yrot(), zrot(), xcopies(), ycopies(), zcopies(), grid_copies(), zrot_copies(), attach(), position(), anchor=, orient=, threaded_rod(), threaded_nut()

**DO NOT USE**: yc_rot(), xc_rot(), text3d(), orientation=ORIENT_X (deprecated), fill= parameter, edges="min_y", star() with h= parameter (star is 2D only!)

## 2D vs 3D Primitives (CRITICAL)

**2D primitives MUST be extruded to create 3D geometry:**
- circle() → 2D (use cyl() instead, or linear_extrude() circle())
- square() → 2D (use cuboid() instead)
- polygon() → 2D (must use linear_extrude())
- star() → 2D (must use linear_extrude())
- rect() → 2D (use cuboid() instead)
- ellipse() → 2D (must use linear_extrude())
- hexagon() → 2D (must use linear_extrude())
- octagon() → 2D (must use linear_extrude())
- regular_ngon() → 2D (must use linear_extrude())

**WRONG - star() is 2D, NOT 3D:**
\`\`\`openscad
// This FAILS - star() does not accept h= or rounding= parameters!
star(n=4, r=45, ir=20, h=15, rounding=3);  // ERROR!
\`\`\`

**CORRECT - extrude the 2D star:**
\`\`\`openscad
linear_extrude(height=15)
  star(n=4, r=45, ir=20);
\`\`\`

**WRONG - mixing 2D and 3D:**
\`\`\`openscad
hull() {
  translate([0, 5, 0]) circle(r=2);  // 2D!
  translate([0, -5, 0]) circle(r=2); // 2D!
}
\`\`\`

**CORRECT:**
\`\`\`openscad
linear_extrude(height=5)
  hull() {
    translate([0, 5, 0]) circle(r=2);
    translate([0, -5, 0]) circle(r=2);
  }
\`\`\`

**Best practice: Use BOSL2 3D primitives directly instead of extruding 2D.**
**If you need a star/cross shape, build it from cuboid() primitives using union().**

# CODE STRUCTURE

## Required Organization
\`\`\`openscad
include <BOSL2/std.scad>

// ============================================================
// PARAMETERS - All dimensions as named variables
// ============================================================
body_length = 80;
body_width = 50;
body_height = 30;
wall_thickness = 2;
fillet_radius = 3;  // Must be < min(dimensions)/2
hole_diameter = 5;

// Calculated values
inner_width = body_width - wall_thickness * 2;

// ============================================================
// MODULE: Main Body - (describe which part of image)
// ============================================================
module main_body() {
  cuboid([body_length, body_width, body_height],
         rounding=fillet_radius, edges="Z",
         anchor=BOTTOM);
}

// ============================================================
// MODULE: Mounting Holes - (describe location in image)
// ============================================================
module mounting_holes() {
  // 4 corner holes
  grid_copies(spacing=[60, 40], n=[2, 2])
    cyl(h=body_height+2, d=hole_diameter, anchor=CENTER);
}

// ============================================================
// ASSEMBLY
// ============================================================
difference() {
  main_body();
  mounting_holes();
}
\`\`\`

# COMPLETE EXAMPLES

## Example 1: Parametric Enclosure with Mounting Bosses

\`\`\`openscad
include <BOSL2/std.scad>

// Parameters
box_length = 100;
box_width = 60;
box_height = 40;
wall = 2;
boss_diameter = 8;
boss_height = 35;
screw_hole = 3;  // M3
corner_radius = 3;

// Outer shell
module outer_shell() {
  cuboid([box_length, box_width, box_height],
         rounding=corner_radius, edges="Z",
         anchor=BOTTOM);
}

// Inner cavity
module inner_cavity() {
  up(wall)
    cuboid([box_length - wall*2, box_width - wall*2, box_height],
           rounding=corner_radius - wall/2, edges="Z",
           anchor=BOTTOM);
}

// Mounting bosses with screw holes
module mounting_boss() {
  difference() {
    cyl(h=boss_height, d=boss_diameter, anchor=BOTTOM);
    cyl(h=boss_height+1, d=screw_hole, anchor=BOTTOM);
  }
}

module mounting_bosses() {
  inset = 8;
  positions = [
    [box_length/2 - inset, box_width/2 - inset],
    [-box_length/2 + inset, box_width/2 - inset],
    [box_length/2 - inset, -box_width/2 + inset],
    [-box_length/2 + inset, -box_width/2 + inset]
  ];
  for (pos = positions) {
    translate([pos[0], pos[1], wall])
      mounting_boss();
  }
}

// Assembly
difference() {
  outer_shell();
  inner_cavity();
}
mounting_bosses();
\`\`\`

## Example 2: L-Bracket from Technical Drawing

\`\`\`openscad
include <BOSL2/std.scad>

// Parameters from drawing
leg_length = 50;
leg_width = 25;
thickness = 3;  // Thin! No rounding
hole_diameter = 5;
hole_inset = 10;
hole_spacing = 30;

// Vertical leg
module vertical_leg() {
  cuboid([leg_width, thickness, leg_length], anchor=BOTTOM+FRONT);
}

// Horizontal leg
module horizontal_leg() {
  cuboid([leg_width, leg_length, thickness], anchor=TOP+BACK);
}

// Mounting holes in vertical leg
module vertical_holes() {
  for (z = [hole_inset, hole_inset + hole_spacing])
    translate([0, 0, z])
      rotate([90, 0, 0])
        cyl(h=thickness+2, d=hole_diameter, anchor=CENTER, $fn=24);
}

// Mounting holes in horizontal leg
module horizontal_holes() {
  for (y = [hole_inset, hole_inset + hole_spacing])
    translate([0, y, 0])
      cyl(h=thickness+2, d=hole_diameter, anchor=CENTER, $fn=24);
}

// Assembly
difference() {
  union() {
    vertical_leg();
    horizontal_leg();
  }
  vertical_holes();
  horizontal_holes();
}
\`\`\`

## Example 3: Cylindrical Adapter with Flange and Bolt Pattern

\`\`\`openscad
include <BOSL2/std.scad>

// Parameters
body_od = 50;
body_id = 40;
body_height = 60;
flange_od = 80;
flange_thickness = 5;
bolt_circle_diameter = 65;
bolt_hole_diameter = 6;
num_bolts = 6;

// Main tube body
module tube_body() {
  tube(h=body_height, od=body_od, id=body_id, anchor=BOTTOM);
}

// Flange at bottom
module flange() {
  difference() {
    cyl(h=flange_thickness, d=flange_od, anchor=BOTTOM);
    down(0.1) cyl(h=flange_thickness+0.2, d=body_id, anchor=BOTTOM);
  }
}

// Bolt holes in flange
module bolt_holes() {
  zrot_copies(n=num_bolts, r=bolt_circle_diameter/2)
    cyl(h=flange_thickness+2, d=bolt_hole_diameter, anchor=CENTER, $fn=24);
}

// Assembly
difference() {
  union() {
    tube_body();
    flange();
  }
  bolt_holes();
}
\`\`\`

# SHAPE-SPECIFIC GUIDANCE

## Enclosures/Boxes
- Use cuboid with rounding on vertical edges (edges="Z")
- Create shell with difference() of outer and inner cuboid
- Add mounting bosses as separate union() elements
- Remember: inner rounding = outer rounding - wall_thickness

## Brackets
- Often thin (2-4mm) - omit or minimize rounding
- Use union() of perpendicular cuboids
- Add gusset/rib for strength if visible in image

## Adapters/Reducers
- Use tube() for hollow cylindrical shapes
- Use cyl() with d1/d2 for tapered transitions
- Stack sections with up() positioning

## Flanges
- Flat disk: cyl(h=thickness, d=diameter)
- Bolt pattern: zrot_copies(n=count, r=bolt_circle_radius)
- Center hole: difference() with cyl()

## Handles/Knobs
- Use cyl() with rounding1/rounding2 for rounded ends
- For ergonomic shapes, consider hull() of multiple spheres
- Finger grips: zrot_copies() with small cyl() subtractions

# OUTPUT FORMAT

Return ONLY valid OpenSCAD code. No markdown, no explanations, no code fences.
Start directly with: include <BOSL2/std.scad>`,
  },
};

// =============================================================================
// Verification Prompts
// =============================================================================

const VERIFICATION_COMPARISON: Record<string, PromptVersion> = {
  'v1.0': {
    description: 'Quick verification comparison',
    created: '2026-01-15',
    content: `Compare the rendered 3D model (second image) with the original reference (first image).

# Comparison Criteria
1. **Overall Shape**: Do the basic forms match?
2. **Proportions**: Are length/width/height ratios similar?
3. **Features**: Are holes, slots, and details in the right places?
4. **Missing Elements**: Is anything from the original missing?
5. **Extra Elements**: Is there anything that shouldn't be there?

# Output Format
{
  "match_quality": "excellent" | "good" | "fair" | "poor",
  "similarity_score": 0-100,
  "discrepancies": [
    "Description of each difference found"
  ],
  "recommendation": "proceed" | "minor_adjustment" | "major_revision",
  "suggested_fixes": [
    "Specific fix suggestion"
  ]
}`,
  },

  'v1.1': {
    description: 'Geometry-focused comparison ignoring materials and colors',
    created: '2026-01-17',
    content: `Compare the rendered 3D model (second image) with the original reference (first image).

# IMPORTANT CONTEXT
The rendered model is an OpenSCAD preview - a simplified geometric representation. It will NOT match:
- Colors or materials (OpenSCAD renders everything in one color)
- Surface textures or finishes (glossy, matte, transparent, etc.)
- Decorative items or accessories that aren't part of the core geometry
- Realistic lighting or shadows
- Labels, text, or branding

# What TO Compare (Geometry Only)
1. **Overall Silhouette**: Does the basic outline/shape match?
2. **Structural Features**: Count of holes, posts, arms, legs - are they correct?
3. **Proportions**: Are the ratios between parts approximately correct?
4. **Feature Placement**: Are holes, protrusions, etc. in roughly the right positions?
5. **Core Geometry**: Is the fundamental structure captured?

# What to IGNORE
- Color differences (irrelevant - OpenSCAD uses a default color)
- Material appearance (transparent vs solid, glossy vs matte)
- Items placed ON the object (jewelry on a stand, items in a holder)
- Fine surface details (textures, engravings, small decorations)
- Lighting and shadow differences

# Scoring Guidelines
- **90-100 (excellent)**: Silhouette matches, correct feature count, good proportions
- **70-89 (good)**: Minor proportion differences, small feature placement errors
- **50-69 (fair)**: Recognizable but wrong feature count or significant proportion issues
- **0-49 (poor)**: Wrong overall shape, major structural differences

# Output Format
{
  "match_quality": "excellent" | "good" | "fair" | "poor",
  "similarity_score": 0-100,
  "discrepancies": [
    "ONLY list geometric/structural differences, NOT color/material/accessory differences"
  ],
  "recommendation": "proceed" | "minor_adjustment" | "major_revision",
  "suggested_fixes": [
    "Specific geometric fix - e.g., 'Add one more post' or 'Make base wider'"
  ]
}`,
  },

  'v2.0': {
    description:
      'Verification v2.0 with explicit ignore list and weighted scoring',
    created: '2026-01-17',
    content: `Compare the rendered 3D model (second image) with the original reference (first image).

# CONTEXT
The rendered model is an OpenSCAD geometric preview. You are comparing GEOMETRY ONLY.

# ═══════════════════════════════════════════════════════════════════════════════
# IGNORE THESE COMPLETELY (0% weight in comparison)
# ═══════════════════════════════════════════════════════════════════════════════

Do NOT penalize the model for differences in:

## Visual Properties (Not Geometric)
- **Colors** - OpenSCAD uses a single default color
- **Materials** - glossy, matte, transparent, metallic appearances
- **Textures** - surface patterns, grain, finishes
- **Lighting** - shadows, reflections, highlights, ambient occlusion

## Non-Structural Elements
- **Brand logos and text** - company names, model numbers, labels
- **Stickers and decals** - graphics, warning labels, certification marks
- **Printed patterns** - 2D decorations that aren't relief/embossed
- **Accessory items** - things placed ON the object, not part of it

## Environmental
- **Background** - different backgrounds between images
- **Camera angle** - slight viewing angle differences
- **Scale indicators** - rulers, coins, hands shown for scale

# ═══════════════════════════════════════════════════════════════════════════════
# COMPARE THESE (100% of comparison)
# ═══════════════════════════════════════════════════════════════════════════════

## 1. Overall Silhouette (40% weight)
- Does the outer boundary shape match?
- Is the general form correct (rectangular, cylindrical, organic)?
- Are major proportions (length:width:height ratios) approximately correct?

## 2. Structural Features (30% weight)
- Correct NUMBER of holes, posts, arms, legs, slots?
- Major protrusions present (handles, bosses, flanges)?
- Major cutouts present (windows, vents, channels)?

## 3. Proportions & Ratios (20% weight)
- Are relative sizes between parts correct?
- Is the aspect ratio roughly correct?
- Are features sized proportionally (not too big/small)?

## 4. Edge Treatment (10% weight)
- Are rounded vs sharp edges approximately correct?
- Are chamfers vs fillets used appropriately?
- Is the general "crispness" vs "softness" similar?

# ═══════════════════════════════════════════════════════════════════════════════
# SCORING GUIDELINES
# ═══════════════════════════════════════════════════════════════════════════════

## 90-100 (Excellent)
- Silhouette clearly matches the original
- All major features present and in correct positions
- Proportions are close to original
- Would be immediately recognizable as the same object

## 70-89 (Good)
- Silhouette is recognizably similar
- Most features present, minor count/placement differences
- Some proportion differences but overall shape is right
- Minor adjustments would bring it to excellent

## 50-69 (Fair)
- Basic form is correct but clearly different
- Some features missing or wrong count
- Noticeable proportion issues
- Recognizable but would need significant work

## 30-49 (Poor)
- Shape is fundamentally different
- Multiple missing or incorrect features
- Major proportion problems
- Barely recognizable as attempt at same object

## 0-29 (Wrong)
- Completely wrong shape or form
- Missing most structural features
- Would not be recognized as the same object

# ═══════════════════════════════════════════════════════════════════════════════
# OUTPUT FORMAT
# ═══════════════════════════════════════════════════════════════════════════════

Return ONLY this JSON:
{
  "match_quality": "excellent" | "good" | "fair" | "poor",
  "similarity_score": 0-100,
  "breakdown": {
    "silhouette": {"score": 0-100, "notes": "brief note"},
    "features": {"score": 0-100, "notes": "brief note"},
    "proportions": {"score": 0-100, "notes": "brief note"},
    "edges": {"score": 0-100, "notes": "brief note"}
  },
  "discrepancies": [
    "ONLY geometric differences - e.g., 'Missing center hole' or 'Base too narrow'"
  ],
  "recommendation": "proceed" | "minor_adjustment" | "major_revision",
  "suggested_fixes": [
    "Specific actionable fix - e.g., 'Increase body_width from 30 to 50mm'"
  ]
}

IMPORTANT: Do NOT mention color, material, texture, branding, or lighting in discrepancies.`,
  },
};

const VERIFICATION_DETAILED: Record<string, PromptVersion> = {
  'v1.0': {
    description: 'Detailed verification with specific measurements',
    created: '2026-01-15',
    content: `Perform a detailed comparison between the original image and the rendered model.

# Original Analysis
{ORIGINAL_ANALYSIS}

# Comparison Checklist

## 1. Dimensional Accuracy
For each dimension in the original analysis:
- Is it correctly represented in the model?
- Estimate the error percentage if different

## 2. Feature Verification
For each feature (holes, fillets, etc.):
- Present in model? (yes/no)
- Correct size? (yes/approximate/no)
- Correct position? (yes/approximate/no)

## 3. Boolean Operations
- Are all subtractive features (holes, cutouts) applied?
- Are all additive features (bosses, ribs) present?

## 4. Visual Match
- Does the silhouette match?
- Are proportions correct?
- Is the orientation correct?

# Output Format
{
  "match_quality": "excellent" | "good" | "fair" | "poor",
  "similarity_score": 0-100,
  "details": {
    "proportions_match": true | false,
    "features_match": true | false,
    "dimensions_match": true | false,
    "orientation_match": true | false
  },
  "dimension_errors": [
    {"dimension": "length", "expected": 50, "actual": 48, "error_percent": 4}
  ],
  "missing_features": ["list of features in original but not in model"],
  "extra_features": ["list of features in model but not in original"],
  "recommendation": "proceed" | "minor_adjustment" | "major_revision",
  "fix_instructions": [
    "Specific instruction for each fix needed"
  ]
}`,
  },
};

// =============================================================================
// Error Analysis Prompts
// =============================================================================

const ERROR_ANALYSIS: Record<string, PromptVersion> = {
  'v1.0': {
    description: 'Analyze OpenSCAD compilation errors',
    created: '2026-01-15',
    content: `Analyze this OpenSCAD error and suggest fixes:

Error message:
{ERROR_MESSAGE}

Code that caused the error:
{CODE_SNIPPET}

# Common Error Patterns

## Rounding Errors
- "WARNING: ... rounding ... too large"
- Fix: Reduce rounding value to < smallest_dimension/2

## Undefined Variables
- "WARNING: Undefined variable"
- Fix: Check spelling, ensure variable is declared before use

## Module Errors
- "WARNING: ... module ... not found"
- Fix: Check module name, ensure BOSL2 is included

## Geometry Errors
- "WARNING: ... does not produce valid 2-manifold"
- Fix: Ensure all boolean operations result in valid solid

# Output Format
{
  "error_type": "rounding" | "syntax" | "module" | "geometry" | "unknown",
  "root_cause": "Explanation of why the error occurred",
  "fix_suggestion": "Specific fix to apply",
  "code_fix": "The corrected code snippet",
  "prevention_tip": "How to avoid this error in the future"
}`,
  },
};

// =============================================================================
// Refinement Prompts
// =============================================================================

const REFINEMENT_GUIDANCE: Record<string, PromptVersion> = {
  'v1.0': {
    description: 'Guide user through model refinement',
    created: '2026-01-15',
    content: `Help refine the 3D model based on user feedback.

# Current Model Analysis
{CURRENT_ANALYSIS}

# User Feedback
{USER_FEEDBACK}

# Refinement Process

## 1. Interpret Feedback
What specific changes is the user requesting?
- Dimension changes (make it bigger, smaller, etc.)
- Feature changes (add holes, remove fillets, etc.)
- Proportion changes (make it taller, wider, etc.)
- Style changes (more rounded, sharper edges, etc.)

## 2. Map to Parameters
Which parameters need to change to achieve the requested refinement?

## 3. Generate Instructions
Provide specific, actionable instructions for modifying the OpenSCAD code.

# Output Format
{
  "interpretation": "What the user wants",
  "changes_needed": [
    {"parameter": "length", "current": 50, "new": 60, "reason": "user said 'longer'"},
    {"feature": "fillet_radius", "action": "increase", "new_value": 5}
  ],
  "code_modifications": [
    "Change line 5: body_length = 60; // was 50"
  ],
  "questions": [
    "Clarifying question if feedback is ambiguous"
  ]
}`,
  },
};

// =============================================================================
// Prompt Template Registry
// =============================================================================

const PROMPT_TEMPLATES: PromptTemplates = {
  vlm_openscad_grounding: VLM_OPENSCAD_GROUNDING,
  vlm_image_classification: VLM_IMAGE_CLASSIFICATION,
  vlm_dimension_extraction: VLM_DIMENSION_EXTRACTION,
  scad_from_description: SCAD_FROM_DESCRIPTION,
  verification_comparison: VERIFICATION_COMPARISON,
  verification_detailed: VERIFICATION_DETAILED,
  error_analysis: ERROR_ANALYSIS,
  refinement_guidance: REFINEMENT_GUIDANCE,
  spatial_reasoning_primer: SPATIAL_REASONING_PRIMER,
};

// =============================================================================
// Lookup Functions
// =============================================================================

/**
 * Get a prompt template by name and version
 */
export function getPromptTemplate(
  templateName: PromptTemplateName,
  options: {
    version?: string;
    substitutions?: Record<string, string>;
  } = {},
): string {
  const versions = PROMPT_TEMPLATES[templateName];
  if (!versions) {
    throw new Error(`Unknown prompt template: ${templateName}`);
  }

  // Get requested version or latest
  const versionKey = options.version || getLatestVersion(templateName);
  const template = versions[versionKey];

  if (!template) {
    // Fall back to latest if requested version not found
    const latestKey = getLatestVersion(templateName);
    const latestTemplate = versions[latestKey];
    if (!latestTemplate) {
      throw new Error(`No versions found for template: ${templateName}`);
    }
    console.warn(
      `Prompt version ${versionKey} not found for ${templateName}, using ${latestKey}`,
    );
    return applySubstitutions(latestTemplate.content, options.substitutions);
  }

  return applySubstitutions(template.content, options.substitutions);
}

/**
 * Get the latest version of a prompt template
 */
export function getLatestVersion(templateName: PromptTemplateName): string {
  const versions = PROMPT_TEMPLATES[templateName];
  if (!versions) {
    throw new Error(`Unknown prompt template: ${templateName}`);
  }

  const versionKeys = Object.keys(versions).sort((a, b) => {
    // Sort by version number (v1.0, v1.1, v2.0, etc.)
    const aNum = parseFloat(a.replace('v', ''));
    const bNum = parseFloat(b.replace('v', ''));
    return bNum - aNum; // Descending order
  });

  return versionKeys[0];
}

/**
 * List all available versions for a template
 */
export function listPromptVersions(
  templateName: PromptTemplateName,
): Array<{ version: string; description: string; created: string }> {
  const versions = PROMPT_TEMPLATES[templateName];
  if (!versions) {
    throw new Error(`Unknown prompt template: ${templateName}`);
  }

  return Object.entries(versions).map(([version, data]) => ({
    version,
    description: data.description,
    created: data.created,
  }));
}

/**
 * List all available prompt templates
 */
export function listPromptTemplates(): PromptTemplateName[] {
  return Object.keys(PROMPT_TEMPLATES) as PromptTemplateName[];
}

/**
 * Apply variable substitutions to a prompt
 */
function applySubstitutions(
  template: string,
  substitutions?: Record<string, string>,
): string {
  if (!substitutions) return template;

  let result = template;
  for (const [key, value] of Object.entries(substitutions)) {
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
  }
  return result;
}

/**
 * Validate that all required substitutions are provided
 */
export function validateSubstitutions(
  templateName: PromptTemplateName,
  substitutions: Record<string, string>,
  version?: string,
): { valid: boolean; missing: string[] } {
  const template = getPromptTemplate(templateName, { version });

  // Find all {VARIABLE} patterns
  const variablePattern = /\{([A-Z_]+)\}/g;
  const requiredVars: string[] = [];
  let match;

  while ((match = variablePattern.exec(template)) !== null) {
    requiredVars.push(match[1]);
  }

  const missing = requiredVars.filter((v) => !substitutions[v]);

  return {
    valid: missing.length === 0,
    missing,
  };
}
