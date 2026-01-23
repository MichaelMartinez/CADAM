/**
 * Mold Generator View
 *
 * Standalone view for generating two-part molds from STL files.
 * Supports standard casting molds and forged carbon compression molds.
 */

import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import {
  OrbitControls,
  GizmoHelper,
  GizmoViewcube,
  Stage,
  Environment,
  OrthographicCamera,
} from '@react-three/drei';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import * as THREE from 'three';
import { Loader2, Box, Download, Save } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { STLSourcePicker } from '@/components/mold/STLSourcePicker';
import { MoldConfigPanel } from '@/components/mold/MoldConfigPanel';
import { MeshAnalysisPanel } from '@/components/mold/MeshAnalysisPanel';
import { useMeshAnalysis, useMoldGeneration } from '@/hooks/useMeshAnalysis';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { generateMoldCode, formatConfigSummary } from '@/utils/moldTemplates';
import { downloadFile } from '@/utils/downloadUtils';
import {
  decodeBase64ToArrayBuffer,
  decodeBase64ToBlob,
} from '@/services/moldService';
import { moldLogger } from '@/lib/logger';
import type {
  STLSource,
  BoundingBox,
  MoldConfig,
  MeshCenter,
  SplitAxis,
} from '@/types/mold';
import { DEFAULT_MOLD_CONFIG } from '@/types/mold';

// Simple 3D mesh viewer component
function SimpleMeshViewer({
  geometry,
  color = '#00a6ff',
}: {
  geometry: THREE.BufferGeometry | null;
  color?: string;
}) {
  if (!geometry) {
    return (
      <div className="flex h-full items-center justify-center rounded-lg bg-adam-background-1">
        <p className="text-sm text-adam-neutral-500">No model to display</p>
      </div>
    );
  }

  return (
    <Canvas>
      <OrthographicCamera makeDefault position={[100, 100, 100]} zoom={2} />
      <Stage environment={null} adjustCamera={false}>
        <Environment files={`${import.meta.env.BASE_URL}/city.hdr`} />
        <mesh geometry={geometry} rotation={[-Math.PI / 2, 0, 0]}>
          <meshStandardMaterial
            color={color}
            metalness={0.6}
            roughness={0.3}
            envMapIntensity={0.3}
          />
        </mesh>
      </Stage>
      <OrbitControls makeDefault />
      <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
        <GizmoViewcube />
      </GizmoHelper>
    </Canvas>
  );
}

export function MoldGeneratorView() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // STL source state
  const [stlSource, setStlSource] = useState<STLSource | null>(null);
  const [boundingBox, setBoundingBox] = useState<BoundingBox | null>(null);
  const [meshCenter, setMeshCenter] = useState<MeshCenter | null>(null);
  const [originalGeometry, setOriginalGeometry] =
    useState<THREE.BufferGeometry | null>(null);
  const [stlArrayBuffer, setStlArrayBuffer] = useState<ArrayBuffer | null>(
    null,
  );

  // Mold config state - use default config from types
  const [config, setConfig] = useState<MoldConfig>(DEFAULT_MOLD_CONFIG);

  // Analysis hook
  const {
    analysisResult,
    isAnalyzing,
    analysisError,
    analyze,
    clearAnalysis: _clearAnalysis,
  } = useMeshAnalysis();

  // FreeCAD mold generation hook (server-side Build123D generation)
  const {
    generationResult,
    isGenerating: isGeneratingServer,
    generationError,
    generateFromConfig,
    clearGeneration: _clearGeneration,
  } = useMoldGeneration();

  // Combined loading state for UI
  const isGenerating = isGeneratingServer;

  // Tab state for left panel
  const [leftPanelTab, setLeftPanelTab] = useState<'config' | 'analysis'>(
    'config',
  );

  // Generated mold state
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [pistonGeometry, setPistonGeometry] =
    useState<THREE.BufferGeometry | null>(null);
  const [bucketGeometry, setBucketGeometry] =
    useState<THREE.BufferGeometry | null>(null);

  // Modular box specific state (3 pieces: left/right halves + top piston)
  const [modularBoxGeometries, setModularBoxGeometries] = useState<{
    left: THREE.BufferGeometry | null;
    right: THREE.BufferGeometry | null;
    top: THREE.BufferGeometry | null;
  }>({
    left: null,
    right: null,
    top: null,
  });

  type MoldViewPart = 'piston' | 'bucket' | 'left' | 'right' | 'top';
  const [moldViewPart, setMoldViewPart] = useState<MoldViewPart>('piston');
  const [isSaving, setIsSaving] = useState(false);

  // Handle STL source selection
  const handleSTLSelect = useCallback(
    async (source: STLSource, bbox: BoundingBox, center: MeshCenter) => {
      moldLogger.info('STL source selected', {
        type: source.type,
        filename: source.filename,
      });

      setStlSource(source);
      setBoundingBox(bbox);
      setMeshCenter(center);
      setGeneratedCode(null);
      setPistonGeometry(null);
      setBucketGeometry(null);

      // Load the geometry for preview
      try {
        let arrayBuffer: ArrayBuffer;

        if (source.type === 'upload') {
          arrayBuffer = await source.file.arrayBuffer();
          moldLogger.info('Loaded uploaded file', {
            size: arrayBuffer.byteLength,
          });
        } else {
          // Download from storage
          const storagePath = `${user?.id}/${source.conversationId}/mesh-${source.meshId}.stl`;
          moldLogger.info('Downloading from storage', { path: storagePath });

          const { data: blob, error } = await supabase.storage
            .from('images')
            .download(storagePath);

          if (error) throw error;
          arrayBuffer = await blob.arrayBuffer();
          moldLogger.info('Downloaded from storage', {
            size: arrayBuffer.byteLength,
          });
        }

        setStlArrayBuffer(arrayBuffer);

        // Parse geometry for display
        const loader = new STLLoader();
        const geometry = loader.parse(arrayBuffer);
        geometry.center();
        geometry.computeVertexNormals();
        setOriginalGeometry(geometry);

        moldLogger.info('STL parsed successfully', {
          boundingBox: bbox,
          meshCenter: center,
          vertices: geometry.attributes.position?.count ?? 0,
        });

        // Automatically trigger analysis for the new mesh
        try {
          moldLogger.info('Starting automatic mesh analysis...');
          await analyze(arrayBuffer, {
            demoldAxis: config.splitAxis,
            repair: true,
          });
          setLeftPanelTab('analysis');
        } catch (analysisErr) {
          moldLogger.warn(
            'Auto-analysis failed (service may not be available)',
            analysisErr,
          );
          // Don't show error toast - analysis is optional
        }
      } catch (err) {
        moldLogger.error('Error loading STL', err);
        toast({
          title: 'Error loading STL',
          description: 'Failed to load the 3D model for preview.',
          variant: 'destructive',
        });
      }
    },
    [user, analyze, config.splitAxis],
  );

  // Handle manual analysis trigger
  const handleAnalyze = useCallback(async () => {
    if (!stlArrayBuffer) {
      toast({
        title: 'No STL selected',
        description: 'Please select an STL file first.',
        variant: 'destructive',
      });
      return;
    }

    try {
      moldLogger.info('Running mesh analysis...');
      const result = await analyze(stlArrayBuffer, {
        demoldAxis: config.splitAxis,
        repair: true,
      });

      // Apply recommended orientation if different
      if (result.recommendedOrientation !== config.splitAxis) {
        moldLogger.info('Analysis recommends different orientation', {
          current: config.splitAxis,
          recommended: result.recommendedOrientation,
        });
      }

      // Apply recommended draft if analysis suggests it
      if (
        result.draftAnalysis?.recommendedDraft > 0 &&
        (config.draftAngle ?? 0) === 0
      ) {
        setConfig((prev) => ({
          ...prev,
          draftAngle: result.draftAnalysis.recommendedDraft,
        }));
      }

      setLeftPanelTab('analysis');
    } catch (err) {
      moldLogger.error('Analysis failed', err);
      toast({
        title: 'Analysis failed',
        description:
          err instanceof Error ? err.message : 'Failed to analyze mesh',
        variant: 'destructive',
      });
    }
  }, [stlArrayBuffer, config.splitAxis, config.draftAngle, analyze]);

  // Handle orientation change from analysis panel
  const handleOrientationSelect = useCallback((axis: SplitAxis) => {
    setConfig((prev) => ({
      ...prev,
      splitAxis: axis,
    }));
  }, []);

  // Handle mold generation
  const handleGenerate = useCallback(async () => {
    if (!stlSource || !boundingBox || !stlArrayBuffer) {
      toast({
        title: 'No STL selected',
        description: 'Please select an STL file first.',
        variant: 'destructive',
      });
      return;
    }

    moldLogger.group('Mold Generation', () => {
      moldLogger.info('Starting server-side mold generation', {
        stlFile: stlSource.filename,
        moldType: config.type,
        shape: config.shape,
        splitAxis: config.splitAxis,
      });
    });

    try {
      // Use server-side FreeCAD/Build123D generation
      const result = await generateFromConfig(
        stlArrayBuffer,
        config,
        analysisResult ?? undefined,
      );

      moldLogger.info('Mold generation complete', {
        success: result.success,
        generationTimeMs: result.generationTimeMs,
        hasPiston: !!result.pistonStl,
        hasBucket: !!result.bucketStl,
      });

      // For compatibility, generate code summary for saving
      const code = generateMoldCode(
        config,
        boundingBox,
        '/input.stl',
        meshCenter ?? undefined,
      );
      setGeneratedCode(code);

      toast({
        title: 'Mold generated',
        description: `Generated in ${result.generationTimeMs}ms`,
      });
    } catch (err) {
      moldLogger.error('Error generating mold', err);
      toast({
        title: 'Error generating mold',
        description:
          err instanceof Error ? err.message : 'Failed to generate mold',
        variant: 'destructive',
      });
    }
  }, [
    stlSource,
    boundingBox,
    meshCenter,
    stlArrayBuffer,
    config,
    analysisResult,
    generateFromConfig,
  ]);

  // Parse server generation result to geometries
  useEffect(() => {
    const loader = new STLLoader();

    // Standard/forged-carbon: piston and bucket
    if (generationResult?.pistonStl) {
      const buffer = decodeBase64ToArrayBuffer(generationResult.pistonStl);
      const geometry = loader.parse(buffer);
      geometry.center();
      geometry.computeVertexNormals();
      setPistonGeometry(geometry);
    } else {
      setPistonGeometry(null);
    }

    if (generationResult?.bucketStl) {
      const buffer = decodeBase64ToArrayBuffer(generationResult.bucketStl);
      const geometry = loader.parse(buffer);
      geometry.center();
      geometry.computeVertexNormals();
      setBucketGeometry(geometry);
    } else {
      setBucketGeometry(null);
    }

    // Modular box: 3 separate pieces (left half, right half, top piston)
    const parseModularPart = (
      stlData: string | undefined,
    ): THREE.BufferGeometry | null => {
      if (!stlData) return null;
      const buffer = decodeBase64ToArrayBuffer(stlData);
      const geometry = loader.parse(buffer);
      geometry.center();
      geometry.computeVertexNormals();
      return geometry;
    };

    setModularBoxGeometries({
      left: parseModularPart(generationResult?.leftStl),
      right: parseModularPart(generationResult?.rightStl),
      top: parseModularPart(generationResult?.topStl),
    });

    // Reset view part when switching mold types
    if (config.type === 'modular-box') {
      setMoldViewPart('left');
    } else {
      setMoldViewPart('piston');
    }
  }, [generationResult, config.type]);

  // Handle download - download all mold parts
  const handleDownload = useCallback(() => {
    if (!stlSource) return;
    const baseName = stlSource.filename.replace('.stl', '');

    if (config.type === 'modular-box') {
      // Download all 3 modular box pieces (left/right halves + top piston)
      const parts = [
        { key: 'leftStl', name: 'left-half' },
        { key: 'rightStl', name: 'right-half' },
        { key: 'topStl', name: 'top-piston' },
      ] as const;

      parts.forEach(({ key, name }) => {
        const stlData = generationResult?.[key];
        if (stlData) {
          const blob = decodeBase64ToBlob(stlData, 'model/stl');
          downloadFile({
            content: blob,
            filename: `${baseName}-mold-${name}.stl`,
            mimeType: 'model/stl',
          });
        }
      });
    } else {
      // Standard/forged-carbon: download piston and bucket
      if (generationResult?.pistonStl) {
        const pistonBlob = decodeBase64ToBlob(
          generationResult.pistonStl,
          'model/stl',
        );
        downloadFile({
          content: pistonBlob,
          filename: `${baseName}-piston.stl`,
          mimeType: 'model/stl',
        });
      }

      if (generationResult?.bucketStl) {
        const bucketBlob = decodeBase64ToBlob(
          generationResult.bucketStl,
          'model/stl',
        );
        downloadFile({
          content: bucketBlob,
          filename: `${baseName}-bucket.stl`,
          mimeType: 'model/stl',
        });
      }
    }
  }, [generationResult, stlSource, config.type]);

  // Handle save as creation
  const handleSaveAsCreation = useCallback(async () => {
    if (!user || !generatedCode || !stlSource) {
      toast({
        title: 'Cannot save',
        description: 'Please generate a mold first.',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);
    try {
      // Create conversation
      const { data: conversation, error: convError } = await supabase
        .from('conversations')
        .insert({
          user_id: user.id,
          title: `Mold: ${stlSource.filename.replace('.stl', '')}`,
        })
        .select()
        .single();

      if (convError) throw convError;

      // Create user message (config summary)
      const { error: userMsgError } = await supabase.from('messages').insert({
        conversation_id: conversation.id,
        role: 'user',
        content: {
          text: formatConfigSummary(config, stlSource),
        },
      });

      if (userMsgError) throw userMsgError;

      // Create assistant message (mold artifact)
      // Mold code uses fixed parameters from config, so no editable parameters
      const { error: assistantMsgError } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversation.id,
          role: 'assistant',
          content: {
            text: `Generated ${config.type} ${config.shape} mold with ${config.splitAxis.toUpperCase()}-axis split.`,
            artifact: {
              title: `${config.type === 'forged-carbon' ? 'Forged Carbon' : 'Standard'} Mold`,
              code: generatedCode,
              parameters: [],
            },
          },
        });

      if (assistantMsgError) throw assistantMsgError;

      // Upload generated mold STL to storage (if available)
      if (generationResult?.pistonStl) {
        const pistonBlob = decodeBase64ToBlob(
          generationResult.pistonStl,
          'model/stl',
        );
        await supabase.storage
          .from('images')
          .upload(`${user.id}/${conversation.id}/mold-piston.stl`, pistonBlob);
      }
      if (generationResult?.bucketStl) {
        const bucketBlob = decodeBase64ToBlob(
          generationResult.bucketStl,
          'model/stl',
        );
        await supabase.storage
          .from('images')
          .upload(`${user.id}/${conversation.id}/mold-bucket.stl`, bucketBlob);
      }

      toast({
        title: 'Saved!',
        description: 'Mold saved as a new creation.',
      });

      // Navigate to editor
      navigate(`/editor/${conversation.id}`);
    } catch (err) {
      console.error('Error saving creation:', err);
      toast({
        title: 'Error saving',
        description: 'Failed to save the mold as a creation.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  }, [user, generatedCode, stlSource, config, generationResult, navigate]);

  return (
    <div className="flex h-full">
      {/* Left Panel - Configuration */}
      <div className="w-80 flex-shrink-0 overflow-y-auto border-r border-adam-neutral-700 bg-adam-bg-dark">
        <div className="space-y-6 p-4">
          {/* Header */}
          <div className="flex items-center gap-2">
            <Box className="h-5 w-5 text-adam-blue" />
            <h1 className="text-lg font-semibold text-adam-text-primary">
              Mold Generator
            </h1>
          </div>

          {/* STL Source Picker */}
          <STLSourcePicker
            value={stlSource}
            onChange={handleSTLSelect}
            disabled={isGenerating || isAnalyzing}
          />

          {/* Tabs for Config / Analysis */}
          <Tabs
            value={leftPanelTab}
            onValueChange={(v) => setLeftPanelTab(v as 'config' | 'analysis')}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="config">Configuration</TabsTrigger>
              <TabsTrigger value="analysis" disabled={!stlSource}>
                Analysis
                {analysisResult && (
                  <span
                    className={`ml-1.5 h-2 w-2 rounded-full ${analysisResult.isMoldable ? 'bg-adam-green' : 'bg-adam-orange'}`}
                  />
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="config" className="mt-4">
              {/* Config Panel */}
              <MoldConfigPanel
                config={config}
                onChange={setConfig}
                boundingBox={boundingBox}
                disabled={isGenerating || !stlSource}
              />
            </TabsContent>

            <TabsContent value="analysis" className="mt-4">
              {/* Analysis Panel */}
              <MeshAnalysisPanel
                analysisResult={analysisResult}
                isAnalyzing={isAnalyzing}
                selectedOrientation={config.splitAxis}
                onOrientationSelect={handleOrientationSelect}
                onReanalyze={handleAnalyze}
              />
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="space-y-2">
            {/* Analyze Button */}
            {!analysisResult && stlSource && (
              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing || isGenerating}
                variant="outline"
                className="w-full"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  'Analyze Mesh'
                )}
              </Button>
            )}

            {/* Generate Button */}
            <Button
              onClick={handleGenerate}
              disabled={!stlSource || isGenerating || isAnalyzing}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Mold'
              )}
            </Button>
          </div>

          {/* Error display */}
          {(generationError || analysisError) && (
            <Card className="border-red-500/30 bg-red-500/10 p-3">
              <p className="text-sm text-red-400">
                {generationError
                  ? generationError instanceof Error
                    ? generationError.message
                    : 'Generation failed'
                  : analysisError instanceof Error
                    ? analysisError.message
                    : 'Analysis failed'}
              </p>
            </Card>
          )}

          {/* Actions (when mold is generated) */}
          {(pistonGeometry ||
            bucketGeometry ||
            (config.type === 'modular-box' && modularBoxGeometries.top)) && (
            <div className="space-y-2">
              <Button
                variant="outline"
                onClick={handleDownload}
                className="w-full"
              >
                <Download className="mr-2 h-4 w-4" />
                {config.type === 'modular-box'
                  ? 'Download All 3 Parts'
                  : 'Download STL'}
              </Button>
              <Button
                onClick={handleSaveAsCreation}
                disabled={isSaving}
                className="w-full"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save as Creation
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Viewers */}
      <div className="grid flex-1 grid-cols-2 gap-4 bg-adam-background-1 p-4">
        {/* Original Model */}
        <div className="flex flex-col">
          <h3 className="mb-2 text-sm font-medium text-adam-text-secondary">
            Original Model
          </h3>
          <div className="flex-1 overflow-hidden rounded-lg border border-adam-neutral-700">
            <SimpleMeshViewer geometry={originalGeometry} color="#00a6ff" />
          </div>
          {boundingBox && (
            <p className="mt-1 text-center text-xs text-adam-neutral-500">
              {boundingBox.x.toFixed(1)} x {boundingBox.y.toFixed(1)} x{' '}
              {boundingBox.z.toFixed(1)} mm
            </p>
          )}
        </div>

        {/* Generated Mold */}
        <div className="flex flex-col">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-medium text-adam-text-secondary">
              Generated Mold
            </h3>
            {config.type === 'modular-box' && modularBoxGeometries.left && (
              <div className="flex flex-wrap gap-1 rounded-md bg-adam-neutral-800 p-0.5">
                {(['left', 'right', 'top'] as const).map((part) => (
                  <button
                    key={part}
                    onClick={() => setMoldViewPart(part)}
                    className={`rounded px-2 py-0.5 text-xs capitalize transition-colors ${
                      moldViewPart === part
                        ? 'bg-adam-blue text-white'
                        : 'text-adam-neutral-400 hover:text-white'
                    }`}
                  >
                    {part === 'left'
                      ? 'Left'
                      : part === 'right'
                        ? 'Right'
                        : 'Top'}
                  </button>
                ))}
              </div>
            )}
            {config.type !== 'modular-box' &&
              (pistonGeometry || bucketGeometry) && (
                <div className="flex gap-1 rounded-md bg-adam-neutral-800 p-0.5">
                  <button
                    onClick={() => setMoldViewPart('piston')}
                    className={`rounded px-2 py-0.5 text-xs transition-colors ${
                      moldViewPart === 'piston'
                        ? 'bg-adam-blue text-white'
                        : 'text-adam-neutral-400 hover:text-white'
                    }`}
                  >
                    Piston
                  </button>
                  <button
                    onClick={() => setMoldViewPart('bucket')}
                    className={`rounded px-2 py-0.5 text-xs transition-colors ${
                      moldViewPart === 'bucket'
                        ? 'bg-adam-blue text-white'
                        : 'text-adam-neutral-400 hover:text-white'
                    }`}
                  >
                    Bucket
                  </button>
                </div>
              )}
          </div>
          <div className="flex-1 overflow-hidden rounded-lg border border-adam-neutral-700">
            {isGenerating ? (
              <div className="flex h-full items-center justify-center bg-adam-background-1">
                <div className="flex flex-col items-center gap-3 px-4 text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-adam-blue" />
                  <p className="text-sm font-medium text-adam-neutral-300">
                    Generating mold...
                  </p>
                </div>
              </div>
            ) : (
              <SimpleMeshViewer
                geometry={getViewerGeometry()}
                color={getViewerColor()}
              />
            )}
          </div>
          {hasMoldGeometry() && (
            <p className="mt-1 text-center text-xs text-adam-neutral-500">
              {getMoldPartLabel()}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  // Helper functions for viewer
  function getViewerGeometry(): THREE.BufferGeometry | null {
    if (config.type === 'modular-box') {
      const key = moldViewPart as keyof typeof modularBoxGeometries;
      if (key in modularBoxGeometries) {
        return modularBoxGeometries[key];
      }
    }
    return moldViewPart === 'piston' ? pistonGeometry : bucketGeometry;
  }

  function getViewerColor(): string {
    if (config.type === 'modular-box') {
      const colors: Record<string, string> = {
        left: '#a78bfa', // purple for left half
        right: '#facc15', // yellow for right half
        top: '#4ade80', // green for top piston
      };
      return colors[moldViewPart] ?? '#60a5fa';
    }
    return moldViewPart === 'piston' ? '#4ade80' : '#60a5fa';
  }

  function hasMoldGeometry(): boolean {
    if (config.type === 'modular-box') {
      return Object.values(modularBoxGeometries).some((g) => g !== null);
    }
    return pistonGeometry !== null || bucketGeometry !== null;
  }

  function getMoldPartLabel(): string {
    if (config.type === 'modular-box') {
      const labels: Record<string, string> = {
        left: 'Left half (Y < 0)',
        right: 'Right half (Y > 0)',
        top: 'Top piston (compression plate)',
      };
      return labels[moldViewPart] ?? '';
    }
    return moldViewPart === 'piston'
      ? 'Piston (top half)'
      : 'Bucket (bottom half)';
  }
}
