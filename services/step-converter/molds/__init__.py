"""
Molds Package - Modular mold generation implementations.

This package contains specialized mold generators for different mold types:
- ModularBoxMold: 3-piece split-cavity compression mold
- ForgedCarbonMold: 2-piece forged carbon mold (future)
- CompressionMold: Standard compression mold (future)

Each mold type is implemented as a class inheriting from BaseMold,
ensuring consistent interface and coordinate tracking.
"""

from molds.base import BaseMold, CoordinateTracker, prepare_mesh
from molds.modular_box import ModularBoxMold
from molds.logging_config import setup_mold_logger
from molds.utils import mirror_polygon_y, extract_projection_profile, extract_solid_xy_footprint

__all__ = [
    'BaseMold',
    'CoordinateTracker',
    'ModularBoxMold',
    'prepare_mesh',
    'setup_mold_logger',
    'mirror_polygon_y',
    'extract_projection_profile',
    'extract_solid_xy_footprint',
]
