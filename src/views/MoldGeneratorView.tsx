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
import { STLSourcePicker } from '@/components/mold/STLSourcePicker';
import { MoldConfigPanel } from '@/components/mold/MoldConfigPanel';
import { useOpenSCAD } from '@/hooks/useOpenSCAD';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { generateMoldCode, formatConfigSummary } from '@/utils/moldTemplates';
import { downloadFile } from '@/utils/downloadUtils';
import type { STLSource, BoundingBox, MoldConfig } from '@/types/mold';

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
  const [originalGeometry, setOriginalGeometry] =
    useState<THREE.BufferGeometry | null>(null);
  const [stlArrayBuffer, setStlArrayBuffer] = useState<ArrayBuffer | null>(
    null,
  );

  // Mold config state
  const [config, setConfig] = useState<MoldConfig>({
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
  });

  // Generated mold state
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [moldGeometry, setMoldGeometry] = useState<THREE.BufferGeometry | null>(
    null,
  );
  const [isSaving, setIsSaving] = useState(false);

  // OpenSCAD hook
  const { compileScad, writeFile, isCompiling, output, error } = useOpenSCAD();

  // Handle STL source selection
  const handleSTLSelect = useCallback(
    async (source: STLSource, bbox: BoundingBox) => {
      setStlSource(source);
      setBoundingBox(bbox);
      setGeneratedCode(null);
      setMoldGeometry(null);

      // Load the geometry for preview
      try {
        let arrayBuffer: ArrayBuffer;

        if (source.type === 'upload') {
          arrayBuffer = await source.file.arrayBuffer();
        } else {
          // Download from storage
          const storagePath = `${user?.id}/${source.conversationId}/mesh-${source.meshId}.stl`;
          const { data: blob, error } = await supabase.storage
            .from('images')
            .download(storagePath);

          if (error) throw error;
          arrayBuffer = await blob.arrayBuffer();
        }

        setStlArrayBuffer(arrayBuffer);

        // Parse geometry for display
        const loader = new STLLoader();
        const geometry = loader.parse(arrayBuffer);
        geometry.center();
        geometry.computeVertexNormals();
        setOriginalGeometry(geometry);
      } catch (err) {
        console.error('Error loading STL:', err);
        toast({
          title: 'Error loading STL',
          description: 'Failed to load the 3D model for preview.',
          variant: 'destructive',
        });
      }
    },
    [user],
  );

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

    try {
      // Write STL to OpenSCAD worker filesystem as Blob
      const meshFilename = '/input.stl';
      const stlBlob = new Blob([stlArrayBuffer], { type: 'model/stl' });
      await writeFile(meshFilename, stlBlob);

      // Generate OpenSCAD code
      const code = generateMoldCode(config, boundingBox, meshFilename);
      setGeneratedCode(code);

      // Compile
      await compileScad(code);
    } catch (err) {
      console.error('Error generating mold:', err);
      toast({
        title: 'Error generating mold',
        description:
          err instanceof Error ? err.message : 'Failed to generate mold',
        variant: 'destructive',
      });
    }
  }, [stlSource, boundingBox, stlArrayBuffer, config, writeFile, compileScad]);

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
            disabled={isCompiling}
          />

          {/* Config Panel */}
          <MoldConfigPanel
            config={config}
            onChange={setConfig}
            boundingBox={boundingBox}
            disabled={isCompiling || !stlSource}
          />

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={!stlSource || isCompiling}
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

          {/* Error display */}
          {error && (
            <Card className="border-red-500/30 bg-red-500/10 p-3">
              <p className="text-sm text-red-400">
                {error instanceof Error ? error.message : 'Compilation failed'}
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
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-8 w-8 animate-spin text-adam-blue" />
                  <p className="text-sm text-adam-neutral-400">
                    Compiling OpenSCAD...
                  </p>
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
