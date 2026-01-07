import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { useOpenSCAD } from '@/hooks/useOpenSCAD';
import { ThreeScene } from './viewer/ThreeScene';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import { BufferGeometry } from 'three';
import { Loader2 } from 'lucide-react';

interface ScadUploadViewProps {
  file: File;
  onCancel: () => void;
  onCreateConversation: (code: string, title: string) => void;
}

export function ScadUploadView({
  file,
  onCancel,
  onCreateConversation,
}: ScadUploadViewProps) {
  const [code, setCode] = useState('');
  const { compileScad, output, isCompiling, error, isError } = useOpenSCAD();
  const [geometry, setGeometry] = useState<BufferGeometry | null>(null);

  useEffect(() => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setCode(content);
      compileScad(content);
    };
    reader.readAsText(file);
  }, [file, compileScad]);

  useEffect(() => {
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
  }, [output]);

  const handleCreate = () => {
    onCreateConversation(code, file.name);
  };

  return (
    <div className="flex h-full w-full flex-col gap-4 rounded-xl bg-adam-bg-secondary-dark p-4 text-white shadow-[0_0_15px_rgba(0,0,0,0.1)]">
      <h2 className="text-2xl font-medium">SCAD File Uploaded: {file.name}</h2>
      <div className="flex flex-1 gap-4">
        <div className="flex w-1/2 flex-col gap-2">
          <h3 className="text-lg">Code</h3>
          <Textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="h-full w-full resize-none bg-adam-bg-dark font-mono"
          />
        </div>
        <div className="flex w-1/2 flex-col gap-2">
          <h3 className="text-lg">Preview</h3>
          <div className="h-full w-full rounded-md bg-adam-neutral-700">
            {isCompiling && !geometry && (
              <div className="flex h-full w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            )}
            {geometry && <ThreeScene geometry={geometry} />}
            {isError && <div className="text-red-500">{error?.message}</div>}
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={() => compileScad(code)} disabled={isCompiling}>
          Re-compile
        </Button>
        <Button onClick={handleCreate}>Create Conversation</Button>
      </div>
    </div>
  );
}
