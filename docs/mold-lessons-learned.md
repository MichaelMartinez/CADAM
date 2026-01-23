# Mold Generator Lessons Learned

## Mold Generator Architecture

### Three-Part Mold Design

- **Left half**: Y < 0, contains left portion of part cavity
- **Right half**: Y > 0, contains right portion of part cavity
- **Top plate + piston**: Single piece - flat plate on top, piston extends downward into cavity

### Assembly Operation

1. Left + Right halves join at Y=0 parting plane
2. Material charged into cavity
3. Top plate descends - piston enters cavity, walls seal against left/right halves
4. Clamped/bolted together for curing

### Key Dimensions

| Dimension     | Formula                               | Purpose                             |
| ------------- | ------------------------------------- | ----------------------------------- |
| `mold_width`  | `part_width + 2 * wall`               | Exterior X dimension                |
| `mold_depth`  | `part_depth + 2 * wall`               | Exterior Y dimension                |
| `wall`        | `max(base_wall, bolt_hole_dia + 2.0)` | Wall thickness (adjusted for bolts) |
| `bolt_margin` | `bolt_hole_dia/2 + 1.0`               | Bolt center distance from mold edge |

---

## Issue: Horizontal Ledges at Cavity/Clearance Transition

**Symptom:** Thin horizontal ledges on left and right interior walls at transition between part cavity (below) and piston clearance zone (above). Blocks piston descent.

**Cause:** Clearance cut width (`part_width + 2*fit_tolerance`) narrower than hull cavity width.

**Solution:** Use `mold_width` for clearance cut X dimension (wall-to-wall cut).

**Files:** `services/step-converter/mold_generator.py` lines 1244, 1265

---

## Issue: Bolt Holes Exposed to Part Cavity

**Symptom:** Bolt holes intersect/expose the part cavity area.

**Cause:** `bolt_margin = wall * 0.8` positions bolt too close to cavity when wall is thin.

**Geometry:**

- Bolt center X: `mold_width/2 - bolt_margin`
- Bolt inner edge: `bolt_center - bolt_hole_dia/2`
- Cavity edge: `part_width/2`
- For no intersection: `bolt_inner_edge >= cavity_edge`

**Solution:**

1. Safe bolt_margin: `bolt_hole_dia/2 + 1.0mm`
2. Minimum wall: `bolt_hole_dia + 2.0mm`

**Files:** `services/step-converter/mold_generator.py` around lines 1160, 1272

---

## General Principles

### Clearance Cuts Must Match or Exceed Cavity

Always extend clearance cuts to mold walls to avoid ledges/steps at transitions.

### Bolt Placement Safety

Ensure bolt holes have clearance from both mold exterior edge AND part cavity interior.

### Wall Thickness Constraints

Wall thickness must accommodate both bolt holes and provide structural integrity. Enforce minimum wall based on bolt size.

---

## Fundamental: 3-Part Compression Mold with Configurable Split Axis

### The Problem with Full-Cavity in Side Pieces

For parts with through-holes (finger holes, tubes, etc.), putting the ENTIRE part
cavity in the left/right side pieces creates unusable molds:

- Through-holes become undercuts
- Cannot load material properly
- Cannot compress from above

### Why Split Axis Matters

Different part geometries require different split orientations:

- A part with **vertical holes** may work with Z-split but fail with X-split
- A part with **horizontal features** may need X or Y split
- **No single axis works for all parts** - user must choose based on geometry

### Correct 3-Part Mold Architecture

The part must be split along the configured axis (default Z) as well as at Y=0:

1. **Split part at axis midpoint** (configurable: X, Y, or Z)
2. **Lower half of part** → Female cavity in Left/Right sides
3. **Upper half of part** → Male protrusion on piston/top plate
4. **Assembly**: Piston's male form descends into clearance, compresses material

```
CORRECT DESIGN (Z-split):
                    ┌─────────────────┐
                    │   FLANGE        │  ← Flat plate
                    ├─────────────────┤
                    │  ╔═══════════╗  │  ← Male protrusion (UPPER HALF)
                    │  ║  (solid)  ║  │     Descends into clearance
                    │  ╚═══════════╝  │
     ───────────────┴─────────────────┴───────────────
     │                                               │
     │  LEFT/RIGHT HALVES                            │
     │  ┌───────────────────────────────────────┐   │
     │  │         (cavity)                      │   │  ← Female cavity (LOWER HALF)
     │  └───────────────────────────────────────┘   │
     │                                               │
     └───────────────────────────────────────────────┘
```

### Split Axis Selection Guide

| Part Feature             | Recommended Axis | Reason                                 |
| ------------------------ | ---------------- | -------------------------------------- |
| Vertical through-holes   | Z                | Holes split horizontally, no overhangs |
| Horizontal through-holes | X or Y           | Holes aligned with split, no overhangs |
| Symmetric around Z       | Z                | Natural compression direction          |
| Tall/narrow parts        | Z                | Shallow cavity depth                   |
| Flat/wide parts          | X or Y           | May reduce cavity depth                |

### Clearance Dimensions

The clearance opening in left/right halves must match the UPPER HALF bounds
(not full part, not hull), so the piston's male protrusion fits precisely.

### Key Principle

The piston is NOT just a flat plate with a shallow impression. It contains
substantial part geometry as a MALE form that compresses material.

### Implementation Files

- `services/step-converter/mold_generator.py`: `split_solid_at_plane()`, `generate_modular_box_mold()`
- `src/types/mold.ts`: `splitAxis` in `modularBox` config
- `src/components/mold/MoldConfigPanel.tsx`: Split axis UI and diagram
