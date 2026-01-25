"""
Logging configuration for mold generation.

Provides detailed logging with timestamps and context for debugging
mold generation issues, especially coordinate tracking and symmetry verification.
"""

import logging
import sys
from typing import Optional


def setup_mold_logger(
    name: str,
    level: int = logging.DEBUG,
    format_string: Optional[str] = None
) -> logging.Logger:
    """
    Create a detailed logger for mold generation with timestamps and context.

    Args:
        name: Logger name (e.g., 'mold_generator', 'modular_box')
        level: Logging level (default: DEBUG)
        format_string: Custom format string (optional)

    Returns:
        Configured logger instance
    """
    logger = logging.getLogger(name)

    # Avoid adding multiple handlers if logger already configured
    if logger.handlers:
        return logger

    logger.setLevel(level)

    # Console handler with detailed format
    handler = logging.StreamHandler(sys.stdout)
    handler.setLevel(level)

    if format_string is None:
        format_string = '%(asctime)s.%(msecs)03d [%(name)s] %(levelname)s: %(message)s'

    formatter = logging.Formatter(
        format_string,
        datefmt='%H:%M:%S'
    )
    handler.setFormatter(formatter)
    logger.addHandler(handler)

    return logger


def log_mesh_info(logger: logging.Logger, mesh, prefix: str = "") -> None:
    """
    Log detailed mesh information including bounds and centering checks.

    Args:
        logger: Logger instance
        mesh: Trimesh object
        prefix: Prefix for log messages (e.g., "ORIGINAL", "CENTERED")
    """
    bounds = mesh.bounds
    centroid = mesh.centroid

    logger.debug(f"{prefix} mesh centroid: {centroid}")
    logger.debug(f"{prefix} mesh bounds: {bounds}")

    # Check symmetry
    x_symmetric = abs(bounds[0][0] + bounds[1][0]) < 0.001
    y_symmetric = abs(bounds[0][1] + bounds[1][1]) < 0.001
    z_symmetric = abs(bounds[0][2] + bounds[1][2]) < 0.001

    logger.debug(f"  x_min={bounds[0][0]:.4f}, x_max={bounds[1][0]:.4f} (symmetric: {x_symmetric})")
    logger.debug(f"  y_min={bounds[0][1]:.4f}, y_max={bounds[1][1]:.4f} (symmetric: {y_symmetric})")
    logger.debug(f"  z_min={bounds[0][2]:.4f}, z_max={bounds[1][2]:.4f} (symmetric: {z_symmetric})")


def log_polygon_info(logger: logging.Logger, points: list, name: str) -> None:
    """
    Log polygon information including point count and bounds.

    Args:
        logger: Logger instance
        points: List of (x, y) tuples
        name: Name for the polygon (e.g., "LEFT contour", "piston profile")
    """
    if not points:
        logger.debug(f"{name}: empty polygon")
        return

    xs = [p[0] for p in points]
    ys = [p[1] for p in points]

    logger.debug(f"{name}: {len(points)} points")
    logger.debug(f"  X range: [{min(xs):.4f}, {max(xs):.4f}]")
    logger.debug(f"  Y range: [{min(ys):.4f}, {max(ys):.4f}]")

    # Try to calculate area if shapely is available
    try:
        from shapely.geometry import Polygon
        poly = Polygon(points)
        if poly.is_valid:
            logger.debug(f"  area: {poly.area:.2f} mm^2")
    except ImportError:
        pass


def log_symmetry_check(
    logger: logging.Logger,
    left_value: float,
    right_value: float,
    name: str,
    tolerance: float = 0.1
) -> bool:
    """
    Log a symmetry check comparison between left and right values.

    Args:
        logger: Logger instance
        left_value: Value for left half (e.g., volume, area)
        right_value: Value for right half
        name: Name for the comparison (e.g., "volume", "area")
        tolerance: Maximum allowed difference

    Returns:
        True if symmetric (within tolerance), False otherwise
    """
    diff = abs(left_value - right_value)
    is_symmetric = diff < tolerance
    status = "PASS" if is_symmetric else "FAIL"

    logger.debug(f"SYMMETRY CHECK {name}:")
    logger.debug(f"  left={left_value:.4f}, right={right_value:.4f}")
    logger.debug(f"  difference={diff:.4f} (tolerance={tolerance}) [{status}]")

    return is_symmetric
