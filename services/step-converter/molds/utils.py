"""
Utility functions for mold generation.

Extracted from mold_generator.py to allow reuse across different mold types.
"""

import os
import tempfile
from io import BytesIO
from typing import Any, Dict, List, Optional, Tuple

import numpy as np

from molds.logging_config import setup_mold_logger

logger = setup_mold_logger('molds.utils')

# Try to import trimesh
try:
    import trimesh
    TRIMESH_AVAILABLE = True
except ImportError:
    TRIMESH_AVAILABLE = False
    logger.warning("trimesh not installed. Mesh operations will fail.")

# Try to import Build123D
BUILD123D_AVAILABLE = False
try:
    from build123d import (
        Box, Location, Solid,
        export_step, export_stl,
    )
    BUILD123D_AVAILABLE = True
except ImportError:
    logger.warning("build123d not installed.")


def reorient_mesh(mesh, target_axis: str):
    """
    Reorient mesh so the target axis becomes Z (demold direction).

    Args:
        mesh: trimesh.Trimesh object
        target_axis: 'x', 'y', or 'z' - axis to become the new Z

    Returns:
        Transformed trimesh object
    """
    if target_axis == 'x':
        # Rotate 90 degrees around Y to move X to Z
        rotation = trimesh.transformations.rotation_matrix(
            np.pi / 2, [0, 1, 0]
        )
    elif target_axis == 'y':
        # Rotate -90 degrees around X to move Y to Z
        rotation = trimesh.transformations.rotation_matrix(
            -np.pi / 2, [1, 0, 0]
        )
    else:
        return mesh

    mesh.apply_transform(rotation)
    return mesh


def mesh_to_solid_build123d(mesh) -> Optional[Any]:
    """
    Convert Trimesh to Build123D Solid.

    This is the critical function for boolean operations with imported STL.
    Uses OCP's StlAPI_Reader + sewing to create a proper watertight solid.

    Args:
        mesh: trimesh.Trimesh object

    Returns:
        Build123D Solid object, or None on failure
    """
    if not BUILD123D_AVAILABLE:
        logger.error("Build123D not available for mesh conversion")
        return None

    try:
        from OCP.StlAPI import StlAPI_Reader
        from OCP.TopoDS import TopoDS_Shape, TopoDS
        from OCP.BRepBuilderAPI import BRepBuilderAPI_MakeSolid, BRepBuilderAPI_Sewing

        # Validate input mesh
        logger.debug(f"Converting mesh with {mesh.vertices.shape[0]} vertices")
        logger.debug(f"  Bounds: {mesh.bounds}")
        logger.debug(f"  Watertight: {mesh.is_watertight}")

        # Repair mesh if needed
        if not mesh.is_watertight:
            logger.debug("  Mesh is not watertight, attempting repair...")
            mesh.fill_holes()
            logger.debug(f"  After repair - Watertight: {mesh.is_watertight}")

        # Fix mesh normals for proper solid orientation
        mesh.fix_normals()

        # Export mesh to temporary STL file
        with tempfile.NamedTemporaryFile(suffix='.stl', delete=False) as tmp:
            mesh.export(tmp.name, file_type='stl')
            tmp_path = tmp.name

        try:
            # Read STL as compound of faces
            reader = StlAPI_Reader()
            shape = TopoDS_Shape()
            if not reader.Read(shape, tmp_path):
                logger.error("StlAPI_Reader failed to read STL")
                return None

            # Sew faces into a shell with appropriate tolerance
            sew = BRepBuilderAPI_Sewing(1e-4)
            sew.Add(shape)
            sew.Perform()
            sewn = sew.SewedShape()

            shape_type = sewn.ShapeType().name
            logger.debug(f"  Sewn shape type: {shape_type}")

            # Convert shell to solid
            if shape_type == 'TopAbs_SHELL':
                shell = TopoDS.Shell_s(sewn)
                builder = BRepBuilderAPI_MakeSolid()
                builder.Add(shell)
                if builder.IsDone():
                    occ_solid = builder.Solid()
                    solid = Solid(occ_solid)

                    vol = solid.volume
                    logger.debug(f"  Created solid with volume: {vol:.2f} mm^3")

                    if vol < 0:
                        logger.warning("Negative volume detected - normals may be inverted")

                    if vol == 0:
                        logger.error("Zero volume solid - mesh may be degenerate")
                        return None

                    return solid
                else:
                    logger.error("BRepBuilderAPI_MakeSolid failed")
                    return None

            elif shape_type == 'TopAbs_COMPOUND':
                logger.debug("  Got compound shape, attempting to extract shells...")
                from OCP.TopExp import TopExp_Explorer
                from OCP.TopAbs import TopAbs_SHELL

                explorer = TopExp_Explorer(sewn, TopAbs_SHELL)
                builder = BRepBuilderAPI_MakeSolid()

                shell_count = 0
                while explorer.More():
                    shell = TopoDS.Shell_s(explorer.Current())
                    builder.Add(shell)
                    shell_count += 1
                    explorer.Next()

                logger.debug(f"  Found {shell_count} shells in compound")

                if builder.IsDone():
                    occ_solid = builder.Solid()
                    solid = Solid(occ_solid)
                    logger.debug(f"  Created solid from compound with volume: {solid.volume:.2f} mm^3")
                    return solid
                else:
                    logger.error("Failed to create solid from compound")
                    return None
            else:
                logger.error(f"Sewn shape is {shape_type}, not SHELL or COMPOUND")
                return None

        finally:
            os.unlink(tmp_path)

    except Exception as e:
        logger.error(f"mesh_to_solid_build123d error: {e}")
        import traceback
        traceback.print_exc()
        return None


def offset_polygon(
    points: List[Tuple[float, float]],
    offset: float
) -> List[Tuple[float, float]]:
    """
    Offset a polygon outward (positive offset) or inward (negative).

    Args:
        points: List of (x, y) tuples representing the polygon
        offset: Offset distance (positive = outward, negative = inward)

    Returns:
        List of offset polygon points
    """
    try:
        from shapely.geometry import Polygon as ShapelyPolygon

        poly = ShapelyPolygon(points)
        buffered = poly.buffer(offset, join_style=2)  # 2 = mitre join

        if buffered.is_empty:
            return points

        # Get exterior coordinates
        coords = list(buffered.exterior.coords)[:-1]  # Remove closing duplicate
        return [(float(c[0]), float(c[1])) for c in coords]

    except ImportError:
        # Manual offset fallback
        return _manual_offset_polygon(points, offset)
    except Exception:
        return points


def _manual_offset_polygon(
    points: List[Tuple[float, float]],
    offset: float
) -> List[Tuple[float, float]]:
    """
    Simple polygon offset without Shapely (less accurate).

    Uses radial scaling from centroid - works well for convex polygons.
    """
    # Compute centroid
    cx = sum(p[0] for p in points) / len(points)
    cy = sum(p[1] for p in points) / len(points)

    # Scale from centroid
    result = []
    for px, py in points:
        dx, dy = px - cx, py - cy
        dist = np.sqrt(dx * dx + dy * dy)
        if dist > 0:
            scale = (dist + offset) / dist
            result.append((cx + dx * scale, cy + dy * scale))
        else:
            result.append((px, py))

    return result


def clip_polygon_to_half(
    points: List[Tuple[float, float]],
    y_min: Optional[float] = None,
    y_max: Optional[float] = None
) -> List[Tuple[float, float]]:
    """
    Clip 2D polygon to one side of a Y boundary.

    Args:
        points: List of (x, y) tuples representing the polygon
        y_min: Keep only Y > y_min (right side in our convention)
        y_max: Keep only Y < y_max (left side in our convention)

    Returns:
        Clipped polygon points
    """
    try:
        from shapely.geometry import Polygon as ShapelyPolygon, box

        poly = ShapelyPolygon(points)

        # Get bounds for clipping box
        minx, miny, maxx, maxy = poly.bounds

        if y_max is not None:  # Keep Y < y_max (left side)
            clip_box = box(minx - 1e6, miny - 1e6, maxx + 1e6, y_max)
        elif y_min is not None:  # Keep Y > y_min (right side)
            clip_box = box(minx - 1e6, y_min, maxx + 1e6, maxy + 1e6)
        else:
            return points

        clipped = poly.intersection(clip_box)

        if clipped.is_empty:
            return points

        # Handle MultiPolygon (take largest)
        if clipped.geom_type == 'MultiPolygon':
            clipped = max(clipped.geoms, key=lambda g: g.area)

        if clipped.geom_type != 'Polygon':
            return points

        # Get exterior coordinates (remove closing duplicate)
        coords = list(clipped.exterior.coords)[:-1]
        return [(float(c[0]), float(c[1])) for c in coords]

    except ImportError:
        return _manual_clip_polygon_to_half(points, y_min, y_max)
    except Exception as e:
        logger.warning(f"clip_polygon_to_half error: {e}")
        return points


def mirror_polygon_y(
    points: List[Tuple[float, float]]
) -> List[Tuple[float, float]]:
    """
    Mirror polygon about Y=0 axis: (x, y) -> (x, -y), with reversed order.

    This ensures symmetric left/right mold halves by mirroring the left
    contour to create the right contour (or vice versa).

    Args:
        points: List of (x, y) tuples representing the polygon

    Returns:
        Mirrored polygon points with winding direction preserved
    """
    if not points:
        return points

    # Mirror each point: (x, y) -> (x, -y)
    mirrored = [(p[0], -p[1]) for p in points]

    # Reverse order to maintain winding direction (CCW stays CCW)
    mirrored.reverse()

    return mirrored


def _manual_clip_polygon_to_half(
    points: List[Tuple[float, float]],
    y_min: Optional[float] = None,
    y_max: Optional[float] = None
) -> List[Tuple[float, float]]:
    """
    Simple polygon clipping without Shapely.
    Uses Sutherland-Hodgman algorithm for a single clip edge.
    """
    if not points:
        return points

    def clip_edge(
        poly: List[Tuple[float, float]],
        boundary_y: float,
        keep_below: bool
    ) -> List[Tuple[float, float]]:
        """Clip polygon against a horizontal line."""
        clipped = []
        n = len(poly)

        for i in range(n):
            curr = poly[i]
            next_pt = poly[(i + 1) % n]

            curr_inside = (curr[1] < boundary_y) if keep_below else (curr[1] > boundary_y)
            next_inside = (next_pt[1] < boundary_y) if keep_below else (next_pt[1] > boundary_y)

            if curr_inside:
                clipped.append(curr)
                if not next_inside:
                    # Compute intersection
                    t = (boundary_y - curr[1]) / (next_pt[1] - curr[1]) if (next_pt[1] - curr[1]) != 0 else 0
                    intersect = (curr[0] + t * (next_pt[0] - curr[0]), boundary_y)
                    clipped.append(intersect)
            elif next_inside:
                # Compute intersection
                t = (boundary_y - curr[1]) / (next_pt[1] - curr[1]) if (next_pt[1] - curr[1]) != 0 else 0
                intersect = (curr[0] + t * (next_pt[0] - curr[0]), boundary_y)
                clipped.append(intersect)

        return clipped

    result = points
    if y_max is not None:
        result = clip_edge(result, y_max, keep_below=True)
    if y_min is not None:
        result = clip_edge(result, y_min, keep_below=False)

    return result


def split_solid_at_plane(
    solid,
    axis: str,
    level: float
) -> Tuple[Optional[Any], Optional[Any]]:
    """
    Split a Build123D solid at a plane perpendicular to the given axis.

    Args:
        solid: Build123D Solid object
        axis: 'x', 'y', or 'z' - the axis perpendicular to the split plane
        level: coordinate value along the axis to split at

    Returns:
        Tuple of (lower_half, upper_half) - parts below/above the plane
        Either may be None if the solid doesn't cross the plane
    """
    if not BUILD123D_AVAILABLE:
        logger.error("Build123D not available for solid splitting")
        return None, None

    try:
        huge = 10000.0

        if axis == 'z':
            lower_cutter = Box(huge, huge, huge)
            lower_cutter = lower_cutter.moved(Location((0, 0, level - huge/2)))
            upper_cutter = Box(huge, huge, huge)
            upper_cutter = upper_cutter.moved(Location((0, 0, level + huge/2)))
        elif axis == 'y':
            lower_cutter = Box(huge, huge, huge)
            lower_cutter = lower_cutter.moved(Location((0, level - huge/2, 0)))
            upper_cutter = Box(huge, huge, huge)
            upper_cutter = upper_cutter.moved(Location((0, level + huge/2, 0)))
        elif axis == 'x':
            lower_cutter = Box(huge, huge, huge)
            lower_cutter = lower_cutter.moved(Location((level - huge/2, 0, 0)))
            upper_cutter = Box(huge, huge, huge)
            upper_cutter = upper_cutter.moved(Location((level + huge/2, 0, 0)))
        else:
            logger.warning(f"Unknown axis '{axis}', defaulting to Z")
            return split_solid_at_plane(solid, 'z', level)

        lower_half = solid & lower_cutter
        upper_half = solid & upper_cutter

        lower_vol = lower_half.volume if hasattr(lower_half, 'volume') else 0
        upper_vol = upper_half.volume if hasattr(upper_half, 'volume') else 0

        return (
            lower_half if lower_vol > 0.001 else None,
            upper_half if upper_vol > 0.001 else None
        )

    except Exception as e:
        logger.error(f"split_solid_at_plane error: {e}")
        return None, None


def split_solid_at_y_plane(
    solid,
    y_level: float = 0.0
) -> Tuple[Optional[Any], Optional[Any]]:
    """
    Split a Build123D solid at a Y plane (vertical parting line).

    Convenience wrapper around split_solid_at_plane.

    Args:
        solid: Build123D Solid object
        y_level: Y coordinate to split at (default 0)

    Returns:
        Tuple of (left_half, right_half) - parts with Y < y_level and Y > y_level
    """
    return split_solid_at_plane(solid, 'y', y_level)


def split_solid_at_z_plane(
    solid,
    z_level: float = 0.0
) -> Tuple[Optional[Any], Optional[Any]]:
    """
    Split a Build123D solid at a Z plane.

    Convenience wrapper around split_solid_at_plane.

    Args:
        solid: Build123D Solid object
        z_level: Z coordinate to split at (default 0)

    Returns:
        Tuple of (bottom_half, top_half) - parts below and above the plane
    """
    return split_solid_at_plane(solid, 'z', z_level)


def export_to_stl_bytes(shape) -> bytes:
    """
    Export Build123D shape to STL bytes.

    Args:
        shape: Build123D Part or Solid object

    Returns:
        STL file contents as bytes
    """
    with tempfile.NamedTemporaryFile(suffix='.stl', delete=False) as tmp:
        tmp_path = tmp.name

    try:
        export_stl(shape, tmp_path)
        with open(tmp_path, 'rb') as f:
            return f.read()
    finally:
        if os.path.exists(tmp_path):
            os.unlink(tmp_path)


def export_to_step_bytes(shape) -> bytes:
    """
    Export Build123D shape to STEP bytes.

    Args:
        shape: Build123D Part or Solid object

    Returns:
        STEP file contents as bytes
    """
    with tempfile.NamedTemporaryFile(suffix='.step', delete=False) as tmp:
        tmp_path = tmp.name

    try:
        export_step(shape, tmp_path)
        with open(tmp_path, 'rb') as f:
            return f.read()
    finally:
        if os.path.exists(tmp_path):
            os.unlink(tmp_path)


def validate_polygon(
    pts: List[Tuple[float, float]],
    name: str
) -> Tuple[bool, str]:
    """
    Validate polygon and return (is_valid, reason).

    Args:
        pts: List of (x, y) tuples
        name: Name for error messages

    Returns:
        Tuple of (is_valid, reason_string)
    """
    if not pts:
        return False, "empty points list"
    if len(pts) < 3:
        return False, f"only {len(pts)} points (need >= 3)"

    try:
        from shapely.geometry import Polygon as ShapelyPolygon
        from shapely.validation import explain_validity

        poly = ShapelyPolygon(pts)
        if not poly.is_valid:
            reason = explain_validity(poly)
            return False, f"invalid geometry: {reason}"
        if poly.area < 0.01:
            return False, f"area too small ({poly.area:.4f} mm^2)"
        return True, f"valid (area={poly.area:.2f} mm^2)"

    except ImportError:
        # Shapely not available, basic validation
        return len(pts) >= 3, "basic validation only (shapely unavailable)"
    except Exception as e:
        return False, f"validation error: {e}"


def fill_mesh_cavities(mesh, voxel_pitch: float = 0.5):
    """
    Fill internal cavities and through-holes in a mesh using voxelization.

    This eliminates undercuts caused by holes/tubes passing through the part.
    Uses voxelization + morphological closing to create a solid envelope.

    Args:
        mesh: trimesh.Trimesh object
        voxel_pitch: Voxel size in mm (smaller = more detail, slower)

    Returns:
        New trimesh with cavities filled
    """
    try:
        from scipy import ndimage
    except ImportError:
        logger.warning("scipy not available, skipping cavity fill")
        return mesh

    try:
        # Voxelize the mesh
        voxel_grid = mesh.voxelized(pitch=voxel_pitch)
        matrix = voxel_grid.matrix.copy()

        logger.debug(f"  Voxelizing mesh: {matrix.shape} voxels at {voxel_pitch}mm pitch")

        # Fill internal holes using binary_fill_holes
        filled_matrix = ndimage.binary_fill_holes(matrix)

        # Apply morphological closing to smooth and fill small gaps
        struct = ndimage.generate_binary_structure(3, 1)  # 6-connectivity
        filled_matrix = ndimage.binary_closing(filled_matrix, structure=struct, iterations=1)

        filled_count = int(np.sum(filled_matrix) - np.sum(matrix))
        logger.debug(f"  Filled {filled_count} voxels (internal cavities)")

        if filled_count == 0:
            logger.debug("  No internal cavities found, using original mesh")
            return mesh

        # Create new voxel grid with filled matrix
        filled_voxels = trimesh.voxel.VoxelGrid(
            trimesh.voxel.encoding.DenseEncoding(filled_matrix),
            transform=voxel_grid.transform
        )

        # Convert back to mesh using marching cubes
        try:
            filled_mesh = filled_voxels.marching_cubes
        except Exception as mc_err:
            logger.warning(f"Marching cubes failed: {mc_err}")
            logger.warning("Falling back to original mesh (install scikit-image for cavity fill)")
            return mesh

        # Repair if needed
        if hasattr(filled_mesh, 'is_watertight') and not filled_mesh.is_watertight:
            try:
                filled_mesh.fill_holes()
            except:
                pass

        # Align filled mesh bounds to match original
        original_bounds = mesh.bounds
        filled_bounds = filled_mesh.bounds

        original_size = original_bounds[1] - original_bounds[0]
        filled_size = filled_bounds[1] - filled_bounds[0]

        # Scale to match original size
        scale_factors = original_size / filled_size
        filled_mesh.vertices *= scale_factors

        # Recalculate bounds after scaling
        filled_bounds = filled_mesh.bounds

        # Translate to match original bounds
        offset = original_bounds[0] - filled_bounds[0]
        filled_mesh.vertices += offset

        logger.debug(f"  Filled mesh: {len(filled_mesh.vertices)} vertices")
        logger.debug(f"  Aligned to original bounds (scale: {scale_factors}, offset: {offset})")

        return filled_mesh

    except Exception as e:
        import traceback
        logger.warning(f"Cavity fill failed: {e}")
        logger.debug(traceback.format_exc())
        return mesh


def extract_projection_profile(
    solid,
    axis: str = 'z'
) -> List[Tuple[float, float]]:
    """
    Extract 2D contour profile from 3D solid using Build123D's project_to_viewport().

    This uses proper CAD projection to get the actual silhouette of the solid,
    preserving all concave features unlike convex hull approaches.

    Args:
        solid: Build123D Solid object
        axis: Projection axis ('z' projects to XY plane looking down Z)

    Returns:
        List of (x, y) tuples representing the projected profile polygon

    Raises:
        ValueError: If solid is None or projection fails
        ImportError: If Build123D is not available
    """
    if not BUILD123D_AVAILABLE:
        raise ImportError("Build123D not available for projection")

    if solid is None:
        raise ValueError("Cannot extract projection from None solid")

    try:
        from shapely.geometry import LineString, MultiLineString, Polygon as ShapelyPolygon
        from shapely.ops import polygonize, unary_union
    except ImportError:
        raise ImportError("shapely required for projection profile extraction")

    try:
        # Set up viewport based on projection axis
        # We want orthographic projection looking along the axis
        if axis == 'z':
            # Look down Z axis (project to XY plane)
            viewport_origin = (0, 0, 1000)  # Far above looking down
            viewport_up = (0, 1, 0)  # Y is up in viewport
        elif axis == 'x':
            # Look along X axis (project to YZ plane)
            viewport_origin = (1000, 0, 0)
            viewport_up = (0, 0, 1)
        elif axis == 'y':
            # Look along Y axis (project to XZ plane)
            viewport_origin = (0, 1000, 0)
            viewport_up = (0, 0, 1)
        else:
            raise ValueError(f"Unknown projection axis: {axis}")

        # Use Build123D's project_to_viewport for proper CAD projection
        # This returns visible and hidden edges as projected 2D geometry
        visible_edges, hidden_edges = solid.project_to_viewport(
            viewport_origin=viewport_origin,
            viewport_up=viewport_up,
            look_at=(0, 0, 0)  # Look at origin where part is centered
        )

        logger.debug(f"project_to_viewport: {len(visible_edges)} visible, {len(hidden_edges)} hidden edges")

        if not visible_edges:
            raise ValueError("No visible edges from projection")

        # Convert Build123D edges to Shapely LineStrings
        lines = []
        for edge in visible_edges:
            try:
                # Get edge vertices
                vertices = edge.vertices()
                if len(vertices) >= 2:
                    # Extract 2D coordinates based on projection axis
                    if axis == 'z':
                        # XY plane
                        pts = [(float(v.X), float(v.Y)) for v in vertices]
                    elif axis == 'x':
                        # YZ plane
                        pts = [(float(v.Y), float(v.Z)) for v in vertices]
                    else:  # axis == 'y'
                        # XZ plane
                        pts = [(float(v.X), float(v.Z)) for v in vertices]

                    if len(pts) >= 2:
                        lines.append(LineString(pts))
            except Exception as edge_err:
                logger.debug(f"Skipping edge: {edge_err}")
                continue

        if not lines:
            raise ValueError("No valid line segments from projection")

        logger.debug(f"Converted {len(lines)} edges to LineStrings")

        # Merge lines and polygonize to get the outer boundary
        merged = unary_union(lines)
        polygons = list(polygonize(merged))

        if not polygons:
            # If polygonize fails, use BOUNDING BOX instead of convex hull
            # Convex hull of edge endpoints can be SMALLER than actual boundary
            # if internal edges (holes, features) don't extend to boundary
            logger.debug("polygonize failed, using bounding box fallback")

            # Get solid's bounding box for reliable XY extent
            bbox = solid.bounding_box()
            if axis == 'z':
                x_min, x_max = bbox.min.X, bbox.max.X
                y_min, y_max = bbox.min.Y, bbox.max.Y
            elif axis == 'x':
                x_min, x_max = bbox.min.Y, bbox.max.Y
                y_min, y_max = bbox.min.Z, bbox.max.Z
            else:  # axis == 'y'
                x_min, x_max = bbox.min.X, bbox.max.X
                y_min, y_max = bbox.min.Z, bbox.max.Z

            bbox_coords = [
                (float(x_min), float(y_min)),
                (float(x_max), float(y_min)),
                (float(x_max), float(y_max)),
                (float(x_min), float(y_max))
            ]
            logger.debug(f"Projection profile: bounding box fallback "
                         f"({x_max - x_min:.2f} x {y_max - y_min:.2f}mm)")
            return bbox_coords

        # Take the largest polygon as the outer boundary
        largest = max(polygons, key=lambda p: p.area)
        coords = list(largest.exterior.coords)[:-1]

        logger.debug(f"Projection profile: {len(coords)} points from CAD projection")
        return [(float(c[0]), float(c[1])) for c in coords]

    except Exception as e:
        logger.warning(f"extract_projection_profile failed: {e}")
        import traceback
        logger.debug(traceback.format_exc())
        raise


def extract_solid_xy_footprint(
    solid,
    offset: float = 0.0
) -> Optional[List[Tuple[float, float]]]:
    """
    Extract the XY footprint of a solid using CAD projection.

    This derives the mold opening profile from the actual solid's XY projection
    rather than from an alpha shape. This guarantees the opening always matches
    or exceeds the part footprint, preventing ledges/overhangs in the mold cavity.

    Args:
        solid: Build123D Solid object
        offset: Optional outward offset for clearance (positive = expand)

    Returns:
        List of (x, y) tuples representing the XY footprint polygon,
        or None if extraction fails

    Fallback chain:
        1. Primary: Solid XY projection via project_to_viewport()
        2. Secondary: Bounding box rectangle
    """
    if solid is None:
        logger.debug("extract_solid_xy_footprint: solid is None")
        return None

    try:
        # Try CAD projection first
        profile_pts = extract_projection_profile(solid, axis='z')

        if profile_pts and len(profile_pts) >= 3:
            logger.debug(f"extract_solid_xy_footprint: got {len(profile_pts)} points from projection")

            # Apply offset if requested
            if offset != 0.0:
                profile_pts = offset_polygon(profile_pts, offset)
                logger.debug(f"  Applied offset of {offset:.2f}mm")

            return profile_pts

    except Exception as proj_err:
        logger.debug(f"extract_solid_xy_footprint projection failed: {proj_err}")

    # Fallback to bounding box rectangle
    try:
        bbox = solid.bounding_box()
        x_min, x_max = bbox.min.X, bbox.max.X
        y_min, y_max = bbox.min.Y, bbox.max.Y

        # Apply offset to bounding box
        x_min -= offset
        x_max += offset
        y_min -= offset
        y_max += offset

        rect_pts = [
            (x_min, y_min),
            (x_max, y_min),
            (x_max, y_max),
            (x_min, y_max)
        ]
        logger.debug(f"extract_solid_xy_footprint: using bounding box fallback "
                     f"({x_max - x_min:.2f} x {y_max - y_min:.2f}mm)")
        return rect_pts

    except Exception as bbox_err:
        logger.warning(f"extract_solid_xy_footprint bounding box failed: {bbox_err}")
        return None
