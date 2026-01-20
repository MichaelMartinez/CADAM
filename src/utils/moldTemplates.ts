/**
 * Mold Templates
 *
 * Robust OpenSCAD code generation for professional two-part molds.
 * Based on best practices from professional mold design:
 * - Air vents for proper casting
 * - Conical registration keys for easy alignment
 * - Edge pour holes with overflow risers
 * - Clamping tabs with bolt holes
 * - Optional gasket channels
 *
 * References:
 * - Jason Webb's Parametric Mold Generator
 * - Prusa's Mold Making Guide
 */

import type {
  MoldConfig,
  BoundingBox,
  MoldDimensions,
  MeshCenter,
} from '@/types/mold';

// =============================================================================
// Dimension Calculation
// =============================================================================

/**
 * Calculate mold dimensions from bounding box and config.
 * Accounts for wall thickness, clamping tabs, and split axis.
 * IMPORTANT: When split axis is not Z, the part is rotated, so we must
 * adjust which bounding box dimension maps to which mold dimension.
 */
export function calculateMoldDimensions(
  boundingBox: BoundingBox,
  config: MoldConfig,
): MoldDimensions {
  const margin = config.wallThickness * 2;
  const tabExtra = config.enableClampingTabs ? config.clampTabSize : 0;

  // Determine effective part dimensions after rotation for split axis
  // The split axis becomes the "height" of the mold (the direction it splits)
  let partWidth: number;
  let partDepth: number;
  let partHeight: number;

  switch (config.splitAxis) {
    case 'x':
      // X-split: rotate around Y by 90°, so X becomes Z, Z becomes X
      partWidth = boundingBox.z; // Original Z becomes width
      partDepth = boundingBox.y; // Y stays the same
      partHeight = boundingBox.x; // Original X becomes height (split direction)
      break;
    case 'y':
      // Y-split: rotate around X by 90°, so Y becomes Z, Z becomes Y
      partWidth = boundingBox.x; // X stays the same
      partDepth = boundingBox.z; // Original Z becomes depth
      partHeight = boundingBox.y; // Original Y becomes height (split direction)
      break;
    case 'z':
    default:
      // Z-split: no rotation needed
      partWidth = boundingBox.x;
      partDepth = boundingBox.y;
      partHeight = boundingBox.z;
      break;
  }

  const width = partWidth + margin + tabExtra;
  const depth = partDepth + margin + tabExtra;
  const height = partHeight + margin;

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
  meshCenter?: MeshCenter,
): string {
  // Use manual dimensions if provided, otherwise calculate
  const dimensions = config.dimensions.autoCalculated
    ? calculateMoldDimensions(boundingBox, config)
    : config.dimensions;

  // Default mesh center to origin if not provided
  const center = meshCenter ?? { x: 0, y: 0, z: 0 };

  if (config.type === 'forged-carbon') {
    if (config.shape === 'circular') {
      return generateForgedCarbonCircularMold(
        config,
        dimensions,
        boundingBox,
        meshFilename,
        center,
      );
    }
    return generateForgedCarbonRectangularMold(
      config,
      dimensions,
      boundingBox,
      meshFilename,
      center,
    );
  }

  // Standard mold
  if (config.shape === 'circular') {
    return generateStandardCircularMold(
      config,
      dimensions,
      boundingBox,
      meshFilename,
      center,
    );
  }
  return generateStandardRectangularMold(
    config,
    dimensions,
    boundingBox,
    meshFilename,
    center,
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
// Shared Module Generators
// =============================================================================

/**
 * Generate the parameters section for OpenSCAD
 */
function generateParameters(
  config: MoldConfig,
  dimensions: MoldDimensions,
  boundingBox: BoundingBox,
  moldType: string,
): string {
  const { wallThickness, keySize, keyFettle, keyMargin, keyType, keyDraft } =
    config;
  const pourHoleD1 = config.pourHoleDiameter ?? 12;
  const pourHoleD2 = config.pourHoleTaper ?? 6;
  const overflowD = config.overflowDiameter ?? 6;

  return `
// =============================================================================
// MOLD PARAMETERS (${moldType})
// =============================================================================

// Mold dimensions
mold_width = ${dimensions.width};
mold_depth = ${dimensions.depth};
mold_height = ${dimensions.height};
wall_thickness = ${wallThickness};

// Registration keys
key_type = "${keyType}"; // "sphere" or "cone"
key_size = ${keySize};
key_fettle = ${keyFettle};
key_margin = ${keyMargin};
key_draft = ${keyDraft}; // Draft angle for conical keys (degrees)

// Air vents
enable_vents = ${config.enableVents};
vent_diameter = ${config.ventDiameter};
vent_count = ${config.ventCount};

// Pour system
pour_hole_d1 = ${pourHoleD1}; // Top diameter (funnel)
pour_hole_d2 = ${pourHoleD2}; // Bottom diameter
pour_hole_position = "${config.pourHolePosition ?? 'edge'}";
pour_hole_height = mold_height / 2 + wall_thickness;
enable_overflow = ${config.enableOverflow ?? false};
overflow_diameter = ${overflowD};

// Clamping system
enable_clamping_tabs = ${config.enableClampingTabs};
clamp_hole_diameter = ${config.clampHoleDiameter};
clamp_tab_size = ${config.clampTabSize};

// Gasket channel
enable_gasket_channel = ${config.enableGasketChannel};
gasket_channel_width = ${config.gasketChannelWidth};
gasket_channel_depth = ${config.gasketChannelDepth};

// Layout
spacing = 15;

// Original part bounding box (for reference)
part_x = ${boundingBox.x};
part_y = ${boundingBox.y};
part_z = ${boundingBox.z};
`;
}

/**
 * Generate the mesh import module with proper centering
 */
function generateMeshModule(
  meshFilename: string,
  splitAxis: string,
  center: MeshCenter,
): string {
  const axisRotation = getAxisRotation(splitAxis);

  return `
// =============================================================================
// IMPORTED MESH (properly centered)
// =============================================================================

// Debug: Echo mesh center values
echo("Mesh center:", ${center.x.toFixed(4)}, ${center.y.toFixed(4)}, ${center.z.toFixed(4)});
echo("Split axis:", "${splitAxis}");
echo("Mesh filename:", "${meshFilename}");

module original_part() {
  // Center the part by its bounding box center, then apply split axis rotation
  // minkowski with tiny sphere fixes mesh topology issues for boolean operations
  echo(">>> STAGE: About to execute minkowski() - this may take a while...");
  render()
  minkowski() {
    ${axisRotation}
    translate([-${center.x.toFixed(4)}, -${center.y.toFixed(4)}, -${center.z.toFixed(4)}])
      import("${meshFilename}");
    sphere(r=0.01, $fn=6);  // Tiny sphere to clean up mesh
  }
  echo(">>> STAGE: minkowski() completed");
}

// DEBUG: Test module with a simple cube to verify differencing works
module test_part() {
  cube([10, 10, 10], center=true);
}
`;
}

/**
 * Generate registration key modules (both sphere and cone variants)
 */
function generateKeyModules(): string {
  return `
// =============================================================================
// REGISTRATION KEY MODULES
// =============================================================================

// Positive key (protrudes from mold half)
module registration_key_positive() {
  if (key_type == "cone") {
    // Conical key with draft angle for easy alignment
    // Height based on key_size, draft creates taper
    key_height = key_size * 1.5;
    d1 = key_size * 2; // Base diameter
    d2 = key_size * 2 - 2 * key_height * tan(key_draft); // Top diameter (smaller due to draft)
    cyl(h=key_height, d1=d1, d2=max(d2, key_size), anchor=BOTTOM, $fn=32);
  } else {
    // Spherical key (original design)
    sphere(r=key_size, $fn=30);
  }
}

// Negative key (hole to receive positive key)
module registration_key_negative() {
  if (key_type == "cone") {
    // Matching conical hole with tolerance
    key_height = key_size * 1.5 + key_fettle;
    d1 = key_size * 2 + key_fettle * 2;
    d2 = (key_size * 2 - 2 * key_size * 1.5 * tan(key_draft)) + key_fettle * 2;
    cyl(h=key_height + 0.1, d1=d1, d2=max(d2, key_size + key_fettle * 2), anchor=BOTTOM, $fn=32);
  } else {
    // Spherical hole with tolerance
    sphere(r=key_size + key_fettle, $fn=30);
  }
}
`;
}

/**
 * Generate air vent module for rectangular molds
 */
function generateVentModuleRectangular(): string {
  return `
// =============================================================================
// AIR VENT SYSTEM (Rectangular)
// =============================================================================

// Vent channels running from corners to exterior
// Critical for proper casting - allows air to escape during pour
module vents_rectangular(is_top=true) {
  if (enable_vents) {
    // Calculate vent positions based on count (corners + midpoints)
    vent_inset = wall_thickness / 2;
    vent_z_offset = is_top ? mold_height / 4 : -mold_height / 4;

    // Corner vents (always 4)
    corner_positions = [
      [-mold_width/2 + vent_inset, -mold_depth/2 + vent_inset],
      [mold_width/2 - vent_inset, -mold_depth/2 + vent_inset],
      [mold_width/2 - vent_inset, mold_depth/2 - vent_inset],
      [-mold_width/2 + vent_inset, mold_depth/2 - vent_inset]
    ];

    for (i = [0:min(vent_count-1, 3)]) {
      pos = corner_positions[i];
      // Vertical vent channel
      translate([pos[0], pos[1], vent_z_offset])
        cyl(h=mold_height/2 + wall_thickness*2, d=vent_diameter, anchor=CENTER, $fn=16);
    }

    // Additional midpoint vents if count > 4
    if (vent_count > 4) {
      mid_positions = [
        [0, -mold_depth/2 + vent_inset],  // Front center
        [mold_width/2 - vent_inset, 0],   // Right center
        [0, mold_depth/2 - vent_inset],   // Back center
        [-mold_width/2 + vent_inset, 0]   // Left center
      ];
      for (i = [0:min(vent_count-5, 3)]) {
        pos = mid_positions[i];
        translate([pos[0], pos[1], vent_z_offset])
          cyl(h=mold_height/2 + wall_thickness*2, d=vent_diameter, anchor=CENTER, $fn=16);
      }
    }
  }
}
`;
}

/**
 * Generate air vent module for circular molds
 */
function generateVentModuleCircular(): string {
  return `
// =============================================================================
// AIR VENT SYSTEM (Circular)
// =============================================================================

// Vent channels distributed around circumference
module vents_circular(mold_diameter, is_top=true) {
  if (enable_vents) {
    vent_radius = mold_diameter/2 - wall_thickness/2;
    vent_z_offset = is_top ? mold_height / 4 : -mold_height / 4;

    for (i = [0:vent_count-1]) {
      angle = i * 360 / vent_count;
      translate([vent_radius * cos(angle), vent_radius * sin(angle), vent_z_offset])
        cyl(h=mold_height/2 + wall_thickness*2, d=vent_diameter, anchor=CENTER, $fn=16);
    }
  }
}
`;
}

/**
 * Generate clamping tab module for rectangular molds
 */
function generateClampingTabsRectangular(): string {
  return `
// =============================================================================
// CLAMPING TABS (Rectangular)
// =============================================================================

// Corner tabs with bolt holes for securing mold halves together
module clamping_tabs_rectangular(half_height) {
  if (enable_clamping_tabs) {
    tab_offset_x = mold_width/2 + clamp_tab_size/2 - 2;
    tab_offset_y = mold_depth/2 + clamp_tab_size/2 - 2;

    // Four corner tabs
    corner_offsets = [
      [tab_offset_x, tab_offset_y],
      [-tab_offset_x, tab_offset_y],
      [tab_offset_x, -tab_offset_y],
      [-tab_offset_x, -tab_offset_y]
    ];

    difference() {
      union() {
        for (pos = corner_offsets) {
          translate([pos[0], pos[1], 0])
            cuboid([clamp_tab_size, clamp_tab_size, half_height],
                   anchor=BOTTOM, rounding=2, edges=TOP+BOTTOM);
        }
      }
      // Bolt holes through all tabs
      for (pos = corner_offsets) {
        translate([pos[0], pos[1], -0.1])
          cyl(h=half_height + 0.2, d=clamp_hole_diameter, anchor=BOTTOM, $fn=24);
      }
    }
  }
}
`;
}

/**
 * Generate clamping tab module for circular molds
 */
function generateClampingTabsCircular(): string {
  return `
// =============================================================================
// CLAMPING TABS (Circular)
// =============================================================================

// Tabs positioned around circumference for circular molds
module clamping_tabs_circular(mold_diameter, half_height) {
  if (enable_clamping_tabs) {
    tab_radius = mold_diameter/2 + clamp_tab_size/2 - 2;
    num_tabs = 4;

    difference() {
      union() {
        for (i = [0:num_tabs-1]) {
          angle = i * 360 / num_tabs + 45; // Offset by 45 degrees
          translate([tab_radius * cos(angle), tab_radius * sin(angle), 0])
            cyl(d=clamp_tab_size, h=half_height, anchor=BOTTOM, $fn=32);
        }
      }
      // Bolt holes
      for (i = [0:num_tabs-1]) {
        angle = i * 360 / num_tabs + 45;
        translate([tab_radius * cos(angle), tab_radius * sin(angle), -0.1])
          cyl(h=half_height + 0.2, d=clamp_hole_diameter, anchor=BOTTOM, $fn=24);
      }
    }
  }
}
`;
}

/**
 * Generate gasket channel module for rectangular molds
 */
function generateGasketChannelRectangular(): string {
  return `
// =============================================================================
// GASKET CHANNEL (Rectangular)
// =============================================================================

// Channel around parting line perimeter to catch flash and improve seal
module gasket_channel_rectangular() {
  if (enable_gasket_channel) {
    channel_inset = wall_thickness + 2;
    inner_w = mold_width - channel_inset * 2;
    inner_d = mold_depth - channel_inset * 2;

    translate([0, 0, -gasket_channel_depth/2])
      difference() {
        cuboid([inner_w + gasket_channel_width*2, inner_d + gasket_channel_width*2, gasket_channel_depth],
               rounding=1, $fn=16);
        cuboid([inner_w, inner_d, gasket_channel_depth + 0.2], rounding=1, $fn=16);
      }
  }
}
`;
}

/**
 * Generate gasket channel module for circular molds
 */
function generateGasketChannelCircular(): string {
  return `
// =============================================================================
// GASKET CHANNEL (Circular)
// =============================================================================

module gasket_channel_circular(mold_diameter) {
  if (enable_gasket_channel) {
    channel_radius = mold_diameter/2 - wall_thickness - 2;

    translate([0, 0, -gasket_channel_depth/2])
      tube(or=channel_radius + gasket_channel_width, ir=channel_radius, h=gasket_channel_depth, $fn=64);
  }
}
`;
}

/**
 * Generate pour system module (pour hole + optional overflow)
 */
function generatePourSystemModule(): string {
  return `
// =============================================================================
// POUR SYSTEM
// =============================================================================

// Main pour hole - positioned at edge for better air escape
// Optional overflow riser on opposite side for head pressure
module pour_system(mold_w, mold_d) {
  pour_offset = pour_hole_position == "edge" ? mold_w/2 - wall_thickness - pour_hole_d1/2 : 0;

  // Main pour hole (funnel shape)
  translate([pour_offset, 0, 0])
    cyl(h=pour_hole_height, d1=pour_hole_d2, d2=pour_hole_d1, anchor=BOTTOM, $fn=32);

  // Overflow riser on opposite side
  if (enable_overflow && pour_hole_position == "edge") {
    translate([-pour_offset, 0, 0])
      cyl(h=pour_hole_height, d=overflow_diameter, anchor=BOTTOM, $fn=24);
  }
}
`;
}

// =============================================================================
// Standard Rectangular Mold
// =============================================================================

function generateStandardRectangularMold(
  config: MoldConfig,
  dimensions: MoldDimensions,
  boundingBox: BoundingBox,
  meshFilename: string,
  center: MeshCenter,
): string {
  const params = generateParameters(
    config,
    dimensions,
    boundingBox,
    'Standard Rectangular',
  );
  const meshModule = generateMeshModule(meshFilename, config.splitAxis, center);
  const keyModules = generateKeyModules();
  const ventModule = generateVentModuleRectangular();
  const clampModule = generateClampingTabsRectangular();
  const gasketModule = generateGasketChannelRectangular();
  const pourModule = generatePourSystemModule();

  return `include <BOSL2/std.scad>
${params}
${meshModule}
${keyModules}
${ventModule}
${clampModule}
${gasketModule}
${pourModule}

// =============================================================================
// BOTTOM HALF
// =============================================================================

module bottom_half() {
  half_h = mold_height / 2;

  difference() {
    union() {
      // Main mold body
      translate([0, 0, -half_h])
        cuboid([mold_width, mold_depth, half_h], anchor=BOTTOM, rounding=2, edges=BOTTOM);

      // Clamping tabs
      translate([0, 0, -half_h])
        clamping_tabs_rectangular(half_h);

      // Positive registration keys (diagonal corners)
      translate([-mold_width/2 + key_margin, mold_depth/2 - key_margin, 0])
        registration_key_positive();
      translate([mold_width/2 - key_margin, -mold_depth/2 + key_margin, 0])
        registration_key_positive();
    }

    // Part cavity
    original_part();

    // Negative registration keys (opposite diagonal)
    translate([-mold_width/2 + key_margin, -mold_depth/2 + key_margin, 0])
      registration_key_negative();
    translate([mold_width/2 - key_margin, mold_depth/2 - key_margin, 0])
      registration_key_negative();

    // Air vents
    vents_rectangular(is_top=false);

    // Gasket channel
    gasket_channel_rectangular();
  }
}

// =============================================================================
// TOP HALF
// =============================================================================

module top_half() {
  half_h = mold_height / 2;

  difference() {
    union() {
      // Main mold body
      cuboid([mold_width, mold_depth, half_h], anchor=BOTTOM, rounding=2, edges=TOP);

      // Clamping tabs
      clamping_tabs_rectangular(half_h);

      // Positive registration keys (opposite diagonal from bottom)
      translate([-mold_width/2 + key_margin, -mold_depth/2 + key_margin, 0])
        registration_key_positive();
      translate([mold_width/2 - key_margin, mold_depth/2 - key_margin, 0])
        registration_key_positive();
    }

    // Part cavity
    original_part();

    // Negative registration keys
    translate([-mold_width/2 + key_margin, mold_depth/2 - key_margin, 0])
      registration_key_negative();
    translate([mold_width/2 - key_margin, -mold_depth/2 + key_margin, 0])
      registration_key_negative();

    // Pour system (pour hole + overflow)
    translate([0, 0, half_h / 2])
      pour_system(mold_width, mold_depth);

    // Air vents
    vents_rectangular(is_top=true);

    // Gasket channel (mirror of bottom)
    gasket_channel_rectangular();
  }
}

// =============================================================================
// OUTPUT (side by side for printing)
// =============================================================================

// Bottom half (positioned for printing)
translate([0, 0, mold_height / 2])
  bottom_half();

// Top half (flipped for printing - flat side down)
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
  center: MeshCenter,
): string {
  const diameter = Math.max(dimensions.width, dimensions.depth);
  const params = generateParameters(
    config,
    dimensions,
    boundingBox,
    'Standard Circular',
  );
  const meshModule = generateMeshModule(meshFilename, config.splitAxis, center);
  const keyModules = generateKeyModules();
  const ventModule = generateVentModuleCircular();
  const clampModule = generateClampingTabsCircular();
  const gasketModule = generateGasketChannelCircular();
  const pourModule = generatePourSystemModule();

  return `include <BOSL2/std.scad>
${params}
// Circular mold specific
mold_diameter = ${diameter};
${meshModule}
${keyModules}
${ventModule}
${clampModule}
${gasketModule}
${pourModule}

// =============================================================================
// BOTTOM HALF
// =============================================================================

module bottom_half() {
  half_h = mold_height / 2;

  difference() {
    union() {
      // Main cylindrical body
      translate([0, 0, -half_h])
        cyl(d=mold_diameter, h=half_h, anchor=BOTTOM, rounding2=-2, $fn=64);

      // Clamping tabs
      translate([0, 0, -half_h])
        clamping_tabs_circular(mold_diameter, half_h);

      // Positive registration keys (4 positions)
      for (angle = [45, 225]) {
        rotate([0, 0, angle])
          translate([mold_diameter/2 - key_margin, 0, 0])
            registration_key_positive();
      }
    }

    // Part cavity
    original_part();

    // Negative registration keys
    for (angle = [135, 315]) {
      rotate([0, 0, angle])
        translate([mold_diameter/2 - key_margin, 0, 0])
          registration_key_negative();
    }

    // Air vents
    vents_circular(mold_diameter, is_top=false);

    // Gasket channel
    gasket_channel_circular(mold_diameter);
  }
}

// =============================================================================
// TOP HALF
// =============================================================================

module top_half() {
  half_h = mold_height / 2;

  difference() {
    union() {
      // Main cylindrical body
      cyl(d=mold_diameter, h=half_h, anchor=BOTTOM, rounding1=-2, $fn=64);

      // Clamping tabs
      clamping_tabs_circular(mold_diameter, half_h);

      // Positive registration keys
      for (angle = [135, 315]) {
        rotate([0, 0, angle])
          translate([mold_diameter/2 - key_margin, 0, 0])
            registration_key_positive();
      }
    }

    // Part cavity
    original_part();

    // Negative registration keys
    for (angle = [45, 225]) {
      rotate([0, 0, angle])
        translate([mold_diameter/2 - key_margin, 0, 0])
          registration_key_negative();
    }

    // Pour system
    translate([0, 0, half_h / 2])
      pour_system(mold_diameter, mold_diameter);

    // Air vents
    vents_circular(mold_diameter, is_top=true);

    // Gasket channel
    gasket_channel_circular(mold_diameter);
  }
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
  center: MeshCenter,
): string {
  const { wallThickness, keySize, keyFettle, keyMargin } = config;
  const pistonClearance = config.pistonClearance ?? 0.4;
  const meshModule = generateMeshModule(meshFilename, config.splitAxis, center);

  // Calculate part height based on split axis (after rotation)
  let partHeight: number;
  switch (config.splitAxis) {
    case 'x':
      partHeight = boundingBox.x;
      break;
    case 'y':
      partHeight = boundingBox.y;
      break;
    case 'z':
    default:
      partHeight = boundingBox.z;
      break;
  }

  // Floor thickness must be at least wall_thickness, but also enough to hold bottom half of part
  // Add 2mm buffer to ensure part doesn't extend below floor
  const floorThickness = Math.max(wallThickness, partHeight / 2 + 2);

  return `include <BOSL2/std.scad>

// =============================================================================
// MOLD PARAMETERS (Forged Carbon Rectangular - Piston + Bucket)
// =============================================================================

// Mold dimensions
mold_width = ${dimensions.width};
mold_depth = ${dimensions.depth};
mold_height = ${dimensions.height};
wall_thickness = ${wallThickness};

// Floor thickness (must accommodate bottom half of part)
// This is calculated as max(wall_thickness, part_height/2 + 2mm buffer)
floor_thickness = ${floorThickness.toFixed(2)};

// Piston clearance (gap between piston and bucket walls)
piston_clearance = ${pistonClearance};

// Registration keys (on sides)
key_size = ${keySize};
key_fettle = ${keyFettle};
key_margin = ${keyMargin};

// Layout spacing
spacing = 15;

// Original part bounding box
part_x = ${boundingBox.x};
part_y = ${boundingBox.y};
part_z = ${boundingBox.z};

// Calculated dimensions
bucket_inner_w = mold_width - wall_thickness * 2;
bucket_inner_d = mold_depth - wall_thickness * 2;
bucket_inner_h = mold_height - floor_thickness;  // Uses floor_thickness, not wall_thickness

piston_outer_w = bucket_inner_w - piston_clearance * 2;
piston_outer_d = bucket_inner_d - piston_clearance * 2;
piston_height = bucket_inner_h;  // Piston fills the remaining cavity
${meshModule}

// =============================================================================
// BUCKET (Bottom - receives piston)
// =============================================================================

module bucket() {
  echo(">>> STAGE: Building bucket...");
  difference() {
    // Outer shell
    cuboid([mold_width, mold_depth, mold_height], anchor=BOTTOM, rounding=2, edges=BOTTOM);

    // Inner cavity (for piston to enter) - starts at floor_thickness
    translate([0, 0, floor_thickness])
      cuboid([bucket_inner_w, bucket_inner_d, mold_height], anchor=BOTTOM);

    // Part cavity carved into floor (bottom half of part)
    // Part is centered, so translate by floor_thickness to position it correctly
    echo(">>> STAGE: Carving part cavity (calls original_part with minkowski)...");
    translate([0, 0, floor_thickness])
      original_part();

    // Key slots on sides (for alignment with piston)
    translate([mold_width/2, 0, floor_thickness + bucket_inner_h/2])
      rotate([0, 90, 0])
        cyl(h=key_size*2, d=key_size*2 + key_fettle*2, anchor=CENTER, $fn=30);
    translate([-mold_width/2, 0, floor_thickness + bucket_inner_h/2])
      rotate([0, 90, 0])
        cyl(h=key_size*2, d=key_size*2 + key_fettle*2, anchor=CENTER, $fn=30);
  }

  // Registration keys protruding from sides
  translate([mold_width/2 - 0.1, 0, floor_thickness + bucket_inner_h/2])
    rotate([0, 90, 0])
      cyl(h=key_size, d=key_size*2, anchor=BOTTOM, $fn=30);
  translate([-mold_width/2 + 0.1, 0, floor_thickness + bucket_inner_h/2])
    rotate([0, -90, 0])
      cyl(h=key_size, d=key_size*2, anchor=BOTTOM, $fn=30);
}

// =============================================================================
// PISTON (Top - compresses into bucket)
// =============================================================================

module piston() {
  echo(">>> STAGE: Building piston...");
  difference() {
    union() {
      // Piston body (fits inside bucket)
      cuboid([piston_outer_w, piston_outer_d, piston_height], anchor=BOTTOM);

      // Handle/grip on top for pressing
      translate([0, 0, piston_height])
        cuboid([piston_outer_w * 0.5, piston_outer_d * 0.5, wall_thickness * 2],
               anchor=BOTTOM, rounding=2, edges=TOP);
    }

    // Part cavity (top half of part)
    // When piston enters bucket, this aligns with bucket's cavity
    echo(">>> STAGE: Carving piston cavity...");
    original_part();

    // Key slots (to receive bucket's keys)
    translate([piston_outer_w/2 + piston_clearance, 0, piston_height/2])
      rotate([0, 90, 0])
        cyl(h=key_size + key_fettle, d=key_size*2 + key_fettle*2, anchor=BOTTOM, $fn=30);
    translate([-piston_outer_w/2 - piston_clearance, 0, piston_height/2])
      rotate([0, -90, 0])
        cyl(h=key_size + key_fettle, d=key_size*2 + key_fettle*2, anchor=BOTTOM, $fn=30);
  }
}

// =============================================================================
// OUTPUT
// =============================================================================

echo(">>> STAGE: Rendering bucket...");
// Bucket (left)
bucket();

echo(">>> STAGE: Rendering piston...");
// Piston (right, offset by mold_width + spacing)
translate([mold_width + spacing, 0, 0])
  piston();

echo(">>> STAGE: All geometry complete");

// DEBUG: Render the imported part directly to verify STL import works
// If this shows up, the import is working. If not, there's an import issue.
translate([0, mold_depth + spacing, floor_thickness])
  color("red") original_part();

// DEBUG: Test bucket with simple cube to verify differencing works
// This should show a 10x10x10 cube cavity carved into a simple box
module debug_test_bucket() {
  difference() {
    cube([30, 30, 15], center=true);
    translate([0, 0, 2.5])
      test_part();
  }
}
translate([-(mold_width + spacing), 0, 7.5])
  color("orange") debug_test_bucket();

// DEBUG: Test with IMPORTED MESH using standard OpenSCAD cube (not BOSL2 cuboid)
// This tests if the issue is BOSL2 vs standard OpenSCAD
module debug_stl_test() {
  difference() {
    cube([part_x + 10, part_y + 10, part_z/2 + 5], center=true);
    original_part();
  }
}
translate([mold_width * 2 + spacing * 2, 0, part_z/4 + 2.5])
  color("purple") debug_stl_test();
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
  center: MeshCenter,
): string {
  const { wallThickness, keySize, keyFettle } = config;
  const pistonClearance = config.pistonClearance ?? 0.4;
  const diameter = Math.max(dimensions.width, dimensions.depth);
  const meshModule = generateMeshModule(meshFilename, config.splitAxis, center);

  // Calculate part height based on split axis (after rotation)
  let partHeight: number;
  switch (config.splitAxis) {
    case 'x':
      partHeight = boundingBox.x;
      break;
    case 'y':
      partHeight = boundingBox.y;
      break;
    case 'z':
    default:
      partHeight = boundingBox.z;
      break;
  }

  // Floor thickness must be at least wall_thickness, but also enough to hold bottom half of part
  // Add 2mm buffer to ensure part doesn't extend below floor
  const floorThickness = Math.max(wallThickness, partHeight / 2 + 2);

  return `include <BOSL2/std.scad>

// =============================================================================
// MOLD PARAMETERS (Forged Carbon Circular - Piston + Bucket)
// =============================================================================

// Mold dimensions
mold_diameter = ${diameter};
mold_height = ${dimensions.height};
wall_thickness = ${wallThickness};

// Floor thickness (must accommodate bottom half of part)
floor_thickness = ${floorThickness.toFixed(2)};

// Piston clearance
piston_clearance = ${pistonClearance};

// Registration keys
key_size = ${keySize};
key_fettle = ${keyFettle};

// Layout spacing
spacing = 15;

// Original part bounding box
part_x = ${boundingBox.x};
part_y = ${boundingBox.y};
part_z = ${boundingBox.z};

// Calculated dimensions
bucket_inner_d = mold_diameter - wall_thickness * 2;
bucket_inner_h = mold_height - floor_thickness;  // Uses floor_thickness

piston_outer_d = bucket_inner_d - piston_clearance * 2;
piston_height = bucket_inner_h;  // Piston fills the remaining cavity
${meshModule}

// =============================================================================
// BUCKET
// =============================================================================

module bucket() {
  echo(">>> STAGE: Building circular bucket...");
  difference() {
    // Outer shell
    cyl(d=mold_diameter, h=mold_height, anchor=BOTTOM, rounding2=-2, $fn=64);

    // Inner cavity - starts at floor_thickness
    translate([0, 0, floor_thickness])
      cyl(d=bucket_inner_d, h=mold_height, anchor=BOTTOM, $fn=64);

    // Part cavity carved into floor (bottom half of part)
    echo(">>> STAGE: Carving bucket cavity...");
    translate([0, 0, floor_thickness])
      original_part();

    // Key slots (4 positions around circumference)
    for (angle = [0, 90, 180, 270]) {
      rotate([0, 0, angle])
        translate([mold_diameter/2, 0, floor_thickness + bucket_inner_h/2])
          rotate([0, 90, 0])
            cyl(h=key_size*2, d=key_size*2 + key_fettle*2, anchor=CENTER, $fn=30);
    }
  }

  // Registration keys (2 opposite positions)
  for (angle = [0, 180]) {
    rotate([0, 0, angle])
      translate([mold_diameter/2 - 0.1, 0, floor_thickness + bucket_inner_h/2])
        rotate([0, 90, 0])
          cyl(h=key_size, d=key_size*2, anchor=BOTTOM, $fn=30);
  }
}

// =============================================================================
// PISTON
// =============================================================================

module piston() {
  echo(">>> STAGE: Building circular piston...");
  difference() {
    union() {
      // Piston body
      cyl(d=piston_outer_d, h=piston_height, anchor=BOTTOM, $fn=64);

      // Handle on top
      translate([0, 0, piston_height])
        cyl(d=piston_outer_d * 0.5, h=wall_thickness*2, anchor=BOTTOM, rounding1=-2, $fn=64);
    }

    // Part cavity (top half of part)
    echo(">>> STAGE: Carving piston cavity...");
    original_part();

    // Key slots (4 positions)
    for (angle = [0, 90, 180, 270]) {
      rotate([0, 0, angle])
        translate([piston_outer_d/2 + piston_clearance, 0, piston_height/2])
          rotate([0, 90, 0])
            cyl(h=key_size + key_fettle, d=key_size*2 + key_fettle*2, anchor=BOTTOM, $fn=30);
    }
  }
}

// =============================================================================
// OUTPUT
// =============================================================================

echo(">>> STAGE: Rendering circular bucket...");
bucket();

echo(">>> STAGE: Rendering circular piston...");
translate([mold_diameter + spacing, 0, 0])
  piston();

echo(">>> STAGE: All geometry complete");

// DEBUG: Render the imported part directly to verify STL import works
translate([0, mold_diameter + spacing, floor_thickness])
  color("red") original_part();
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
    `Key type: ${config.keyType} (size: ${config.keySize}mm, tolerance: ${config.keyFettle}mm)`,
  ];

  if (config.keyType === 'cone') {
    lines.push(`Key draft angle: ${config.keyDraft}°`);
  }

  if (config.enableVents) {
    lines.push(
      `Air vents: ${config.ventCount} x ${config.ventDiameter}mm diameter`,
    );
  } else {
    lines.push('Air vents: disabled');
  }

  if (config.type === 'standard') {
    lines.push(
      `Pour hole: ${config.pourHoleDiameter}mm → ${config.pourHoleTaper}mm (${config.pourHolePosition})`,
    );
    if (config.enableOverflow) {
      lines.push(`Overflow riser: ${config.overflowDiameter}mm`);
    }
  } else {
    lines.push(`Piston clearance: ${config.pistonClearance}mm`);
  }

  if (config.enableClampingTabs) {
    lines.push(
      `Clamping tabs: ${config.clampTabSize}mm with M${config.clampHoleDiameter} holes`,
    );
  }

  if (config.enableGasketChannel) {
    lines.push(
      `Gasket channel: ${config.gasketChannelWidth}mm x ${config.gasketChannelDepth}mm`,
    );
  }

  if (!config.dimensions.autoCalculated) {
    lines.push(
      `Custom dimensions: ${config.dimensions.width} x ${config.dimensions.depth} x ${config.dimensions.height}mm`,
    );
  }

  return lines.join('\n');
}
