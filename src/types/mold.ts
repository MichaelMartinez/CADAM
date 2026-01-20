/**
 * Mold Generator Types
 *
 * Type definitions for the mold generator tool.
 * Based on best practices from professional mold design.
 */

// =============================================================================
// Core Types
// =============================================================================

export type MoldType = 'standard' | 'forged-carbon';
export type MoldShape = 'rectangular' | 'circular';
export type SplitAxis = 'x' | 'y' | 'z';
export type KeyType = 'sphere' | 'cone';
export type PourHolePosition = 'center' | 'edge';

// =============================================================================
// Bounding Box (reuse structure from MeshUploadState)
// =============================================================================

export interface BoundingBox {
  x: number;
  y: number;
  z: number;
}

// =============================================================================
// Mesh Center (for proper part centering)
// =============================================================================

export interface MeshCenter {
  x: number;
  y: number;
  z: number;
}

// =============================================================================
// Mold Configuration
// =============================================================================

export interface MoldDimensions {
  width: number; // X axis
  depth: number; // Y axis
  height: number; // Z axis
  autoCalculated: boolean;
}

export interface MoldConfig {
  type: MoldType;
  shape: MoldShape;
  splitAxis: SplitAxis;

  // Wall thickness (mm)
  wallThickness: number;

  // Registration keys
  keyType: KeyType; // Type of registration key (sphere or cone)
  keySize: number; // Size of key (radius for sphere, base radius for cone)
  keyFettle: number; // Tolerance on negative keys (mm)
  keyMargin: number; // Distance from edge (mm)
  keyDraft: number; // Draft angle for conical keys (degrees)

  // Air vent system (critical for proper casting)
  enableVents: boolean;
  ventDiameter: number; // Vent channel diameter (0.5-2mm)
  ventCount: number; // Number of vent channels (4-8)

  // Pour system (standard mold only)
  pourHoleDiameter?: number; // Top diameter (mm)
  pourHoleTaper?: number; // Bottom diameter (mm), smaller for funnel effect
  pourHolePosition?: PourHolePosition; // Position of pour hole
  enableOverflow?: boolean; // Add overflow/riser channel
  overflowDiameter?: number; // Overflow hole diameter (mm)

  // Clamping system
  enableClampingTabs: boolean;
  clampHoleDiameter: number; // Bolt hole diameter (mm)
  clampTabSize: number; // Size of clamping tabs (mm)

  // Gasket channel (optional seal around parting line)
  enableGasketChannel: boolean;
  gasketChannelWidth: number; // Width of gasket channel (mm)
  gasketChannelDepth: number; // Depth of gasket channel (mm)

  // Forged carbon only - piston clearance (legacy, use shear edge params instead)
  pistonClearance?: number; // Gap between piston and bucket (mm)

  // Forged carbon shear edge (proper telescopic seal design)
  shearEdgeGap?: number; // 0.05-0.15mm (default 0.075) - tight seal tolerance
  shearEdgeDepth?: number; // 2-5mm (default 2.5) - vertical interface length
  clearanceRunout?: number; // 0.2-0.6mm (default 0.4) - clearance after seal region

  // Draft angle for mold cavity (helps with demolding)
  draftAngle?: number; // 0-5 degrees (default from analysis recommendation)

  // Profile generation method
  useProjectedProfile?: boolean; // Use alpha shape (true) vs bounding box (false)

  // Mold dimensions (auto-calculated or manual override)
  dimensions: MoldDimensions;
}

// =============================================================================
// STL Source
// =============================================================================

export type STLSource =
  | { type: 'upload'; file: File; filename: string }
  | {
      type: 'creation';
      conversationId: string;
      meshId: string;
      filename: string;
    };

// =============================================================================
// Generator State
// =============================================================================

export interface MoldGeneratorState {
  stlSource: STLSource | null;
  boundingBox: BoundingBox | null;
  originalGeometry: ArrayBuffer | null;
  config: MoldConfig;
  generatedCode: string | null;
  compiledBlob: Blob | null;
  isCompiling: boolean;
  error: string | null;
}

// =============================================================================
// Default Configuration
// =============================================================================

export const DEFAULT_MOLD_CONFIG: MoldConfig = {
  type: 'standard',
  shape: 'rectangular',
  splitAxis: 'z',

  wallThickness: 5,

  // Registration keys (conical for better alignment)
  keyType: 'cone',
  keySize: 4,
  keyFettle: 0.4,
  keyMargin: 10,
  keyDraft: 5, // 5 degree draft angle

  // Air vents (critical for proper casting)
  enableVents: true,
  ventDiameter: 1.0,
  ventCount: 4,

  // Pour system
  pourHoleDiameter: 12,
  pourHoleTaper: 6,
  pourHolePosition: 'edge',
  enableOverflow: true,
  overflowDiameter: 6,

  // Clamping system
  enableClampingTabs: true,
  clampHoleDiameter: 4,
  clampTabSize: 15,

  // Gasket channel (off by default)
  enableGasketChannel: false,
  gasketChannelWidth: 2,
  gasketChannelDepth: 1,

  // Forged carbon (legacy)
  pistonClearance: 0.4,

  // Forged carbon shear edge (proper telescopic seal)
  shearEdgeGap: 0.075, // 0.075mm tight seal
  shearEdgeDepth: 2.5, // 2.5mm vertical interface
  clearanceRunout: 0.4, // 0.4mm clearance after seal

  // Draft angle (0 = use analysis recommendation)
  draftAngle: 0,

  // Profile generation
  useProjectedProfile: true, // Use alpha shape by default

  dimensions: {
    width: 0,
    depth: 0,
    height: 0,
    autoCalculated: true,
  },
};

// =============================================================================
// Validation
// =============================================================================

export interface MoldConfigValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateMoldConfig(
  config: MoldConfig,
  boundingBox: BoundingBox | null,
): MoldConfigValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!boundingBox) {
    errors.push('No STL file selected');
  }

  // Wall thickness validation
  if (config.wallThickness < 1) {
    errors.push('Wall thickness must be at least 1mm');
  }
  if (config.wallThickness > 20) {
    errors.push('Wall thickness should not exceed 20mm');
  }

  // Registration key validation
  if (config.keySize < 1) {
    errors.push('Key size must be at least 1mm');
  }
  if (config.keyFettle < 0.1) {
    errors.push('Key tolerance must be at least 0.1mm');
  }
  if (config.keyFettle > config.keySize) {
    errors.push('Key tolerance should be smaller than key size');
  }
  if (
    config.keyType === 'cone' &&
    (config.keyDraft < 1 || config.keyDraft > 15)
  ) {
    errors.push('Key draft angle should be between 1 and 15 degrees');
  }

  // Vent validation
  if (config.enableVents) {
    if (config.ventDiameter < 0.3) {
      errors.push('Vent diameter must be at least 0.3mm');
    }
    if (config.ventDiameter > 3) {
      warnings.push('Vent diameter over 3mm may allow material to escape');
    }
    if (config.ventCount < 2) {
      errors.push('At least 2 vents are recommended');
    }
    if (config.ventCount > 12) {
      warnings.push('More than 12 vents may weaken mold structure');
    }
  }

  // Standard mold specific validation
  if (config.type === 'standard') {
    if (!config.pourHoleDiameter || config.pourHoleDiameter < 3) {
      errors.push('Pour hole diameter must be at least 3mm');
    }
    if (
      config.pourHoleTaper &&
      config.pourHoleDiameter &&
      config.pourHoleTaper >= config.pourHoleDiameter
    ) {
      errors.push('Pour hole taper must be smaller than top diameter');
    }
    if (config.enableOverflow) {
      if (!config.overflowDiameter || config.overflowDiameter < 2) {
        errors.push('Overflow diameter must be at least 2mm');
      }
    }
    if (!config.enableVents) {
      warnings.push('Air vents are strongly recommended for proper casting');
    }
  }

  // Clamping tab validation
  if (config.enableClampingTabs) {
    if (config.clampHoleDiameter < 2) {
      errors.push('Clamp hole diameter must be at least 2mm');
    }
    if (config.clampTabSize < config.clampHoleDiameter * 2) {
      errors.push('Clamp tab size must be at least twice the hole diameter');
    }
  }

  // Gasket channel validation
  if (config.enableGasketChannel) {
    if (config.gasketChannelWidth < 1) {
      errors.push('Gasket channel width must be at least 1mm');
    }
    if (config.gasketChannelDepth < 0.5) {
      errors.push('Gasket channel depth must be at least 0.5mm');
    }
  }

  // Forged carbon specific validation
  if (config.type === 'forged-carbon') {
    // Legacy piston clearance (for backwards compatibility)
    if (!config.pistonClearance || config.pistonClearance < 0.1) {
      errors.push('Piston clearance must be at least 0.1mm');
    }
    if (config.pistonClearance && config.pistonClearance > 2) {
      errors.push('Piston clearance should not exceed 2mm');
    }

    // Shear edge gap validation (proper telescopic seal)
    if (config.shearEdgeGap !== undefined) {
      if (config.shearEdgeGap < 0.05) {
        errors.push('Shear edge gap must be at least 0.05mm');
      }
      if (config.shearEdgeGap > 0.15) {
        warnings.push(
          'Shear edge gap over 0.15mm may cause flash in forged carbon',
        );
      }
    }

    // Shear edge depth validation
    if (config.shearEdgeDepth !== undefined) {
      if (config.shearEdgeDepth < 1) {
        errors.push('Shear edge depth must be at least 1mm');
      }
      if (config.shearEdgeDepth > 5) {
        warnings.push('Shear edge depth over 5mm may make demolding difficult');
      }
    }

    // Clearance runout validation
    if (config.clearanceRunout !== undefined) {
      if (config.clearanceRunout < 0.2) {
        errors.push('Clearance runout must be at least 0.2mm');
      }
      if (config.clearanceRunout > 0.6) {
        warnings.push(
          'Clearance runout over 0.6mm may cause piston instability',
        );
      }
    }

    // Draft angle validation
    if (config.draftAngle !== undefined && config.draftAngle !== 0) {
      if (config.draftAngle < 0.5) {
        warnings.push(
          'Draft angle under 0.5 degrees may not improve demolding',
        );
      }
      if (config.draftAngle > 5) {
        errors.push('Draft angle should not exceed 5 degrees');
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}
