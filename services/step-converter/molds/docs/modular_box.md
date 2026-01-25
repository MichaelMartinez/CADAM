# Modular Box Mold - Lessons Learned

This document captures lessons learned during the development and debugging of the modular-box mold generator.

## Critical Issue: Asymmetric Mold Halves

### Problem

The modular-box mold generation was producing asymmetric left and right halves. When the mold halves were assembled, they didn't match up properly.

### Root Cause

**The mesh was being centered using `centroid` (center of mass) instead of bounding box center.**

```python
# BROKEN: Line 213 in original mold_generator.py
mesh.vertices -= mesh.centroid  # Centroid != geometric center!
```

For parts with holes or asymmetric geometry:

- **Centroid** = center of mass (depends on material distribution)
- **Bounding box center** = `(bounds[0] + bounds[1]) / 2` (pure geometry)

When using centroid:

1. After "centering", bounds are NOT symmetric (e.g., `z_min != -z_max`)
2. Polygon clipping at Y=0 produces unequal halves
3. Offset operations compound the asymmetry

### Solution

Center using bounding box center:

```python
# FIXED: In molds/base.py prepare_mesh()
bbox_center = (mesh.bounds[0] + mesh.bounds[1]) / 2
mesh.vertices -= bbox_center

# Now bounds ARE symmetric: x_min = -x_max, y_min = -y_max, z_min = -z_max
```

This ensures the mesh is geometrically centered, producing symmetric bounds regardless of the part's internal structure.

## Coordinate Tracking

### CoordinateTracker Class

The `CoordinateTracker` dataclass was introduced to:

1. Track mesh bounds through all transformations
2. Verify symmetry at each stage
3. Provide detailed logging for debugging

Key properties:

- `original_bounds`: Mesh bounds before centering
- `bbox_center`: The bounding box center used for centering
- `centering_offset`: The offset applied (`-bbox_center`)
- `final_bounds`: Mesh bounds after centering
- `is_symmetric()`: Verification method

### Verification Logging

The logging infrastructure provides checkpoints to verify correct centering:

```
09:15:32.124 [molds.base] DEBUG: ORIGINAL centroid: [2.34, -1.56, 5.67]
09:15:32.125 [molds.base] DEBUG: Bounding box center: [2.35, -1.55, 5.65]
09:15:32.125 [molds.base] DEBUG: Difference (centroid - bbox_center): [-0.01, -0.01, 0.02]
09:15:32.126 [molds.base] DEBUG: NOTE: Centroid differs significantly from bbox center
09:15:32.126 [molds.base] DEBUG: CENTERED bounds: [[-12.55, -13.75, -5.65], [12.55, 13.75, 5.65]]
09:15:32.126 [molds.base] DEBUG: Symmetry: X=True, Y=True, Z=True
```

## Contour-Following Limitations

### Z-Split Only

Contour-following (using alpha shape profile) only works correctly for Z-split axis because:

- The piston always compresses along Z (enters from above)
- The alpha shape is computed as XY projection (axis='z')
- For Y-split or X-split, the geometry logic conflicts with the mold parting line

For non-Z split axes, the code falls back to rectangular profile:

```python
if self.split_axis != 'z':
    logger.debug(f"NOTE: Contour-following disabled for {split_axis.upper()}-split")
    use_contour_profile = False
```

### Polygon Validation

Before using clipped polygons, validate them:

```python
left_valid, left_reason = validate_polygon(left_contour_pts, "left")
if not left_valid:
    # Fall back to rectangular
```

Common validation failures:

- Too few points (< 3)
- Self-intersecting polygon
- Area too small (degenerate)

## Mold Assembly Design

### 3-Piece Structure

1. **Left mold half** (Y < 0): Contains lower half of part cavity
2. **Right mold half** (Y > 0): Contains lower half of part cavity
3. **Top plate/piston**: Flange + upper half of part as male protrusion

### Part Splitting Strategy

The part is split at the axis midpoint:

- Z-split (default): `split_level = floor_thickness + (part_height / 2)`
- X-split: `split_level = 0.0` (part is centered at origin)
- Y-split: `split_level = 0.0`

The lower half goes into the mold cavity; the upper half becomes the piston protrusion.

### Profile Hierarchy

For contour-following design:

- **Mold inner opening** = alpha shape (piston_profile_pts)
- **Piston outer** = alpha shape - fit_tolerance

This gives a `fit_tolerance` gap all around for smooth sliding fit.

## Testing Checklist

After making changes, verify:

1. **Symmetry**: Left and right mold halves should have equal volumes
2. **Coordinate tracking**: `tracker.is_symmetric()` should return all `True`
3. **Profile alignment**: Alpha shape points should be symmetric around Y=0
4. **Export**: All 3 parts (left, right, top) should export successfully

### CLI Testing

```bash
# Test with Z-split (default)
python services/step-converter/mold_generator.py test.stl modular-box --save --split-axis z

# Test with alpha shape profile
python services/step-converter/mold_generator.py test.stl modular-box --save --alpha

# View Docker logs for detailed output
docker logs -f step-converter 2>&1 | grep -E "molds|SYMMETRY|bounds"
```

## Future Improvements

1. **Contour-following for non-Z splits**: Requires reimplementing the geometry logic for X/Y split axes

2. **Registration keys**: The current implementation has placeholder code for alignment pins between mold halves

3. **Draft angles**: Adding draft to vertical walls for easier demolding

4. **Venting channels**: Implementing air escape paths for compression molding
