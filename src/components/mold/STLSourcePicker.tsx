/**
 * STL Source Picker
 *
 * Component for selecting an STL source - either by uploading a new file
 * or selecting from existing creations.
 */

import { useState, useCallback, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Upload, FileBox, Loader2, Check } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, isGodMode } from '@/lib/supabase';
import { parseSTL, isValidSTL } from '@/utils/meshUtils';
import type { STLSource, BoundingBox } from '@/types/mold';
import type { Conversation } from '@shared/types';

interface STLSourcePickerProps {
  value: STLSource | null;
  onChange: (source: STLSource, boundingBox: BoundingBox) => void;
  disabled?: boolean;
}

export function STLSourcePicker({
  value,
  onChange,
  disabled = false,
}: STLSourcePickerProps) {
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch recent creations that have mesh attachments
  const { data: creationsWithMesh, isLoading: isLoadingCreations } = useQuery<
    Array<Conversation & { meshId: string; meshFilename: string }>
  >({
    queryKey: ['creations-with-mesh'],
    queryFn: async () => {
      let query = supabase
        .from('conversations')
        .select('*')
        .order('updated_at', { ascending: false });

      if (!isGodMode) {
        query = query.eq('user_id', user?.id ?? '');
      }

      const { data: conversations, error } = await query.limit(20);
      if (error) throw error;

      // For each conversation, check if it has a mesh in its messages
      const conversationsWithMeshInfo = await Promise.all(
        (conversations || []).map(async (conv) => {
          const { data: messages } = await supabase
            .from('messages')
            .select('content')
            .eq('conversation_id', conv.id)
            .eq('role', 'user')
            .limit(5);

          // Look for mesh data in message content
          for (const msg of messages || []) {
            const content = msg.content as {
              mesh?: { id: string };
              text?: string;
            };
            if (content?.mesh?.id) {
              return {
                ...conv,
                meshId: content.mesh.id,
                meshFilename: `mesh-${content.mesh.id}.stl`,
              };
            }
          }
          return null;
        }),
      );

      return conversationsWithMeshInfo.filter(Boolean) as Array<
        Conversation & { meshId: string; meshFilename: string }
      >;
    },
    enabled: !!user,
  });

  // Handle file upload
  const handleFileUpload = useCallback(
    async (file: File) => {
      if (!isValidSTL(file)) {
        toast({
          title: 'Invalid file',
          description: 'Please upload a valid STL file.',
          variant: 'destructive',
        });
        return;
      }

      setIsProcessing(true);
      try {
        const { boundingBox } = await parseSTL(file);
        const safeFilename =
          file.name
            .toLowerCase()
            .replace(/[^a-z0-9._-]/g, '_')
            .replace(/\.stl$/i, '') + '.stl';

        onChange({ type: 'upload', file, filename: safeFilename }, boundingBox);
      } catch (error) {
        console.error('Error parsing STL:', error);
        toast({
          title: 'Error processing STL',
          description:
            error instanceof Error ? error.message : 'Failed to parse STL file',
          variant: 'destructive',
        });
      } finally {
        setIsProcessing(false);
      }
    },
    [onChange],
  );

  // Handle selection from existing creation
  const handleCreationSelect = useCallback(
    async (conv: Conversation & { meshId: string; meshFilename: string }) => {
      setIsProcessing(true);
      try {
        // Download the STL from storage
        const storagePath = `${conv.user_id}/${conv.id}/mesh-${conv.meshId}.stl`;
        const { data: blob, error } = await supabase.storage
          .from('images')
          .download(storagePath);

        if (error) throw error;

        // Parse to get bounding box
        const file = new File([blob], conv.meshFilename, {
          type: 'model/stl',
        });
        const { boundingBox } = await parseSTL(file);

        onChange(
          {
            type: 'creation',
            conversationId: conv.id,
            meshId: conv.meshId,
            filename: conv.meshFilename,
          },
          boundingBox,
        );
      } catch (error) {
        console.error('Error loading mesh from creation:', error);
        toast({
          title: 'Error loading mesh',
          description: 'Failed to load the 3D model from this creation.',
          variant: 'destructive',
        });
      } finally {
        setIsProcessing(false);
      }
    },
    [onChange],
  );

  // Handle file input change
  const handleFileInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        handleFileUpload(file);
      }
      // Reset input so same file can be selected again
      event.target.value = '';
    },
    [handleFileUpload],
  );

  // Handle drag events
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragActive(false);

      const file = e.dataTransfer.files?.[0];
      if (file) {
        handleFileUpload(file);
      }
    },
    [handleFileUpload],
  );

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-adam-text-secondary">
        STL Source
      </label>

      {/* Selected source display */}
      {value && (
        <Card className="bg-adam-green/10 border-adam-green/30 p-3">
          <div className="flex items-center gap-2">
            <Check className="text-adam-green h-4 w-4" />
            <span className="truncate text-sm text-adam-text-primary">
              {value.filename}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto h-6 px-2 text-xs"
              onClick={() =>
                onChange(
                  null as unknown as STLSource,
                  null as unknown as BoundingBox,
                )
              }
              disabled={disabled}
            >
              Clear
            </Button>
          </div>
        </Card>
      )}

      {/* Source picker tabs */}
      {!value && (
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-adam-background-1">
            <TabsTrigger value="upload" className="text-xs">
              <Upload className="mr-1 h-3 w-3" />
              Upload
            </TabsTrigger>
            <TabsTrigger value="creations" className="text-xs">
              <FileBox className="mr-1 h-3 w-3" />
              My Creations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="mt-2">
            <div
              onClick={() =>
                !disabled && !isProcessing && fileInputRef.current?.click()
              }
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className={`cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors duration-200 ${isDragActive ? 'border-adam-blue bg-adam-blue/10' : 'border-adam-neutral-600 hover:border-adam-neutral-400'} ${disabled || isProcessing ? 'cursor-not-allowed opacity-50' : ''} `}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".stl"
                onChange={handleFileInputChange}
                className="hidden"
              />
              {isProcessing ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-8 w-8 animate-spin text-adam-blue" />
                  <p className="text-sm text-adam-text-secondary">
                    Processing STL...
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-8 w-8 text-adam-neutral-400" />
                  <p className="text-sm text-adam-text-secondary">
                    {isDragActive
                      ? 'Drop STL file here'
                      : 'Drag & drop STL file or click to browse'}
                  </p>
                  <p className="text-xs text-adam-neutral-500">
                    .stl files only
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="creations" className="mt-2">
            <div className="max-h-48 space-y-1 overflow-y-auto">
              {isLoadingCreations ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-adam-neutral-400" />
                </div>
              ) : creationsWithMesh && creationsWithMesh.length > 0 ? (
                creationsWithMesh.map((conv) => (
                  <Card
                    key={conv.id}
                    className={`cursor-pointer border-adam-neutral-700 bg-adam-background-1 p-2 transition-colors hover:bg-adam-neutral-800 ${isProcessing ? 'pointer-events-none opacity-50' : ''} `}
                    onClick={() => handleCreationSelect(conv)}
                  >
                    <div className="flex items-center gap-2">
                      <FileBox className="h-4 w-4 flex-shrink-0 text-adam-neutral-400" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm text-adam-text-primary">
                          {conv.title || 'Untitled'}
                        </p>
                        <p className="truncate text-xs text-adam-neutral-500">
                          {conv.meshFilename}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="py-8 text-center">
                  <p className="text-sm text-adam-neutral-500">
                    No creations with 3D models found
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
