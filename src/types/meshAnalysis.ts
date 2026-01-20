/**
 * Mesh Analysis Types
 *
 * Type definitions for server-side mesh analysis using Trimesh, Shapely, and FreeCAD.
 * These types represent the results from the /analyze-mesh endpoint.
 */

// =============================================================================
// Orientation Analysis
// =============================================================================

/**
 * Analysis score for a single axis orientation.
 * Higher scores indicate better moldability for that orientation.
 */
export interface OrientationScore {
  /** The axis being analyzed */
  axis: 'x' | 'y' | 'z';

  /** Projected area when viewed from this axis (mm^2) */
  projectedArea: number;

  /** Percentage of vertices that would create undercuts (0-100) */
  undercutPercentage: number;

  /** Height of the part when oriented along this axis (mm) */
  height: number;

  /** Overall moldability score (higher is better) */
  score: number;

  /** Human-readable summary */
  summary?: string;
}

// =============================================================================
// Undercut Analysis
// =============================================================================

/**
 * Detailed undercut analysis for a specific demold direction.
 */
export interface UndercutResult {
  /** Total number of undercut vertices */
  undercutVertexCount: number;

  /** Percentage of total vertices that are undercuts */
  undercutPercentage: number;

  /** Maximum undercut depth in mm */
  maxUndercutDepth: number;

  /** Indices of undercut vertices (for visualization) */
  undercutVertexIndices?: number[];

  /** Severity level */
  severity: 'none' | 'minor' | 'moderate' | 'severe';

  /** Human-readable description */
  description: string;
}

// =============================================================================
// Draft Angle Analysis
// =============================================================================

/**
 * Face with insufficient draft angle.
 */
export interface ProblemFace {
  /** Face index in the mesh */
  index: number;

  /** Current draft angle in degrees */
  draft: number;

  /** Face normal vector */
  normal?: [number, number, number];
}

/**
 * Draft angle analysis for the mesh.
 */
export interface DraftAnalysis {
  /** Minimum draft angle found on any face (degrees) */
  minDraft: number;

  /** Maximum draft angle found on any face (degrees) */
  maxDraft: number;

  /** Average draft angle across all faces (degrees) */
  avgDraft: number;

  /** Number of faces with insufficient draft (<1 degree) */
  problemFaceCount: number;

  /** Details of problem faces (limited to first 100) */
  problemFaces: ProblemFace[];

  /** Recommended draft angle correction (degrees) */
  recommendedDraft: number;
}

// =============================================================================
// Alpha Shape (2D Profile)
// =============================================================================

/**
 * Alpha shape result - the concave hull of the mesh projection.
 * Used for generating proper shear edge profiles.
 */
export interface AlphaShapeResult {
  /** Ordered 2D points forming the alpha shape polygon [[x, y], ...] */
  points: [number, number][];

  /** Area of the alpha shape (mm^2) */
  area: number;

  /** Perimeter of the alpha shape (mm) */
  perimeter?: number;

  /** Alpha value used for computation */
  alphaValue: number;
}

// =============================================================================
// Mesh Repair Status
// =============================================================================

export type RepairType = 'none' | 'minor' | 'major' | 'voxelize';

/**
 * Mesh repair information.
 */
export interface RepairInfo {
  /** Whether repair was needed */
  wasRepaired: boolean;

  /** Type of repair performed */
  repairType: RepairType;

  /** Number of holes filled */
  holesFilled: number;

  /** Number of normals fixed */
  normalsFixed: number;

  /** Number of degenerate faces removed */
  degenerateFacesRemoved: number;

  /** Base64-encoded repaired STL (if repair was needed) */
  repairedStl?: string;
}

// =============================================================================
// Main Analysis Result
// =============================================================================

/**
 * Complete mesh analysis result from the server.
 */
export interface MeshAnalysisResult {
  /** Whether the mesh is manifold (watertight) */
  isManifold: boolean;

  /** Number of non-manifold edges (0 if manifold) */
  nonManifoldEdgeCount: number;

  /** Mesh volume in mm^3 (null if not watertight) */
  volume: number | null;

  /** Surface area in mm^2 */
  surfaceArea: number;

  /** Number of triangles in the mesh */
  triangleCount: number;

  /** Number of vertices in the mesh */
  vertexCount: number;

  /** Bounding box dimensions [x, y, z] in mm */
  boundingBox: [number, number, number];

  /** Orientation scores for each axis, sorted by score descending */
  orientationScores: OrientationScore[];

  /** Recommended orientation based on analysis */
  recommendedOrientation: 'x' | 'y' | 'z';

  /** Undercut analysis per axis */
  undercutAnalysis: Record<'x' | 'y' | 'z', UndercutResult>;

  /** Alpha shape for shear edge generation (using recommended orientation) */
  alphaShape: AlphaShapeResult | null;

  /** Draft angle analysis */
  draftAnalysis: DraftAnalysis;

  /** Repair information */
  repairInfo: RepairInfo;

  /** Whether the mesh is suitable for mold generation */
  isMoldable: boolean;

  /** Warnings about potential issues */
  warnings: string[];

  /** Critical errors that prevent mold generation */
  errors: string[];

  /** Analysis duration in milliseconds */
  analysisTimeMs: number;
}

// =============================================================================
// Analysis Options (Request)
// =============================================================================

/**
 * Options for mesh analysis request.
 */
export interface AnalysisOptions {
  /** Attempt to repair non-manifold meshes (default: true) */
  repair?: boolean;

  /** Demold axis for undercut detection (default: 'z') */
  demoldAxis?: 'x' | 'y' | 'z';

  /** Axis for alpha shape projection (default: matches demoldAxis) */
  projectionAxis?: 'x' | 'y' | 'z';

  /** Alpha value for concave hull computation (default: 0.1, lower = tighter fit) */
  alphaValue?: number;

  /** Minimum draft angle threshold in degrees (default: 1.0) */
  minDraftThreshold?: number;

  /** Whether to include vertex indices for visualization (default: false, can be large) */
  includeVertexIndices?: boolean;
}

// =============================================================================
// Mold Generation Config (for server)
// =============================================================================

/**
 * Configuration for FreeCAD-based mold generation.
 */
export interface MoldGenerationConfig {
  /** Mold type */
  moldType: 'standard' | 'forged-carbon';

  /** Mold shape */
  moldShape: 'rectangular' | 'circular';

  /** Orientation for part placement in mold */
  orientation: 'x' | 'y' | 'z';

  /** Shear edge gap for forged carbon (mm) - tight tolerance for seal */
  shearEdgeGap: number;

  /** Shear edge depth (mm) - vertical interface length */
  shearEdgeDepth: number;

  /** Clearance after shear edge region (mm) */
  clearanceRunout: number;

  /** Draft angle to apply to mold cavity (degrees) */
  draftAngle: number;

  /** Wall thickness around mold (mm) */
  wallThickness: number;

  /** Whether to use alpha shape for profile (true) or bounding box (false) */
  useAlphaShapeProfile: boolean;

  /** Pre-computed alpha shape points (from analysis) */
  alphaShapePoints?: [number, number][];

  /** Output format */
  outputFormat: 'stl' | 'step' | 'both';

  /** Piston height for forged carbon (mm) */
  pistonHeight?: number;

  /** Bucket height for forged carbon (mm) */
  bucketHeight?: number;

  /** Handle dimensions for forged carbon */
  handle?: {
    width: number;
    depth: number;
    height: number;
  };

  /** Registration key configuration */
  registrationKeys?: {
    enabled: boolean;
    type: 'sphere' | 'cone';
    size: number;
    tolerance: number;
  };
}

// =============================================================================
// Mold Generation Result
// =============================================================================

/**
 * Result from mold generation endpoint.
 */
export interface MoldGenerationResult {
  /** Success status */
  success: boolean;

  /** Error message if failed */
  error?: string;

  /** Generated STL data (base64 encoded) */
  stlData?: string;

  /** Generated STEP data (base64 encoded) */
  stepData?: string;

  /** Piston STL (for forged carbon) */
  pistonStl?: string;

  /** Bucket STL (for forged carbon) */
  bucketStl?: string;

  /** Piston STEP (for forged carbon) */
  pistonStep?: string;

  /** Bucket STEP (for forged carbon) */
  bucketStep?: string;

  /** Generation time in milliseconds */
  generationTimeMs: number;

  /** Mold statistics */
  stats?: {
    pistonVolume?: number;
    bucketVolume?: number;
    totalVolume?: number;
    shearEdgeArea?: number;
  };
}
