// Types for bi-directional source mapping between 3D viewer and OpenSCAD code

// Primitive types that can be mapped (standard OpenSCAD + BOSL2)
export type OpenSCADPrimitive =
  // Standard OpenSCAD primitives
  | 'cube'
  | 'sphere'
  | 'cylinder'
  | 'polyhedron'
  | 'circle'
  | 'square'
  | 'polygon'
  | 'text'
  | 'linear_extrude'
  | 'rotate_extrude'
  | 'surface'
  // BOSL2 primitives
  | 'cyl'
  | 'cuboid'
  | 'prismoid'
  | 'spheroid'
  | 'tube'
  | 'pie_slice'
  | 'arc'
  | 'rect'
  | 'oval'
  | 'regular_ngon'
  | 'pentagon'
  | 'hexagon'
  | 'octagon'
  | 'teardrop'
  | 'egg'
  | 'wedge'
  | 'onion'
  | 'torus'
  // Boolean operations
  | 'hull'
  | 'minkowski'
  | 'union'
  | 'difference'
  | 'intersection'
  // Special types
  | 'module_call';

// AST node source location
export interface SourceLocation {
  startLine: number;
  endLine: number;
  startColumn: number;
  endColumn: number;
}

// Geometric bounds for heuristic matching
export interface GeometricBounds {
  center: [number, number, number];
  dimensions: [number, number, number];
  transformMatrix?: number[];
}

// Parsed primitive with both source and geometric info
export interface MappedPrimitive {
  id: string;
  type: OpenSCADPrimitive;
  location: SourceLocation;
  bounds: GeometricBounds;
  parentModuleId?: string;
  parameters?: Record<string, number | string | number[]>;
}

// Highlight state shared between viewer and code panel
export interface HighlightState {
  // Active highlight from 3D click
  fromViewer?: {
    faceIndex: number;
    worldPosition: [number, number, number];
    primitiveId?: string;
  };
  // Active highlight from code cursor
  fromCode?: {
    lineNumber: number;
    primitiveId?: string;
  };
  // Resolved mapping
  highlightedPrimitive?: MappedPrimitive;
}

// AST analysis result
export interface ASTAnalysisResult {
  primitives: MappedPrimitive[];
  modules: Map<string, MappedPrimitive[]>;
  errors: string[];
}
