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
        Box, Cylinder, Sphere, Cone
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

        # Generate based on mold type
        if mold_type == "forged-carbon":
            result = generate_forged_carbon_mold(
                mesh=mesh,
                bbox=bbox,
                config=config,
                alpha_shape_points=alpha_shape_points if use_alpha_shape else None,
                output_format=output_format
            )
        else:
            result = generate_standard_mold(
                mesh=mesh,
                bbox=bbox,
                config=config,
                alpha_shape_points=alpha_shape_points if use_alpha_shape else None,
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
        with BuildPart() as piston_builder:
            # Shear edge region (tight tolerance profile)
            with BuildSketch(Plane.XY):
                Polygon(piston_profile_pts)
            extrude(amount=shear_depth, taper=draft if draft > 0 else None)

            # Main body above shear edge (with clearance runout)
            with BuildSketch(Plane.XY.offset(shear_depth)):
                # Offset inward for clearance
                Polygon(piston_profile_pts)
                offset(amount=-clearance, kind=Kind.INTERSECTION)
            extrude(amount=piston_height - shear_depth, taper=draft if draft > 0 else None)

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

            # Sew faces into a shell
            sew = BRepBuilderAPI_Sewing(1e-6)
            sew.Add(shape)
            sew.Perform()
            sewn = sew.SewedShape()

            # Convert shell to solid
            if sewn.ShapeType().name == 'TopAbs_SHELL':
                shell = TopoDS.Shell_s(sewn)
                builder = BRepBuilderAPI_MakeSolid()
                builder.Add(shell)
                if builder.IsDone():
                    occ_solid = builder.Solid()
                    return Solid(occ_solid)
                else:
                    print("mesh_to_solid_build123d: BRepBuilderAPI_MakeSolid failed")
                    return None
            else:
                print(f"mesh_to_solid_build123d: Sewn shape is {sewn.ShapeType()}, not SHELL")
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

        config = {
            "moldType": "forged-carbon",
            "moldShape": "rectangular",
            "orientation": "z",
            "shearEdgeGap": 0.075,
            "shearEdgeDepth": 2.5,
            "clearanceRunout": 0.4,
            "draftAngle": 0,
            "wallThickness": 5.0,
            "useAlphaShapeProfile": False,
            "outputFormat": "stl"
        }

        result = generate_mold(stl_data, config)

        # Remove binary data for printing
        printable = {k: v for k, v in result.items() if not k.endswith('Stl') and not k.endswith('Step')}
        print(json.dumps(printable, indent=2))

        if result.get("success") and result.get("pistonStl"):
            print(f"Piston STL: {len(result['pistonStl'])} bytes (base64)")
        if result.get("success") and result.get("bucketStl"):
            print(f"Bucket STL: {len(result['bucketStl'])} bytes (base64)")
    else:
        print("Usage: python mold_generator.py <stl_file>")
