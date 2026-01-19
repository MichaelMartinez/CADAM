/**
 * Mold Templates
 *
 * Deterministic OpenSCAD code generation for two-part molds.
 * Supports standard casting molds and forged carbon compression molds.
 */

import type { MoldConfig, BoundingBox, MoldDimensions } from '@/types/mold';

// =============================================================================
// Dimension Calculation
// =============================================================================

/**
 * Calculate mold dimensions from bounding box and config.
 * Adds wall thickness and margin to accommodate the part.
 */
export function calculateMoldDimensions(
  boundingBox: BoundingBox,
  config: MoldConfig,
): MoldDimensions {
  const margin = config.wallThickness * 2;

  // For different split axes, the "height" of the mold changes
  let width: number, depth: number, height: number;

  switch (config.splitAxis) {
    case 'x':
      // Split along X axis (left/right halves)
      width = boundingBox.x + margin;
      depth = boundingBox.y + margin;
      height = boundingBox.z + margin;
      break;
    case 'y':
      // Split along Y axis (front/back halves)
      width = boundingBox.x + margin;
      depth = boundingBox.y + margin;
      height = boundingBox.z + margin;
      break;
    case 'z':
    default:
      // Split along Z axis (top/bottom halves) - most common
      width = boundingBox.x + margin;
      depth = boundingBox.y + margin;
      height = boundingBox.z + margin;
      break;
  }

  // Round to 1 decimal place for cleaner dimensions
  return {
    width: Math.ceil(width * 10) / 10,
    depth: Math.ceil(depth * 10) / 10,
    height: Math.ceil(height * 10) / 10,
    autoCalculated: true,
  };
}

// =============================================================================
// Main Entry Point
// =============================================================================

/**
 * Generate OpenSCAD code for a mold based on configuration.
 */
export function generateMoldCode(
  config: MoldConfig,
  boundingBox: BoundingBox,
  meshFilename: string,
): string {
  // Use manual dimensions if provided, otherwise calculate
  const dimensions = config.dimensions.autoCalculated
    ? calculateMoldDimensions(boundingBox, config)
    : config.dimensions;

  if (config.type === 'forged-carbon') {
    if (config.shape === 'circular') {
      return generateForgedCarbonCircularMold(
        config,
        dimensions,
        boundingBox,
        meshFilename,
      );
    }
    return generateForgedCarbonRectangularMold(
      config,
      dimensions,
      boundingBox,
      meshFilename,
    );
  }

  // Standard mold
  if (config.shape === 'circular') {
    return generateStandardCircularMold(
      config,
      dimensions,
      boundingBox,
      meshFilename,
    );
  }
  return generateStandardRectangularMold(
    config,
    dimensions,
    boundingBox,
    meshFilename,
  );
}

// =============================================================================
// Axis Rotation Helper
// =============================================================================

/**
 * Generate rotation code to orient mesh for the specified split axis.
 * The split plane is always at Z=0 in the mold coordinate system.
 */
function getAxisRotation(splitAxis: string): string {
  switch (splitAxis) {
    case 'x':
      return 'rotate([0, 90, 0])';
    case 'y':
      return 'rotate([90, 0, 0])';
    case 'z':
    default:
      return ''; // No rotation needed for Z split
  }
}

// =============================================================================
// Standard Rectangular Mold
// =============================================================================

function generateStandardRectangularMold(
  config: MoldConfig,
  dimensions: MoldDimensions,
  boundingBox: BoundingBox,
  meshFilename: string,
): string {
  const { wallThickness, keySize, keyFettle, keyMargin } = config;
  const pourHoleD1 = config.pourHoleDiameter ?? 10;
  const pourHoleD2 = config.pourHoleTaper ?? 5;
  const axisRotation = getAxisRotation(config.splitAxis);
  const spacing = 10;

  return `include <BOSL2/std.scad>

// =============================================================================
// MOLD PARAMETERS (Standard Rectangular)
// =============================================================================

// Mold dimensions
mold_width = ${dimensions.width};
mold_depth = ${dimensions.depth};
mold_height = ${dimensions.height};
wall_thickness = ${wallThickness};

// Registration keys
key_size = ${keySize};
key_fettle = ${keyFettle};
key_margin = ${keyMargin};

// Pour hole (funnel shape)
pour_hole_d1 = ${pourHoleD1};
pour_hole_d2 = ${pourHoleD2};
pour_hole_height = mold_height / 2 + wall_thickness;

// Layout spacing
spacing = ${spacing};

// Original part bounding box (for reference)
part_x = ${boundingBox.x};
part_y = ${boundingBox.y};
part_z = ${boundingBox.z};

// =============================================================================
// IMPORTED MESH
// =============================================================================

module original_part() {
  // Center the part at origin with split plane at Z=0
  ${axisRotation}
  import("${meshFilename}", convexity=10);
}

// =============================================================================
// BOTTOM HALF
// =============================================================================

module bottom_half() {
  difference() {
    // Outer shell (bottom half only)
    translate([0, 0, -mold_height / 2])
      cuboid([mold_width, mold_depth, mold_height / 2], anchor = BOTTOM, rounding = 2, edges = BOTTOM);

    // Part cavity
    original_part();

    // Key holes (negative) - diagonal corners
    translate([-mold_width / 2 + key_margin, -mold_depth / 2 + key_margin, 0])
      sphere(r = key_size + key_fettle, $fn = 30);
    translate([mold_width / 2 - key_margin, mold_depth / 2 - key_margin, 0])
      sphere(r = key_size + key_fettle, $fn = 30);
  }

  // Keys (positive) - opposite diagonal
  translate([-mold_width / 2 + key_margin, mold_depth / 2 - key_margin, 0])
    sphere(r = key_size, $fn = 30);
  translate([mold_width / 2 - key_margin, -mold_depth / 2 + key_margin, 0])
    sphere(r = key_size, $fn = 30);
}

// =============================================================================
// TOP HALF
// =============================================================================

module top_half() {
  difference() {
    // Outer shell (top half only)
    cuboid([mold_width, mold_depth, mold_height / 2], anchor = BOTTOM, rounding = 2, edges = TOP);

    // Part cavity
    original_part();

    // Key holes (negative) - opposite diagonal from bottom's positives
    translate([-mold_width / 2 + key_margin, mold_depth / 2 - key_margin, 0])
      sphere(r = key_size + key_fettle, $fn = 30);
    translate([mold_width / 2 - key_margin, -mold_depth / 2 + key_margin, 0])
      sphere(r = key_size + key_fettle, $fn = 30);

    // Pour hole (funnel shape)
    translate([0, 0, mold_height / 4])
      cyl(h = pour_hole_height, d1 = pour_hole_d2, d2 = pour_hole_d1, anchor = BOTTOM, $fn = 32);
  }

  // Keys (positive) - same diagonal as bottom's negatives
  translate([-mold_width / 2 + key_margin, -mold_depth / 2 + key_margin, 0])
    sphere(r = key_size, $fn = 30);
  translate([mold_width / 2 - key_margin, mold_depth / 2 - key_margin, 0])
    sphere(r = key_size, $fn = 30);
}

// =============================================================================
// OUTPUT (side by side for printing)
// =============================================================================

// Bottom half
translate([0, 0, mold_height / 2])
  bottom_half();

// Top half (rotated 180 degrees so flat side is down for printing)
translate([mold_width + spacing, 0, mold_height / 2])
  rotate([180, 0, 0])
    top_half();
`;
}

// =============================================================================
// Standard Circular Mold
// =============================================================================

function generateStandardCircularMold(
  config: MoldConfig,
  dimensions: MoldDimensions,
  boundingBox: BoundingBox,
  meshFilename: string,
): string {
  const { wallThickness, keySize, keyFettle, keyMargin } = config;
  const pourHoleD1 = config.pourHoleDiameter ?? 10;
  const pourHoleD2 = config.pourHoleTaper ?? 5;
  const axisRotation = getAxisRotation(config.splitAxis);
  const spacing = 10;

  // For circular mold, diameter is max of width and depth
  const diameter = Math.max(dimensions.width, dimensions.depth);

  return `include <BOSL2/std.scad>

// =============================================================================
// MOLD PARAMETERS (Standard Circular)
// =============================================================================

// Mold dimensions
mold_diameter = ${diameter};
mold_height = ${dimensions.height};
wall_thickness = ${wallThickness};

// Registration keys
key_size = ${keySize};
key_fettle = ${keyFettle};
key_margin = ${keyMargin};

// Pour hole (funnel shape)
pour_hole_d1 = ${pourHoleD1};
pour_hole_d2 = ${pourHoleD2};
pour_hole_height = mold_height / 2 + wall_thickness;

// Layout spacing
spacing = ${spacing};

// Original part bounding box (for reference)
part_x = ${boundingBox.x};
part_y = ${boundingBox.y};
part_z = ${boundingBox.z};

// =============================================================================
// IMPORTED MESH
// =============================================================================

module original_part() {
  ${axisRotation}
  import("${meshFilename}", convexity=10);
}

// =============================================================================
// BOTTOM HALF
// =============================================================================

module bottom_half() {
  difference() {
    // Outer shell (bottom half only)
    translate([0, 0, -mold_height / 2])
      cyl(d = mold_diameter, h = mold_height / 2, anchor = BOTTOM, rounding2 = -2, $fn = 64);

    // Part cavity
    original_part();

    // Key holes (negative) - 2 keys at opposite positions
    translate([-mold_diameter / 2 + key_margin, -mold_diameter / 2 + key_margin, 0])
      sphere(r = key_size + key_fettle, $fn = 30);
    translate([mold_diameter / 2 - key_margin, mold_diameter / 2 - key_margin, 0])
      sphere(r = key_size + key_fettle, $fn = 30);
  }

  // Keys (positive) - opposite positions
  translate([-mold_diameter / 2 + key_margin, mold_diameter / 2 - key_margin, 0])
    sphere(r = key_size, $fn = 30);
  translate([mold_diameter / 2 - key_margin, -mold_diameter / 2 + key_margin, 0])
    sphere(r = key_size, $fn = 30);
}

// =============================================================================
// TOP HALF
// =============================================================================

module top_half() {
  difference() {
    // Outer shell (top half only)
    cyl(d = mold_diameter, h = mold_height / 2, anchor = BOTTOM, rounding1 = -2, $fn = 64);

    // Part cavity
    original_part();

    // Key holes (negative)
    translate([-mold_diameter / 2 + key_margin, mold_diameter / 2 - key_margin, 0])
      sphere(r = key_size + key_fettle, $fn = 30);
    translate([mold_diameter / 2 - key_margin, -mold_diameter / 2 + key_margin, 0])
      sphere(r = key_size + key_fettle, $fn = 30);

    // Pour hole
    translate([0, 0, mold_height / 4])
      cyl(h = pour_hole_height, d1 = pour_hole_d2, d2 = pour_hole_d1, anchor = BOTTOM, $fn = 32);
  }

  // Keys (positive)
  translate([-mold_diameter / 2 + key_margin, -mold_diameter / 2 + key_margin, 0])
    sphere(r = key_size, $fn = 30);
  translate([mold_diameter / 2 - key_margin, mold_diameter / 2 - key_margin, 0])
    sphere(r = key_size, $fn = 30);
}

// =============================================================================
// OUTPUT
// =============================================================================

translate([0, 0, mold_height / 2])
  bottom_half();

translate([mold_diameter + spacing, 0, mold_height / 2])
  rotate([180, 0, 0])
    top_half();
`;
}

// =============================================================================
// Forged Carbon Rectangular Mold (Piston + Bucket)
// =============================================================================

function generateForgedCarbonRectangularMold(
  config: MoldConfig,
  dimensions: MoldDimensions,
  boundingBox: BoundingBox,
  meshFilename: string,
): string {
  const { wallThickness, keySize, keyFettle, keyMargin } = config;
  const pistonClearance = config.pistonClearance ?? 0.4;
  const axisRotation = getAxisRotation(config.splitAxis);
  const spacing = 15;

  return `include <BOSL2/std.scad>

// =============================================================================
// MOLD PARAMETERS (Forged Carbon Rectangular - Piston + Bucket)
// =============================================================================

// Mold dimensions
mold_width = ${dimensions.width};
mold_depth = ${dimensions.depth};
mold_height = ${dimensions.height};
wall_thickness = ${wallThickness};

// Piston clearance (gap between piston and bucket walls)
piston_clearance = ${pistonClearance};

// Registration keys (on sides)
key_size = ${keySize};
key_fettle = ${keyFettle};
key_margin = ${keyMargin};

// Layout spacing
spacing = ${spacing};

// Original part bounding box
part_x = ${boundingBox.x};
part_y = ${boundingBox.y};
part_z = ${boundingBox.z};

// Calculated dimensions
bucket_inner_w = mold_width - wall_thickness * 2;
bucket_inner_d = mold_depth - wall_thickness * 2;
bucket_inner_h = mold_height - wall_thickness;

piston_outer_w = bucket_inner_w - piston_clearance * 2;
piston_outer_d = bucket_inner_d - piston_clearance * 2;
piston_height = bucket_inner_h - wall_thickness;

// =============================================================================
// IMPORTED MESH
// =============================================================================

module original_part() {
  ${axisRotation}
  import("${meshFilename}", convexity=10);
}

// =============================================================================
// BUCKET (Bottom - receives piston)
// =============================================================================

module bucket() {
  difference() {
    // Outer shell
    cuboid([mold_width, mold_depth, mold_height], anchor = BOTTOM, rounding = 2, edges = BOTTOM);

    // Inner cavity (for piston to enter)
    translate([0, 0, wall_thickness])
      cuboid([bucket_inner_w, bucket_inner_d, mold_height], anchor = BOTTOM);

    // Part cavity at bottom (negative of part)
    translate([0, 0, wall_thickness])
      original_part();

    // Key slots on sides (for alignment with piston)
    translate([mold_width / 2, 0, mold_height / 2])
      rotate([0, 90, 0])
        cyl(h = key_size * 2, d = key_size * 2 + key_fettle * 2, anchor = CENTER, $fn = 30);
    translate([-mold_width / 2, 0, mold_height / 2])
      rotate([0, 90, 0])
        cyl(h = key_size * 2, d = key_size * 2 + key_fettle * 2, anchor = CENTER, $fn = 30);
  }

  // Registration keys protruding from sides
  translate([mold_width / 2 - 0.1, 0, mold_height / 2])
    rotate([0, 90, 0])
      cyl(h = key_size, d = key_size * 2, anchor = BOTTOM, $fn = 30);
  translate([-mold_width / 2 + 0.1, 0, mold_height / 2])
    rotate([0, -90, 0])
      cyl(h = key_size, d = key_size * 2, anchor = BOTTOM, $fn = 30);
}

// =============================================================================
// PISTON (Top - compresses into bucket)
// =============================================================================

module piston() {
  difference() {
    union() {
      // Piston body (fits inside bucket)
      cuboid([piston_outer_w, piston_outer_d, piston_height], anchor = BOTTOM);

      // Handle/grip on top for pressing
      translate([0, 0, piston_height])
        cuboid([piston_outer_w * 0.5, piston_outer_d * 0.5, wall_thickness * 2],
               anchor = BOTTOM, rounding = 2, edges = TOP);
    }

    // Part cavity (negative of top half of part)
    translate([0, 0, 0])
      original_part();

    // Key slots (to receive bucket's keys)
    translate([piston_outer_w / 2 + piston_clearance, 0, piston_height / 2])
      rotate([0, 90, 0])
        cyl(h = key_size + key_fettle, d = key_size * 2 + key_fettle * 2, anchor = BOTTOM, $fn = 30);
    translate([-piston_outer_w / 2 - piston_clearance, 0, piston_height / 2])
      rotate([0, -90, 0])
        cyl(h = key_size + key_fettle, d = key_size * 2 + key_fettle * 2, anchor = BOTTOM, $fn = 30);
  }
}

// =============================================================================
// OUTPUT
// =============================================================================

// Bucket (left)
bucket();

// Piston (right)
translate([mold_width + spacing, 0, 0])
  piston();
`;
}

// =============================================================================
// Forged Carbon Circular Mold (Piston + Bucket)
// =============================================================================

function generateForgedCarbonCircularMold(
  config: MoldConfig,
  dimensions: MoldDimensions,
  boundingBox: BoundingBox,
  meshFilename: string,
): string {
  const { wallThickness, keySize, keyFettle } = config;
  const pistonClearance = config.pistonClearance ?? 0.4;
  const axisRotation = getAxisRotation(config.splitAxis);
  const spacing = 15;

  // For circular mold, diameter is max of width and depth
  const diameter = Math.max(dimensions.width, dimensions.depth);

  return `include <BOSL2/std.scad>

// =============================================================================
// MOLD PARAMETERS (Forged Carbon Circular - Piston + Bucket)
// =============================================================================

// Mold dimensions
mold_diameter = ${diameter};
mold_height = ${dimensions.height};
wall_thickness = ${wallThickness};

// Piston clearance
piston_clearance = ${pistonClearance};

// Registration keys
key_size = ${keySize};
key_fettle = ${keyFettle};

// Layout spacing
spacing = ${spacing};

// Original part bounding box
part_x = ${boundingBox.x};
part_y = ${boundingBox.y};
part_z = ${boundingBox.z};

// Calculated dimensions
bucket_inner_d = mold_diameter - wall_thickness * 2;
bucket_inner_h = mold_height - wall_thickness;

piston_outer_d = bucket_inner_d - piston_clearance * 2;
piston_height = bucket_inner_h - wall_thickness;

// =============================================================================
// IMPORTED MESH
// =============================================================================

module original_part() {
  ${axisRotation}
  import("${meshFilename}", convexity=10);
}

// =============================================================================
// BUCKET
// =============================================================================

module bucket() {
  difference() {
    // Outer shell
    cyl(d = mold_diameter, h = mold_height, anchor = BOTTOM, rounding2 = -2, $fn = 64);

    // Inner cavity
    translate([0, 0, wall_thickness])
      cyl(d = bucket_inner_d, h = mold_height, anchor = BOTTOM, $fn = 64);

    // Part cavity
    translate([0, 0, wall_thickness])
      original_part();

    // Key slots (4 positions around circumference)
    for (angle = [0, 90, 180, 270]) {
      rotate([0, 0, angle])
        translate([mold_diameter / 2, 0, mold_height / 2])
          rotate([0, 90, 0])
            cyl(h = key_size * 2, d = key_size * 2 + key_fettle * 2, anchor = CENTER, $fn = 30);
    }
  }

  // Registration keys (2 opposite positions)
  for (angle = [0, 180]) {
    rotate([0, 0, angle])
      translate([mold_diameter / 2 - 0.1, 0, mold_height / 2])
        rotate([0, 90, 0])
          cyl(h = key_size, d = key_size * 2, anchor = BOTTOM, $fn = 30);
  }
}

// =============================================================================
// PISTON
// =============================================================================

module piston() {
  difference() {
    union() {
      // Piston body
      cyl(d = piston_outer_d, h = piston_height, anchor = BOTTOM, $fn = 64);

      // Handle on top
      translate([0, 0, piston_height])
        cyl(d = piston_outer_d * 0.5, h = wall_thickness * 2, anchor = BOTTOM, rounding1 = -2, $fn = 64);
    }

    // Part cavity
    original_part();

    // Key slots (4 positions)
    for (angle = [0, 90, 180, 270]) {
      rotate([0, 0, angle])
        translate([piston_outer_d / 2 + piston_clearance, 0, piston_height / 2])
          rotate([0, 90, 0])
            cyl(h = key_size + key_fettle, d = key_size * 2 + key_fettle * 2, anchor = BOTTOM, $fn = 30);
    }
  }
}

// =============================================================================
// OUTPUT
// =============================================================================

bucket();

translate([mold_diameter + spacing, 0, 0])
  piston();
`;
}

// =============================================================================
// Utility: Format config as human-readable summary
// =============================================================================

export function formatConfigSummary(
  config: MoldConfig,
  stlSource: { filename: string },
): string {
  const lines = [
    `Generate a ${config.type} ${config.shape} mold for "${stlSource.filename}"`,
    '',
    `Split axis: ${config.splitAxis.toUpperCase()}`,
    `Wall thickness: ${config.wallThickness}mm`,
    `Key size: ${config.keySize}mm (tolerance: ${config.keyFettle}mm)`,
  ];

  if (config.type === 'standard') {
    lines.push(
      `Pour hole: ${config.pourHoleDiameter}mm → ${config.pourHoleTaper}mm`,
    );
  } else {
    lines.push(`Piston clearance: ${config.pistonClearance}mm`);
  }

  if (!config.dimensions.autoCalculated) {
    lines.push(
      `Custom dimensions: ${config.dimensions.width} x ${config.dimensions.depth} x ${config.dimensions.height}mm`,
    );
  }

  return lines.join('\n');
}
