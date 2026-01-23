"""
Mesh Analysis Module

Uses Trimesh, Shapely, and SciPy to analyze STL meshes for moldability.
Provides manifold checking, orientation analysis, undercut detection, and alpha shape computation.
"""

import time
import base64
from io import BytesIO
from typing import Dict, List, Optional, Tuple, Any
import numpy as np

try:
    import trimesh
    TRIMESH_AVAILABLE = True
except ImportError:
    TRIMESH_AVAILABLE = False
    print("WARNING: trimesh not installed. Mesh analysis will be limited.")

try:
    from shapely.geometry import Polygon, MultiPoint
    from shapely.ops import unary_union
    SHAPELY_AVAILABLE = True
except ImportError:
    SHAPELY_AVAILABLE = False
    print("WARNING: shapely not installed. Alpha shape computation will be limited.")

try:
    from scipy.spatial import Delaunay
    SCIPY_AVAILABLE = True
except ImportError:
    SCIPY_AVAILABLE = False
    print("WARNING: scipy not installed. Alpha shape computation will use convex hull.")


def analyze_mesh(stl_data: bytes, options: Dict[str, Any]) -> Dict[str, Any]:
    """
    Perform comprehensive mesh analysis for mold generation.

    Args:
        stl_data: Raw STL file bytes
        options: Analysis options dict with keys:
            - repair: bool (default True) - Attempt to repair non-manifold meshes
            - demoldAxis: 'x'|'y'|'z' (default 'z') - Primary demold direction
            - projectionAxis: 'x'|'y'|'z' (default matches demoldAxis) - Axis for alpha shape
            - alphaValue: float (default 0.1) - Alpha parameter for concave hull
            - minDraftThreshold: float (default 1.0) - Minimum draft angle in degrees
            - includeVertexIndices: bool (default False) - Include undercut vertex indices

    Returns:
        Analysis result dictionary
    """
    start_time = time.time()

    if not TRIMESH_AVAILABLE:
        return {
            "success": False,
            "error": "Trimesh library not available",
            "analysisTimeMs": int((time.time() - start_time) * 1000)
        }

    # Parse options with defaults
    repair = options.get("repair", True)
    demold_axis = options.get("demoldAxis", "z")
    projection_axis = options.get("projectionAxis", demold_axis)
    alpha_value = options.get("alphaValue", 0.1)
    min_draft_threshold = options.get("minDraftThreshold", 1.0)
    include_vertex_indices = options.get("includeVertexIndices", False)

    result = {
        "success": True,
        "warnings": [],
        "errors": []
    }

    try:
        # Load mesh from bytes
        mesh = trimesh.load(BytesIO(stl_data), file_type='stl')

        # Basic mesh info
        result["vertexCount"] = len(mesh.vertices)
        result["triangleCount"] = len(mesh.faces)
        result["boundingBox"] = [
            float(mesh.bounds[1][0] - mesh.bounds[0][0]),
            float(mesh.bounds[1][1] - mesh.bounds[0][1]),
            float(mesh.bounds[1][2] - mesh.bounds[0][2])
        ]
        result["surfaceArea"] = float(mesh.area)

        # Manifold check
        result["isManifold"] = bool(mesh.is_watertight)
        result["nonManifoldEdgeCount"] = count_non_manifold_edges(mesh)

        # Volume (only valid for watertight meshes)
        if mesh.is_watertight:
            result["volume"] = float(mesh.volume)
        else:
            result["volume"] = None
            result["warnings"].append("Mesh is not watertight - volume cannot be computed")

        # Repair information
        repair_info = {
            "wasRepaired": False,
            "repairType": "none",
            "holesFilled": 0,
            "normalsFixed": 0,
            "degenerateFacesRemoved": 0,
            "repairedStl": None
        }

        # Attempt repair if needed and requested
        if not mesh.is_watertight and repair:
            mesh, repair_info = repair_mesh(mesh)
            result["isManifold"] = bool(mesh.is_watertight)

            # If repaired successfully, encode the repaired STL
            if repair_info["wasRepaired"] and mesh.is_watertight:
                stl_buffer = BytesIO()
                mesh.export(stl_buffer, file_type='stl')
                repair_info["repairedStl"] = base64.b64encode(stl_buffer.getvalue()).decode('utf-8')

        result["repairInfo"] = repair_info

        # Orientation analysis
        result["orientationScores"] = analyze_orientations(mesh)
        result["recommendedOrientation"] = result["orientationScores"][0]["axis"]

        # Undercut analysis for each axis
        result["undercutAnalysis"] = {
            "x": analyze_undercuts(mesh, "x", include_vertex_indices),
            "y": analyze_undercuts(mesh, "y", include_vertex_indices),
            "z": analyze_undercuts(mesh, "z", include_vertex_indices)
        }

        # Draft angle analysis
        result["draftAnalysis"] = analyze_draft_angles(mesh, demold_axis, min_draft_threshold)

        # Alpha shape computation
        if SHAPELY_AVAILABLE:
            result["alphaShape"] = compute_alpha_shape(mesh, projection_axis, alpha_value)
        else:
            result["alphaShape"] = compute_convex_hull_2d(mesh, projection_axis)
            result["warnings"].append("Using convex hull instead of alpha shape (shapely not available)")

        # Determine moldability
        result["isMoldable"] = determine_moldability(result)

    except Exception as e:
        result["success"] = False
        result["error"] = str(e)
        result["errors"].append(f"Analysis failed: {str(e)}")

    result["analysisTimeMs"] = int((time.time() - start_time) * 1000)
    return result


def count_non_manifold_edges(mesh) -> int:
    """Count edges that are not shared by exactly 2 faces."""
    try:
        edges = mesh.edges_unique
        edge_face_count = mesh.edges_unique_length
        # Non-manifold edges have != 2 adjacent faces
        non_manifold = np.sum(edge_face_count != 2)
        return int(non_manifold)
    except Exception:
        return 0


def repair_mesh(mesh) -> Tuple[Any, Dict[str, Any]]:
    """
    Attempt to repair a non-manifold mesh.

    Returns:
        Tuple of (repaired_mesh, repair_info_dict)
    """
    repair_info = {
        "wasRepaired": False,
        "repairType": "none",
        "holesFilled": 0,
        "normalsFixed": 0,
        "degenerateFacesRemoved": 0,
        "repairedStl": None
    }

    original_watertight = mesh.is_watertight

    try:
        # Remove degenerate faces first
        initial_faces = len(mesh.faces)
        mesh.remove_degenerate_faces()
        repair_info["degenerateFacesRemoved"] = initial_faces - len(mesh.faces)

        # Fix normals
        trimesh.repair.fix_normals(mesh)
        repair_info["normalsFixed"] = 1  # Approximate

        # Fill holes
        if not mesh.is_watertight:
            initial_faces = len(mesh.faces)
            trimesh.repair.fill_holes(mesh)
            repair_info["holesFilled"] = len(mesh.faces) - initial_faces

        # Check if repair was successful
        if not original_watertight and mesh.is_watertight:
            repair_info["wasRepaired"] = True
            repair_info["repairType"] = "minor"
        elif not original_watertight and not mesh.is_watertight:
            # Try more aggressive repair
            mesh.process(validate=True)
            if mesh.is_watertight:
                repair_info["wasRepaired"] = True
                repair_info["repairType"] = "major"

    except Exception as e:
        print(f"Mesh repair error: {e}")
        repair_info["repairType"] = "none"

    return mesh, repair_info


def analyze_orientations(mesh) -> List[Dict[str, Any]]:
    """
    Score each axis for moldability.

    Returns list of orientation scores sorted by score (best first).
    """
    scores = []

    for axis in ['x', 'y', 'z']:
        # Get axis index
        axis_idx = {'x': 0, 'y': 1, 'z': 2}[axis]

        # Project to get 2D area (shadow)
        projected_area = compute_projected_area(mesh, axis)

        # Count undercuts
        undercut_pct = compute_undercut_percentage(mesh, axis)

        # Measure height along axis
        height = float(mesh.bounds[1][axis_idx] - mesh.bounds[0][axis_idx])

        # Compute score: maximize area, minimize height and undercuts
        # Higher score = better moldability
        if undercut_pct == 0:
            undercut_factor = 1.0
        else:
            undercut_factor = 1.0 / (undercut_pct + 1)

        score = (projected_area * undercut_factor) / max(height, 0.1)

        # Generate summary
        if undercut_pct < 5:
            undercut_desc = "minimal"
        elif undercut_pct < 15:
            undercut_desc = "moderate"
        else:
            undercut_desc = "significant"

        summary = f"{undercut_desc} undercuts ({undercut_pct:.1f}%), {height:.1f}mm height"

        scores.append({
            "axis": axis,
            "projectedArea": float(projected_area),
            "undercutPercentage": float(undercut_pct),
            "height": float(height),
            "score": float(score),
            "summary": summary
        })

    # Sort by score descending
    return sorted(scores, key=lambda x: -x["score"])


def compute_projected_area(mesh, axis: str) -> float:
    """Compute the 2D shadow area when viewed from the given axis."""
    try:
        # Get vertices for projection
        vertices = mesh.vertices
        axis_idx = {'x': 0, 'y': 1, 'z': 2}[axis]

        # Project to 2D by removing the axis dimension
        if axis == 'x':
            points_2d = vertices[:, [1, 2]]  # YZ plane
        elif axis == 'y':
            points_2d = vertices[:, [0, 2]]  # XZ plane
        else:  # z
            points_2d = vertices[:, [0, 1]]  # XY plane

        # Compute convex hull area as approximation
        from scipy.spatial import ConvexHull
        hull = ConvexHull(points_2d)
        return float(hull.volume)  # In 2D, volume = area

    except Exception:
        # Fallback: use bounding box area
        axis_idx = {'x': 0, 'y': 1, 'z': 2}[axis]
        dims = [0, 1, 2]
        dims.remove(axis_idx)
        return float(
            (mesh.bounds[1][dims[0]] - mesh.bounds[0][dims[0]]) *
            (mesh.bounds[1][dims[1]] - mesh.bounds[0][dims[1]])
        )


def compute_undercut_percentage(mesh, axis: str) -> float:
    """
    Compute percentage of vertices that create undercuts when demolding along axis.
    Uses ray casting to detect vertices that would get "stuck".
    """
    try:
        vertices = mesh.vertices
        axis_idx = {'x': 0, 'y': 1, 'z': 2}[axis]

        # Create ray direction (positive axis direction)
        ray_dir = np.zeros(3)
        ray_dir[axis_idx] = 1.0

        # For each vertex, cast a ray in the demold direction
        # If it hits the mesh (other than at the vertex itself), it's an undercut
        ray_origins = vertices + ray_dir * 0.001  # Slight offset to avoid self-intersection
        ray_directions = np.tile(ray_dir, (len(vertices), 1))

        # Use trimesh ray casting
        locations, index_ray, index_tri = mesh.ray.intersects_location(
            ray_origins=ray_origins,
            ray_directions=ray_directions
        )

        # Count unique vertices that hit something
        undercut_vertices = np.unique(index_ray)
        undercut_pct = (len(undercut_vertices) / len(vertices)) * 100

        return float(undercut_pct)

    except Exception as e:
        print(f"Undercut detection error: {e}")
        return 0.0


def analyze_undercuts(mesh, axis: str, include_indices: bool = False) -> Dict[str, Any]:
    """
    Detailed undercut analysis for a specific demold direction.
    """
    try:
        vertices = mesh.vertices
        axis_idx = {'x': 0, 'y': 1, 'z': 2}[axis]

        # Create ray direction (positive axis direction)
        ray_dir = np.zeros(3)
        ray_dir[axis_idx] = 1.0

        # Cast rays from each vertex
        ray_origins = vertices + ray_dir * 0.001
        ray_directions = np.tile(ray_dir, (len(vertices), 1))

        # Get intersections
        locations, index_ray, index_tri = mesh.ray.intersects_location(
            ray_origins=ray_origins,
            ray_directions=ray_directions
        )

        # Find undercut vertices and depths
        undercut_vertices = np.unique(index_ray)
        undercut_count = len(undercut_vertices)
        undercut_pct = (undercut_count / len(vertices)) * 100

        # Compute max undercut depth
        max_depth = 0.0
        if len(locations) > 0:
            for i, loc in enumerate(locations):
                origin = ray_origins[index_ray[i]]
                depth = np.linalg.norm(loc - origin)
                max_depth = max(max_depth, depth)

        # Determine severity
        if undercut_pct < 1:
            severity = "none"
            description = "No significant undercuts detected"
        elif undercut_pct < 10:
            severity = "minor"
            description = f"Minor undercuts ({undercut_pct:.1f}%) - may be acceptable for flexible molds"
        elif undercut_pct < 30:
            severity = "moderate"
            description = f"Moderate undercuts ({undercut_pct:.1f}%) - consider reorienting part"
        else:
            severity = "severe"
            description = f"Severe undercuts ({undercut_pct:.1f}%) - not suitable for simple two-part mold"

        result = {
            "undercutVertexCount": int(undercut_count),
            "undercutPercentage": float(undercut_pct),
            "maxUndercutDepth": float(max_depth),
            "severity": severity,
            "description": description
        }

        if include_indices:
            result["undercutVertexIndices"] = undercut_vertices.tolist()[:1000]  # Limit size

        return result

    except Exception as e:
        return {
            "undercutVertexCount": 0,
            "undercutPercentage": 0.0,
            "maxUndercutDepth": 0.0,
            "severity": "none",
            "description": f"Analysis error: {str(e)}"
        }


def analyze_draft_angles(mesh, demold_axis: str = 'z', min_threshold: float = 1.0) -> Dict[str, Any]:
    """
    Analyze faces for draft angle relative to demold direction.

    Draft angle is the angle between the face normal and the plane perpendicular
    to the demold direction. Faces parallel to the demold direction have 0 draft.
    """
    try:
        axis_idx = {'x': 0, 'y': 1, 'z': 2}[demold_axis]
        demold_vector = np.zeros(3)
        demold_vector[axis_idx] = 1.0

        face_normals = mesh.face_normals
        face_angles = []
        problem_faces = []

        for i, normal in enumerate(face_normals):
            # Angle between face normal and demold direction
            dot = np.clip(np.dot(normal, demold_vector), -1, 1)
            angle = np.degrees(np.arccos(abs(dot)))

            # Draft angle is 90° - angle (faces parallel to demold have 0° draft)
            draft = 90 - angle
            face_angles.append(draft)

            if draft < min_threshold:
                problem_faces.append({
                    "index": int(i),
                    "draft": float(draft),
                    "normal": normal.tolist()
                })

        face_angles = np.array(face_angles)

        # Determine recommended draft
        if len(problem_faces) > len(face_normals) * 0.1:  # >10% problem faces
            recommended_draft = 2.0
        elif len(problem_faces) > 0:
            recommended_draft = 1.0
        else:
            recommended_draft = 0.0

        return {
            "minDraft": float(np.min(face_angles)),
            "maxDraft": float(np.max(face_angles)),
            "avgDraft": float(np.mean(face_angles)),
            "problemFaceCount": len(problem_faces),
            "problemFaces": problem_faces[:100],  # Limit to first 100
            "recommendedDraft": recommended_draft
        }

    except Exception as e:
        return {
            "minDraft": 0.0,
            "maxDraft": 90.0,
            "avgDraft": 45.0,
            "problemFaceCount": 0,
            "problemFaces": [],
            "recommendedDraft": 0.0
        }


def compute_alpha_shape(mesh, axis: str, alpha: float = 0.1) -> Optional[Dict[str, Any]]:
    """
    Compute alpha shape (concave hull) of mesh projection onto a 2D plane.

    The alpha shape is a tighter fit than the convex hull, following the contours
    of the mesh projection more closely.
    """
    if not SHAPELY_AVAILABLE or not SCIPY_AVAILABLE:
        return compute_convex_hull_2d(mesh, axis)

    try:
        vertices = mesh.vertices

        # Project to 2D
        if axis == 'x':
            points_2d = vertices[:, [1, 2]]  # YZ plane
        elif axis == 'y':
            points_2d = vertices[:, [0, 2]]  # XZ plane
        else:  # z
            points_2d = vertices[:, [0, 1]]  # XY plane

        # Remove duplicate points
        points_2d = np.unique(points_2d, axis=0)

        if len(points_2d) < 3:
            return None

        # Compute Delaunay triangulation
        tri = Delaunay(points_2d)

        # Filter triangles by circumradius
        edges = set()
        for simplex in tri.simplices:
            pts = points_2d[simplex]
            circumradius = compute_circumradius(pts)

            if circumradius < 1.0 / alpha:
                # Add boundary edges (edges that appear only once)
                for i in range(3):
                    edge = tuple(sorted([simplex[i], simplex[(i + 1) % 3]]))
                    if edge in edges:
                        edges.remove(edge)  # Interior edge - remove
                    else:
                        edges.add(edge)  # Boundary edge - add

        if not edges:
            return compute_convex_hull_2d(mesh, axis)

        # Order edges into polygon(s)
        polygon_points = order_boundary_edges(edges, points_2d)

        if polygon_points is None or len(polygon_points) < 3:
            return compute_convex_hull_2d(mesh, axis)

        # Create shapely polygon for area/perimeter and validation
        try:
            polygon = Polygon(polygon_points)
            if not polygon.is_valid:
                # Fix self-intersections - this can produce MultiPolygon
                fixed = polygon.buffer(0)
                if fixed.geom_type == 'Polygon':
                    polygon = fixed
                    # Use the fixed polygon's exterior coordinates
                    polygon_points = np.array(list(polygon.exterior.coords)[:-1])
                elif fixed.geom_type == 'MultiPolygon':
                    # Use the largest polygon from the result
                    largest = max(fixed.geoms, key=lambda g: g.area)
                    polygon = largest
                    polygon_points = np.array(list(polygon.exterior.coords)[:-1])
            area = polygon.area
            perimeter = polygon.length
        except Exception:
            area = 0.0
            perimeter = 0.0

        return {
            "points": polygon_points.tolist(),
            "area": float(area),
            "perimeter": float(perimeter),
            "alphaValue": float(alpha)
        }

    except Exception as e:
        print(f"Alpha shape error: {e}")
        return compute_convex_hull_2d(mesh, axis)


def compute_circumradius(triangle_pts: np.ndarray) -> float:
    """Compute circumradius of a triangle given its 3 vertices."""
    try:
        a = np.linalg.norm(triangle_pts[0] - triangle_pts[1])
        b = np.linalg.norm(triangle_pts[1] - triangle_pts[2])
        c = np.linalg.norm(triangle_pts[2] - triangle_pts[0])

        s = (a + b + c) / 2  # Semi-perimeter
        area = np.sqrt(max(0, s * (s - a) * (s - b) * (s - c)))  # Heron's formula

        if area < 1e-10:
            return float('inf')

        return (a * b * c) / (4 * area)
    except Exception:
        return float('inf')


def order_boundary_edges(edges: set, points: np.ndarray) -> Optional[np.ndarray]:
    """
    Order boundary edges into a closed polygon.
    Returns ordered point coordinates.
    """
    if not edges:
        return None

    # Build adjacency
    adjacency = {}
    for e in edges:
        if e[0] not in adjacency:
            adjacency[e[0]] = []
        if e[1] not in adjacency:
            adjacency[e[1]] = []
        adjacency[e[0]].append(e[1])
        adjacency[e[1]].append(e[0])

    # Walk the boundary starting from first edge
    start = list(edges)[0][0]
    ordered = [start]
    visited = {start}
    current = start

    while True:
        neighbors = adjacency.get(current, [])
        next_vertex = None

        for n in neighbors:
            if n not in visited:
                next_vertex = n
                break

        if next_vertex is None:
            # Check if we can close the loop
            if len(ordered) > 2 and start in neighbors:
                break
            else:
                break  # Can't continue

        ordered.append(next_vertex)
        visited.add(next_vertex)
        current = next_vertex

    if len(ordered) < 3:
        return None

    return points[ordered]


def compute_convex_hull_2d(mesh, axis: str) -> Optional[Dict[str, Any]]:
    """Fallback: compute convex hull instead of alpha shape."""
    try:
        from scipy.spatial import ConvexHull

        vertices = mesh.vertices

        # Project to 2D
        if axis == 'x':
            points_2d = vertices[:, [1, 2]]
        elif axis == 'y':
            points_2d = vertices[:, [0, 2]]
        else:
            points_2d = vertices[:, [0, 1]]

        # Remove duplicates
        points_2d = np.unique(points_2d, axis=0)

        if len(points_2d) < 3:
            return None

        hull = ConvexHull(points_2d)
        hull_points = points_2d[hull.vertices]

        return {
            "points": hull_points.tolist(),
            "area": float(hull.volume),  # In 2D, volume = area
            "perimeter": float(np.sum([
                np.linalg.norm(hull_points[i] - hull_points[(i + 1) % len(hull_points)])
                for i in range(len(hull_points))
            ])),
            "alphaValue": 0.0  # Indicates convex hull was used
        }

    except Exception as e:
        print(f"Convex hull error: {e}")
        return None


def determine_moldability(result: Dict[str, Any]) -> bool:
    """
    Determine if the mesh is suitable for mold generation based on analysis.
    """
    # Check for critical errors
    if not result.get("isManifold", False):
        result["errors"].append("Mesh must be manifold (watertight) for mold generation")
        return False

    # Check undercuts on recommended axis
    rec_axis = result.get("recommendedOrientation", "z")
    undercuts = result.get("undercutAnalysis", {}).get(rec_axis, {})

    if undercuts.get("severity") == "severe":
        result["warnings"].append(
            f"Severe undercuts ({undercuts.get('undercutPercentage', 0):.1f}%) on {rec_axis}-axis. "
            "Consider reorienting or modifying the part."
        )

    # Check draft angles
    draft = result.get("draftAnalysis", {})
    if draft.get("problemFaceCount", 0) > 0:
        result["warnings"].append(
            f"{draft['problemFaceCount']} faces have insufficient draft angle. "
            f"Recommended draft correction: {draft.get('recommendedDraft', 0)}°"
        )

    # Part is moldable if manifold (undercuts are warnings, not blockers)
    return True


if __name__ == "__main__":
    # Simple test
    import sys

    if len(sys.argv) > 1:
        with open(sys.argv[1], 'rb') as f:
            stl_data = f.read()

        result = analyze_mesh(stl_data, {})

        import json
        print(json.dumps(result, indent=2))
    else:
        print("Usage: python mesh_analysis.py <stl_file>")
