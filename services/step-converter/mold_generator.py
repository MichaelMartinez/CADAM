"""
Mold Generator Module

Uses Build123D (OpenCascade-based) to generate compression molds from STL meshes.
Supports forged carbon two-part molds with proper shear edge geometry.
"""

import time
import base64
import tempfile
import os
from io import BytesIO
from typing import Dict, List, Optional, Tuple, Any
import numpy as np

try:
    import trimesh
    TRIMESH_AVAILABLE = True
except ImportError:
    TRIMESH_AVAILABLE = False
    print("WARNING: trimesh not installed. Mesh loading will fail.")

# Try to import Build123D (preferred)
BUILD123D_AVAILABLE = False
try:
    from build123d import (
        BuildPart, BuildSketch, Part, Sketch,
        Rectangle, Circle, Polygon, RegularPolygon,
        extrude, fillet, chamfer, offset,
        add, Locations, Location, Plane, Axis,
        Mode, Align, Kind, export_step, export_stl,
        Solid, Face, Wire, Edge, Compound,
        Box, Cylinder, Sphere, Cone,
        GridLocations
    )
    BUILD123D_AVAILABLE = True
except ImportError:
    print("WARNING: build123d not installed. Using FreeCAD fallback.")

# Fallback to FreeCAD if Build123D not available
FREECAD_AVAILABLE = False
if not BUILD123D_AVAILABLE:
    try:
        import sys
        freecad_paths = [
            "/usr/lib/freecad/lib",
            "/usr/lib/freecad-python3/lib",
            "/usr/share/freecad/lib",
        ]
        for p in freecad_paths:
            if os.path.exists(p) and p not in sys.path:
                sys.path.insert(0, p)
        import FreeCAD
        import Part as FreeCADPart
        FREECAD_AVAILABLE = True
    except ImportError:
        print("WARNING: FreeCAD not available either. Mold generation will fail.")


def fill_mesh_cavities(mesh, voxel_pitch: float = 0.5) -> 'trimesh.Trimesh':
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
        print("  WARNING: scipy not available, skipping cavity fill")
        return mesh

    try:
        # Voxelize the mesh
        voxel_grid = mesh.voxelized(pitch=voxel_pitch)
        matrix = voxel_grid.matrix.copy()

        print(f"  Voxelizing mesh: {matrix.shape} voxels at {voxel_pitch}mm pitch")

        # Fill internal holes using binary_fill_holes
        # This fills any region of False that is completely surrounded by True
        filled_matrix = ndimage.binary_fill_holes(matrix)

        # Optional: Apply morphological closing to smooth and fill small gaps
        # Closing = dilation followed by erosion
        struct = ndimage.generate_binary_structure(3, 1)  # 6-connectivity
        filled_matrix = ndimage.binary_closing(filled_matrix, structure=struct, iterations=1)

        filled_count = int(np.sum(filled_matrix) - np.sum(matrix))
        print(f"  Filled {filled_count} voxels (internal cavities)")

        if filled_count == 0:
            print("  No internal cavities found, using original mesh")
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
            print(f"  WARNING: Marching cubes failed: {mc_err}")
            print("  Falling back to original mesh (install scikit-image for cavity fill)")
            return mesh

        # The marching cubes mesh may need repair
        if hasattr(filled_mesh, 'is_watertight') and not filled_mesh.is_watertight:
            try:
                filled_mesh.fill_holes()
            except:
                pass  # Ignore fill_holes errors

        # Align filled mesh bounds to match original mesh bounds
        # The voxelized mesh may have different scale/position due to voxel grid
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

        print(f"  Filled mesh: {len(filled_mesh.vertices)} vertices, watertight={getattr(filled_mesh, 'is_watertight', 'unknown')}")
        print(f"  Aligned to original bounds (scale: {scale_factors}, offset: {offset})")

        return filled_mesh

    except Exception as e:
        import traceback
        print(f"  WARNING: Cavity fill failed: {e}")
        print(f"  {traceback.format_exc()}")
        return mesh


def generate_mold(
    stl_data: bytes,
    config: Dict[str, Any],
    alpha_shape_points: Optional[List[List[float]]] = None
) -> Dict[str, Any]:
    """
    Generate a compression mold from an STL mesh.

    Args:
        stl_data: Raw STL file bytes
        config: Mold configuration with keys:
            - moldType: 'standard' | 'forged-carbon'
            - moldShape: 'rectangular' | 'circular'
            - orientation: 'x' | 'y' | 'z'
            - shearEdgeGap: float (mm) - tight seal tolerance (0.05-0.15)
            - shearEdgeDepth: float (mm) - vertical interface (2-5)
            - clearanceRunout: float (mm) - clearance after seal (0.2-0.6)
            - draftAngle: float (degrees) - draft for demolding
            - wallThickness: float (mm)
            - useAlphaShapeProfile: bool
            - outputFormat: 'stl' | 'step' | 'both'
            - pistonHeight: float (mm)
            - bucketHeight: float (mm)
            - handle: {width, depth, height}
            - registrationKeys: {enabled, type, size, tolerance}
        alpha_shape_points: Pre-computed alpha shape for profile generation

    Returns:
        Result dictionary with generated mold data
    """
    start_time = time.time()

    result = {
        "success": True,
        "error": None,
        "generationTimeMs": 0,
        "stats": {}
    }

    if not TRIMESH_AVAILABLE:
        return {
            "success": False,
            "error": "Trimesh library not available for mesh loading",
            "generationTimeMs": int((time.time() - start_time) * 1000)
        }

    if not BUILD123D_AVAILABLE and not FREECAD_AVAILABLE:
        return {
            "success": False,
            "error": "Neither Build123D nor FreeCAD available for mold generation",
            "generationTimeMs": int((time.time() - start_time) * 1000)
        }

    try:
        # Load mesh
        mesh = trimesh.load(BytesIO(stl_data), file_type='stl')

        # Ensure mesh is centered
        mesh.vertices -= mesh.centroid

        # Get bounding box
        bounds = mesh.bounds
        bbox = bounds[1] - bounds[0]

        # Parse config with defaults
        mold_type = config.get("moldType", "forged-carbon")
        mold_shape = config.get("moldShape", "rectangular")
        orientation = config.get("orientation", "z")
        shear_edge_gap = config.get("shearEdgeGap", 0.075)
        shear_edge_depth = config.get("shearEdgeDepth", 2.5)
        clearance_runout = config.get("clearanceRunout", 0.4)
        draft_angle = config.get("draftAngle", 0.0)
        wall_thickness = config.get("wallThickness", 5.0)
        use_alpha_shape = config.get("useAlphaShapeProfile", True)
        output_format = config.get("outputFormat", "stl")

        # Reorient mesh if needed
        if orientation != 'z':
            mesh = reorient_mesh(mesh, orientation)
            bounds = mesh.bounds
            bbox = bounds[1] - bounds[0]

        # Compute alpha shape if needed but not provided
        computed_alpha_points = alpha_shape_points
        if use_alpha_shape and computed_alpha_points is None:
            try:
                from mesh_analysis import compute_alpha_shape
                alpha_result = compute_alpha_shape(mesh, 'z', alpha=0.05)
                if alpha_result and alpha_result.get("points"):
                    computed_alpha_points = alpha_result["points"]
                    print(f"Computed alpha shape with {len(computed_alpha_points)} points")
                else:
                    print("Alpha shape computation returned no points, using bounding box")
            except ImportError:
                print("mesh_analysis not available for alpha shape computation")
            except Exception as e:
                print(f"Alpha shape computation failed: {e}")

        # Fallback to bounding box rectangle if no alpha shape
        if use_alpha_shape and computed_alpha_points is None:
            hw, hd = float(bbox[0]/2), float(bbox[1]/2)
            computed_alpha_points = [[-hw, -hd], [hw, -hd], [hw, hd], [-hw, hd]]
            print("Using bounding box rectangle for profile")

        # Generate based on mold type
        if mold_type == "forged-carbon":
            result = generate_forged_carbon_mold(
                mesh=mesh,
                bbox=bbox,
                config=config,
                alpha_shape_points=computed_alpha_points if use_alpha_shape else None,
                output_format=output_format
            )
        elif mold_type == "modular-box":
            result = generate_modular_box_mold(
                mesh=mesh,
                bbox=bbox,
                config=config,
                alpha_shape_points=computed_alpha_points if use_alpha_shape else None,
                output_format=output_format
            )
        else:
            result = generate_standard_mold(
                mesh=mesh,
                bbox=bbox,
                config=config,
                alpha_shape_points=computed_alpha_points if use_alpha_shape else None,
                output_format=output_format
            )

    except Exception as e:
        import traceback
        result = {
            "success": False,
            "error": f"Mold generation failed: {str(e)}\n{traceback.format_exc()}",
        }

    result["generationTimeMs"] = int((time.time() - start_time) * 1000)
    return result


def reorient_mesh(mesh, target_axis: str):
    """Reorient mesh so the target axis becomes Z (demold direction)."""
    if target_axis == 'x':
        # Rotate 90° around Y to move X to Z
        rotation = trimesh.transformations.rotation_matrix(
            np.pi / 2, [0, 1, 0]
        )
    elif target_axis == 'y':
        # Rotate -90° around X to move Y to Z
        rotation = trimesh.transformations.rotation_matrix(
            -np.pi / 2, [1, 0, 0]
        )
    else:
        return mesh

    mesh.apply_transform(rotation)
    return mesh


def generate_forged_carbon_mold(
    mesh,
    bbox: np.ndarray,
    config: Dict[str, Any],
    alpha_shape_points: Optional[List[List[float]]],
    output_format: str
) -> Dict[str, Any]:
    """
    Generate forged carbon compression mold (piston + bucket).

    The shear edge design creates a telescopic seal:
    - Piston outer edge matches bucket inner edge with tight gap
    - Shear edge extends 2-5mm vertically for proper seal
    - After seal region, clearance opens up for smooth piston travel
    """
    result = {"success": True, "stats": {}}

    # Extract dimensions
    part_width = float(bbox[0])
    part_depth = float(bbox[1])
    part_height = float(bbox[2])

    # Config values
    shear_gap = config.get("shearEdgeGap", 0.075)
    shear_depth = config.get("shearEdgeDepth", 2.5)
    clearance = config.get("clearanceRunout", 0.4)
    draft = config.get("draftAngle", 0.0)
    wall = config.get("wallThickness", 5.0)

    piston_height = config.get("pistonHeight", part_height + 10)
    bucket_height = config.get("bucketHeight", part_height + wall + 20)

    handle = config.get("handle", {
        "width": min(part_width * 0.6, 50),
        "depth": min(part_depth * 0.6, 50),
        "height": 15
    })

    # Mold outer dimensions
    mold_width = part_width + 2 * wall + 2 * clearance
    mold_depth = part_depth + 2 * wall + 2 * clearance

    if BUILD123D_AVAILABLE:
        result = generate_forged_carbon_build123d(
            mesh=mesh,
            part_dims=(part_width, part_depth, part_height),
            mold_dims=(mold_width, mold_depth),
            shear_gap=shear_gap,
            shear_depth=shear_depth,
            clearance=clearance,
            draft=draft,
            wall=wall,
            piston_height=piston_height,
            bucket_height=bucket_height,
            handle=handle,
            alpha_shape_points=alpha_shape_points,
            output_format=output_format,
            config=config
        )
    else:
        result = generate_forged_carbon_freecad(
            mesh=mesh,
            part_dims=(part_width, part_depth, part_height),
            mold_dims=(mold_width, mold_depth),
            shear_gap=shear_gap,
            shear_depth=shear_depth,
            clearance=clearance,
            draft=draft,
            wall=wall,
            piston_height=piston_height,
            bucket_height=bucket_height,
            handle=handle,
            alpha_shape_points=alpha_shape_points,
            output_format=output_format
        )

    return result


def generate_forged_carbon_build123d(
    mesh,
    part_dims: Tuple[float, float, float],
    mold_dims: Tuple[float, float],
    shear_gap: float,
    shear_depth: float,
    clearance: float,
    draft: float,
    wall: float,
    piston_height: float,
    bucket_height: float,
    handle: Dict[str, float],
    alpha_shape_points: Optional[List[List[float]]],
    output_format: str,
    config: Dict[str, Any]
) -> Dict[str, Any]:
    """Generate forged carbon mold using Build123D."""
    result = {"success": True, "stats": {}}

    part_width, part_depth, part_height = part_dims
    mold_width, mold_depth = mold_dims

    try:
        # Convert mesh to solid for boolean operations
        part_solid = mesh_to_solid_build123d(mesh)

        if part_solid is None:
            return {
                "success": False,
                "error": "Failed to convert mesh to solid for boolean operations"
            }

        # Create profile polygon (alpha shape or rectangle)
        if alpha_shape_points and len(alpha_shape_points) >= 3:
            piston_profile_pts = [(p[0], p[1]) for p in alpha_shape_points]
        else:
            # Rectangle profile
            hw, hd = part_width / 2, part_depth / 2
            piston_profile_pts = [(-hw, -hd), (hw, -hd), (hw, hd), (-hw, hd)]

        # === PISTON ===
        # Pre-compute the inward offset profile for the clearance section
        # This avoids the problematic offset() within BuildSketch context
        clearance_profile_pts = offset_polygon(piston_profile_pts, -clearance)

        with BuildPart() as piston_builder:
            # Shear edge region (tight tolerance profile)
            with BuildSketch(Plane.XY):
                Polygon(piston_profile_pts)
            extrude(amount=shear_depth)

            # Main body above shear edge (with clearance runout)
            with BuildSketch(Plane.XY.offset(shear_depth)):
                Polygon(clearance_profile_pts)  # Use pre-computed offset profile
            extrude(amount=piston_height - shear_depth)

            # Cut part cavity from bottom
            # Position part at Z=0 (bottom of piston)
            add(part_solid, mode=Mode.SUBTRACT)

            # Add handle on top
            with BuildSketch(Plane.XY.offset(piston_height)):
                Rectangle(handle["width"], handle["depth"])
            extrude(amount=handle["height"])

        piston = piston_builder.part

        # === BUCKET ===
        # Offset profile outward for cavity
        cavity_profile_pts = offset_polygon(piston_profile_pts, shear_gap)

        with BuildPart() as bucket_builder:
            # Outer shell
            with BuildSketch(Plane.XY):
                Rectangle(mold_width + 2 * wall, mold_depth + 2 * wall)
            extrude(amount=bucket_height)

            # Shear edge cavity (tight tolerance)
            with BuildSketch(Plane.XY.offset(wall)):
                Polygon(cavity_profile_pts)
            extrude(amount=bucket_height - wall, mode=Mode.SUBTRACT)

            # Part cavity in floor
            # Part sits at Z = wall (floor level)
            part_at_floor = part_solid.moved(Location((0, 0, wall)))
            add(part_at_floor, mode=Mode.SUBTRACT)

        bucket = bucket_builder.part

        # Add registration keys if enabled
        reg_keys = config.get("registrationKeys", {})
        if reg_keys.get("enabled", False):
            piston, bucket = add_registration_keys_build123d(
                piston, bucket, piston_profile_pts, reg_keys, wall
            )

        # Export
        result["stats"] = {
            "pistonVolume": piston.volume if hasattr(piston, 'volume') else 0,
            "bucketVolume": bucket.volume if hasattr(bucket, 'volume') else 0,
        }

        if output_format in ['stl', 'both']:
            piston_stl = export_to_stl_bytes(piston)
            bucket_stl = export_to_stl_bytes(bucket)
            result["pistonStl"] = base64.b64encode(piston_stl).decode('utf-8')
            result["bucketStl"] = base64.b64encode(bucket_stl).decode('utf-8')

        if output_format in ['step', 'both']:
            piston_step = export_to_step_bytes(piston)
            bucket_step = export_to_step_bytes(bucket)
            result["pistonStep"] = base64.b64encode(piston_step).decode('utf-8')
            result["bucketStep"] = base64.b64encode(bucket_step).decode('utf-8')

    except Exception as e:
        import traceback
        result = {
            "success": False,
            "error": f"Build123D generation failed: {str(e)}\n{traceback.format_exc()}"
        }

    return result


def mesh_to_solid_build123d(mesh) -> Optional[Any]:
    """
    Convert Trimesh to Build123D Solid.

    This is the critical function for boolean operations with imported STL.
    Uses OCP's StlAPI_Reader + sewing to create a proper watertight solid.
    """
    try:
        from OCP.StlAPI import StlAPI_Reader
        from OCP.TopoDS import TopoDS_Shape, TopoDS
        from OCP.BRepBuilderAPI import BRepBuilderAPI_MakeSolid, BRepBuilderAPI_Sewing

        # Validate input mesh
        print(f"mesh_to_solid_build123d: Converting mesh with {mesh.vertices.shape[0]} vertices")
        print(f"  Bounds: {mesh.bounds}")
        print(f"  Watertight: {mesh.is_watertight}")

        # Repair mesh if needed
        if not mesh.is_watertight:
            print("  Mesh is not watertight, attempting repair...")
            mesh.fill_holes()
            print(f"  After repair - Watertight: {mesh.is_watertight}")

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
                print("mesh_to_solid_build123d: StlAPI_Reader failed to read STL")
                return None

            # Sew faces into a shell with appropriate tolerance
            # Use a larger tolerance for potentially imperfect meshes
            sew = BRepBuilderAPI_Sewing(1e-4)  # Increased from 1e-6 for robustness
            sew.Add(shape)
            sew.Perform()
            sewn = sew.SewedShape()

            shape_type = sewn.ShapeType().name
            print(f"  Sewn shape type: {shape_type}")

            # Convert shell to solid
            if shape_type == 'TopAbs_SHELL':
                shell = TopoDS.Shell_s(sewn)
                builder = BRepBuilderAPI_MakeSolid()
                builder.Add(shell)
                if builder.IsDone():
                    occ_solid = builder.Solid()
                    solid = Solid(occ_solid)

                    # Validate output
                    vol = solid.volume
                    print(f"  Created solid with volume: {vol:.2f} mm³")

                    if vol < 0:
                        print("  WARNING: Negative volume detected - normals may be inverted")
                        # The solid might still work for boolean operations
                        # Build123D typically handles this internally

                    if vol == 0:
                        print("  ERROR: Zero volume solid - mesh may be degenerate")
                        return None

                    return solid
                else:
                    print("mesh_to_solid_build123d: BRepBuilderAPI_MakeSolid failed")
                    return None
            elif shape_type == 'TopAbs_COMPOUND':
                # Sometimes we get a compound of shells, try to extract and combine
                print("  Got compound shape, attempting to extract shells...")
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

                print(f"  Found {shell_count} shells in compound")

                if builder.IsDone():
                    occ_solid = builder.Solid()
                    solid = Solid(occ_solid)
                    print(f"  Created solid from compound with volume: {solid.volume:.2f} mm³")
                    return solid
                else:
                    print("mesh_to_solid_build123d: Failed to create solid from compound")
                    return None
            else:
                print(f"mesh_to_solid_build123d: Sewn shape is {shape_type}, not SHELL or COMPOUND")
                return None

        finally:
            os.unlink(tmp_path)

    except Exception as e:
        print(f"mesh_to_solid_build123d error: {e}")
        import traceback
        traceback.print_exc()
        return None


def offset_polygon(points: List[Tuple[float, float]], offset: float) -> List[Tuple[float, float]]:
    """Offset a polygon outward (positive offset) or inward (negative)."""
    try:
        from shapely.geometry import Polygon as ShapelyPolygon
        from shapely.geometry import LinearRing

        poly = ShapelyPolygon(points)
        buffered = poly.buffer(offset, join_style=2)  # 2 = mitre join

        if buffered.is_empty:
            return points

        # Get exterior coordinates
        coords = list(buffered.exterior.coords)[:-1]  # Remove closing duplicate
        return [(float(c[0]), float(c[1])) for c in coords]

    except ImportError:
        # Manual offset fallback (simple approach)
        return manual_offset_polygon(points, offset)
    except Exception:
        return points


def manual_offset_polygon(points: List[Tuple[float, float]], offset: float) -> List[Tuple[float, float]]:
    """Simple polygon offset without Shapely (less accurate)."""
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
        # Fallback: simple Y-filter (less accurate but works)
        return manual_clip_polygon_to_half(points, y_min, y_max)
    except Exception as e:
        print(f"clip_polygon_to_half error: {e}")
        return points


def manual_clip_polygon_to_half(
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

    def clip_edge(poly: List[Tuple[float, float]], boundary_y: float, keep_below: bool) -> List[Tuple[float, float]]:
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


def split_solid_at_z_plane(solid, z_level: float = 0.0) -> Tuple[Optional[Any], Optional[Any]]:
    """
    Split a Build123D solid at a Z plane.

    Args:
        solid: Build123D Solid object
        z_level: Z coordinate to split at (default 0)

    Returns:
        Tuple of (bottom_half, top_half) - parts below and above the plane
        Either may be None if the solid doesn't cross the plane
    """
    try:
        # Create a large cutting box
        huge = 10000.0  # Large enough for any reasonable part

        # Bottom cutting box (Z from -huge to z_level)
        bottom_cutter = Box(huge, huge, huge)
        bottom_cutter = bottom_cutter.moved(Location((0, 0, z_level - huge/2)))

        # Top cutting box (Z from z_level to +huge)
        top_cutter = Box(huge, huge, huge)
        top_cutter = top_cutter.moved(Location((0, 0, z_level + huge/2)))

        # Intersect to get halves
        bottom_half = solid & bottom_cutter
        top_half = solid & top_cutter

        # Check volumes
        bottom_vol = bottom_half.volume if hasattr(bottom_half, 'volume') else 0
        top_vol = top_half.volume if hasattr(top_half, 'volume') else 0

        return (
            bottom_half if bottom_vol > 0.001 else None,
            top_half if top_vol > 0.001 else None
        )

    except Exception as e:
        print(f"split_solid_at_z_plane error: {e}")
        return None, None


def split_solid_at_y_plane(solid, y_level: float = 0.0) -> Tuple[Optional[Any], Optional[Any]]:
    """
    Split a Build123D solid at a Y plane (vertical parting line).

    Args:
        solid: Build123D Solid object
        y_level: Y coordinate to split at (default 0)

    Returns:
        Tuple of (left_half, right_half) - parts with Y < y_level and Y > y_level
        Either may be None if the solid doesn't cross the plane
    """
    try:
        # Create a large cutting box
        huge = 10000.0

        # Left cutting box (Y from -huge to y_level)
        left_cutter = Box(huge, huge, huge)
        left_cutter = left_cutter.moved(Location((0, y_level - huge/2, 0)))

        # Right cutting box (Y from y_level to +huge)
        right_cutter = Box(huge, huge, huge)
        right_cutter = right_cutter.moved(Location((0, y_level + huge/2, 0)))

        # Intersect to get halves
        left_half = solid & left_cutter
        right_half = solid & right_cutter

        # Check volumes
        left_vol = left_half.volume if hasattr(left_half, 'volume') else 0
        right_vol = right_half.volume if hasattr(right_half, 'volume') else 0

        return (
            left_half if left_vol > 0.001 else None,
            right_half if right_vol > 0.001 else None
        )

    except Exception as e:
        print(f"split_solid_at_y_plane error: {e}")
        return None, None


def split_solid_at_plane(solid, axis: str, level: float) -> Tuple[Optional[Any], Optional[Any]]:
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
    try:
        huge = 10000.0

        if axis == 'z':
            # Split at Z plane
            lower_cutter = Box(huge, huge, huge)
            lower_cutter = lower_cutter.moved(Location((0, 0, level - huge/2)))
            upper_cutter = Box(huge, huge, huge)
            upper_cutter = upper_cutter.moved(Location((0, 0, level + huge/2)))
        elif axis == 'y':
            # Split at Y plane
            lower_cutter = Box(huge, huge, huge)
            lower_cutter = lower_cutter.moved(Location((0, level - huge/2, 0)))
            upper_cutter = Box(huge, huge, huge)
            upper_cutter = upper_cutter.moved(Location((0, level + huge/2, 0)))
        elif axis == 'x':
            # Split at X plane
            lower_cutter = Box(huge, huge, huge)
            lower_cutter = lower_cutter.moved(Location((level - huge/2, 0, 0)))
            upper_cutter = Box(huge, huge, huge)
            upper_cutter = upper_cutter.moved(Location((level + huge/2, 0, 0)))
        else:
            print(f"split_solid_at_plane: Unknown axis '{axis}', defaulting to Z")
            return split_solid_at_z_plane(solid, level)

        lower_half = solid & lower_cutter
        upper_half = solid & upper_cutter

        lower_vol = lower_half.volume if hasattr(lower_half, 'volume') else 0
        upper_vol = upper_half.volume if hasattr(upper_half, 'volume') else 0

        return (
            lower_half if lower_vol > 0.001 else None,
            upper_half if upper_vol > 0.001 else None
        )

    except Exception as e:
        print(f"split_solid_at_plane error: {e}")
        return None, None


def add_registration_keys_build123d(piston, bucket, profile_pts, config, wall):
    """Add registration keys to piston and bucket for alignment."""
    key_type = config.get("type", "cone")
    key_size = config.get("size", 4)
    tolerance = config.get("tolerance", 0.4)

    # Place keys at corners of profile bounding box
    min_x = min(p[0] for p in profile_pts)
    max_x = max(p[0] for p in profile_pts)
    min_y = min(p[1] for p in profile_pts)
    max_y = max(p[1] for p in profile_pts)

    # Key positions (outside the profile)
    margin = key_size * 2
    positions = [
        (min_x - margin, min_y - margin),
        (max_x + margin, min_y - margin),
        (max_x + margin, max_y + margin),
        (min_x - margin, max_y + margin),
    ]

    # Add positive keys to piston (male)
    # Add negative keys to bucket (female) with tolerance

    # For now, return unchanged - registration keys are complex
    # TODO: Implement full registration key geometry
    return piston, bucket


def export_to_stl_bytes(shape) -> bytes:
    """Export Build123D shape to STL bytes."""
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
    """Export Build123D shape to STEP bytes."""
    with tempfile.NamedTemporaryFile(suffix='.step', delete=False) as tmp:
        tmp_path = tmp.name

    try:
        export_step(shape, tmp_path)
        with open(tmp_path, 'rb') as f:
            return f.read()
    finally:
        if os.path.exists(tmp_path):
            os.unlink(tmp_path)


def generate_forged_carbon_freecad(
    mesh,
    part_dims: Tuple[float, float, float],
    mold_dims: Tuple[float, float],
    shear_gap: float,
    shear_depth: float,
    clearance: float,
    draft: float,
    wall: float,
    piston_height: float,
    bucket_height: float,
    handle: Dict[str, float],
    alpha_shape_points: Optional[List[List[float]]],
    output_format: str
) -> Dict[str, Any]:
    """
    Fallback: Generate forged carbon mold using raw FreeCAD.
    This is more verbose but works without Build123D.
    """
    import FreeCAD
    import Part as FreeCADPart

    result = {"success": True, "stats": {}}

    part_width, part_depth, part_height = part_dims
    mold_width, mold_depth = mold_dims

    try:
        # Create FreeCAD document
        doc = FreeCAD.newDocument("MoldGen")

        # Convert mesh to solid
        part_shape = mesh_to_freecad_shape(mesh)
        if part_shape is None:
            return {"success": False, "error": "Failed to convert mesh to FreeCAD shape"}

        # Create piston
        # Simple box-based approach for FreeCAD fallback
        piston_box = FreeCADPart.makeBox(
            part_width + 2 * clearance,
            part_depth + 2 * clearance,
            piston_height,
            FreeCAD.Vector(
                -(part_width + 2 * clearance) / 2,
                -(part_depth + 2 * clearance) / 2,
                0
            )
        )

        # Cut part cavity
        piston_shape = piston_box.cut(part_shape)

        # Add handle
        handle_box = FreeCADPart.makeBox(
            handle["width"],
            handle["depth"],
            handle["height"],
            FreeCAD.Vector(
                -handle["width"] / 2,
                -handle["depth"] / 2,
                piston_height
            )
        )
        piston_shape = piston_shape.fuse(handle_box)

        # Create bucket
        outer_box = FreeCADPart.makeBox(
            mold_width + 2 * wall,
            mold_depth + 2 * wall,
            bucket_height,
            FreeCAD.Vector(
                -(mold_width + 2 * wall) / 2,
                -(mold_depth + 2 * wall) / 2,
                0
            )
        )

        # Inner cavity
        inner_box = FreeCADPart.makeBox(
            part_width + 2 * clearance + 2 * shear_gap,
            part_depth + 2 * clearance + 2 * shear_gap,
            bucket_height - wall,
            FreeCAD.Vector(
                -(part_width + 2 * clearance + 2 * shear_gap) / 2,
                -(part_depth + 2 * clearance + 2 * shear_gap) / 2,
                wall
            )
        )
        bucket_shape = outer_box.cut(inner_box)

        # Cut part cavity from floor
        part_at_floor = part_shape.copy()
        part_at_floor.translate(FreeCAD.Vector(0, 0, wall))
        bucket_shape = bucket_shape.cut(part_at_floor)

        # Export
        result["stats"] = {
            "pistonVolume": piston_shape.Volume,
            "bucketVolume": bucket_shape.Volume,
        }

        with tempfile.TemporaryDirectory() as tmpdir:
            if output_format in ['stl', 'both']:
                piston_stl_path = os.path.join(tmpdir, "piston.stl")
                bucket_stl_path = os.path.join(tmpdir, "bucket.stl")

                piston_shape.exportStl(piston_stl_path)
                bucket_shape.exportStl(bucket_stl_path)

                with open(piston_stl_path, 'rb') as f:
                    result["pistonStl"] = base64.b64encode(f.read()).decode('utf-8')
                with open(bucket_stl_path, 'rb') as f:
                    result["bucketStl"] = base64.b64encode(f.read()).decode('utf-8')

            if output_format in ['step', 'both']:
                piston_step_path = os.path.join(tmpdir, "piston.step")
                bucket_step_path = os.path.join(tmpdir, "bucket.step")

                piston_shape.exportStep(piston_step_path)
                bucket_shape.exportStep(bucket_step_path)

                with open(piston_step_path, 'rb') as f:
                    result["pistonStep"] = base64.b64encode(f.read()).decode('utf-8')
                with open(bucket_step_path, 'rb') as f:
                    result["bucketStep"] = base64.b64encode(f.read()).decode('utf-8')

        FreeCAD.closeDocument(doc.Name)

    except Exception as e:
        import traceback
        result = {
            "success": False,
            "error": f"FreeCAD generation failed: {str(e)}\n{traceback.format_exc()}"
        }

    return result


def mesh_to_freecad_shape(mesh):
    """Convert Trimesh to FreeCAD Shape."""
    import FreeCAD
    import Part as FreeCADPart
    import Mesh

    try:
        # Export to temp STL
        with tempfile.NamedTemporaryFile(suffix='.stl', delete=False) as tmp:
            mesh.export(tmp.name)
            tmp_path = tmp.name

        try:
            # Import as FreeCAD mesh
            fc_mesh = Mesh.Mesh(tmp_path)

            # Convert mesh to shape
            shape = FreeCADPart.Shape()
            shape.makeShapeFromMesh(fc_mesh.Topology, 0.1)

            # Make solid
            solid = FreeCADPart.makeSolid(shape)
            return solid

        finally:
            os.unlink(tmp_path)

    except Exception as e:
        print(f"mesh_to_freecad_shape error: {e}")
        return None


def generate_modular_box_mold(
    mesh,
    bbox: np.ndarray,
    config: Dict[str, Any],
    alpha_shape_points: Optional[List[List[float]]],
    output_format: str
) -> Dict[str, Any]:
    """
    Generate 3-piece split-cavity modular compression mold with configurable split axis.

    This design creates a 3-piece mold for compression molding:
    - Left half: Y < 0 portion (contains LOWER half of part cavity)
    - Right half: Y > 0 portion (contains LOWER half of part cavity)
    - Top plate (piston): Flange + UPPER half of part as male protrusion

    The key insight for parts with through-holes:
    1. Split the part at the configured axis midpoint (default: Z)
    2. LOWER half of part → Female cavity in Left/Right sides
    3. UPPER half of part → Male protrusion on piston
    4. Piston descends, its male form compresses material against the female cavity

    Split Axis Options:
    - Z (default): Vertical compression, part split horizontally at Z midpoint
    - X: Horizontal compression along X, part split at X midpoint
    - Y: Horizontal compression along Y, part split at Y midpoint

    Assembly diagram (Z-split):
                    ┌─────────────────┐
                    │   FLANGE        │  ← Flat plate
                    ├─────────────────┤
                    │  ╔═══════════╗  │  ← Male protrusion (UPPER HALF of part)
                    │  ║  (solid)  ║  │     Descends into clearance
                    │  ╚═══════════╝  │
     ───────────────┴─────────────────┴───────────────
     │                                               │
     │  LEFT/RIGHT HALVES                            │
     │  ┌───────────────────────────────────────┐   │
     │  │         (cavity)                      │   │  ← Female cavity (LOWER HALF of part)
     │  └───────────────────────────────────────┘   │
     │                                               │
     └───────────────────────────────────────────────┘
    """
    result = {"success": True, "stats": {}}

    if not BUILD123D_AVAILABLE:
        return {
            "success": False,
            "error": "Build123D not available for modular box generation"
        }

    try:
        # The mesh is already centered at origin (done in generate_mold)
        part_bounds = mesh.bounds
        part_z_min = float(part_bounds[0][2])
        part_z_max = float(part_bounds[1][2])
        part_x_min = float(part_bounds[0][0])
        part_x_max = float(part_bounds[1][0])
        part_y_min = float(part_bounds[0][1])
        part_y_max = float(part_bounds[1][1])

        part_width = part_x_max - part_x_min   # X dimension
        part_depth = part_y_max - part_y_min   # Y dimension
        part_height = part_z_max - part_z_min  # Z dimension

        print(f"Part dimensions: {part_width:.2f} x {part_depth:.2f} x {part_height:.2f} mm")
        print(f"Part bounds: X[{part_x_min:.2f}, {part_x_max:.2f}] Y[{part_y_min:.2f}, {part_y_max:.2f}] Z[{part_z_min:.2f}, {part_z_max:.2f}]")

        # Config values
        wall = config.get("wallThickness", 5.0)
        modular_config = config.get("modularBox", {})
        bolt_hole_dia = modular_config.get("boltHoleDiameter", 6.2)
        stroke = modular_config.get("stroke", modular_config.get("compressionTravel", 10.0))
        plate_thickness = modular_config.get("plateThickness", 5.0)
        fit_tolerance = modular_config.get("fitTolerance", 0.1)
        floor_thickness = modular_config.get("floorThickness", wall)

        # Split axis for part division (default: Z for vertical compression)
        split_axis = modular_config.get("splitAxis", config.get("splitAxis", "z")).lower()
        print(f"Split axis: {split_axis.upper()}")

        # Size multiplier for larger molds (50% increase = 1.5)
        size_multiplier = modular_config.get("sizeMultiplier", 1.5)
        wall = wall * size_multiplier
        floor_thickness = floor_thickness * size_multiplier

        # Ensure wall is thick enough for bolt holes + clearance from cavity
        min_wall_for_bolts = bolt_hole_dia + 2.0
        if wall < min_wall_for_bolts:
            print(f"  Adjusting wall from {wall:.1f}mm to {min_wall_for_bolts:.1f}mm for bolt clearance")
            wall = min_wall_for_bolts

        print(f"Config: wall={wall:.1f}, stroke={stroke}, plate_thickness={plate_thickness}, fit_tolerance={fit_tolerance}")

        # === COMPUTE PISTON PROFILE FROM ALPHA SHAPE ===
        # The piston outer profile should match the part's contour (alpha shape)
        # so it descends like a matched die, containing material properly
        #
        # IMPORTANT: Contour-following only works correctly for Z-split because:
        # - The piston always compresses along Z (enters from above)
        # - The alpha shape is computed as XY projection (axis='z')
        # - For Y-split or X-split, the geometry logic conflicts with the mold parting line
        #
        # For non-Z split axes, fall back to rectangular profile until the
        # geometry is properly reimplemented for those cases.
        if split_axis != 'z':
            print(f"  NOTE: Contour-following disabled for {split_axis.upper()}-split (using rectangular)")
            use_contour_profile = False
            hw, hd = part_width / 2, part_depth / 2
            piston_profile_pts = [(-hw, -hd), (hw, -hd), (hw, hd), (-hw, hd)]
        elif alpha_shape_points and len(alpha_shape_points) >= 3:
            # Use alpha shape as piston profile (Z-split only)
            piston_profile_pts = [(float(p[0]), float(p[1])) for p in alpha_shape_points]
            print(f"Using alpha shape profile with {len(piston_profile_pts)} points")
            use_contour_profile = True
        else:
            # Fallback to bounding box rectangle
            hw, hd = part_width / 2, part_depth / 2
            piston_profile_pts = [(-hw, -hd), (hw, -hd), (hw, hd), (-hw, hd)]
            print("Using rectangular bounding box profile (no alpha shape)")
            use_contour_profile = False

        # Compute clearance profile by offsetting the piston profile outward
        # This creates the opening in the mold halves that accepts the piston
        clearance_profile_pts = offset_polygon(piston_profile_pts, fit_tolerance)
        print(f"Clearance profile: {len(clearance_profile_pts)} points (offset by {fit_tolerance}mm)")

        # Pre-compute left/right halves of clearance profile (split at Y=0)
        # These are used for the clearance openings in left/right mold halves
        left_clearance_pts = clip_polygon_to_half(clearance_profile_pts, y_max=0.0)
        right_clearance_pts = clip_polygon_to_half(clearance_profile_pts, y_min=0.0)
        print(f"  Left clearance: {len(left_clearance_pts)} points, Right clearance: {len(right_clearance_pts)} points")

        # Convert mesh to solid for mold cavity
        part_solid = mesh_to_solid_build123d(mesh)
        if part_solid is None:
            return {
                "success": False,
                "error": "Failed to convert mesh to solid for boolean operations"
            }

        # === POSITION PART AT FLOOR LEVEL ===
        # Part bottom should rest on floor
        part_z_offset = floor_thickness - part_z_min
        part_positioned = part_solid.moved(Location((0, 0, part_z_offset)))

        # === SPLIT PART AT CONFIGURED AXIS MIDPOINT ===
        # This is the key to the correct 3-part mold design
        # The part is split into lower and upper halves along the compression axis
        if split_axis == 'z':
            # Z-split: horizontal cut at part's Z midpoint (after positioning)
            split_level = floor_thickness + (part_height / 2)
            print(f"Splitting part at Z={split_level:.2f}mm (part midpoint)")
        elif split_axis == 'x':
            # X-split: vertical cut at X=0 (part is centered)
            split_level = 0.0
            print(f"Splitting part at X={split_level:.2f}mm (part center)")
        elif split_axis == 'y':
            # Y-split: vertical cut at Y=0 (part is centered)
            # Note: For Y-split, the "lower/upper" become "front/back"
            split_level = 0.0
            print(f"Splitting part at Y={split_level:.2f}mm (part center)")
        else:
            print(f"Unknown split axis '{split_axis}', defaulting to Z")
            split_axis = 'z'
            split_level = floor_thickness + (part_height / 2)

        # Split the positioned part into lower/upper halves
        part_lower, part_upper = split_solid_at_plane(part_positioned, split_axis, split_level)
        print(f"  Part split result: lower={part_lower is not None}, upper={part_upper is not None}")

        if part_lower is None or part_upper is None:
            print("  WARNING: Part split failed to produce two halves. Using full part for cavity.")
            # Fallback: use full part for cavity, no male protrusion
            part_lower = part_positioned
            part_upper = None

        # Get bounds of each half for dimension calculations
        if part_lower is not None:
            lower_bbox = part_lower.bounding_box()
            lower_height = lower_bbox.max.Z - lower_bbox.min.Z
            print(f"  Lower half height: {lower_height:.2f}mm")
        else:
            lower_height = part_height / 2

        if part_upper is not None:
            upper_bbox = part_upper.bounding_box()
            upper_height = upper_bbox.max.Z - upper_bbox.min.Z
            upper_width = upper_bbox.max.X - upper_bbox.min.X
            upper_depth = upper_bbox.max.Y - upper_bbox.min.Y
            print(f"  Upper half: {upper_width:.2f} x {upper_depth:.2f} x {upper_height:.2f}mm")
        else:
            upper_height = 0
            upper_width = part_width
            upper_depth = part_depth

        # === MOLD DIMENSIONS ===
        mold_width = part_width + 2 * wall   # X dimension
        mold_depth = part_depth + 2 * wall   # Y dimension
        # Mold height based on lower half + stroke (upper half is on piston)
        mold_height = floor_thickness + lower_height + stroke

        # Clearance opening dimensions (for piston entry)
        # CRITICAL: Clearance must be at least as large as full part dimensions
        # to avoid slivers/ledges at the cavity-to-clearance transition
        # (per lessons-learned: "Always extend clearance cuts to avoid ledges/steps")
        clearance_width = max(upper_width, part_width) + 2 * fit_tolerance
        clearance_depth = max(upper_depth, part_depth) + 2 * fit_tolerance
        clearance_height = stroke

        print(f"Mold dimensions: {mold_width:.2f} x {mold_depth:.2f} x {mold_height:.2f} mm")
        print(f"Clearance opening: {clearance_width:.2f} x {clearance_depth:.2f} mm")

        # === SPLIT LOWER HALF AT Y=0 FOR LEFT/RIGHT MOLD HALVES ===
        # The parting line is always at Y=0 for the mold halves
        if part_lower is not None:
            lower_left, lower_right = split_solid_at_y_plane(part_lower, y_level=0.0)
            print(f"  Lower half Y-split: left={lower_left is not None}, right={lower_right is not None}")
        else:
            lower_left, lower_right = None, None

        # === CREATE LEFT MOLD HALF (Y < 0) ===
        print("Creating left mold half...")
        clearance_z_start = floor_thickness + lower_height
        with BuildPart() as left_builder:
            # Create left half of mold box
            Box(mold_width, mold_depth / 2, mold_height,
                align=(Align.CENTER, Align.MAX, Align.MIN))  # MAX aligns Y to 0

            # Subtract only the LOWER-LEFT portion of the part
            if lower_left is not None:
                add(lower_left, mode=Mode.SUBTRACT)

            # Cut clearance for piston (where upper half protrusion enters)
            # Use contour-following profile if available, otherwise fall back to rectangle
            with BuildSketch(Plane.XY.offset(clearance_z_start)):
                if use_contour_profile and len(left_clearance_pts) >= 3:
                    Polygon(left_clearance_pts)
                else:
                    with Locations([(0, -clearance_depth / 4)]):
                        Rectangle(clearance_width, clearance_depth / 2)
            extrude(amount=clearance_height, mode=Mode.SUBTRACT)

        left_half = left_builder.part
        print(f"  Left half volume: {left_half.volume:.2f} mm³")

        # === CREATE RIGHT MOLD HALF (Y > 0) ===
        print("Creating right mold half...")
        with BuildPart() as right_builder:
            # Create right half of mold box
            Box(mold_width, mold_depth / 2, mold_height,
                align=(Align.CENTER, Align.MIN, Align.MIN))  # MIN aligns Y to 0

            # Subtract only the LOWER-RIGHT portion of the part
            if lower_right is not None:
                add(lower_right, mode=Mode.SUBTRACT)

            # Cut clearance for piston (contour-following profile)
            with BuildSketch(Plane.XY.offset(clearance_z_start)):
                if use_contour_profile and len(right_clearance_pts) >= 3:
                    Polygon(right_clearance_pts)
                else:
                    with Locations([(0, clearance_depth / 4)]):
                        Rectangle(clearance_width, clearance_depth / 2)
            extrude(amount=clearance_height, mode=Mode.SUBTRACT)

        right_half = right_builder.part
        print(f"  Right half volume: {right_half.volume:.2f} mm³")

        # === ADD BOLT HOLES ===
        bolt_margin = bolt_hole_dia / 2 + 1.0

        print("Adding bolt holes to left half...")
        with BuildPart() as left_with_bolts:
            add(left_half)
            bolt_positions_left = [
                (-mold_width/2 + bolt_margin, -mold_depth/2 + bolt_margin),
                (mold_width/2 - bolt_margin, -mold_depth/2 + bolt_margin),
            ]
            for bx, by in bolt_positions_left:
                with BuildSketch(Plane.XY):
                    with Locations([(bx, by)]):
                        Circle(bolt_hole_dia / 2)
                extrude(amount=mold_height, mode=Mode.SUBTRACT)

        left_part = left_with_bolts.part

        print("Adding bolt holes to right half...")
        with BuildPart() as right_with_bolts:
            add(right_half)
            bolt_positions_right = [
                (-mold_width/2 + bolt_margin, mold_depth/2 - bolt_margin),
                (mold_width/2 - bolt_margin, mold_depth/2 - bolt_margin),
            ]
            for bx, by in bolt_positions_right:
                with BuildSketch(Plane.XY):
                    with Locations([(bx, by)]):
                        Circle(bolt_hole_dia / 2)
                extrude(amount=mold_height, mode=Mode.SUBTRACT)

        right_part = right_with_bolts.part

        # === CREATE PISTON WITH UPPER HALF AS MALE PROTRUSION ===
        # This is the key change: piston contains the UPPER half of the part
        # as a solid male form, not just a shallow impression
        print("Creating piston with upper-half male protrusion...")

        # Flange dimensions (sits on top of mold halves)
        flange_width = mold_width
        flange_depth = mold_depth
        flange_thickness = plate_thickness

        # Piston body (fits into clearance opening)
        # For contour-following: piston profile is the alpha shape, clearance is offset outward
        # The piston body uses the piston_profile_pts directly (gap provided by clearance offset)
        piston_body_clearance = 0.2  # Running clearance between piston and mold opening
        piston_body_width = clearance_width - 0.4  # Fallback dimensions
        piston_body_depth = clearance_depth - 0.4
        # Piston body must be tall enough for: stroke travel + cavity depth (upper_height)
        piston_body_height = stroke + upper_height

        # Compute piston body profile (slightly smaller than piston_profile for running clearance)
        if use_contour_profile:
            piston_body_profile_pts = offset_polygon(piston_profile_pts, -piston_body_clearance)
            print(f"  Piston body: contour-following profile with {len(piston_body_profile_pts)} points")
        else:
            piston_body_profile_pts = None
            print(f"  Piston body: {piston_body_width:.1f} x {piston_body_depth:.1f} mm (rectangular)")

        print(f"  Flange: {flange_width:.1f} x {flange_depth:.1f} x {flange_thickness:.1f} mm")
        print(f"  Piston body height: {piston_body_height:.1f} mm")

        with BuildPart() as top_builder:
            # Create flange plate (sits on mold halves)
            Box(flange_width, flange_depth, flange_thickness,
                align=(Align.CENTER, Align.CENTER, Align.MIN))

            # Add piston body extending downward (contour-following or rectangular)
            with BuildSketch(Plane.XY):
                if use_contour_profile and piston_body_profile_pts and len(piston_body_profile_pts) >= 3:
                    Polygon(piston_body_profile_pts)
                else:
                    Rectangle(piston_body_width, piston_body_depth)
            extrude(amount=-piston_body_height)

            # SUBTRACT upper half of part to create cavity (not add!)
            # The upper half needs to be positioned so it extends UP into the piston body
            if part_upper is not None:
                # Piston bottom is at Z = -piston_body_height
                # Position upper half so its BOTTOM (parting plane) aligns with piston bottom
                # Then it extends upward INTO the piston body where subtraction creates cavity
                protrusion_z_offset = -piston_body_height - upper_bbox.min.Z

                upper_positioned = part_upper.moved(Location((0, 0, protrusion_z_offset)))
                print(f"  Subtracting upper half to create piston cavity (Z offset: {protrusion_z_offset:.2f}mm)")
                print(f"    Upper half will be at Z={upper_bbox.min.Z + protrusion_z_offset:.2f} to Z={upper_bbox.max.Z + protrusion_z_offset:.2f}")
                add(upper_positioned, mode=Mode.SUBTRACT)  # SUBTRACT creates cavity
            else:
                print("  No upper half available - piston will have flat bottom")

        top_part = top_builder.part
        # piston_body_height already includes upper_height (stroke + upper_height)
        piston_total_height = flange_thickness + piston_body_height
        print(f"Top plate volume: {top_part.volume:.2f} mm³ (total height: {piston_total_height:.1f} mm)")

        # Calculate volumes for stats
        result["stats"] = {
            "partWidth": part_width,
            "partDepth": part_depth,
            "partHeight": part_height,
            "moldWidth": mold_width,
            "moldDepth": mold_depth,
            "moldHeight": mold_height,
            "pistonWidth": piston_body_width,
            "pistonDepth": piston_body_depth,
            "pistonHeight": piston_total_height,
            "lowerHalfHeight": lower_height,
            "upperHalfHeight": upper_height if part_upper else 0,
            "stroke": stroke,
            "wallThickness": wall,
            "splitAxis": split_axis,
            "leftVolume": left_part.volume if hasattr(left_part, 'volume') else 0,
            "rightVolume": right_part.volume if hasattr(right_part, 'volume') else 0,
            "topVolume": top_part.volume if hasattr(top_part, 'volume') else 0,
            "profileType": "contour_following" if use_contour_profile else "rectangular",
            "splitAxis": split_axis,
            "profilePoints": len(piston_profile_pts) if use_contour_profile else 4,
        }

        # Export all 3 parts
        if output_format in ['stl', 'both']:
            result["leftStl"] = base64.b64encode(export_to_stl_bytes(left_part)).decode('utf-8')
            result["rightStl"] = base64.b64encode(export_to_stl_bytes(right_part)).decode('utf-8')
            result["topStl"] = base64.b64encode(export_to_stl_bytes(top_part)).decode('utf-8')

            # For backwards compatibility
            result["pistonStl"] = result["topStl"]
            result["bucketStl"] = result["leftStl"]  # Just use left as bucket fallback

        if output_format in ['step', 'both']:
            result["leftStep"] = base64.b64encode(export_to_step_bytes(left_part)).decode('utf-8')
            result["rightStep"] = base64.b64encode(export_to_step_bytes(right_part)).decode('utf-8')
            result["topStep"] = base64.b64encode(export_to_step_bytes(top_part)).decode('utf-8')

            result["pistonStep"] = result["topStep"]
            result["bucketStep"] = result["leftStep"]

    except Exception as e:
        import traceback
        result = {
            "success": False,
            "error": f"Modular box generation failed: {str(e)}\n{traceback.format_exc()}"
        }

    return result


def generate_standard_mold(
    mesh,
    bbox: np.ndarray,
    config: Dict[str, Any],
    alpha_shape_points: Optional[List[List[float]]],
    output_format: str
) -> Dict[str, Any]:
    """
    Generate standard two-part mold (top + bottom halves).
    Split at parting line (typically Z=0 or midpoint).
    """
    # For now, return a simple implementation
    # TODO: Implement full standard mold generation
    return {
        "success": False,
        "error": "Standard mold generation not yet implemented. Use forged-carbon type."
    }


if __name__ == "__main__":
    # Simple test
    import sys
    import json

    if len(sys.argv) > 1:
        with open(sys.argv[1], 'rb') as f:
            stl_data = f.read()

        # Check for mold type argument
        mold_type = sys.argv[2] if len(sys.argv) > 2 else "modular-box"

        # Check for --alpha flag to use alpha shape profile
        use_alpha = "--alpha" in sys.argv

        # Check for --split-axis argument
        split_axis = "z"  # default
        for i, arg in enumerate(sys.argv):
            if arg == "--split-axis" and i + 1 < len(sys.argv):
                split_axis = sys.argv[i + 1].lower()
                if split_axis not in ['x', 'y', 'z']:
                    print(f"Invalid split axis '{split_axis}', using 'z'")
                    split_axis = "z"

        config = {
            "moldType": mold_type,
            "moldShape": "rectangular",
            "orientation": "z",
            "splitAxis": split_axis,
            "shearEdgeGap": 0.075,
            "shearEdgeDepth": 2.5,
            "clearanceRunout": 0.4,
            "draftAngle": 0,
            "wallThickness": 5.0,
            "useAlphaShapeProfile": use_alpha,
            "outputFormat": "stl",
            "modularBox": {
                "boltHoleDiameter": 6.2,
                "stroke": 10.0,
                "plateThickness": 5.0,
                "fitTolerance": 0.1,
                "floorThickness": 5.0,
                "splitAxis": split_axis,
            }
        }

        print(f"Generating {mold_type} mold (split axis: {split_axis.upper()}, alpha shape: {use_alpha})...")
        result = generate_mold(stl_data, config)

        # Remove binary data for printing
        printable = {k: v for k, v in result.items() if not k.endswith('Stl') and not k.endswith('Step')}
        print(json.dumps(printable, indent=2))

        if result.get("success"):
            # Report STL sizes
            for key in ['leftStl', 'rightStl', 'topStl', 'pistonStl', 'bucketStl']:
                if result.get(key):
                    print(f"{key}: {len(result[key])} bytes (base64)")

            # Optionally save STL files for inspection
            if "--save" in sys.argv:
                import base64
                output_dir = "output_mold"
                os.makedirs(output_dir, exist_ok=True)

                # Save the 3 main parts
                parts_to_save = {
                    'leftStl': 'left.stl',
                    'rightStl': 'right.stl',
                    'topStl': 'top.stl',
                }

                for key, filename in parts_to_save.items():
                    if result.get(key):
                        filepath = f"{output_dir}/{filename}"
                        with open(filepath, 'wb') as f:
                            f.write(base64.b64decode(result[key]))
                        print(f"Saved: {filepath}")
    else:
        print("Usage: python mold_generator.py <stl_file> [mold_type] [--save] [--alpha] [--split-axis x|y|z]")
        print("  mold_type: forged-carbon, modular-box (default)")
        print("  --save: Save generated STL files to output_mold/")
        print("  --alpha: Use alpha shape profile instead of rectangular bounding box")
        print("  --split-axis: Axis to split part for compression (x, y, or z; default: z)")
