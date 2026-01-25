"""
Base classes and coordinate tracking for mold generation.

This module provides the foundation for all mold types:
- CoordinateTracker: Tracks mesh bounds through all transformations
- prepare_mesh(): Properly centers mesh using BOUNDING BOX center (not centroid!)
- BaseMold: Abstract base class for mold implementations

CRITICAL FIX: The original code used mesh.centroid for centering, but centroid
is the center of mass which differs from geometric center for parts with holes
or asymmetric geometry. This caused asymmetric mold halves.
"""

from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from io import BytesIO
from typing import Any, Dict, List, Optional, Tuple

import numpy as np

from molds.logging_config import (
    setup_mold_logger,
    log_mesh_info,
    log_symmetry_check,
)

logger = setup_mold_logger('molds.base')


@dataclass
class CoordinateTracker:
    """
    Tracks mesh coordinate transformations for debugging and verification.

    This class maintains a record of the mesh's bounds at each stage of
    processing, enabling verification that centering and transformations
    produce symmetric results.

    Attributes:
        original_bounds: Mesh bounds before any transformation
        original_centroid: Mesh centroid (center of mass) - for reference only
        bbox_center: Bounding box center used for centering
        centering_offset: The offset applied to center the mesh
        final_bounds: Mesh bounds after centering
    """
    original_bounds: Optional[np.ndarray] = None
    original_centroid: Optional[np.ndarray] = None
    bbox_center: Optional[np.ndarray] = None
    centering_offset: Optional[np.ndarray] = None
    final_bounds: Optional[np.ndarray] = None

    @property
    def part_width(self) -> float:
        """X dimension of the part."""
        if self.final_bounds is None:
            return 0.0
        return float(self.final_bounds[1][0] - self.final_bounds[0][0])

    @property
    def part_depth(self) -> float:
        """Y dimension of the part."""
        if self.final_bounds is None:
            return 0.0
        return float(self.final_bounds[1][1] - self.final_bounds[0][1])

    @property
    def part_height(self) -> float:
        """Z dimension of the part."""
        if self.final_bounds is None:
            return 0.0
        return float(self.final_bounds[1][2] - self.final_bounds[0][2])

    @property
    def x_min(self) -> float:
        if self.final_bounds is None:
            return 0.0
        return float(self.final_bounds[0][0])

    @property
    def x_max(self) -> float:
        if self.final_bounds is None:
            return 0.0
        return float(self.final_bounds[1][0])

    @property
    def y_min(self) -> float:
        if self.final_bounds is None:
            return 0.0
        return float(self.final_bounds[0][1])

    @property
    def y_max(self) -> float:
        if self.final_bounds is None:
            return 0.0
        return float(self.final_bounds[1][1])

    @property
    def z_min(self) -> float:
        if self.final_bounds is None:
            return 0.0
        return float(self.final_bounds[0][2])

    @property
    def z_max(self) -> float:
        if self.final_bounds is None:
            return 0.0
        return float(self.final_bounds[1][2])

    def is_symmetric(self, tolerance: float = 0.001) -> Dict[str, bool]:
        """
        Check if bounds are symmetric around origin.

        Returns:
            Dict with 'x', 'y', 'z' keys indicating symmetry for each axis
        """
        if self.final_bounds is None:
            return {'x': False, 'y': False, 'z': False}

        return {
            'x': abs(self.final_bounds[0][0] + self.final_bounds[1][0]) < tolerance,
            'y': abs(self.final_bounds[0][1] + self.final_bounds[1][1]) < tolerance,
            'z': abs(self.final_bounds[0][2] + self.final_bounds[1][2]) < tolerance,
        }

    def log_state(self, stage: str = "current") -> None:
        """Log the current state of coordinate tracking."""
        logger.debug(f"=== CoordinateTracker [{stage}] ===")

        if self.original_bounds is not None:
            logger.debug(f"Original bounds: {self.original_bounds}")
        if self.original_centroid is not None:
            logger.debug(f"Original centroid (CoM): {self.original_centroid}")
        if self.bbox_center is not None:
            logger.debug(f"Bounding box center: {self.bbox_center}")
        if self.centering_offset is not None:
            logger.debug(f"Centering offset applied: {self.centering_offset}")
        if self.final_bounds is not None:
            logger.debug(f"Final bounds: {self.final_bounds}")
            sym = self.is_symmetric()
            logger.debug(f"Symmetry: X={sym['x']}, Y={sym['y']}, Z={sym['z']}")


def prepare_mesh(
    mesh,
    reorient_axis: Optional[str] = None
) -> Tuple[Any, CoordinateTracker]:
    """
    Prepare mesh for mold generation with proper centering.

    CRITICAL: This function uses BOUNDING BOX CENTER for centering, not centroid!

    The centroid (center of mass) differs from the geometric center for parts
    with holes, cavities, or asymmetric material distribution. Using centroid
    causes asymmetric mold halves when the part is split at Y=0.

    Args:
        mesh: trimesh.Trimesh object
        reorient_axis: Optional axis to reorient to Z ('x', 'y', or None)

    Returns:
        Tuple of (centered_mesh, CoordinateTracker)
    """
    from molds.utils import reorient_mesh

    tracker = CoordinateTracker()

    # Record original state
    tracker.original_bounds = mesh.bounds.copy()
    tracker.original_centroid = mesh.centroid.copy()

    logger.debug("=== MESH PREPARATION ===")
    log_mesh_info(logger, mesh, "ORIGINAL")

    # Calculate BOUNDING BOX center (NOT centroid!)
    # This is the geometric center that ensures symmetric bounds after centering
    bbox_center = (mesh.bounds[0] + mesh.bounds[1]) / 2
    tracker.bbox_center = bbox_center.copy()

    logger.debug(f"Centroid (center of mass): {tracker.original_centroid}")
    logger.debug(f"Bounding box center: {bbox_center}")

    centroid_diff = tracker.original_centroid - bbox_center
    logger.debug(f"Difference (centroid - bbox_center): {centroid_diff}")

    if np.linalg.norm(centroid_diff) > 0.01:
        logger.debug("  NOTE: Centroid differs significantly from bbox center")
        logger.debug("  This part has asymmetric mass distribution (holes/cavities)")
        logger.debug("  Using bounding box center ensures symmetric mold halves")

    # CENTER USING BOUNDING BOX CENTER (the critical fix!)
    tracker.centering_offset = -bbox_center
    mesh.vertices -= bbox_center

    # Record final state
    tracker.final_bounds = mesh.bounds.copy()

    logger.debug("=== AFTER CENTERING ===")
    log_mesh_info(logger, mesh, "CENTERED")

    # Verify symmetry
    sym = tracker.is_symmetric()
    if not all(sym.values()):
        logger.warning(f"Mesh bounds not symmetric after centering: {sym}")
        logger.warning("This indicates a bug in centering logic")
    else:
        logger.debug("Mesh bounds ARE symmetric (centering successful)")

    # Reorient if requested
    if reorient_axis and reorient_axis.lower() != 'z':
        logger.debug(f"Reorienting mesh: {reorient_axis} -> Z")
        mesh = reorient_mesh(mesh, reorient_axis)
        tracker.final_bounds = mesh.bounds.copy()
        log_mesh_info(logger, mesh, "REORIENTED")

    tracker.log_state("final")

    return mesh, tracker


class BaseMold(ABC):
    """
    Abstract base class for mold generation implementations.

    All mold types (modular-box, forged-carbon, etc.) should inherit from this
    class to ensure consistent interface and coordinate tracking.

    Attributes:
        mesh: The part mesh (already centered)
        tracker: CoordinateTracker with transformation history
        config: Mold configuration dictionary
        alpha_shape_points: Optional alpha shape profile points
        output_format: Output format ('stl', 'step', or 'both')
    """

    def __init__(
        self,
        mesh,
        config: Dict[str, Any],
        alpha_shape_points: Optional[List[List[float]]] = None,
        output_format: str = 'stl'
    ):
        """
        Initialize the mold generator.

        Note: The mesh should already be centered via prepare_mesh().
        If not, it will be centered here.

        Args:
            mesh: trimesh.Trimesh object (preferably already centered)
            config: Mold configuration dictionary
            alpha_shape_points: Optional pre-computed alpha shape
            output_format: 'stl', 'step', or 'both'
        """
        # Check if mesh is already centered (bounds symmetric around origin)
        bounds = mesh.bounds
        is_centered = (
            abs(bounds[0][0] + bounds[1][0]) < 0.01 and
            abs(bounds[0][1] + bounds[1][1]) < 0.01 and
            abs(bounds[0][2] + bounds[1][2]) < 0.01
        )

        if is_centered:
            # Already centered, just create tracker
            self.mesh = mesh
            self.tracker = CoordinateTracker(
                original_bounds=bounds.copy(),
                final_bounds=bounds.copy()
            )
        else:
            # Center the mesh
            self.mesh, self.tracker = prepare_mesh(mesh)

        self.config = config
        self.output_format = output_format

        # Re-center alpha shape points using the same offset applied to mesh
        # This fixes coordinate alignment when alpha shape was computed BEFORE centering
        if alpha_shape_points and self.tracker.centering_offset is not None:
            x_off = float(self.tracker.centering_offset[0])
            y_off = float(self.tracker.centering_offset[1])
            self.alpha_shape_points = [
                [p[0] + x_off, p[1] + y_off] for p in alpha_shape_points
            ]
            logger.debug(f"Re-centered alpha shape by ({x_off:.3f}, {y_off:.3f})")
        else:
            self.alpha_shape_points = alpha_shape_points

        # Logger for subclass use
        self.logger = setup_mold_logger(self.__class__.__name__)

    @abstractmethod
    def generate(self) -> Dict[str, Any]:
        """
        Generate the mold parts.

        Returns:
            Result dictionary containing:
            - success: bool
            - error: Optional error message
            - stats: Dictionary of mold statistics
            - *Stl/*Step: Base64-encoded output files
        """
        pass

    def get_profile_points(self) -> List[Tuple[float, float]]:
        """
        Get the profile points for the mold (alpha shape or bounding box).

        Returns:
            List of (x, y) tuples representing the profile polygon
        """
        if self.alpha_shape_points and len(self.alpha_shape_points) >= 3:
            return [(float(p[0]), float(p[1])) for p in self.alpha_shape_points]
        else:
            # Rectangle from bounding box
            hw = self.tracker.part_width / 2
            hd = self.tracker.part_depth / 2
            return [(-hw, -hd), (hw, -hd), (hw, hd), (-hw, hd)]

    def get_config_value(self, key: str, default: Any = None) -> Any:
        """
        Get a configuration value with optional default.

        Args:
            key: Configuration key (supports dot notation for nested keys)
            default: Default value if key not found

        Returns:
            Configuration value or default
        """
        keys = key.split('.')
        value = self.config

        for k in keys:
            if isinstance(value, dict):
                value = value.get(k)
            else:
                return default

            if value is None:
                return default

        return value
