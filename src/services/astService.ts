import {
  CodeFile,
  Lexer,
  Parser,
  ErrorCollector,
  ModuleInstantiationStmt,
  ModuleDeclarationStmt,
  BlockStmt,
  ScadFile,
} from 'openscad-parser';
import type {
  MappedPrimitive,
  ASTAnalysisResult,
  SourceLocation,
  GeometricBounds,
  OpenSCADPrimitive,
} from '@/types/sourceMapping';

// Primitives that create geometry (standard OpenSCAD + BOSL2)
const GEOMETRIC_PRIMITIVES = new Set([
  // Standard OpenSCAD
  'cube',
  'sphere',
  'cylinder',
  'polyhedron',
  'circle',
  'square',
  'polygon',
  'text',
  'linear_extrude',
  'rotate_extrude',
  'surface',
  // BOSL2 primitives
  'cyl',
  'cuboid',
  'prismoid',
  'spheroid',
  'tube',
  'pie_slice',
  'arc',
  'rect',
  'oval',
  'regular_ngon',
  'pentagon',
  'hexagon',
  'octagon',
  'teardrop',
  'egg',
  'wedge',
  'onion',
  'torus',
]);

// Transforms that modify geometry position/orientation (standard + BOSL2)
const TRANSFORMS = new Set([
  // Standard OpenSCAD
  'translate',
  'rotate',
  'scale',
  'mirror',
  'multmatrix',
  'resize',
  // BOSL2 transforms and positioners
  'up',
  'down',
  'left',
  'right',
  'fwd',
  'back',
  'move',
  'xrot',
  'yrot',
  'zrot',
  'xflip',
  'yflip',
  'zflip',
  'xscale',
  'yscale',
  'zscale',
]);

// Boolean operations
const BOOLEAN_OPS = new Set([
  'union',
  'difference',
  'intersection',
  'hull',
  'minkowski',
]);

// Create 4x4 identity matrix
function identityMatrix(): number[] {
  return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
}

// Multiply two 4x4 matrices
function multiplyMatrices(a: number[], b: number[]): number[] {
  const result: number[] = new Array(16).fill(0);
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      for (let k = 0; k < 4; k++) {
        result[row * 4 + col] += a[row * 4 + k] * b[k * 4 + col];
      }
    }
  }
  return result;
}

// Create translation matrix
function translationMatrix(x: number, y: number, z: number): number[] {
  return [1, 0, 0, x, 0, 1, 0, y, 0, 0, 1, z, 0, 0, 0, 1];
}

// Create scale matrix
function scaleMatrix(x: number, y: number, z: number): number[] {
  return [x, 0, 0, 0, 0, y, 0, 0, 0, 0, z, 0, 0, 0, 0, 1];
}

// Create rotation matrix (degrees)
function rotationMatrix(x: number, y: number, z: number): number[] {
  const toRad = Math.PI / 180;
  const cx = Math.cos(x * toRad),
    sx = Math.sin(x * toRad);
  const cy = Math.cos(y * toRad),
    sy = Math.sin(y * toRad);
  const cz = Math.cos(z * toRad),
    sz = Math.sin(z * toRad);

  // Combined rotation: Rz * Ry * Rx
  return [
    cy * cz,
    -cy * sz,
    sy,
    0,
    sx * sy * cz + cx * sz,
    -sx * sy * sz + cx * cz,
    -sx * cy,
    0,
    -cx * sy * cz + sx * sz,
    cx * sy * sz + sx * cz,
    cx * cy,
    0,
    0,
    0,
    0,
    1,
  ];
}

// Transform a point by a matrix
function transformPoint(
  point: [number, number, number],
  matrix: number[],
): [number, number, number] {
  const [x, y, z] = point;
  return [
    matrix[0] * x + matrix[1] * y + matrix[2] * z + matrix[3],
    matrix[4] * x + matrix[5] * y + matrix[6] * z + matrix[7],
    matrix[8] * x + matrix[9] * y + matrix[10] * z + matrix[11],
  ];
}

// Extract numeric value from AST argument
function extractNumber(arg: unknown): number | null {
  if (typeof arg === 'number') return arg;
  // Handle AST node structures
  if (arg && typeof arg === 'object') {
    const node = arg as Record<string, unknown>;
    if ('value' in node && typeof node.value === 'number') {
      return node.value;
    }
    if ('tokens' in node) {
      const tokens = node.tokens as Record<string, unknown>;
      if (tokens.value && typeof tokens.value === 'object') {
        const valueToken = tokens.value as Record<string, unknown>;
        if ('value' in valueToken && typeof valueToken.value === 'number') {
          return valueToken.value;
        }
      }
    }
  }
  return null;
}

// Extract vector [x, y, z] from AST argument
function extractVector(arg: unknown): [number, number, number] | null {
  if (Array.isArray(arg)) {
    if (arg.length >= 3) {
      const x = extractNumber(arg[0]);
      const y = extractNumber(arg[1]);
      const z = extractNumber(arg[2]);
      if (x !== null && y !== null && z !== null) {
        return [x, y, z];
      }
    } else if (arg.length === 2) {
      const x = extractNumber(arg[0]);
      const y = extractNumber(arg[1]);
      if (x !== null && y !== null) {
        return [x, y, 0];
      }
    }
  }
  // Handle VectorExpr or similar AST nodes
  if (arg && typeof arg === 'object') {
    const node = arg as Record<string, unknown>;
    if ('children' in node && Array.isArray(node.children)) {
      return extractVector(node.children);
    }
  }
  return null;
}

// Get argument by name or position from ModuleInstantiationStmt
function getArg(
  stmt: ModuleInstantiationStmt,
  name: string,
  position: number,
): unknown {
  for (const arg of stmt.args) {
    if (arg.name === name) {
      return arg.value;
    }
  }
  if (position < stmt.args.length && !stmt.args[position].name) {
    return stmt.args[position].value;
  }
  return null;
}

// Extract string value from AST (for anchor names)
function extractString(arg: unknown): string | null {
  if (typeof arg === 'string') return arg;
  if (arg && typeof arg === 'object') {
    const node = arg as Record<string, unknown>;
    // Handle identifier references like BOTTOM, TOP, CENTER
    if ('name' in node && typeof node.name === 'string') {
      return node.name;
    }
    if ('value' in node && typeof node.value === 'string') {
      return node.value;
    }
  }
  return null;
}

// Get BOSL2 anchor offset for Z-axis (height adjustment)
function getBosl2AnchorOffset(
  stmt: ModuleInstantiationStmt,
  height: number,
): number {
  const anchor = getArg(stmt, 'anchor', -1);
  const anchorStr = extractString(anchor);

  if (anchorStr) {
    // BOSL2 anchor names
    if (anchorStr === 'BOTTOM' || anchorStr === 'BOT') {
      return height / 2; // Origin at bottom, center is at h/2
    } else if (anchorStr === 'TOP') {
      return -height / 2; // Origin at top, center is at -h/2
    } else if (anchorStr === 'CENTER' || anchorStr === 'CTR') {
      return 0; // Centered
    }
  }

  // Default: BOSL2 primitives are centered by default
  return 0;
}

// Calculate bounds for a primitive based on type and parameters
function calculatePrimitiveBounds(
  stmt: ModuleInstantiationStmt,
  transform: number[],
): GeometricBounds {
  let center: [number, number, number] = [0, 0, 0];
  let dimensions: [number, number, number] = [1, 1, 1];

  const name = stmt.name;

  if (name === 'cube') {
    const size = getArg(stmt, 'size', 0);
    const centered = getArg(stmt, 'center', 1);

    if (typeof size === 'number') {
      dimensions = [size, size, size];
    } else {
      const vec = extractVector(size);
      if (vec) dimensions = vec;
    }

    if (!centered) {
      center = [dimensions[0] / 2, dimensions[1] / 2, dimensions[2] / 2];
    }
  } else if (name === 'sphere') {
    const r = extractNumber(getArg(stmt, 'r', 0));
    const d = extractNumber(getArg(stmt, 'd', 0));
    const radius = r ?? (d ? d / 2 : 1);
    dimensions = [radius * 2, radius * 2, radius * 2];
  } else if (name === 'cylinder') {
    const h = extractNumber(getArg(stmt, 'h', 0)) ?? 1;
    const r = extractNumber(getArg(stmt, 'r', 1));
    const r1 = extractNumber(getArg(stmt, 'r1', 1));
    const r2 = extractNumber(getArg(stmt, 'r2', 2));
    const d = extractNumber(getArg(stmt, 'd', 1));
    const centered = getArg(stmt, 'center', 3);

    let maxRadius = 1;
    if (r !== null) {
      maxRadius = r;
    } else if (d !== null) {
      maxRadius = d / 2;
    } else if (r1 !== null || r2 !== null) {
      maxRadius = Math.max(r1 ?? 0, r2 ?? 0);
    }

    dimensions = [maxRadius * 2, maxRadius * 2, h];
    if (!centered) {
      center = [0, 0, h / 2];
    }
  } else if (name === 'cyl') {
    // BOSL2 cyl: cyl(h, r|d, r1|d1, r2|d2, anchor, ...)
    const h =
      extractNumber(getArg(stmt, 'h', 0)) ??
      extractNumber(getArg(stmt, 'l', 0)) ??
      1;
    const r = extractNumber(getArg(stmt, 'r', 1));
    const d = extractNumber(getArg(stmt, 'd', 1));
    const r1 = extractNumber(getArg(stmt, 'r1', 1));
    const r2 = extractNumber(getArg(stmt, 'r2', 2));
    const d1 = extractNumber(getArg(stmt, 'd1', 1));
    const d2 = extractNumber(getArg(stmt, 'd2', 2));

    let maxRadius = 1;
    if (r !== null) maxRadius = r;
    else if (d !== null) maxRadius = d / 2;
    else if (r1 !== null || r2 !== null) maxRadius = Math.max(r1 ?? 0, r2 ?? 0);
    else if (d1 !== null || d2 !== null)
      maxRadius = Math.max((d1 ?? 0) / 2, (d2 ?? 0) / 2);

    dimensions = [maxRadius * 2, maxRadius * 2, h];
    // Handle BOSL2 anchor parameter
    const anchorOffset = getBosl2AnchorOffset(stmt, h);
    center = [0, 0, anchorOffset];
  } else if (name === 'cuboid') {
    // BOSL2 cuboid: cuboid(size, ...)
    const size = getArg(stmt, 'size', 0);
    if (typeof size === 'number') {
      dimensions = [size, size, size];
    } else {
      const vec = extractVector(size);
      if (vec) dimensions = vec;
    }
    // BOSL2 default anchor is CENTER
    center = [0, 0, 0];
  } else if (name === 'prismoid') {
    // BOSL2 prismoid: prismoid(size1, size2, h, ...)
    const size1 = extractVector(getArg(stmt, 'size1', 0));
    const size2 = extractVector(getArg(stmt, 'size2', 1));
    const h = extractNumber(getArg(stmt, 'h', 2)) ?? 1;

    const maxX = Math.max(size1?.[0] ?? 1, size2?.[0] ?? 1);
    const maxY = Math.max(size1?.[1] ?? 1, size2?.[1] ?? 1);
    dimensions = [maxX, maxY, h];
    center = [0, 0, 0];
  } else if (name === 'tube') {
    // BOSL2 tube: tube(h, or|od, ir|id, ...)
    const h = extractNumber(getArg(stmt, 'h', 0)) ?? 1;
    const od =
      extractNumber(getArg(stmt, 'od', 1)) ??
      extractNumber(getArg(stmt, 'or', 1));
    const maxRadius = od ? od / 2 : 1;
    dimensions = [maxRadius * 2, maxRadius * 2, h];
    center = [0, 0, 0];
  }

  // Apply transform to center
  const transformedCenter = transformPoint(center, transform);

  // For dimensions, we need to extract scale from transform
  // Simplified: just use the dimensions as-is for now
  // A full implementation would apply rotation to get axis-aligned bounding box

  return {
    center: transformedCenter,
    dimensions,
    transformMatrix: transform,
  };
}

// Calculate transform matrix from a transform statement
function calculateTransformMatrix(stmt: ModuleInstantiationStmt): number[] {
  const name = stmt.name;

  // Standard OpenSCAD transforms
  if (name === 'translate') {
    const v = extractVector(getArg(stmt, 'v', 0));
    if (v) return translationMatrix(v[0], v[1], v[2]);
  } else if (name === 'scale') {
    const v = getArg(stmt, 'v', 0);
    if (typeof v === 'number') {
      return scaleMatrix(v, v, v);
    }
    const vec = extractVector(v);
    if (vec) return scaleMatrix(vec[0], vec[1], vec[2]);
  } else if (name === 'rotate') {
    const a = getArg(stmt, 'a', 0);
    const v = getArg(stmt, 'v', 1);

    if (typeof a === 'number' && v) {
      // Rotation around arbitrary axis - simplified
      const vec = extractVector(v);
      if (vec) {
        // For now, just handle Z rotation for arbitrary axis
        return rotationMatrix(0, 0, a);
      }
    } else {
      // Euler angles
      const angles = extractVector(a);
      if (angles) return rotationMatrix(angles[0], angles[1], angles[2]);
      const angle = extractNumber(a);
      if (angle !== null) return rotationMatrix(0, 0, angle);
    }
  }
  // BOSL2 position transforms
  else if (name === 'up') {
    const z = extractNumber(getArg(stmt, 'z', 0));
    if (z !== null) return translationMatrix(0, 0, z);
  } else if (name === 'down') {
    const z = extractNumber(getArg(stmt, 'z', 0));
    if (z !== null) return translationMatrix(0, 0, -z);
  } else if (name === 'left') {
    const x = extractNumber(getArg(stmt, 'x', 0));
    if (x !== null) return translationMatrix(-x, 0, 0);
  } else if (name === 'right') {
    const x = extractNumber(getArg(stmt, 'x', 0));
    if (x !== null) return translationMatrix(x, 0, 0);
  } else if (name === 'fwd') {
    const y = extractNumber(getArg(stmt, 'y', 0));
    if (y !== null) return translationMatrix(0, -y, 0);
  } else if (name === 'back') {
    const y = extractNumber(getArg(stmt, 'y', 0));
    if (y !== null) return translationMatrix(0, y, 0);
  } else if (name === 'move') {
    const v = extractVector(getArg(stmt, 'v', 0));
    if (v) return translationMatrix(v[0], v[1], v[2]);
  }
  // BOSL2 rotation transforms
  else if (name === 'xrot') {
    const a = extractNumber(getArg(stmt, 'a', 0));
    if (a !== null) return rotationMatrix(a, 0, 0);
  } else if (name === 'yrot') {
    const a = extractNumber(getArg(stmt, 'a', 0));
    if (a !== null) return rotationMatrix(0, a, 0);
  } else if (name === 'zrot') {
    const a = extractNumber(getArg(stmt, 'a', 0));
    if (a !== null) return rotationMatrix(0, 0, a);
  }
  // BOSL2 scale transforms
  else if (name === 'xscale') {
    const v = extractNumber(getArg(stmt, 'x', 0));
    if (v !== null) return scaleMatrix(v, 1, 1);
  } else if (name === 'yscale') {
    const v = extractNumber(getArg(stmt, 'y', 0));
    if (v !== null) return scaleMatrix(1, v, 1);
  } else if (name === 'zscale') {
    const v = extractNumber(getArg(stmt, 'z', 0));
    if (v !== null) return scaleMatrix(1, 1, v);
  }

  return identityMatrix();
}

// Recursively visit AST and extract primitives
function visitStatement(
  stmt: unknown,
  transformStack: number[][],
  moduleContext: string | undefined,
  primitives: MappedPrimitive[],
  modules: Map<string, MappedPrimitive[]>,
): void {
  if (!stmt || typeof stmt !== 'object') return;

  // Check if it's a ModuleInstantiationStmt
  if (stmt instanceof ModuleInstantiationStmt) {
    const name = stmt.name;
    const currentTransform = transformStack.reduce(
      (acc, t) => multiplyMatrices(acc, t),
      identityMatrix(),
    );

    if (GEOMETRIC_PRIMITIVES.has(name)) {
      // This is a geometric primitive
      const span = stmt.span;
      const location: SourceLocation = {
        startLine: span.start.line + 1, // Convert from 0-indexed
        endLine: span.end.line + 1,
        startColumn: span.start.col,
        endColumn: span.end.col,
      };

      const bounds = calculatePrimitiveBounds(stmt, currentTransform);

      const primitive: MappedPrimitive = {
        id: `${name}-${location.startLine}-${location.startColumn}`,
        type: name as OpenSCADPrimitive,
        location,
        bounds,
        parentModuleId: moduleContext,
      };

      primitives.push(primitive);

      if (moduleContext) {
        const modulePrims = modules.get(moduleContext) || [];
        modulePrims.push(primitive);
        modules.set(moduleContext, modulePrims);
      }
    } else if (TRANSFORMS.has(name)) {
      // This is a transform - push to stack and visit child
      const transformMatrix = calculateTransformMatrix(stmt);
      transformStack.push(transformMatrix);

      if (stmt.child) {
        visitStatement(
          stmt.child,
          transformStack,
          moduleContext,
          primitives,
          modules,
        );
      }

      transformStack.pop();
      return; // Don't process child again
    } else if (BOOLEAN_OPS.has(name)) {
      // Boolean operation - record as a primitive for potential matching
      const span = stmt.span;
      const location: SourceLocation = {
        startLine: span.start.line + 1,
        endLine: span.end.line + 1,
        startColumn: span.start.col,
        endColumn: span.end.col,
      };

      const primitive: MappedPrimitive = {
        id: `${name}-${location.startLine}-${location.startColumn}`,
        type: name as OpenSCADPrimitive,
        location,
        bounds: {
          center: [0, 0, 0],
          dimensions: [0, 0, 0],
          transformMatrix: currentTransform,
        },
        parentModuleId: moduleContext,
      };

      primitives.push(primitive);

      // Visit child to find nested primitives
      if (stmt.child) {
        visitStatement(
          stmt.child,
          transformStack,
          moduleContext,
          primitives,
          modules,
        );
      }
      return;
    } else {
      // User-defined module call (e.g., small_cone_outer(), transition(), etc.)
      // Track these as module_call primitives for click-to-code mapping
      const span = stmt.span;
      const location: SourceLocation = {
        startLine: span.start.line + 1,
        endLine: span.end.line + 1,
        startColumn: span.start.col,
        endColumn: span.end.col,
      };

      const primitive: MappedPrimitive = {
        id: `module_call-${name}-${location.startLine}-${location.startColumn}`,
        type: 'module_call' as OpenSCADPrimitive,
        location,
        bounds: {
          center: [0, 0, 0],
          dimensions: [0, 0, 0],
          transformMatrix: currentTransform,
        },
        parentModuleId: moduleContext,
        parameters: { moduleName: name },
      };

      primitives.push(primitive);
    }

    // Visit child statement if present
    if (stmt.child) {
      visitStatement(
        stmt.child,
        transformStack,
        moduleContext,
        primitives,
        modules,
      );
    }
  } else if (stmt instanceof BlockStmt) {
    // Block statement - visit all children
    for (const child of stmt.children) {
      visitStatement(
        child,
        [...transformStack],
        moduleContext,
        primitives,
        modules,
      );
    }
  } else if (stmt instanceof ModuleDeclarationStmt) {
    // Module declaration - track context
    visitStatement(
      stmt.stmt,
      [...transformStack],
      stmt.name,
      primitives,
      modules,
    );
  } else if ('child' in stmt && stmt.child) {
    // Generic statement with child
    visitStatement(
      stmt.child,
      transformStack,
      moduleContext,
      primitives,
      modules,
    );
  } else if (
    'children' in stmt &&
    Array.isArray((stmt as { children: unknown[] }).children)
  ) {
    // Generic statement with children
    for (const child of (stmt as { children: unknown[] }).children) {
      visitStatement(
        child,
        [...transformStack],
        moduleContext,
        primitives,
        modules,
      );
    }
  }
}

// Main function to analyze OpenSCAD code
export function analyzeOpenSCADCode(code: string): ASTAnalysisResult {
  const primitives: MappedPrimitive[] = [];
  const modules = new Map<string, MappedPrimitive[]>();
  const errors: string[] = [];

  try {
    const codeFile = new CodeFile('<input>', code);
    const errorCollector = new ErrorCollector();
    const lexer = new Lexer(codeFile, errorCollector);
    const tokens = lexer.scan();
    const parser = new Parser(codeFile, tokens, errorCollector);
    const ast: ScadFile = parser.parse();

    // Visit all statements in the file
    for (const stmt of ast.statements) {
      visitStatement(stmt, [identityMatrix()], undefined, primitives, modules);
    }

    // Collect any parsing errors
    for (const error of errorCollector.errors) {
      errors.push(error.message);
    }
  } catch (e) {
    errors.push(e instanceof Error ? e.message : String(e));
  }

  return { primitives, modules, errors };
}

// Calculate Euclidean distance between two points
function distance(
  a: [number, number, number],
  b: [number, number, number],
): number {
  return Math.sqrt(
    Math.pow(a[0] - b[0], 2) +
      Math.pow(a[1] - b[1], 2) +
      Math.pow(a[2] - b[2], 2),
  );
}

// Check if a point is inside bounds
function isPointInBounds(
  point: [number, number, number],
  bounds: GeometricBounds,
): boolean {
  const halfDims = bounds.dimensions.map((d) => d / 2);
  return (
    Math.abs(point[0] - bounds.center[0]) <= halfDims[0] &&
    Math.abs(point[1] - bounds.center[1]) <= halfDims[1] &&
    Math.abs(point[2] - bounds.center[2]) <= halfDims[2]
  );
}

// Score normal alignment with cube faces (axis-aligned)
function getCubeNormalScore(normal: [number, number, number]): number {
  const absNormal = normal.map(Math.abs);
  const maxComponent = Math.max(...absNormal);
  return maxComponent; // Close to 1.0 for axis-aligned normals
}

// Score normal alignment for cylinder
function getCylinderNormalScore(
  normal: [number, number, number],
  _primitive: MappedPrimitive,
): number {
  // Check for end caps (normal points along Z)
  if (Math.abs(normal[2]) > 0.9) return 1.0;

  // Check for radial surface (normal perpendicular to Z)
  const radialMagnitude = Math.sqrt(
    normal[0] * normal[0] + normal[1] * normal[1],
  );
  return radialMagnitude;
}

// Score normal alignment for sphere
function getSphereNormalScore(
  normal: [number, number, number],
  clickPosition: [number, number, number],
  primitive: MappedPrimitive,
): number {
  // Normal should point radially from center
  const toCenter: [number, number, number] = [
    clickPosition[0] - primitive.bounds.center[0],
    clickPosition[1] - primitive.bounds.center[1],
    clickPosition[2] - primitive.bounds.center[2],
  ];
  const mag = Math.sqrt(toCenter[0] ** 2 + toCenter[1] ** 2 + toCenter[2] ** 2);
  if (mag < 0.001) return 0;

  const normalized: [number, number, number] = [
    toCenter[0] / mag,
    toCenter[1] / mag,
    toCenter[2] / mag,
  ];

  // Dot product with normal
  const dot =
    normal[0] * normalized[0] +
    normal[1] * normalized[1] +
    normal[2] * normalized[2];
  return Math.abs(dot);
}

// Weight constants for scoring
const WEIGHT_DISTANCE = 0.3;
const WEIGHT_CONTAINMENT = 0.3;
const WEIGHT_NORMAL = 0.25;
const WEIGHT_PROXIMITY = 0.15;
const MATCH_THRESHOLD = 0.3;

// Calculate match score for a primitive
function calculateMatchScore(
  clickPosition: [number, number, number],
  clickNormal: [number, number, number],
  primitive: MappedPrimitive,
): number {
  let score = 0;

  // Skip boolean operations for distance scoring
  if (BOOLEAN_OPS.has(primitive.type)) {
    // Boolean ops get a base score if the click is near any of their children
    return 0.1;
  }

  // 1. Distance score - inverse distance from click to primitive center
  const dist = distance(clickPosition, primitive.bounds.center);
  const maxDim = Math.max(...primitive.bounds.dimensions);
  const normalizedDist = maxDim > 0 ? dist / maxDim : dist;
  const distanceScore = 1 / (1 + normalizedDist);
  score += distanceScore * WEIGHT_DISTANCE;

  // 2. Containment score - is click point inside primitive bounds?
  if (isPointInBounds(clickPosition, primitive.bounds)) {
    score += WEIGHT_CONTAINMENT;
  }

  // 3. Normal matching based on primitive type
  let normalScore = 0;
  if (
    primitive.type === 'cube' ||
    primitive.type === 'cuboid' ||
    primitive.type === 'prismoid'
  ) {
    normalScore = getCubeNormalScore(clickNormal);
  } else if (
    primitive.type === 'cylinder' ||
    primitive.type === 'cyl' ||
    primitive.type === 'tube'
  ) {
    normalScore = getCylinderNormalScore(clickNormal, primitive);
  } else if (primitive.type === 'sphere' || primitive.type === 'spheroid') {
    normalScore = getSphereNormalScore(clickNormal, clickPosition, primitive);
  } else {
    // Default normal score for other primitives
    normalScore = 0.5;
  }
  score += normalScore * WEIGHT_NORMAL;

  // 4. Proximity to center ratio
  const proximityScore = distanceScore;
  score += proximityScore * WEIGHT_PROXIMITY;

  return score;
}

// Find the best matching primitive for a click
export function findBestMatchingPrimitive(
  worldPosition: [number, number, number],
  normal: [number, number, number],
  _faceVertices: [number, number, number][],
  primitives: MappedPrimitive[],
): MappedPrimitive | null {
  if (primitives.length === 0) return null;

  // Separate primitives by category
  const geometricPrimitives = primitives.filter(
    (p) => !BOOLEAN_OPS.has(p.type) && p.type !== 'module_call',
  );
  const moduleCalls = primitives.filter((p) => p.type === 'module_call');
  const booleanOps = primitives.filter((p) => BOOLEAN_OPS.has(p.type));

  // Score geometric primitives
  const scored = geometricPrimitives.map((primitive) => ({
    primitive,
    score: calculateMatchScore(worldPosition, normal, primitive),
  }));

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);

  // Find best geometric match
  const bestGeometric = scored[0];

  if (bestGeometric && bestGeometric.score > MATCH_THRESHOLD) {
    // Check if this primitive is inside a module definition
    if (bestGeometric.primitive.parentModuleId) {
      // Find the module call that references this module
      const moduleCall = moduleCalls.find(
        (mc) =>
          mc.parameters?.moduleName === bestGeometric.primitive.parentModuleId,
      );
      if (moduleCall) {
        // Return the module call instead - this maps clicks to the call site
        return moduleCall;
      }
    }
    return bestGeometric.primitive;
  }

  // Fallback: try module calls with Z-position heuristic
  if (moduleCalls.length > 0) {
    // Sort module calls by their line number (order in code often matches Z order)
    const sortedCalls = [...moduleCalls].sort(
      (a, b) => a.location.startLine - b.location.startLine,
    );

    // For stacked models, use click Z position to estimate which section was clicked
    const clickZ = worldPosition[2];

    // Get the bounding box of all geometric primitives to normalize Z
    let minZ = Infinity,
      maxZ = -Infinity;
    for (const p of geometricPrimitives) {
      const pMinZ = p.bounds.center[2] - p.bounds.dimensions[2] / 2;
      const pMaxZ = p.bounds.center[2] + p.bounds.dimensions[2] / 2;
      if (pMinZ < minZ) minZ = pMinZ;
      if (pMaxZ > maxZ) maxZ = pMaxZ;
    }

    // If we have valid Z bounds, use proportional matching
    if (minZ < maxZ && sortedCalls.length > 1) {
      const zRange = maxZ - minZ;
      const normalizedZ = (clickZ - minZ) / zRange; // 0 to 1
      const sectionIndex = Math.min(
        Math.floor(normalizedZ * sortedCalls.length),
        sortedCalls.length - 1,
      );
      return sortedCalls[Math.max(0, sectionIndex)];
    }

    // Fallback to first module call
    return sortedCalls[0];
  }

  // Fallback: try boolean operations
  if (booleanOps.length > 0) {
    return booleanOps[0];
  }

  return null;
}

// Find primitive containing a specific line number
export function findPrimitiveByLine(
  lineNumber: number,
  primitives: MappedPrimitive[],
): MappedPrimitive | null {
  // Find primitive that contains this line
  const containing = primitives.filter(
    (p) =>
      lineNumber >= p.location.startLine && lineNumber <= p.location.endLine,
  );

  if (containing.length === 0) return null;

  // Return the most specific (smallest range) primitive
  containing.sort(
    (a, b) =>
      a.location.endLine -
      a.location.startLine -
      (b.location.endLine - b.location.startLine),
  );

  return containing[0];
}
