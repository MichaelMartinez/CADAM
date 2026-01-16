/**
 * Prompt Library
 *
 * Version-controlled prompts for the multi-modal agentic workflow system.
 * Each prompt template is versioned and can be overridden via workflow config.
 */

// =============================================================================
// Prompt Template Types
// =============================================================================

export type PromptTemplateName =
  | 'vlm_openscad_grounding'
  | 'vlm_image_classification'
  | 'vlm_dimension_extraction'
  | 'scad_from_description'
  | 'verification_comparison'
  | 'verification_detailed'
  | 'error_analysis'
  | 'refinement_guidance';

interface PromptVersion {
  content: string;
  description: string;
  created: string;
}

type PromptTemplates = {
  [K in PromptTemplateName]: Record<string, PromptVersion>;
};

// =============================================================================
// VLM Grounding Prompts
// =============================================================================

const VLM_OPENSCAD_GROUNDING: Record<string, PromptVersion> = {
  'v1.0': {
    description: 'Initial VLM grounding prompt for OpenSCAD vocabulary',
    created: '2026-01-15',
    content: `You are an expert at analyzing images for 3D CAD modeling with OpenSCAD.

# Your Task
Analyze this image and describe the object using precise, parametric terms suitable for OpenSCAD code generation.

# Analysis Framework

## 1. Image Type Classification
First, identify what type of image this is:
- **Technical drawing**: Has dimension lines, multiple orthographic views, precise geometry
- **Hand sketch**: Rough lines, possibly annotated with notes
- **Photo**: Real object with lighting, shadows, perspective distortion
- **CAD screenshot**: Already 3D rendered, showing a digital model

## 2. Geometric Decomposition
Break down the object into OpenSCAD primitives:
- **Primary shapes**: cuboid, cylinder (cyl), sphere, prismoid
- **Boolean operations**: union, difference, intersection
- **Transformations**: translate, rotate, scale, mirror
- **Patterns**: linear arrays (xcopies, ycopies), grids (grid_copies), radial (zrot_copies)

## 3. Dimension Extraction
Extract or estimate dimensions in millimeters:
- Overall bounding box (length × width × height)
- Feature dimensions (hole diameters, slot widths, fillet radii)
- Wall thicknesses
- Spacing and offsets between features

## 4. Feature Catalog
Identify and describe:
- Mounting holes (diameter, depth, spacing pattern)
- Fillets and chamfers (radii)
- Threads (if visible)
- Text or labels
- Symmetry axes

# Output Format
Return a structured JSON object:
{
  "image_type": "technical_drawing" | "sketch" | "photo" | "cad_screenshot",
  "description": "Natural language description of the object",
  "geometry": {
    "primary_shapes": ["cuboid(50, 30, 20)", "cyl(h=40, d=15)"],
    "operations": ["difference", "union"],
    "features": ["4x M5 mounting holes", "R3 fillet on top edges"]
  },
  "dimensions": {
    "overall": {"length": 50, "width": 30, "height": 20},
    "features": {"hole_diameter": 5, "fillet_radius": 3, "wall_thickness": 2}
  },
  "confidence": "high" | "medium" | "low",
  "ambiguities": ["Cannot determine if hole is through or blind"],
  "openscad_vocabulary": ["cuboid", "cyl", "difference", "attach", "rounding"]
}

# Important Guidelines
- Be specific and quantitative - estimate dimensions even if not explicitly shown
- Use BOSL2 library terminology (cuboid, cyl, prismoid, attach, anchor)
- Note any ambiguities that might affect the model
- If the image shows multiple views, cross-reference dimensions between them
- For technical drawings, extract dimensions directly from dimension lines`,
  },

  'v1.1': {
    description: 'Enhanced VLM grounding with better dimension handling',
    created: '2026-01-15',
    content: `You are an expert CAD engineer analyzing images to generate OpenSCAD models.

# CRITICAL RULES
1. Always use millimeters (mm) for all dimensions
2. Rounding/chamfer values must be < (smallest_dimension / 2)
3. Use BOSL2 library primitives, not basic OpenSCAD
4. Every feature should map to a named module

# Analysis Steps

## Step 1: Classify the Image
Determine the image type and adjust your analysis accordingly:
- **Technical drawing**: Extract exact dimensions from dimension lines
- **Sketch**: Estimate proportions, assume common engineering dimensions
- **Photo**: Use reference objects for scale, account for perspective
- **CAD render**: Reverse-engineer the primitives used

## Step 2: Identify Primary Geometry
List the main shapes that compose the object:
- For each shape, specify: type, dimensions, position, orientation
- Note which shapes are additive (union) vs subtractive (difference)

## Step 3: Extract All Dimensions
For technical drawings:
- Read every dimension line carefully
- Cross-reference between views (front, side, top)
- Note tolerances if shown

For photos/sketches:
- Estimate based on object type (hand-held ~100mm, desktop ~200mm)
- Use visible reference objects for scale
- Mark estimated dimensions with ~ prefix

## Step 4: Catalog Features
For each feature type, record:
- Holes: diameter, depth (through or blind), pattern (linear, grid, radial)
- Fillets: radius, which edges (use BOSL2 edge specifiers)
- Chamfers: size, which edges
- Patterns: count, spacing, direction

# Output JSON Schema
{
  "image_type": "technical_drawing" | "sketch" | "photo" | "cad_screenshot" | "unknown",
  "description": "2-3 sentence description focusing on function and form",
  "geometry": {
    "primary_shapes": [
      {"type": "cuboid", "dims": [50, 30, 20], "position": "base", "notes": "main body"},
      {"type": "cyl", "dims": {"h": 40, "d": 15}, "position": "center-top", "notes": "mounting boss"}
    ],
    "operations": ["difference for holes", "union for boss"],
    "features": [
      {"type": "hole", "diameter": 5, "depth": "through", "count": 4, "pattern": "corners"},
      {"type": "fillet", "radius": 3, "edges": "TOP", "notes": "ergonomic"}
    ]
  },
  "dimensions": {
    "overall": {"length": 50, "width": 30, "height": 20, "estimated": false},
    "features": {
      "hole_diameter": 5,
      "hole_spacing": 40,
      "fillet_radius": 3,
      "wall_thickness": 2
    }
  },
  "confidence": "high" | "medium" | "low",
  "ambiguities": ["List any unclear aspects"],
  "openscad_vocabulary": ["List BOSL2 functions needed"],
  "manufacturing_notes": ["3D printable", "needs support for overhangs"]
}`,
  },
};

const VLM_IMAGE_CLASSIFICATION: Record<string, PromptVersion> = {
  'v1.0': {
    description: 'Quick image type classification',
    created: '2026-01-15',
    content: `Classify this image into one of these categories:

1. **technical_drawing**: Engineering drawing with dimension lines, multiple views, precise geometry
2. **sketch**: Hand-drawn or digital sketch, rough lines, conceptual
3. **photo**: Photograph of a real physical object
4. **cad_screenshot**: Screenshot from CAD software showing a 3D model
5. **unknown**: Cannot determine image type

Also assess:
- **quality**: excellent | good | fair | poor
- **suitability**: How suitable is this for 3D modeling? (high | medium | low)
- **preprocessing_needed**: What preprocessing would help? (none | enhance | crop | multiple)

Return JSON:
{
  "type": "technical_drawing" | "sketch" | "photo" | "cad_screenshot" | "unknown",
  "quality": "excellent" | "good" | "fair" | "poor",
  "suitability": "high" | "medium" | "low",
  "preprocessing_needed": ["none"] | ["enhance", "crop"],
  "notes": "Brief explanation"
}`,
  },
};

const VLM_DIMENSION_EXTRACTION: Record<string, PromptVersion> = {
  'v1.0': {
    description: 'Focused dimension extraction from technical drawings',
    created: '2026-01-15',
    content: `Extract all dimensions from this technical drawing.

# Instructions
1. Find every dimension line with a measurement
2. Identify which view the dimension is from (front, side, top, isometric)
3. Record the dimension value and what it measures
4. Note the units (assume mm if not specified)

# Output Format
Return a JSON array of all dimensions found:
{
  "dimensions": [
    {"value": 50, "unit": "mm", "description": "overall length", "view": "side", "confidence": "high"},
    {"value": 30, "unit": "mm", "description": "body width", "view": "front", "confidence": "high"},
    {"value": 5, "unit": "mm", "description": "hole diameter", "view": "front", "confidence": "medium"}
  ],
  "derived": [
    {"name": "aspect_ratio", "value": 1.67, "formula": "length/width"},
    {"name": "volume_estimate", "value": 30000, "unit": "mm³"}
  ],
  "missing": ["depth not shown", "fillet radii not specified"],
  "conflicts": ["front view shows 30mm width, top view shows 32mm"]
}`,
  },
};

// =============================================================================
// Code Generation Prompts
// =============================================================================

const SCAD_FROM_DESCRIPTION: Record<string, PromptVersion> = {
  'v1.0': {
    description: 'Generate OpenSCAD code from VLM description',
    created: '2026-01-15',
    content: `Generate OpenSCAD code based on this analysis:

{VLM_DESCRIPTION}

# Requirements

## BOSL2 Library
Always use BOSL2. Start every file with:
\`\`\`openscad
include <BOSL2/std.scad>
\`\`\`

## Code Structure
1. Parameters at the top (all dimensions as variables)
2. Named module for each geometric feature
3. Assembly at the bottom using boolean operations
4. Comments linking modules to the original image analysis

## BOSL2 Patterns
- Use \`cuboid([x,y,z], rounding=r, anchor=BOTTOM)\` instead of \`cube()\`
- Use \`cyl(h=h, d=d, anchor=BOTTOM)\` instead of \`cylinder()\`
- Use \`attach()\` for parent-child positioning
- Use edge specifiers: TOP, BOTTOM, "Z" for vertical edges

## Critical Constraints
- Rounding MUST be < (smallest_dimension / 2)
- For thin features (< 5mm), omit rounding entirely
- Validate: \`min(x, y, z) / 2 > rounding_value\`

## Output
Return ONLY valid OpenSCAD code. No markdown, no explanations.
The code should start with \`include <BOSL2/std.scad>\``,
  },
};

// =============================================================================
// Verification Prompts
// =============================================================================

const VERIFICATION_COMPARISON: Record<string, PromptVersion> = {
  'v1.0': {
    description: 'Quick verification comparison',
    created: '2026-01-15',
    content: `Compare the rendered 3D model (second image) with the original reference (first image).

# Comparison Criteria
1. **Overall Shape**: Do the basic forms match?
2. **Proportions**: Are length/width/height ratios similar?
3. **Features**: Are holes, slots, and details in the right places?
4. **Missing Elements**: Is anything from the original missing?
5. **Extra Elements**: Is there anything that shouldn't be there?

# Output Format
{
  "match_quality": "excellent" | "good" | "fair" | "poor",
  "similarity_score": 0-100,
  "discrepancies": [
    "Description of each difference found"
  ],
  "recommendation": "proceed" | "minor_adjustment" | "major_revision",
  "suggested_fixes": [
    "Specific fix suggestion"
  ]
}`,
  },
};

const VERIFICATION_DETAILED: Record<string, PromptVersion> = {
  'v1.0': {
    description: 'Detailed verification with specific measurements',
    created: '2026-01-15',
    content: `Perform a detailed comparison between the original image and the rendered model.

# Original Analysis
{ORIGINAL_ANALYSIS}

# Comparison Checklist

## 1. Dimensional Accuracy
For each dimension in the original analysis:
- Is it correctly represented in the model?
- Estimate the error percentage if different

## 2. Feature Verification
For each feature (holes, fillets, etc.):
- Present in model? (yes/no)
- Correct size? (yes/approximate/no)
- Correct position? (yes/approximate/no)

## 3. Boolean Operations
- Are all subtractive features (holes, cutouts) applied?
- Are all additive features (bosses, ribs) present?

## 4. Visual Match
- Does the silhouette match?
- Are proportions correct?
- Is the orientation correct?

# Output Format
{
  "match_quality": "excellent" | "good" | "fair" | "poor",
  "similarity_score": 0-100,
  "details": {
    "proportions_match": true | false,
    "features_match": true | false,
    "dimensions_match": true | false,
    "orientation_match": true | false
  },
  "dimension_errors": [
    {"dimension": "length", "expected": 50, "actual": 48, "error_percent": 4}
  ],
  "missing_features": ["list of features in original but not in model"],
  "extra_features": ["list of features in model but not in original"],
  "recommendation": "proceed" | "minor_adjustment" | "major_revision",
  "fix_instructions": [
    "Specific instruction for each fix needed"
  ]
}`,
  },
};

// =============================================================================
// Error Analysis Prompts
// =============================================================================

const ERROR_ANALYSIS: Record<string, PromptVersion> = {
  'v1.0': {
    description: 'Analyze OpenSCAD compilation errors',
    created: '2026-01-15',
    content: `Analyze this OpenSCAD error and suggest fixes:

Error message:
{ERROR_MESSAGE}

Code that caused the error:
{CODE_SNIPPET}

# Common Error Patterns

## Rounding Errors
- "WARNING: ... rounding ... too large"
- Fix: Reduce rounding value to < smallest_dimension/2

## Undefined Variables
- "WARNING: Undefined variable"
- Fix: Check spelling, ensure variable is declared before use

## Module Errors
- "WARNING: ... module ... not found"
- Fix: Check module name, ensure BOSL2 is included

## Geometry Errors
- "WARNING: ... does not produce valid 2-manifold"
- Fix: Ensure all boolean operations result in valid solid

# Output Format
{
  "error_type": "rounding" | "syntax" | "module" | "geometry" | "unknown",
  "root_cause": "Explanation of why the error occurred",
  "fix_suggestion": "Specific fix to apply",
  "code_fix": "The corrected code snippet",
  "prevention_tip": "How to avoid this error in the future"
}`,
  },
};

// =============================================================================
// Refinement Prompts
// =============================================================================

const REFINEMENT_GUIDANCE: Record<string, PromptVersion> = {
  'v1.0': {
    description: 'Guide user through model refinement',
    created: '2026-01-15',
    content: `Help refine the 3D model based on user feedback.

# Current Model Analysis
{CURRENT_ANALYSIS}

# User Feedback
{USER_FEEDBACK}

# Refinement Process

## 1. Interpret Feedback
What specific changes is the user requesting?
- Dimension changes (make it bigger, smaller, etc.)
- Feature changes (add holes, remove fillets, etc.)
- Proportion changes (make it taller, wider, etc.)
- Style changes (more rounded, sharper edges, etc.)

## 2. Map to Parameters
Which parameters need to change to achieve the requested refinement?

## 3. Generate Instructions
Provide specific, actionable instructions for modifying the OpenSCAD code.

# Output Format
{
  "interpretation": "What the user wants",
  "changes_needed": [
    {"parameter": "length", "current": 50, "new": 60, "reason": "user said 'longer'"},
    {"feature": "fillet_radius", "action": "increase", "new_value": 5}
  ],
  "code_modifications": [
    "Change line 5: body_length = 60; // was 50"
  ],
  "questions": [
    "Clarifying question if feedback is ambiguous"
  ]
}`,
  },
};

// =============================================================================
// Prompt Template Registry
// =============================================================================

const PROMPT_TEMPLATES: PromptTemplates = {
  vlm_openscad_grounding: VLM_OPENSCAD_GROUNDING,
  vlm_image_classification: VLM_IMAGE_CLASSIFICATION,
  vlm_dimension_extraction: VLM_DIMENSION_EXTRACTION,
  scad_from_description: SCAD_FROM_DESCRIPTION,
  verification_comparison: VERIFICATION_COMPARISON,
  verification_detailed: VERIFICATION_DETAILED,
  error_analysis: ERROR_ANALYSIS,
  refinement_guidance: REFINEMENT_GUIDANCE,
};

// =============================================================================
// Lookup Functions
// =============================================================================

/**
 * Get a prompt template by name and version
 */
export function getPromptTemplate(
  templateName: PromptTemplateName,
  options: {
    version?: string;
    substitutions?: Record<string, string>;
  } = {},
): string {
  const versions = PROMPT_TEMPLATES[templateName];
  if (!versions) {
    throw new Error(`Unknown prompt template: ${templateName}`);
  }

  // Get requested version or latest
  const versionKey = options.version || getLatestVersion(templateName);
  const template = versions[versionKey];

  if (!template) {
    // Fall back to latest if requested version not found
    const latestKey = getLatestVersion(templateName);
    const latestTemplate = versions[latestKey];
    if (!latestTemplate) {
      throw new Error(`No versions found for template: ${templateName}`);
    }
    console.warn(
      `Prompt version ${versionKey} not found for ${templateName}, using ${latestKey}`,
    );
    return applySubstitutions(latestTemplate.content, options.substitutions);
  }

  return applySubstitutions(template.content, options.substitutions);
}

/**
 * Get the latest version of a prompt template
 */
export function getLatestVersion(templateName: PromptTemplateName): string {
  const versions = PROMPT_TEMPLATES[templateName];
  if (!versions) {
    throw new Error(`Unknown prompt template: ${templateName}`);
  }

  const versionKeys = Object.keys(versions).sort((a, b) => {
    // Sort by version number (v1.0, v1.1, v2.0, etc.)
    const aNum = parseFloat(a.replace('v', ''));
    const bNum = parseFloat(b.replace('v', ''));
    return bNum - aNum; // Descending order
  });

  return versionKeys[0];
}

/**
 * List all available versions for a template
 */
export function listPromptVersions(
  templateName: PromptTemplateName,
): Array<{ version: string; description: string; created: string }> {
  const versions = PROMPT_TEMPLATES[templateName];
  if (!versions) {
    throw new Error(`Unknown prompt template: ${templateName}`);
  }

  return Object.entries(versions).map(([version, data]) => ({
    version,
    description: data.description,
    created: data.created,
  }));
}

/**
 * List all available prompt templates
 */
export function listPromptTemplates(): PromptTemplateName[] {
  return Object.keys(PROMPT_TEMPLATES) as PromptTemplateName[];
}

/**
 * Apply variable substitutions to a prompt
 */
function applySubstitutions(
  template: string,
  substitutions?: Record<string, string>,
): string {
  if (!substitutions) return template;

  let result = template;
  for (const [key, value] of Object.entries(substitutions)) {
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
  }
  return result;
}

/**
 * Validate that all required substitutions are provided
 */
export function validateSubstitutions(
  templateName: PromptTemplateName,
  substitutions: Record<string, string>,
  version?: string,
): { valid: boolean; missing: string[] } {
  const template = getPromptTemplate(templateName, { version });

  // Find all {VARIABLE} patterns
  const variablePattern = /\{([A-Z_]+)\}/g;
  const requiredVars: string[] = [];
  let match;

  while ((match = variablePattern.exec(template)) !== null) {
    requiredVars.push(match[1]);
  }

  const missing = requiredVars.filter((v) => !substitutions[v]);

  return {
    valid: missing.length === 0,
    missing,
  };
}
