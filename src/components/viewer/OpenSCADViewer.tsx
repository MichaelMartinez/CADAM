import { useOpenSCAD } from '@/hooks/useOpenSCAD';
import { useCallback, useEffect, useState, useRef } from 'react';
import { ThreeScene } from '@/components/viewer/ThreeScene';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import { BufferGeometry } from 'three';
import OpenSCADError from '@/lib/OpenSCADError';
import { useConversation } from '@/services/conversationService';
import { useCurrentMessage } from '@/contexts/CurrentMessageContext';
import { Content } from '@shared/types';
import { useSendContentMutation } from '@/services/messageService';
import { useBlob } from '@/contexts/BlobContext';
import { useMeshFiles } from '@/contexts/MeshFilesContext';
import { OpenSCADErrorDisplay } from '@/components/viewer/OpenSCADErrorDisplay';

// Extract import() filenames from OpenSCAD code
function extractImportFilenames(code: string): string[] {
  const importRegex = /import\s*\(\s*"([^"]+)"\s*\)/g;
  const filenames: string[] = [];
  let match;
  while ((match = importRegex.exec(code)) !== null) {
    filenames.push(match[1]);
  }
  return filenames;
}

export function OpenSCADViewer() {
  const { conversation } = useConversation();
  const { currentMessage } = useCurrentMessage();
  const { setBlob } = useBlob();
  const { compileScad, writeFile, output, isError, error } = useOpenSCAD();
  const { getMeshFile, hasMeshFile } = useMeshFiles();
  const [geometry, setGeometry] = useState<BufferGeometry | null>(null);
  const { mutate: sendMessage } = useSendContentMutation({ conversation });
  // Track which files (and their versions) we've written to avoid re-writing
  // Maps filename -> Blob instance
  const writtenFilesRef = useRef<Map<string, Blob>>(new Map());

  const scadCode = currentMessage?.content.artifact?.code;

  useEffect(() => {
    if (!scadCode) return;

    const compileWithMeshFiles = async () => {
      try {
        // Extract any import() filenames from the code
        const importedFiles = extractImportFilenames(scadCode);

        // Write any mesh files that haven't been written yet
        for (const filename of importedFiles) {
          const inContext = hasMeshFile(filename);
          const meshContent = getMeshFile(filename);

          // Check if we need to write:
          // 1. File exists in context
          // 2. We haven't written it OR the content has changed (new Blob reference)
          const writtenBlob = writtenFilesRef.current.get(filename);
          const needsWrite =
            inContext &&
            meshContent &&
            (!writtenBlob || writtenBlob !== meshContent);

          if (needsWrite && meshContent) {
            await writeFile(filename, meshContent);
            writtenFilesRef.current.set(filename, meshContent);
          }
        }

        // Now compile the code
        compileScad(scadCode);
      } catch (err) {
        console.error('[OpenSCAD] Error preparing files for compilation:', err);
      }
    };

    compileWithMeshFiles();
  }, [scadCode, compileScad, writeFile, getMeshFile, hasMeshFile]);

  useEffect(() => {
    setBlob(output ?? null);
    if (output && output instanceof Blob) {
      output.arrayBuffer().then((buffer) => {
        const loader = new STLLoader();
        const geom = loader.parse(buffer);
        geom.center();
        geom.computeVertexNormals();
        setGeometry(geom);
      });
    } else {
      setGeometry(null);
    }
  }, [output, setBlob]);

  const fixError = useCallback(
    async (error: OpenSCADError) => {
      const newContent: Content = {
        text: 'Fix with AI',
        error: error.stdErr.join('\n'),
      };

      sendMessage(newContent);
    },
    [sendMessage],
  );

  const isLastMessage =
    conversation.current_message_leaf_id === currentMessage?.id;

  return (
    <div className="h-full w-full bg-adam-neutral-700/50 shadow-lg backdrop-blur-sm transition-all duration-300 ease-in-out">
      <div className="h-full w-full">
        {geometry ? (
          <div className="h-full w-full">
            <ThreeScene geometry={geometry} />
          </div>
        ) : (
          <>
            {isError && error && error.name === 'OpenSCADError' && (
              <OpenSCADErrorDisplay
                error={error as OpenSCADError}
                onFixWithAI={
                  isLastMessage
                    ? () => fixError(error as OpenSCADError)
                    : undefined
                }
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
