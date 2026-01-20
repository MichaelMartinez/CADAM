/**
 * useMeshAnalysis Hook
 *
 * React hook for analyzing STL meshes for moldability.
 * Provides analysis results including manifold check, orientation recommendations,
 * undercut detection, and alpha shape computation.
 */

import { useState, useCallback } from 'react';
import {
  analyzeMesh,
  generateMold,
  analyzeAndGenerateMold,
  moldConfigToGenerationConfig,
  decodeBase64ToArrayBuffer,
} from '@/services/moldService';
import type {
  MeshAnalysisResult,
  AnalysisOptions,
  MoldGenerationConfig,
  MoldGenerationResult,
} from '@/types/meshAnalysis';
import type { MoldConfig } from '@/types/mold';

interface UseMeshAnalysisState {
  /** Analysis result from server */
  analysisResult: MeshAnalysisResult | null;
  /** Whether analysis is in progress */
  isAnalyzing: boolean;
  /** Error from analysis */
  analysisError: Error | null;
}

interface UseMoldGenerationState {
  /** Generation result from server */
  generationResult: MoldGenerationResult | null;
  /** Whether generation is in progress */
  isGenerating: boolean;
  /** Error from generation */
  generationError: Error | null;
}

/**
 * Hook for mesh analysis functionality.
 */
export function useMeshAnalysis() {
  const [state, setState] = useState<UseMeshAnalysisState>({
    analysisResult: null,
    isAnalyzing: false,
    analysisError: null,
  });

  /**
   * Analyze an STL mesh.
   *
   * @param stlBuffer - Raw STL file data
   * @param options - Analysis options
   * @returns Analysis result
   */
  const analyze = useCallback(
    async (
      stlBuffer: ArrayBuffer,
      options: AnalysisOptions = {},
    ): Promise<MeshAnalysisResult> => {
      setState((prev) => ({
        ...prev,
        isAnalyzing: true,
        analysisError: null,
      }));

      try {
        const result = await analyzeMesh(stlBuffer, options);

        setState({
          analysisResult: result,
          isAnalyzing: false,
          analysisError: null,
        });

        return result;
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        setState((prev) => ({
          ...prev,
          isAnalyzing: false,
          analysisError: err,
        }));
        throw err;
      }
    },
    [],
  );

  /**
   * Clear analysis results.
   */
  const clearAnalysis = useCallback(() => {
    setState({
      analysisResult: null,
      isAnalyzing: false,
      analysisError: null,
    });
  }, []);

  return {
    ...state,
    analyze,
    clearAnalysis,
  };
}

/**
 * Hook for mold generation functionality.
 */
export function useMoldGeneration() {
  const [state, setState] = useState<UseMoldGenerationState>({
    generationResult: null,
    isGenerating: false,
    generationError: null,
  });

  /**
   * Generate a mold from STL mesh.
   *
   * @param stlBuffer - Raw STL file data
   * @param config - Mold generation configuration
   * @param alphaShapePoints - Pre-computed alpha shape points
   * @returns Generation result
   */
  const generate = useCallback(
    async (
      stlBuffer: ArrayBuffer,
      config: MoldGenerationConfig,
      alphaShapePoints?: [number, number][],
    ): Promise<MoldGenerationResult> => {
      setState((prev) => ({
        ...prev,
        isGenerating: true,
        generationError: null,
      }));

      try {
        const result = await generateMold(stlBuffer, config, alphaShapePoints);

        setState({
          generationResult: result,
          isGenerating: false,
          generationError: null,
        });

        return result;
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        setState((prev) => ({
          ...prev,
          isGenerating: false,
          generationError: err,
        }));
        throw err;
      }
    },
    [],
  );

  /**
   * Generate mold from UI MoldConfig.
   *
   * @param stlBuffer - Raw STL file data
   * @param moldConfig - UI mold configuration
   * @param analysisResult - Optional analysis result for alpha shape
   */
  const generateFromConfig = useCallback(
    async (
      stlBuffer: ArrayBuffer,
      moldConfig: MoldConfig,
      analysisResult?: MeshAnalysisResult,
    ): Promise<MoldGenerationResult> => {
      const config = moldConfigToGenerationConfig(moldConfig, analysisResult);
      return generate(stlBuffer, config, analysisResult?.alphaShape?.points);
    },
    [generate],
  );

  /**
   * Clear generation results.
   */
  const clearGeneration = useCallback(() => {
    setState({
      generationResult: null,
      isGenerating: false,
      generationError: null,
    });
  }, []);

  return {
    ...state,
    generate,
    generateFromConfig,
    clearGeneration,
  };
}

/**
 * Combined hook for the complete mold generation workflow.
 *
 * Provides both analysis and generation functionality in a unified interface.
 */
export function useMoldWorkflow() {
  const { analysisResult, isAnalyzing, analysisError, analyze, clearAnalysis } =
    useMeshAnalysis();

  const {
    generationResult,
    isGenerating,
    generationError,
    generate,
    generateFromConfig,
    clearGeneration,
  } = useMoldGeneration();

  /**
   * Combined analysis and generation in one operation.
   *
   * @param stlBuffer - Raw STL file data
   * @param config - Partial mold generation config (analysis fills in gaps)
   * @param analysisOptions - Analysis options
   */
  const analyzeAndGenerate = useCallback(
    async (
      stlBuffer: ArrayBuffer,
      config: Partial<MoldGenerationConfig>,
      analysisOptions: AnalysisOptions = {},
    ) => {
      // This uses the server-side combined endpoint for efficiency
      return analyzeAndGenerateMold(stlBuffer, config, analysisOptions);
    },
    [],
  );

  /**
   * Get piston geometry as ArrayBuffer for Three.js.
   */
  const getPistonGeometry = useCallback((): ArrayBuffer | null => {
    if (!generationResult?.pistonStl) return null;
    return decodeBase64ToArrayBuffer(generationResult.pistonStl);
  }, [generationResult]);

  /**
   * Get bucket geometry as ArrayBuffer for Three.js.
   */
  const getBucketGeometry = useCallback((): ArrayBuffer | null => {
    if (!generationResult?.bucketStl) return null;
    return decodeBase64ToArrayBuffer(generationResult.bucketStl);
  }, [generationResult]);

  /**
   * Clear all workflow state.
   */
  const clearAll = useCallback(() => {
    clearAnalysis();
    clearGeneration();
  }, [clearAnalysis, clearGeneration]);

  return {
    // Analysis state
    analysisResult,
    isAnalyzing,
    analysisError,
    analyze,
    clearAnalysis,

    // Generation state
    generationResult,
    isGenerating,
    generationError,
    generate,
    generateFromConfig,
    clearGeneration,

    // Combined
    analyzeAndGenerate,
    getPistonGeometry,
    getBucketGeometry,
    clearAll,

    // Derived state
    isWorking: isAnalyzing || isGenerating,
    hasError: !!analysisError || !!generationError,
    error: analysisError || generationError,
  };
}
