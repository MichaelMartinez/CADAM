/**
 * Mold Generation Service
 *
 * API client for mesh analysis and FreeCAD-based mold generation.
 * Uses the step-converter edge function to proxy requests to the FreeCAD service.
 */

import { supabase } from '@/lib/supabase';
import type {
  MeshAnalysisResult,
  AnalysisOptions,
  MoldGenerationConfig,
  MoldGenerationResult,
} from '@/types/meshAnalysis';
import type { MoldConfig } from '@/types/mold';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

async function getAuthHeaders(): Promise<HeadersInit> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return {
    Authorization: `Bearer ${session?.access_token}`,
  };
}

/**
 * Analyze an STL mesh for moldability.
 *
 * Returns manifold status, orientation recommendations, undercut detection,
 * draft angle analysis, and alpha shape for shear edge generation.
 *
 * @param stlBuffer - Raw STL file data
 * @param options - Analysis options
 * @returns Mesh analysis result
 */
export async function analyzeMesh(
  stlBuffer: ArrayBuffer,
  options: AnalysisOptions = {},
): Promise<MeshAnalysisResult> {
  const formData = new FormData();
  formData.append(
    'stl',
    new Blob([stlBuffer], { type: 'model/stl' }),
    'input.stl',
  );
  formData.append('options', JSON.stringify(options));

  const response = await fetch(
    `${SUPABASE_URL}/functions/v1/step-converter/analyze-mesh`,
    {
      method: 'POST',
      headers: await getAuthHeaders(),
      body: formData,
    },
  );

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || error.detail || 'Mesh analysis failed');
  }

  return response.json();
}

/**
 * Generate a compression mold from an STL mesh.
 *
 * Supports forged carbon two-part molds with proper shear edge geometry.
 * Returns STL and/or STEP files for piston and bucket.
 *
 * @param stlBuffer - Raw STL file data
 * @param config - Mold generation configuration
 * @param alphaShapePoints - Pre-computed alpha shape points (from analysis)
 * @returns Mold generation result with STL/STEP data
 */
export async function generateMold(
  stlBuffer: ArrayBuffer,
  config: MoldGenerationConfig,
  alphaShapePoints?: [number, number][],
): Promise<MoldGenerationResult> {
  const formData = new FormData();
  formData.append(
    'stl',
    new Blob([stlBuffer], { type: 'model/stl' }),
    'input.stl',
  );
  formData.append('config', JSON.stringify(config));
  formData.append(
    'alpha_shape',
    alphaShapePoints ? JSON.stringify(alphaShapePoints) : 'null',
  );

  const response = await fetch(
    `${SUPABASE_URL}/functions/v1/step-converter/generate-mold`,
    {
      method: 'POST',
      headers: await getAuthHeaders(),
      body: formData,
    },
  );

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || error.detail || 'Mold generation failed');
  }

  return response.json();
}

/**
 * Combined analysis and mold generation in one call.
 *
 * This is more efficient than calling analyzeMesh then generateMold separately,
 * as it automatically uses the analysis results (like alpha shape) for generation.
 *
 * @param stlBuffer - Raw STL file data
 * @param config - Mold generation configuration
 * @param analysisOptions - Analysis options
 * @returns Combined result with both analysis and generation data
 */
export async function analyzeAndGenerateMold(
  stlBuffer: ArrayBuffer,
  config: Partial<MoldGenerationConfig>,
  analysisOptions: AnalysisOptions = {},
): Promise<{
  success: boolean;
  analysis: MeshAnalysisResult;
  generation: MoldGenerationResult;
}> {
  const formData = new FormData();
  formData.append(
    'stl',
    new Blob([stlBuffer], { type: 'model/stl' }),
    'input.stl',
  );
  formData.append('config', JSON.stringify(config));
  formData.append('analysis_options', JSON.stringify(analysisOptions));

  const response = await fetch(
    `${SUPABASE_URL}/functions/v1/step-converter/analyze-and-generate`,
    {
      method: 'POST',
      headers: await getAuthHeaders(),
      body: formData,
    },
  );

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: 'Unknown error' }));
    throw new Error(
      error.error || error.detail || 'Analysis and generation failed',
    );
  }

  return response.json();
}

/**
 * Convert MoldConfig from the UI to MoldGenerationConfig for the server.
 *
 * Maps the frontend config format to the backend API format.
 */
export function moldConfigToGenerationConfig(
  moldConfig: MoldConfig,
  analysisResult?: MeshAnalysisResult,
): MoldGenerationConfig {
  return {
    moldType: moldConfig.type,
    moldShape: moldConfig.shape,
    orientation: moldConfig.splitAxis, // splitAxis in UI maps to orientation in API
    shearEdgeGap: moldConfig.shearEdgeGap ?? 0.075,
    shearEdgeDepth: moldConfig.shearEdgeDepth ?? 2.5,
    clearanceRunout: moldConfig.clearanceRunout ?? 0.4,
    draftAngle:
      moldConfig.draftAngle ??
      analysisResult?.draftAnalysis?.recommendedDraft ??
      0,
    wallThickness: moldConfig.wallThickness,
    useAlphaShapeProfile: moldConfig.useProjectedProfile ?? true,
    alphaShapePoints: analysisResult?.alphaShape?.points,
    outputFormat: 'both', // Generate both STL and STEP by default

    // Forged carbon specific
    pistonHeight:
      moldConfig.dimensions.height > 0
        ? moldConfig.dimensions.height - moldConfig.wallThickness
        : undefined,
    bucketHeight:
      moldConfig.dimensions.height > 0
        ? moldConfig.dimensions.height
        : undefined,
    handle: {
      width: Math.min((moldConfig.dimensions.width || 50) * 0.6, 50),
      depth: Math.min((moldConfig.dimensions.depth || 50) * 0.6, 50),
      height: 15,
    },

    // Registration keys
    registrationKeys: {
      enabled: moldConfig.keySize > 0,
      type: moldConfig.keyType,
      size: moldConfig.keySize,
      tolerance: moldConfig.keyFettle,
    },
  };
}

/**
 * Decode base64-encoded STL/STEP data to Blob.
 */
export function decodeBase64ToBlob(
  base64Data: string,
  mimeType: string = 'application/octet-stream',
): Blob {
  const binaryString = atob(base64Data);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return new Blob([bytes], { type: mimeType });
}

/**
 * Decode base64-encoded STL data to ArrayBuffer for Three.js loading.
 */
export function decodeBase64ToArrayBuffer(base64Data: string): ArrayBuffer {
  const binaryString = atob(base64Data);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * Download generated mold file.
 */
export function downloadMoldFile(
  data: string,
  filename: string,
  mimeType: string = 'application/octet-stream',
): void {
  const blob = decodeBase64ToBlob(data, mimeType);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
