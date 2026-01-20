/**
 * Mold Generator View
 *
 * Standalone view for generating two-part molds from STL files.
 * Supports standard casting molds and forged carbon compression molds.
 */

import { useState, useCallback, useEffect, useRef } from 'react';
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
import {
  Loader2,
  Box,
  Download,
  Save,
  XCircle,
  AlertTriangle,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { STLSourcePicker } from '@/components/mold/STLSourcePicker';
import { MoldConfigPanel } from '@/components/mold/MoldConfigPanel';
import { MeshAnalysisPanel } from '@/components/mold/MeshAnalysisPanel';
import { useOpenSCAD } from '@/hooks/useOpenSCAD';
import { useMeshAnalysis, useMoldGeneration } from '@/hooks/useMeshAnalysis';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { generateMoldCode, formatConfigSummary } from '@/utils/moldTemplates';
import { downloadFile } from '@/utils/downloadUtils';
// Server-side mold generation utilities (will be used when server integration is complete)
// import { downloadMoldFile, decodeBase64ToArrayBuffer } from '@/services/moldService';
import { moldLogger } from '@/lib/logger';
import type {
  STLSource,
  BoundingBox,
  MoldConfig,
  MeshCenter,
  SplitAxis,
} from '@/types/mold';
import { DEFAULT_MOLD_CONFIG } from '@/types/mold';
import type { CompilationEvent } from '@shared/types';

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

  // FreeCAD mold generation hook (new server-side method)
  // These will be used when we switch fully to server-side generation
  const {
    generationResult: _generationResult,
    isGenerating: _isGeneratingServer,
    generationError: _generationError,
    generateFromConfig: _generateFromConfig,
    clearGeneration: _clearGeneration,
  } = useMoldGeneration();

  // Tab state for left panel
  const [leftPanelTab, setLeftPanelTab] = useState<'config' | 'analysis'>(
    'config',
  );

  // Generated mold state
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [moldGeometry, setMoldGeometry] = useState<THREE.BufferGeometry | null>(
    null,
  );
  const [isSaving, setIsSaving] = useState(false);

  // Compilation progress tracking
  const [compilationStage, setCompilationStage] = useState<string>('');
  const [compilationElapsed, setCompilationElapsed] = useState<number>(0);
  const compilationStartRef = useRef<number | null>(null);

  // Handle compilation events from OpenSCAD worker
  const handleCompilationEvent = useCallback((event: CompilationEvent) => {
    // Parse stage from echo statements (format: ">>> STAGE: message")
    if (
      event.type === 'compilation.stderr' &&
      event.message.includes('>>> STAGE:')
    ) {
      const stageMatch = event.message.match(/>>> STAGE:\s*(.+)/);
      if (stageMatch) {
        const stage = stageMatch[1].trim();
        setCompilationStage(stage);
        moldLogger.info(`Stage: ${stage}`);
      }
    }
    // Update stage for major compilation events
    if (event.type === 'compilation.rendering') {
      setCompilationStage('Rendering geometry...');
    } else if (event.type === 'library.loading') {
      setCompilationStage(`Loading ${event.library ?? 'library'}...`);
    } else if (event.type === 'compilation.complete') {
      setCompilationStage('Complete!');
    }
    // Log all compilation events for debugging
    if (
      event.type === 'compilation.stderr' ||
      event.type === 'compilation.error'
    ) {
      moldLogger.debug(`[${event.type}] ${event.message}`);
    }
  }, []);

  // OpenSCAD hook with event callback
  const {
    compileScad,
    cancelCompilation,
    writeFile,
    isCompiling,
    output,
    error,
    compilationEvents: _compilationEvents,
  } = useOpenSCAD({
    onCompilationEvent: handleCompilationEvent,
  });

  // Timer effect to track elapsed compilation time
  useEffect(() => {
    if (isCompiling) {
      compilationStartRef.current = Date.now();
      setCompilationElapsed(0);
      setCompilationStage('Initializing...');

      const interval = setInterval(() => {
        if (compilationStartRef.current) {
          setCompilationElapsed(Date.now() - compilationStartRef.current);
        }
      }, 100);

      return () => {
        clearInterval(interval);
      };
    } else {
      compilationStartRef.current = null;
    }
  }, [isCompiling]);

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
      setMoldGeometry(null);

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
      moldLogger.info('Starting mold generation', {
        stlFile: stlSource.filename,
        moldType: config.type,
        shape: config.shape,
        splitAxis: config.splitAxis,
      });
    });

    try {
      // Write STL to OpenSCAD worker filesystem as Blob
      const meshFilename = '/input.stl';
      const stlBlob = new Blob([stlArrayBuffer], { type: 'model/stl' });

      const writeStart = performance.now();
      moldLogger.info('Writing STL to worker filesystem...', {
        path: meshFilename,
        size: stlArrayBuffer.byteLength,
      });
      await writeFile(meshFilename, stlBlob);
      moldLogger.info('STL written to worker', {
        duration: `${(performance.now() - writeStart).toFixed(0)}ms`,
      });

      // Generate OpenSCAD code with mesh center for proper positioning
      const code = generateMoldCode(
        config,
        boundingBox,
        meshFilename,
        meshCenter ?? undefined,
      );

      const hasMinkowski = code.includes('minkowski()');
      moldLogger.info('Generated OpenSCAD code', {
        codeLength: code.length,
        hasMinkowski,
        boundingBox,
        meshCenter,
      });

      // Log code in collapsed group for debugging
      moldLogger.groupCollapsed('Generated SCAD Code', () => {
        console.log(code);
      });

      setGeneratedCode(code);

      // Compile
      moldLogger.info('Starting OpenSCAD compilation...', {
        timestamp: new Date().toISOString(),
        warning: hasMinkowski
          ? 'Contains minkowski() - may be slow'
          : undefined,
      });
      await compileScad(code);
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
    writeFile,
    compileScad,
  ]);

  // Parse compiled output to geometry
  useEffect(() => {
    if (output && output instanceof Blob) {
      output.arrayBuffer().then((buffer) => {
        const loader = new STLLoader();
        const geometry = loader.parse(buffer);
        geometry.center();
        geometry.computeVertexNormals();
        setMoldGeometry(geometry);
      });
    }
  }, [output]);

  // Handle download
  const handleDownload = useCallback(() => {
    if (output instanceof Blob && stlSource) {
      const filename = `mold-${stlSource.filename.replace('.stl', '')}.stl`;
      downloadFile({ content: output, filename, mimeType: 'model/stl' });
    }
  }, [output, stlSource]);

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
      if (output instanceof Blob) {
        const moldFilename = `mold-${crypto.randomUUID()}.stl`;
        await supabase.storage
          .from('images')
          .upload(`${user.id}/${conversation.id}/${moldFilename}`, output);
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
  }, [user, generatedCode, stlSource, config, output, navigate]);

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
            disabled={isCompiling || isAnalyzing}
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
                disabled={isCompiling || !stlSource}
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
                disabled={isAnalyzing || isCompiling}
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
              disabled={!stlSource || isCompiling || isAnalyzing}
              className="w-full"
            >
              {isCompiling ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Mold'
              )}
            </Button>

            {/* Cancel Button (visible during compilation) */}
            {isCompiling && (
              <Button
                onClick={cancelCompilation}
                variant="outline"
                className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10"
              >
                <XCircle className="mr-2 h-4 w-4" />
                Cancel Compilation
              </Button>
            )}
          </div>

          {/* Error display */}
          {(error || analysisError) && (
            <Card className="border-red-500/30 bg-red-500/10 p-3">
              <p className="text-sm text-red-400">
                {error
                  ? error instanceof Error
                    ? error.message
                    : 'Compilation failed'
                  : analysisError instanceof Error
                    ? analysisError.message
                    : 'Analysis failed'}
              </p>
            </Card>
          )}

          {/* Actions (when mold is generated) */}
          {moldGeometry && (
            <div className="space-y-2">
              <Button
                variant="outline"
                onClick={handleDownload}
                className="w-full"
              >
                <Download className="mr-2 h-4 w-4" />
                Download STL
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
          <h3 className="mb-2 text-sm font-medium text-adam-text-secondary">
            Generated Mold
          </h3>
          <div className="flex-1 overflow-hidden rounded-lg border border-adam-neutral-700">
            {isCompiling ? (
              <div className="flex h-full items-center justify-center bg-adam-background-1">
                <div className="flex flex-col items-center gap-3 px-4 text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-adam-blue" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-adam-neutral-300">
                      {compilationStage || 'Compiling OpenSCAD...'}
                    </p>
                    <p className="text-xs text-adam-neutral-500">
                      Elapsed: {(compilationElapsed / 1000).toFixed(1)}s
                    </p>
                  </div>

                  {/* Warning at 30s */}
                  {compilationElapsed > 30000 &&
                    compilationElapsed < 120000 && (
                      <div className="flex items-center gap-1.5 rounded-md bg-yellow-500/10 px-3 py-1.5">
                        <AlertTriangle className="h-3.5 w-3.5 text-yellow-500" />
                        <p className="text-xs text-yellow-400">
                          Complex geometry may take several minutes
                        </p>
                      </div>
                    )}

                  {/* Warning at 120s */}
                  {compilationElapsed >= 120000 && (
                    <div className="flex items-center gap-1.5 rounded-md bg-orange-500/10 px-3 py-1.5">
                      <AlertTriangle className="h-3.5 w-3.5 text-orange-500" />
                      <p className="text-xs text-orange-400">
                        Consider simplifying the model or cancelling
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <SimpleMeshViewer geometry={moldGeometry} color="#4ade80" />
            )}
          </div>
          {moldGeometry && (
            <p className="mt-1 text-center text-xs text-adam-neutral-500">
              {config.type === 'forged-carbon'
                ? 'Bucket + Piston'
                : 'Top + Bottom halves'}{' '}
              (side by side)
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
