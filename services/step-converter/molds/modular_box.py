"""
Modular Box Mold Generator.

Generates a 3-piece split-cavity compression mold with configurable split axis:
- Left half: Y < 0 portion (contains LOWER half of part cavity)
- Right half: Y > 0 portion (contains LOWER half of part cavity)
- Top plate (piston): Flange + UPPER half of part as male protrusion

The key insight for parts with through-holes:
1. Split the part at the configured axis midpoint (default: Z)
2. LOWER half of part -> Female cavity in Left/Right sides
3. UPPER half of part -> Male protrusion on piston
4. Piston descends, its male form compresses material against the female cavity

Assembly diagram (Z-split):
                +-----------------+
                |   FLANGE        |  <- Flat plate
                +-----------------+
                |  +==========+   |  <- Male protrusion (UPPER HALF of part)
                |  |  (solid) |   |     Descends into clearance
                |  +==========+   |
 ---------------+-----------------+---------------
 |                                               |
 |  LEFT/RIGHT HALVES                            |
 |  +---------------------------------------+    |
 |  |         (cavity)                      |    |  <- Female cavity (LOWER HALF)
 |  +---------------------------------------+    |
 |                                               |
 +-----------------------------------------------+
"""

import base64
from typing import Any, Dict, List, Optional, Tuple

from molds.base import BaseMold, CoordinateTracker
from molds.logging_config import (
    setup_mold_logger,
    log_polygon_info,
    log_symmetry_check,
)
from molds.utils import (
    mesh_to_solid_build123d,
    offset_polygon,
    clip_polygon_to_half,
    mirror_polygon_y,
    extract_projection_profile,
    extract_solid_xy_footprint,
    split_solid_at_plane,
    split_solid_at_y_plane,
    export_to_stl_bytes,
    export_to_step_bytes,
    validate_polygon,
    BUILD123D_AVAILABLE,
)

logger = setup_mold_logger('molds.modular_box')

# Import Build123D components if available
if BUILD123D_AVAILABLE:
    from build123d import (
        BuildPart, BuildSketch, Part,
        Rectangle, Circle, Polygon,
        extrude, Box, Location, Plane,
        Mode, Align, Locations, add,
    )


class ModularBoxMold(BaseMold):
    """
    3-piece modular compression mold generator.

    Produces:
    - Left mold half (Y < 0)
    - Right mold half (Y > 0)
    - Top plate/piston with male protrusion

    The mold halves contain the lower portion of the part cavity,
    while the piston contains the upper portion as a male protrusion.
    """

    def __init__(
        self,
        mesh,
        config: Dict[str, Any],
        alpha_shape_points: Optional[List[List[float]]] = None,
        output_format: str = 'stl'
    ):
        """
        Initialize modular box mold generator.

        Args:
            mesh: trimesh.Trimesh object (will be centered if not already)
            config: Mold configuration dictionary
            alpha_shape_points: Optional pre-computed alpha shape
            output_format: 'stl', 'step', or 'both'
        """
        super().__init__(mesh, config, alpha_shape_points, output_format)

        # Extract modular-box specific config
        self.modular_config = config.get('modularBox', {})
        self.split_axis = self.modular_config.get(
            'splitAxis',
            config.get('splitAxis', 'z')
        ).lower()

        logger.debug(f"ModularBoxMold initialized")
        logger.debug(f"  Split axis: {self.split_axis.upper()}")
        logger.debug(f"  Part dimensions: {self.tracker.part_width:.2f} x {self.tracker.part_depth:.2f} x {self.tracker.part_height:.2f} mm")

    def generate(self) -> Dict[str, Any]:
        """
        Generate the 3-piece modular box mold.

        Returns:
            Result dictionary with mold parts and statistics
        """
        result = {"success": True, "stats": {}}

        if not BUILD123D_AVAILABLE:
            return {
                "success": False,
                "error": "Build123D not available for modular box generation"
            }

        try:
            result = self._generate_mold()
        except Exception as e:
            import traceback
            result = {
                "success": False,
                "error": f"Modular box generation failed: {str(e)}\n{traceback.format_exc()}"
            }

        return result

    def _generate_mold(self) -> Dict[str, Any]:
        """Internal mold generation logic."""
        result = {"success": True, "stats": {}}

        # Use tracker for all dimension queries
        part_width = self.tracker.part_width
        part_depth = self.tracker.part_depth
        part_height = self.tracker.part_height

        logger.debug(f"=== MOLD GENERATION START ===")
        logger.debug(f"Part dimensions: {part_width:.2f} x {part_depth:.2f} x {part_height:.2f} mm")
        logger.debug(f"Part bounds: X[{self.tracker.x_min:.2f}, {self.tracker.x_max:.2f}] "
                     f"Y[{self.tracker.y_min:.2f}, {self.tracker.y_max:.2f}] "
                     f"Z[{self.tracker.z_min:.2f}, {self.tracker.z_max:.2f}]")

        # Config values with size multiplier
        wall = self.config.get("wallThickness", 5.0)
        bolt_hole_dia = self.modular_config.get("boltHoleDiameter", 6.2)
        stroke = self.modular_config.get("stroke", self.modular_config.get("compressionTravel", 10.0))
        plate_thickness = self.modular_config.get("plateThickness", 5.0)
        fit_tolerance = self.modular_config.get("fitTolerance", 0.1)
        floor_thickness = self.modular_config.get("floorThickness", wall)
        size_multiplier = self.modular_config.get("sizeMultiplier", 1.5)

        # Apply size multiplier
        wall = wall * size_multiplier
        floor_thickness = floor_thickness * size_multiplier

        # Ensure wall is thick enough for bolt holes
        min_wall_for_bolts = bolt_hole_dia + 2.0
        if wall < min_wall_for_bolts:
            logger.debug(f"Adjusting wall from {wall:.1f}mm to {min_wall_for_bolts:.1f}mm for bolt clearance")
            wall = min_wall_for_bolts

        logger.debug(f"Config: wall={wall:.1f}, stroke={stroke}, plate_thickness={plate_thickness}, fit_tolerance={fit_tolerance}")

        # === COMPUTE PISTON PROFILE FROM ALPHA SHAPE ===
        # Contour-following only works correctly for Z-split
        if self.split_axis != 'z':
            logger.debug(f"NOTE: Contour-following disabled for {self.split_axis.upper()}-split (using rectangular)")
            use_contour_profile = False
            piston_profile_pts = self.get_profile_points()
            # Override with bounding box rectangle
            hw, hd = part_width / 2, part_depth / 2
            piston_profile_pts = [(-hw, -hd), (hw, -hd), (hw, hd), (-hw, hd)]
        elif self.alpha_shape_points and len(self.alpha_shape_points) >= 3:
            piston_profile_pts = [(float(p[0]), float(p[1])) for p in self.alpha_shape_points]
            logger.debug(f"Using alpha shape profile with {len(piston_profile_pts)} points")
            use_contour_profile = True
        else:
            hw, hd = part_width / 2, part_depth / 2
            piston_profile_pts = [(-hw, -hd), (hw, -hd), (hw, hd), (-hw, hd)]
            logger.debug("Using rectangular bounding box profile (no alpha shape)")
            use_contour_profile = False

        # Log profile info
        log_polygon_info(logger, piston_profile_pts, "Piston profile")

        # === CLIP PROFILE TO LEFT/RIGHT HALVES (SYMMETRIC) ===
        # Use clip-and-mirror strategy: clip to LEFT half only, then mirror for RIGHT
        # This guarantees symmetric mold halves regardless of alpha shape asymmetries
        logger.debug("=== CONTOUR PROFILE CLIPPING (SYMMETRIC) ===")

        # Step 1: Clip to LEFT half only (Y < 0)
        left_contour_pts = clip_polygon_to_half(piston_profile_pts, y_max=0.0)
        left_contour_valid, left_reason = validate_polygon(left_contour_pts, "left")

        log_polygon_info(logger, left_contour_pts, "Left contour (Y < 0)")
        logger.debug(f"Left validation: {left_reason}")

        # Step 2: Create RIGHT by MIRRORING left (guarantees symmetry)
        if left_contour_valid:
            right_contour_pts = mirror_polygon_y(left_contour_pts)
            right_contour_valid = True
            logger.debug(f"Right contour: mirrored from left ({len(right_contour_pts)} points, SYMMETRIC)")
        else:
            # Left invalid, both use rectangular fallback
            right_contour_pts = clip_polygon_to_half(piston_profile_pts, y_min=0.0)
            right_contour_valid, right_reason = validate_polygon(right_contour_pts, "right")
            logger.warning(f"Left invalid ({left_reason}), using independent clipping for right")
            log_polygon_info(logger, right_contour_pts, "Right contour (Y > 0)")

        if not left_contour_valid or not right_contour_valid:
            logger.warning("Invalid clipped contour detected, will fall back to rectangular")

        # === CONVERT MESH TO SOLID ===
        logger.debug("=== MESH TO SOLID CONVERSION ===")
        part_solid = mesh_to_solid_build123d(self.mesh)
        if part_solid is None:
            return {
                "success": False,
                "error": "Failed to convert mesh to solid for boolean operations"
            }

        # === TRY BUILD123D PROJECTION FOR BETTER PROFILE ===
        # Build123D projection can be more accurate than alpha shape from mesh vertices
        # Use alpha=0.05 to preserve concave features (not convex hull)
        # DISABLED: Alpha shape from mesh_analysis already provides good profile,
        # and projection convex hull loses concave details. Keep alpha shape.
        #
        # If you want to re-enable projection with alpha shape boundary:
        # if use_contour_profile and part_solid is not None:
        #     try:
        #         projection_pts = extract_projection_profile(part_solid, 'z', alpha=0.05)
        #         ... (re-clip logic)
        #     except: pass

        # === POSITION PART AT FLOOR LEVEL ===
        part_z_offset = floor_thickness - self.tracker.z_min
        part_positioned = part_solid.moved(Location((0, 0, part_z_offset)))
        logger.debug(f"Part positioned at floor level (Z offset: {part_z_offset:.2f}mm)")

        # === SPLIT PART AT CONFIGURED AXIS MIDPOINT ===
        logger.debug("=== PART SPLITTING ===")
        if self.split_axis == 'z':
            split_level = floor_thickness + (part_height / 2)
            logger.debug(f"Splitting part at Z={split_level:.2f}mm (part midpoint)")
        elif self.split_axis == 'x':
            split_level = 0.0
            logger.debug(f"Splitting part at X={split_level:.2f}mm (part center)")
        elif self.split_axis == 'y':
            split_level = 0.0
            logger.debug(f"Splitting part at Y={split_level:.2f}mm (part center)")
        else:
            logger.warning(f"Unknown split axis '{self.split_axis}', defaulting to Z")
            self.split_axis = 'z'
            split_level = floor_thickness + (part_height / 2)

        part_lower, part_upper = split_solid_at_plane(part_positioned, self.split_axis, split_level)
        logger.debug(f"Part split result: lower={part_lower is not None}, upper={part_upper is not None}")

        if part_lower is None or part_upper is None:
            logger.warning("Part split failed to produce two halves. Using full part for cavity.")
            part_lower = part_positioned
            part_upper = None

        # Get bounds of each half
        if part_lower is not None:
            lower_bbox = part_lower.bounding_box()
            lower_height = lower_bbox.max.Z - lower_bbox.min.Z
            logger.debug(f"Lower half height: {lower_height:.2f}mm")
        else:
            lower_height = part_height / 2

        if part_upper is not None:
            upper_bbox = part_upper.bounding_box()
            upper_height = upper_bbox.max.Z - upper_bbox.min.Z
            upper_width = upper_bbox.max.X - upper_bbox.min.X
            upper_depth = upper_bbox.max.Y - upper_bbox.min.Y
            logger.debug(f"Upper half: {upper_width:.2f} x {upper_depth:.2f} x {upper_height:.2f}mm")
        else:
            upper_height = 0
            upper_width = part_width
            upper_depth = part_depth

        # === MOLD DIMENSIONS ===
        mold_width = part_width + 2 * wall
        mold_depth = part_depth + 2 * wall
        mold_height = floor_thickness + lower_height + stroke

        inner_opening_width = max(upper_width, part_width)
        inner_opening_depth = max(upper_depth, part_depth)

        logger.debug(f"=== MOLD DIMENSIONS ===")
        logger.debug(f"Mold outer: {mold_width:.2f} x {mold_depth:.2f} x {mold_height:.2f} mm")
        logger.debug(f"Inner opening: {inner_opening_width:.2f} x {inner_opening_depth:.2f} mm")

        # === COMPUTE UNIFIED OPENING PROFILE (SYMMETRIC) ===
        # Extract solid footprint from FULL lower half (before Y-split) and compute
        # union with alpha shape. This ensures the opening covers both profiles
        # while maintaining left/right symmetry via clip-and-mirror.
        unified_left_contour_pts = left_contour_pts
        unified_left_contour_valid = left_contour_valid
        unified_right_contour_pts = right_contour_pts
        unified_right_contour_valid = right_contour_valid

        if use_contour_profile and part_lower is not None and left_contour_valid:
            try:
                # Get solid footprint from full lower half
                solid_footprint = extract_solid_xy_footprint(part_lower, offset=fit_tolerance)

                if solid_footprint and len(solid_footprint) >= 3:
                    from shapely.geometry import Polygon as ShapelyPolygon
                    from shapely.ops import unary_union

                    solid_poly = ShapelyPolygon(solid_footprint)
                    alpha_poly = ShapelyPolygon(piston_profile_pts)

                    # Compute union of solid footprint and alpha shape
                    union_poly = unary_union([solid_poly, alpha_poly])

                    if union_poly.geom_type == 'Polygon' and not union_poly.is_empty:
                        union_coords = list(union_poly.exterior.coords)[:-1]
                        unified_full_pts = [(float(c[0]), float(c[1])) for c in union_coords]

                        # Clip to LEFT (Y < 0) and validate
                        unified_left = clip_polygon_to_half(unified_full_pts, y_max=0.0)
                        unified_left_valid, unified_left_reason = validate_polygon(unified_left, "unified_left")

                        if unified_left_valid:
                            unified_left_contour_pts = unified_left
                            unified_left_contour_valid = True
                            # Mirror to RIGHT for symmetry
                            unified_right_contour_pts = mirror_polygon_y(unified_left)
                            unified_right_contour_valid = True

                            logger.debug(f"Unified opening profile: solid_area={solid_poly.area:.1f}, "
                                         f"alpha_area={alpha_poly.area:.1f}, union_area={union_poly.area:.1f}")
                            logger.debug(f"Using unified contour (clip+mirror) for symmetric mold halves")
                        else:
                            logger.debug(f"Unified left invalid ({unified_left_reason}), using alpha shape")
                    else:
                        logger.debug("Union produced non-polygon, using alpha shape contours")
            except Exception as union_err:
                logger.debug(f"Unified contour computation failed: {union_err}, using alpha shape")

        # === SPLIT LOWER HALF AT Y=0 FOR LEFT/RIGHT MOLD HALVES ===
        if part_lower is not None:
            lower_left, lower_right = split_solid_at_y_plane(part_lower, y_level=0.0)
            logger.debug(f"Lower half Y-split: left={lower_left is not None}, right={lower_right is not None}")
        else:
            lower_left, lower_right = None, None

        # === CREATE LEFT MOLD HALF (Y < 0) ===
        logger.debug("=== CREATING LEFT MOLD HALF ===")
        contour_cut_height = mold_height - floor_thickness
        left_half = self._create_mold_half(
            mold_width=mold_width,
            mold_depth=mold_depth,
            mold_height=mold_height,
            floor_thickness=floor_thickness,
            contour_cut_height=contour_cut_height,
            inner_opening_width=inner_opening_width,
            inner_opening_depth=inner_opening_depth,
            contour_pts=unified_left_contour_pts,
            contour_valid=unified_left_contour_valid,
            use_contour_profile=use_contour_profile,
            part_half=lower_left,
            is_left=True,
            fit_tolerance=fit_tolerance
        )
        logger.debug(f"Left half volume: {left_half.volume:.2f} mm^3")

        # === CREATE RIGHT MOLD HALF (Y > 0) ===
        logger.debug("=== CREATING RIGHT MOLD HALF ===")
        right_half = self._create_mold_half(
            mold_width=mold_width,
            mold_depth=mold_depth,
            mold_height=mold_height,
            floor_thickness=floor_thickness,
            contour_cut_height=contour_cut_height,
            inner_opening_width=inner_opening_width,
            inner_opening_depth=inner_opening_depth,
            contour_pts=unified_right_contour_pts,
            contour_valid=unified_right_contour_valid,
            use_contour_profile=use_contour_profile,
            part_half=lower_right,
            is_left=False,
            fit_tolerance=fit_tolerance
        )
        logger.debug(f"Right half volume: {right_half.volume:.2f} mm^3")

        # Symmetry check on mold halves
        log_symmetry_check(
            logger,
            left_half.volume,
            right_half.volume,
            "mold half volumes",
            tolerance=left_half.volume * 0.01  # 1% tolerance
        )

        # === ADD BOLT HOLES ===
        bolt_margin = bolt_hole_dia / 2 + 1.0
        left_part = self._add_bolt_holes(
            left_half, mold_width, mold_depth, mold_height,
            bolt_hole_dia, bolt_margin, is_left=True
        )
        right_part = self._add_bolt_holes(
            right_half, mold_width, mold_depth, mold_height,
            bolt_hole_dia, bolt_margin, is_left=False
        )

        # === CREATE PISTON ===
        logger.debug("=== CREATING PISTON ===")
        top_part = self._create_piston(
            flange_width=mold_width,
            flange_depth=mold_depth,
            flange_thickness=plate_thickness,
            inner_opening_width=inner_opening_width,
            inner_opening_depth=inner_opening_depth,
            piston_profile_pts=piston_profile_pts,
            use_contour_profile=use_contour_profile,
            fit_tolerance=fit_tolerance,
            stroke=stroke,
            upper_height=upper_height,
            part_upper=part_upper,
            upper_bbox=upper_bbox if part_upper else None
        )

        piston_body_width = inner_opening_width - 2 * fit_tolerance
        piston_body_depth = inner_opening_depth - 2 * fit_tolerance
        piston_body_height = stroke + upper_height
        piston_total_height = plate_thickness + piston_body_height

        logger.debug(f"Top plate volume: {top_part.volume:.2f} mm^3 (total height: {piston_total_height:.1f} mm)")

        # === COLLECT STATISTICS ===
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
            "splitAxis": self.split_axis,
            "leftVolume": left_part.volume if hasattr(left_part, 'volume') else 0,
            "rightVolume": right_part.volume if hasattr(right_part, 'volume') else 0,
            "topVolume": top_part.volume if hasattr(top_part, 'volume') else 0,
            "profileType": "contour_following" if use_contour_profile else "rectangular",
            "profilePoints": len(piston_profile_pts) if use_contour_profile else 4,
        }

        # === EXPORT ===
        logger.debug("=== EXPORTING ===")
        if self.output_format in ['stl', 'both']:
            result["leftStl"] = base64.b64encode(export_to_stl_bytes(left_part)).decode('utf-8')
            result["rightStl"] = base64.b64encode(export_to_stl_bytes(right_part)).decode('utf-8')
            result["topStl"] = base64.b64encode(export_to_stl_bytes(top_part)).decode('utf-8')
            # Backwards compatibility
            result["pistonStl"] = result["topStl"]
            result["bucketStl"] = result["leftStl"]

        if self.output_format in ['step', 'both']:
            result["leftStep"] = base64.b64encode(export_to_step_bytes(left_part)).decode('utf-8')
            result["rightStep"] = base64.b64encode(export_to_step_bytes(right_part)).decode('utf-8')
            result["topStep"] = base64.b64encode(export_to_step_bytes(top_part)).decode('utf-8')
            result["pistonStep"] = result["topStep"]
            result["bucketStep"] = result["leftStep"]

        logger.debug("=== MOLD GENERATION COMPLETE ===")
        return result

    def _create_mold_half(
        self,
        mold_width: float,
        mold_depth: float,
        mold_height: float,
        floor_thickness: float,
        contour_cut_height: float,
        inner_opening_width: float,
        inner_opening_depth: float,
        contour_pts: List[Tuple[float, float]],
        contour_valid: bool,
        use_contour_profile: bool,
        part_half,
        is_left: bool,
        fit_tolerance: float = 0.1
    ):
        """Create a single mold half (left or right).

        The opening profile is derived from the actual solid's XY projection
        to ensure it always matches or exceeds the part footprint, preventing
        ledges/overhangs in the mold cavity.
        """
        y_align = Align.MAX if is_left else Align.MIN
        y_offset_dir = -1 if is_left else 1
        side_name = "left" if is_left else "right"

        # Opening profile is passed in as contour_pts (unified contour computed upstream)
        # This contour is the union of alpha shape and solid footprint, clipped and
        # mirrored for symmetry. Just use it directly.
        opening_pts = contour_pts if contour_valid else None
        opening_valid = contour_valid

        if opening_valid:
            logger.debug(f"Using unified contour for {side_name} ({len(opening_pts)} pts)")
        else:
            logger.debug(f"Using rectangular fallback for {side_name}")

        with BuildPart() as half_builder:
            # 1. Create rectangular outer box
            Box(mold_width, mold_depth / 2, mold_height,
                align=(Align.CENTER, y_align, Align.MIN))

            # 2. Cut contour opening ALL THE WAY through
            with BuildSketch(Plane.XY.offset(floor_thickness)):
                if use_contour_profile and opening_valid and opening_pts:
                    try:
                        Polygon(opening_pts)
                    except Exception as poly_err:
                        logger.warning(f"{side_name} opening polygon failed: {poly_err}")
                        # Fall back to rectangle
                        with Locations([(0, y_offset_dir * inner_opening_depth / 4)]):
                            Rectangle(inner_opening_width, inner_opening_depth / 2)
                else:
                    # Rectangular fallback
                    with Locations([(0, y_offset_dir * inner_opening_depth / 4)]):
                        Rectangle(inner_opening_width, inner_opening_depth / 2)
            extrude(amount=contour_cut_height, mode=Mode.SUBTRACT)

            # 3. Subtract part cavity at floor level
            if part_half is not None:
                add(part_half, mode=Mode.SUBTRACT)

        return half_builder.part

    def _add_bolt_holes(
        self,
        mold_half,
        mold_width: float,
        mold_depth: float,
        mold_height: float,
        bolt_hole_dia: float,
        bolt_margin: float,
        is_left: bool
    ):
        """Add bolt holes to a mold half."""
        if is_left:
            bolt_positions = [
                (-mold_width/2 + bolt_margin, -mold_depth/2 + bolt_margin),
                (mold_width/2 - bolt_margin, -mold_depth/2 + bolt_margin),
            ]
        else:
            bolt_positions = [
                (-mold_width/2 + bolt_margin, mold_depth/2 - bolt_margin),
                (mold_width/2 - bolt_margin, mold_depth/2 - bolt_margin),
            ]

        with BuildPart() as bolted:
            add(mold_half)
            for bx, by in bolt_positions:
                with BuildSketch(Plane.XY):
                    with Locations([(bx, by)]):
                        Circle(bolt_hole_dia / 2)
                extrude(amount=mold_height, mode=Mode.SUBTRACT)

        return bolted.part

    def _create_piston(
        self,
        flange_width: float,
        flange_depth: float,
        flange_thickness: float,
        inner_opening_width: float,
        inner_opening_depth: float,
        piston_profile_pts: List[Tuple[float, float]],
        use_contour_profile: bool,
        fit_tolerance: float,
        stroke: float,
        upper_height: float,
        part_upper,
        upper_bbox
    ):
        """Create the piston with male protrusion."""
        piston_body_height = stroke + upper_height
        piston_body_width = inner_opening_width - 2 * fit_tolerance
        piston_body_depth = inner_opening_depth - 2 * fit_tolerance

        # Compute piston body profile
        piston_body_valid = False
        if use_contour_profile:
            piston_body_profile_pts = offset_polygon(piston_profile_pts, -fit_tolerance)
            piston_body_valid, piston_reason = validate_polygon(piston_body_profile_pts, "piston_body")
            logger.debug(f"Piston body: contour profile with {len(piston_body_profile_pts)} points (offset: -{fit_tolerance}mm)")
            logger.debug(f"Piston body validation: {piston_reason}")
            if not piston_body_valid:
                logger.warning("Piston body profile invalid, falling back to rectangular")
        else:
            piston_body_profile_pts = None
            logger.debug(f"Piston body: {piston_body_width:.1f} x {piston_body_depth:.1f} mm (rectangular)")

        logger.debug(f"Flange: {flange_width:.1f} x {flange_depth:.1f} x {flange_thickness:.1f} mm")
        logger.debug(f"Piston body height: {piston_body_height:.1f} mm")

        with BuildPart() as top_builder:
            # Flange plate
            Box(flange_width, flange_depth, flange_thickness,
                align=(Align.CENTER, Align.CENTER, Align.MIN))

            # Piston body extending downward
            with BuildSketch(Plane.XY):
                if use_contour_profile and piston_body_valid:
                    try:
                        Polygon(piston_body_profile_pts)
                    except Exception as poly_err:
                        logger.warning(f"Piston body polygon failed: {poly_err}")
                        Rectangle(piston_body_width, piston_body_depth)
                else:
                    Rectangle(piston_body_width, piston_body_depth)
            extrude(amount=-piston_body_height)

            # Subtract upper half of part to create cavity
            if part_upper is not None and upper_bbox is not None:
                protrusion_z_offset = -piston_body_height - upper_bbox.min.Z
                upper_positioned = part_upper.moved(Location((0, 0, protrusion_z_offset)))
                logger.debug(f"Subtracting upper half (Z offset: {protrusion_z_offset:.2f}mm)")
                logger.debug(f"Upper half at Z={upper_bbox.min.Z + protrusion_z_offset:.2f} to Z={upper_bbox.max.Z + protrusion_z_offset:.2f}")
                add(upper_positioned, mode=Mode.SUBTRACT)
            else:
                logger.debug("No upper half - piston will have flat bottom")

        return top_builder.part
