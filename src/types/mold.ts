/**
 * Mold Generator Types
 *
 * Type definitions for the mold generator tool.
 */

// =============================================================================
// Core Types
// =============================================================================

export type MoldType = 'standard' | 'forged-carbon';
export type MoldShape = 'rectangular' | 'circular';
export type SplitAxis = 'x' | 'y' | 'z';

// =============================================================================
// Bounding Box (reuse structure from MeshUploadState)
// =============================================================================

export interface BoundingBox {
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
  keySize: number; // Sphere radius (mm)
  keyFettle: number; // Tolerance on negative keys (mm)
  keyMargin: number; // Distance from edge (mm)

  // Standard mold only - pour hole
  pourHoleDiameter?: number; // Top diameter (mm)
  pourHoleTaper?: number; // Bottom diameter (mm), smaller for funnel effect

  // Forged carbon only - piston clearance
  pistonClearance?: number; // Gap between piston and bucket (mm)

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

  keySize: 3,
  keyFettle: 0.4,
  keyMargin: 7,

  pourHoleDiameter: 10,
  pourHoleTaper: 5,

  pistonClearance: 0.4,

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
}

export function validateMoldConfig(
  config: MoldConfig,
  boundingBox: BoundingBox | null,
): MoldConfigValidation {
  const errors: string[] = [];

  if (!boundingBox) {
    errors.push('No STL file selected');
  }

  if (config.wallThickness < 1) {
    errors.push('Wall thickness must be at least 1mm');
  }

  if (config.wallThickness > 20) {
    errors.push('Wall thickness should not exceed 20mm');
  }

  if (config.keySize < 1) {
    errors.push('Key size must be at least 1mm');
  }

  if (config.keyFettle < 0.1) {
    errors.push('Key tolerance must be at least 0.1mm');
  }

  if (config.keyFettle > config.keySize) {
    errors.push('Key tolerance should be smaller than key size');
  }

  if (config.type === 'standard') {
    if (!config.pourHoleDiameter || config.pourHoleDiameter < 3) {
      errors.push('Pour hole diameter must be at least 3mm');
    }
  }

  if (config.type === 'forged-carbon') {
    if (!config.pistonClearance || config.pistonClearance < 0.1) {
      errors.push('Piston clearance must be at least 0.1mm');
    }
    if (config.pistonClearance && config.pistonClearance > 2) {
      errors.push('Piston clearance should not exceed 2mm');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
