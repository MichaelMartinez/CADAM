# BOSL2 Prompt Enhancement Plan

## Executive Summary

This plan details how to enhance Adam's prompts by incorporating concrete BOSL2 examples from the cheat sheet to improve code generation quality and leverage advanced library features.

## Current State Analysis

### Identified Prompts

1. **PARAMETRIC_AGENT_PROMPT** (`supabase/functions/chat/index.ts:261`)
   - Conversational outer agent with tool-calling
   - Basic BOSL2 awareness but lacks concrete examples

2. **STRICT_CODE_PROMPT** (`supabase/functions/chat/index.ts:338`)
   - Code generation prompt with some BOSL2 examples
   - Examples are limited to basic functions
   - Missing advanced BOSL2 features

3. **PARAMETRIC_SYSTEM_PROMPT** (`supabase/functions/prompt-generator/index.ts:15`)
   - Generates prompts for parametric models
   - References BOSL2 features but needs more specificity

4. **Augmentation Prompt** (`supabase/functions/prompt-generator/index.ts:100`)
   - Enhances existing prompts
   - Similar to PARAMETRIC_SYSTEM_PROMPT but needs concrete examples

## BOSL2 Key Feature Categories (from cheat_sheet.md)

### 1. **Attachments & Positioning** (LibFile: attachments.scad)

**Core Concepts:** Smart component positioning, parent-child relationships

```
Key Functions:
- attach(parent, child) - Position child on parent at anchor point
- position(at) - Move to specific anchor
- align(anchor) - Align to anchor with offset/overlap control
- orient(anchor, spin) - Reorient to anchor with rotation
```

**Use Cases:**

- Lids on boxes
- Handles on mugs
- Mounting brackets
- Multi-part assemblies

**Example Pattern:**

```openscad
cuboid([40,30,20], anchor=BOTTOM)
    attach(TOP) cylinder(h=10, d=5);
```

### 2. **Advanced Rounding & Filleting** (LibFile: rounding.scad, shapes3d.scad)

**Core Concepts:** Smooth edges, professional finish, printability

```
Key Functions:
- cuboid(size, rounding=, edges=) - Rounded cubes with edge control
- cyl(h, r, rounding=) - Rounded cylinders
- offset_sweep(path, height, bottom=, top=) - Rounded extrusions
- rounded_prism(bottom, top, height, joint_bot=, joint_top=, k=) - Complex rounding
- edge_profile(edges) - Apply 2D mask to edges
- corner_profile(corners) - Apply 3D mask to corners
```

**Use Cases:**

- Professional-looking enclosures
- Ergonomic handles
- Strong corner joints
- Print-friendly overhangs

**Example Pattern:**

```openscad
include <BOSL2/std.scad>
cuboid([50,30,20], rounding=3, edges="Z", anchor=BOTTOM);
```

### 3. **Threading & Fasteners** (LibFile: threading.scad, screws.scad)

**Core Concepts:** Threaded holes, screws, nuts, standoffs

```
Key Functions:
- threaded_rod(d, l, pitch, internal=) - Create threads (external or internal)
- threaded_nut(nutwidth, id, h, pitch) - Create threaded nuts
- screw(spec, head, drive, thread=, length=) - Complete screw with head
- screw_hole(spec, head, thread=, length=) - Screw hole with countersink
- trapezoidal_threaded_rod() - ACME-style threads
- generic_threaded_rod(d, l, pitch, profile) - Custom thread profiles
```

**Common Thread Sizes:**

- M3: d=3, pitch=0.5
- M4: d=4, pitch=0.7
- M5: d=5, pitch=0.8
- M6: d=6, pitch=1.0

**Use Cases:**

- Threaded inserts
- Screw-on lids
- Mounting holes
- Adjustable mechanisms

**Example Pattern:**

```openscad
include <BOSL2/std.scad>
include <BOSL2/threading.scad>

difference() {
    cyl(h=20, d=8, rounding=1, anchor=BOTTOM);
    threaded_rod(d=3, l=22, pitch=0.5, internal=true, $fn=32);
}
```

### 4. **Gears & Mechanical Components** (LibFile: gears.scad)

**Core Concepts:** Spur gears, worm gears, racks, planetary assemblies

```
Key Functions:
- spur_gear(mod=, teeth=, thickness=, shaft_diam=) - Standard spur gear
- ring_gear(mod=, teeth=, thickness=, backing=) - Ring/internal gear
- rack(mod=, teeth=, thickness=) - Linear gear rack
- worm_gear(mod=, teeth=, worm_diam=) - Worm wheel
- bevel_gear() - Bevel/crown gears
- planetary_gears() - Calculate planetary gear assemblies
```

**Gear Parameters:**

- mod/module: Controls tooth size (common: 0.5-3)
- teeth: Number of teeth (20-60 typical)
- pressure_angle: Usually 20° or 25°
- helical: Angle for helical gears

**Use Cases:**

- Gear trains
- Mechanical advantage systems
- Rotating mechanisms
- Differential assemblies

**Example Pattern:**

```openscad
include <BOSL2/std.scad>
include <BOSL2/gears.scad>

spur_gear(mod=2, teeth=24, thickness=8, shaft_diam=5, pressure_angle=20);
```

### 5. **Joiners & Mechanical Connections** (LibFile: joiners.scad, hinges.scad)

**Core Concepts:** Snap-fit, dovetails, hinges, clips

```
Key Functions:
- dovetail(gender, width=, height=, slide=, slope=) - Dovetail joints
- snap_pin(size) - Tension clip pins
- snap_pin_socket(size) - Matching socket
- knuckle_hinge(length, offset, segs) - Pin hinge
- living_hinge_mask() - Flexible living hinge
- rabbit_clip() - Snap-fit clip mechanism
```

**Use Cases:**

- Snap-together assemblies
- Hinged lids
- Tool-free assembly
- Living hinges for flexible parts

**Example Pattern:**

```openscad
include <BOSL2/std.scad>
include <BOSL2/joiners.scad>

// Male dovetail
cube([50,20,10])
    attach(RIGHT) dovetail("male", width=10, height=8, slide=20);
```

### 6. **Path Operations & Sweeps** (LibFile: skin.scad, paths.scad)

**Core Concepts:** Sweep 2D shapes along paths, skin between profiles

```
Key Functions:
- path_sweep(shape, path, twist=, scale=) - Sweep shape along 3D path
- path_sweep2d(shape, path) - Sweep along 2D path
- linear_sweep(region, height, twist=, scale=) - Enhanced extrusion
- rotate_sweep(shape, angle=) - Revolve shape
- skin(profiles, slices=, caps=) - Connect multiple 2D profiles
```

**Use Cases:**

- Twisted/tapered parts
- Organic shapes
- Pipes and tubes
- Complex sweeps

**Example Pattern:**

```openscad
include <BOSL2/std.scad>
include <BOSL2/rounding.scad>

path = arc(n=20, r=50, angle=[0,90]);
shape = rect([10,5]);
path_sweep(shape, path);
```

### 7. **Distributors & Patterns** (LibFile: distributors.scad)

**Core Concepts:** Create arrays and patterns of objects

```
Key Functions:
- grid_copies(spacing, size=) - Rectangular grid
- arc_copies(n, r=) - Circular array
- xcopies(spacing, n=) / ycopies() / zcopies() - Linear arrays
- path_copies(path, n=) - Copies along path
- rot_copies(n=, v=) - Rotational copies
- mirror_copy(v) - Original + mirrored copy
```

**Use Cases:**

- Bolt hole patterns
- Ventilation grids
- Gear teeth (with rotate)
- Decorative patterns

**Example Pattern:**

```openscad
include <BOSL2/std.scad>

grid_copies(spacing=20, n=[5,3])
    cylinder(h=5, d=3);
```

### 8. **Masking & Edge Treatments** (LibFile: masks.scad)

**Core Concepts:** Apply edge profiles for chamfers, rounds, custom edges

```
Key Functions:
- edge_profile(edges=, except=) - Apply 2D mask to cube edges
- corner_profile(corners=) - Apply 3D mask to corners
- mask2d_roundover(r=) - Rounded edge mask
- mask2d_chamfer(edge, angle=) - Chamfered edge mask
- rounding_edge_mask(l, r=) - 3D rounding mask
- chamfer_edge_mask(l, chamfer=) - 3D chamfer mask
```

**Edge Selectors:**

- "X", "Y", "Z" - All edges parallel to axis
- EDGES("ALL") - All edges
- [edge list] - Specific edges

**Use Cases:**

- Post-processing edge treatment
- Chamfers for easier assembly
- Custom molding profiles
- Decorative edges

**Example Pattern:**

```openscad
include <BOSL2/std.scad>

diff()
cube([50,30,20], anchor=BOTTOM)
    edge_profile(TOP)
        mask2d_roundover(r=3);
```

### 9. **Texturing** (LibFile: skin.scad - texture())

**Core Concepts:** Add surface patterns and textures

```
Key Functions:
- texture(tex, n=, inset=, gap=, roughness=) - Define texture patterns
- Used with: cyl(), linear_sweep(), rotate_sweep()
```

**Texture Types:**

- "knurled" - Diamond knurling
- "ribs" - Vertical ribs
- "diamonds" - Diamond pattern
- "trunc_diamonds" - Truncated diamonds
- "trunc_pyramids" - Pyramid pattern
- Custom 2D shapes

**Use Cases:**

- Grip surfaces
- Knobs and handles
- Decorative patterns
- Non-slip surfaces

**Example Pattern:**

```openscad
include <BOSL2/std.scad>

cyl(h=30, d=20, texture="knurled", tex_size=[5,1], tex_depth=0.5);
```

### 10. **Boolean Operations with Tags** (LibFile: attachments.scad)

**Core Concepts:** Named boolean operations for complex assembly

```
Key Functions:
- diff(remove=, keep=) - Difference with tag control
- tag(tag_name) - Tag children for operations
- intersect(intersect=, keep=) - Intersection with tags
- show_only(tags) - Show specific tagged parts
- hide(tags) - Hide specific tagged parts
```

**Use Cases:**

- Complex assemblies
- Part visualization
- Selective operations
- Debugging

**Example Pattern:**

```openscad
include <BOSL2/std.scad>

diff()
cuboid([50,30,20], anchor=BOTTOM) {
    tag("remove") attach(TOP) cyl(h=10, d=5);
    tag("keep") attach(FRONT) sphere(d=8);
}
```

## Enhanced Examples Library

### Basic BOSL2 Patterns

#### Simple Rounded Box

```openscad
include <BOSL2/std.scad>

// Parameters
box_width = 50;
box_depth = 30;
box_height = 20;
wall_thickness = 2;
corner_radius = 3;

diff()
cuboid([box_width, box_depth, box_height], rounding=corner_radius, edges="Z", anchor=BOTTOM)
    tag("remove") up(wall_thickness)
        cuboid([box_width-wall_thickness*2, box_depth-wall_thickness*2, box_height],
               rounding=corner_radius-wall_thickness, edges="Z", anchor=BOTTOM);
```

#### Threaded Container

```openscad
include <BOSL2/std.scad>
include <BOSL2/threading.scad>

// Parameters
container_diameter = 60;
container_height = 40;
wall_thickness = 2;
thread_diameter = 55;
thread_pitch = 2;
lid_height = 10;

// Container body with internal threads
difference() {
    cyl(h=container_height, d=container_diameter, rounding=2, anchor=BOTTOM);
    up(wall_thickness)
        cyl(h=container_height, d=container_diameter-wall_thickness*2, rounding=1, anchor=BOTTOM);
    up(container_height-8)
        threaded_rod(d=thread_diameter, l=10, pitch=thread_pitch, internal=true, $fn=64);
}

// Screw-on lid with external threads
up(container_height + 5)
difference() {
    union() {
        cyl(h=lid_height, d=container_diameter, rounding=2, anchor=BOTTOM);
        down(3)
            threaded_rod(d=thread_diameter-0.4, l=8, pitch=thread_pitch, internal=false, $fn=64);
    }
    up(wall_thickness)
        cyl(h=lid_height, d=container_diameter-wall_thickness*2, anchor=BOTTOM);
}
```

#### Attachment-Based Assembly

```openscad
include <BOSL2/std.scad>

// Parameters
base_size = 50;
post_height = 30;
post_diameter = 8;

// Base with attached posts at corners
cuboid([base_size, base_size, 5], rounding=2, edges="Z", anchor=BOTTOM) {
    attach(TOP+FWD+RIGHT) cyl(h=post_height, d=post_diameter, rounding=1);
    attach(TOP+FWD+LEFT) cyl(h=post_height, d=post_diameter, rounding=1);
    attach(TOP+BACK+RIGHT) cyl(h=post_height, d=post_diameter, rounding=1);
    attach(TOP+BACK+LEFT) cyl(h=post_height, d=post_diameter, rounding=1);
}
```

#### Gear Assembly

```openscad
include <BOSL2/std.scad>
include <BOSL2/gears.scad>

// Parameters
gear1_teeth = 20;
gear2_teeth = 30;
gear_module = 2;
gear_thickness = 8;
shaft_diameter = 5;

// First gear
spur_gear(mod=gear_module, teeth=gear1_teeth, thickness=gear_thickness,
          shaft_diam=shaft_diameter, pressure_angle=20, anchor=BOTTOM);

// Second gear meshed with first
gear_dist = gear_dist(mod=gear_module, teeth=gear1_teeth, mate_teeth=gear2_teeth);
right(gear_dist)
    spur_gear(mod=gear_module, teeth=gear2_teeth, thickness=gear_thickness,
              shaft_diam=shaft_diameter, pressure_angle=20, anchor=BOTTOM);
```

#### Dovetail Joint

```openscad
include <BOSL2/std.scad>
include <BOSL2/joiners.scad>

// Parameters
board_width = 80;
board_thickness = 10;
dovetail_width = 12;
dovetail_slide = 30;

// Board with male dovetail
left(board_width/2 + 2)
cuboid([board_width, 40, board_thickness], anchor=BOTTOM)
    attach(RIGHT) dovetail("male", width=dovetail_width, height=board_thickness,
                           slide=dovetail_slide, anchor=LEFT);

// Board with female dovetail
right(board_width/2 + 2)
cuboid([board_width, 40, board_thickness], anchor=BOTTOM)
    attach(LEFT) dovetail("female", width=dovetail_width, height=board_thickness,
                          slide=dovetail_slide, anchor=RIGHT);
```

#### Grid Pattern with Distribution

```openscad
include <BOSL2/std.scad>

// Parameters
grid_spacing = 15;
grid_count = [5, 5];
hole_diameter = 4;
base_size = [80, 80, 3];

// Base plate with grid of holes
diff()
cuboid(base_size, rounding=2, edges="Z", anchor=BOTTOM)
    tag("remove") attach(TOP)
        grid_copies(spacing=grid_spacing, n=grid_count)
            cyl(h=base_size.z+1, d=hole_diameter, anchor=TOP);
```

#### Textured Grip Surface

```openscad
include <BOSL2/std.scad>

// Parameters
handle_length = 80;
handle_diameter = 25;
knurl_size = [3, 1];
knurl_depth = 0.8;

cyl(h=handle_length, d=handle_diameter,
    texture="knurled", tex_size=knurl_size, tex_depth=knurl_depth,
    rounding=2, anchor=BOTTOM, $fn=64);
```

#### Path Sweep Example

```openscad
include <BOSL2/std.scad>

// Parameters
sweep_radius = 40;
sweep_angle = 180;
tube_diameter = 8;

// Create curved path
path = arc(n=30, r=sweep_radius, angle=[0, sweep_angle]);
// Sweep circular shape along path
path_sweep(circle(d=tube_diameter), path3d(path));
```

#### Mounting Bracket with Screw Holes

```openscad
include <BOSL2/std.scad>
include <BOSL2/screws.scad>

// Parameters
bracket_length = 60;
bracket_width = 30;
bracket_thickness = 4;
hole_spacing = 40;
screw_spec = "M4";

// Bracket with countersunk screw holes
diff()
cuboid([bracket_length, bracket_width, bracket_thickness],
       rounding=2, edges="Z", anchor=BOTTOM)
    tag("remove") attach(TOP)
        xcopies(spacing=hole_spacing, n=2)
            screw_hole(screw_spec, head="flat", length=bracket_thickness+1,
                      anchor=TOP, $fn=32);
```

## Prompt Enhancement Strategy

### 1. STRICT_CODE_PROMPT Enhancements

**Current Issues:**

- Limited examples (only basic mug, threaded standoff, gear)
- Missing advanced features like attachments, masks, distributions
- No texture examples
- No complex joinery examples

**Proposed Additions:**

Add section after library imports:

```markdown
# BOSL2 Core Concepts

## Attachments (Smart Positioning)

Use attach() to position components on anchor points (TOP, BOTTOM, LEFT, RIGHT, FWD, BACK):
cuboid([40,30,20], anchor=BOTTOM)
attach(TOP) cyl(h=10, d=5, anchor=BOTTOM);

## Rounding (Professional Finish)

Use cuboid() and cyl() with rounding= parameter:
cuboid([50,30,20], rounding=3, edges="Z", anchor=BOTTOM);
cyl(h=30, d=20, rounding=2, anchor=BOTTOM);

## Threading (Precise Fasteners)

Use threaded_rod() for threads (M3: d=3, pitch=0.5; M4: d=4, pitch=0.7):
include <BOSL2/threading.scad>
threaded_rod(d=3, l=20, pitch=0.5, internal=true, $fn=32);

## Distributions (Patterns)

Use grid_copies(), arc_copies(), xcopies() for patterns:
grid_copies(spacing=15, n=[3,3])
cyl(h=5, d=3, anchor=BOTTOM);

## Masking (Edge Treatment)

Use diff() with edge_profile() for edge treatments:
diff()
cuboid([50,30,20], anchor=BOTTOM)
edge_profile(TOP) mask2d_roundover(r=3);

## Textures (Grip Surfaces)

Use texture= parameter on cyl() or linear_sweep():
cyl(h=50, d=25, texture="knurled", tex_size=[3,1], tex_depth=0.8);
```

Add comprehensive examples section:

```markdown
# BOSL2 Example Patterns

## Threaded Standoff (M3)

include <BOSL2/std.scad>
include <BOSL2/threading.scad>

standoff_height = 20;
outer_diameter = 8;
thread_diameter = 3;
thread_pitch = 0.5;

diff()
cyl(h=standoff_height, d=outer_diameter, rounding=1, anchor=BOTTOM, $fn=32)
tag("remove") threaded_rod(d=thread_diameter, l=standoff_height+1,
pitch=thread_pitch, internal=true, $fn=32);

## Box with Attached Lid

include <BOSL2/std.scad>

box_size = [60, 40, 30];
wall = 2;
lid_height = 8;

// Box
diff()
cuboid(box_size, rounding=3, edges="Z", anchor=BOTTOM)
tag("remove") up(wall)
cuboid([box_size.x-wall*2, box_size.y-wall*2, box_size.z],
rounding=2, edges="Z", anchor=BOTTOM);

// Lid positioned above
up(box_size.z + 2)
cuboid([box_size.x, box_size.y, lid_height], rounding=3, edges="Z", anchor=BOTTOM);

## Mounting Bracket with Holes

include <BOSL2/std.scad>

bracket_size = [60, 30, 4];
hole_spacing = 40;
hole_diameter = 4;

diff()
cuboid(bracket_size, rounding=2, edges="Z", anchor=BOTTOM)
tag("remove") attach(TOP)
xcopies(spacing=hole_spacing, n=2)
cyl(h=bracket_size.z+1, d=hole_diameter, anchor=TOP, $fn=32);

## Spur Gear

include <BOSL2/std.scad>
include <BOSL2/gears.scad>

teeth = 24;
module = 2;
thickness = 8;
bore = 5;

spur_gear(mod=module, teeth=teeth, thickness=thickness,
shaft_diam=bore, pressure_angle=20, anchor=BOTTOM);

## Snap-Fit Clip

include <BOSL2/std.scad>
include <BOSL2/joiners.scad>

clip_length = 30;
clip_width = 10;

snap_pin([clip_width, clip_length, 4], pointed=true, anchor=BOTTOM);

## Knurled Handle

include <BOSL2/std.scad>

handle_length = 80;
handle_diameter = 25;

cyl(h=handle_length, d=handle_diameter,
texture="knurled", tex_size=[3,1], tex_depth=0.8,
rounding=2, anchor=BOTTOM, $fn=64);

## Dovetail Joint Assembly

include <BOSL2/std.scad>
include <BOSL2/joiners.scad>

board_width = 80;
board_thickness = 10;

// Male side
left(board_width/2 + 5)
cuboid([board_width, 40, board_thickness], anchor=BOTTOM)
attach(RIGHT) dovetail("male", width=12, height=board_thickness,
slide=30, anchor=LEFT);

// Female side  
right(board_width/2 + 5)
cuboid([board_width, 40, board_thickness], anchor=BOTTOM)
attach(LEFT) dovetail("female", width=12, height=board_thickness,
slide=30, anchor=RIGHT);
```

### 2. PARAMETRIC_AGENT_PROMPT Enhancements

Add after "Library Usage Strategy":

```markdown
# BOSL2 Feature Guidance

When users request specific features, guide them toward appropriate BOSL2 capabilities:

**Rounding/Smooth Edges:**

- "rounded corners" → cuboid() with rounding= and edges=
- "smooth edges" → cyl() with rounding=
- "filleted joints" → offset_sweep() or rounded_prism()

**Fasteners:**

- "screw holes" → screw_hole() with spec (M3, M4, M5)
- "threaded" → threaded_rod() with internal=true/false
- "bolt pattern" → grid_copies() + screw_hole()

**Mechanical:**

- "gear" → spur_gear(), specify mod= and teeth=
- "hinge" → knuckle_hinge() or living_hinge_mask()
- "dovetail" → dovetail() with gender="male"/"female"
- "snap fit" → snap_pin() and snap_pin_socket()

**Patterns:**

- "array of holes" → grid_copies() or xcopies()
- "circular pattern" → arc_copies() or rot_copies()
- "along path" → path_copies()

**Textures:**

- "grip", "knurled" → texture="knurled" on cyl()
- "ribbed" → texture="ribs"
- "textured surface" → texture= with custom pattern

**Assembly:**

- "attach", "mount", "position" → attach() with anchor points
- "lid on top" → attach(TOP)
- "handle on side" → attach(LEFT) or attach(RIGHT)
```

### 3. PARAMETRIC_SYSTEM_PROMPT Enhancements

**Current State:**

- Good structure but examples lack specificity
- BOSL2 features mentioned but not with concrete syntax

**Proposed Enhancement:**
Replace the BOSL2 feature bullets with concrete examples:

```markdown
- Leverage BOSL2 advanced features with these patterns:
  • Attachments: "lid attached to TOP using attach(TOP)", "posts at corners using attach(TOP+FWD+RIGHT)"
  • Rounding: "cuboid([50,30,20], rounding=3, edges='Z') for rounded vertical edges", "cyl(h=30, d=20, rounding=2) for rounded cylinder ends"
  • Threading: "M3 threaded hole using threaded_rod(d=3, l=20, pitch=0.5, internal=true)", "screw_hole('M4', head='flat') for countersunk holes"
  • Gears: "spur_gear(mod=2, teeth=24, thickness=8) for 24-tooth gear", "rack(mod=2, teeth=10) for linear rack"
  • Patterns: "grid_copies(spacing=15, n=[3,3]) for 3x3 hole pattern", "arc_copies(n=6, r=30) for circular array"
  • Joiners: "dovetail('male', width=12, slide=30) for sliding dovetail", "snap_pin() for clip assembly"
  • Textures: "texture='knurled', tex_size=[3,1], tex_depth=0.8 on cyl() for grip surface"
  • Sweeps: "path_sweep(circle(d=5), path) for tube along curve", "linear_sweep(region, height=20, twist=45) for twisted extrusion"
```

## Implementation Checklist

### Phase 1: Prompt Enhancement

- [ ] Update STRICT_CODE_PROMPT with BOSL2 concepts section
- [ ] Add 10+ concrete BOSL2 examples to STRICT_CODE_PROMPT
- [ ] Update PARAMETRIC_AGENT_PROMPT with feature-to-syntax mapping
- [ ] Update PARAMETRIC_SYSTEM_PROMPT with specific pattern examples
- [ ] Update augmentation prompt with same improvements

### Phase 2: Example Categorization

- [ ] Create "Common Patterns" section with 15+ examples covering:
  - Basic shapes with rounding
  - Threaded parts (M3, M4, M5 with correct pitches)
  - Attachment-based assemblies
  - Gear assemblies (spur, worm, rack)
  - Joinery (dovetail, snap-fit, hinge)
  - Distribution patterns (grid, arc, path)
  - Textured surfaces
  - Advanced sweeps

### Phase 3: Feature-Specific Guidance

- [ ] Add threading reference table (M3-M10 with pitches)
- [ ] Add gear parameter guidance (module, teeth, pressure angle)
- [ ] Add attachment anchor reference (TOP, BOTTOM, combinations)
- [ ] Add texture type reference
- [ ] Add edge selector reference ("X", "Y", "Z", "ALL")

### Phase 4: Testing & Validation

- [ ] Test prompts with common user requests
- [ ] Verify generated code uses BOSL2 appropriately
- [ ] Check for parameter extraction compatibility
- [ ] Validate threading pitch values
- [ ] Ensure printability guidance is followed

## Key Improvements Summary

### What's Being Added:

1. **Concrete Syntax Examples**: Replace vague feature names with actual BOSL2 function calls
2. **Parameter Guidance**: Include typical values (M3 = d:3, pitch:0.5)
3. **Pattern Library**: Provide copy-paste-ready code patterns
4. **Feature Mapping**: Map user intent to specific BOSL2 functions
5. **Cheat Sheet Integration**: Pull actual syntax from cheat_sheet.md

### Expected Benefits:

1. **Better Code Quality**: More idiomatic BOSL2 usage
2. **Correct Parameters**: Proper thread pitches, gear modules, etc.
3. **Reduced Errors**: Fewer syntax mistakes from concrete examples
4. **Feature Discovery**: LLM learns about advanced BOSL2 capabilities
5. **Consistency**: Similar requests produce similar BOSL2 patterns

## Common BOSL2 Reference Tables

### Thread Specifications (ISO Metric)

| Size | Diameter (mm) | Pitch (mm) | Usage                        |
| ---- | ------------- | ---------- | ---------------------------- |
| M3   | 3.0           | 0.5        | Small electronics, standoffs |
| M4   | 4.0           | 0.7        | General fastening            |
| M5   | 5.0           | 0.8        | Medium strength              |
| M6   | 6.0           | 1.0        | Furniture, brackets          |
| M8   | 8.0           | 1.25       | Heavy duty                   |

### Anchor Points (Directional Vectors)

| Anchor | Direction | Combination Examples |
| ------ | --------- | -------------------- |
| TOP    | [0,0,1]   | TOP+FWD, TOP+LEFT    |
| BOTTOM | [0,0,-1]  | BOTTOM+BACK+RIGHT    |
| LEFT   | [-1,0,0]  | LEFT+FWD             |
| RIGHT  | [1,0,0]   | RIGHT+BACK           |
| FWD    | [0,-1,0]  | FWD+TOP              |
| BACK   | [0,1,0]   | BACK+BOTTOM          |

### Edge Selectors (for cuboid rounding/chamfering)

| Selector | Effect                                  |
| -------- | --------------------------------------- |
| "X"      | All edges parallel to X axis            |
| "Y"      | All edges parallel to Y axis            |
| "Z"      | All edges parallel to Z axis (vertical) |
| "ALL"    | All 12 edges                            |
| [list]   | Specific edge indices                   |

### Common Gear Modules

| Module | Tooth Size | Typical Use        |
| ------ | ---------- | ------------------ |
| 0.5    | Very fine  | Watches, precision |
| 1.0    | Fine       | Small mechanisms   |
| 2.0    | Medium     | General purpose    |
| 3.0    | Large      | Power transmission |

### Texture Types

| Type             | Pattern       | Use Case                |
| ---------------- | ------------- | ----------------------- |
| "knurled"        | Diamond knurl | Grip surfaces, handles  |
| "ribs"           | Vertical ribs | Visual/tactile feedback |
| "diamonds"       | Diamond grid  | Decorative, anti-slip   |
| "trunc_pyramids" | Pyramid bumps | Grip enhancement        |

## Next Steps

1. **Review and Approve Plan**: Get feedback on this enhancement strategy
2. **Implement in Code Mode**: Update the three main prompts
3. **Add Examples Systematically**: Ensure coverage of all major BOSL2 categories
4. **Test with Real Queries**: Validate improvements with actual user requests
5. **Iterate Based on Results**: Refine examples based on code generation quality

## Questions for Discussion

1. Should we include ALL examples in prompts, or create a rotating subset?
2. Should we add warnings about common BOSL2 pitfalls (e.g., include vs use)?
3. Should we create separate specialized prompts for different model types (mechanical vs. artistic)?
4. How should we handle the balance between BOSL2 and vanilla OpenSCAD?

## Success Criteria

- Generated code consistently uses appropriate BOSL2 functions
- Thread specifications are correct (proper pitch for size)
- Attachments are used for multi-part assemblies
- Rounding makes parts more professional and printable
- Parameters remain extractable and functional
- Code is more concise while being more capable
