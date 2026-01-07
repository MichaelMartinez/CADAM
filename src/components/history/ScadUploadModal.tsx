import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useOpenSCAD } from '@/hooks/useOpenSCAD';
import { ThreeScene } from '@/components/viewer/ThreeScene';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import { BufferGeometry } from 'three';
import { Loader2, UploadCloud } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';

interface ScadUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateConversation: (code: string, title: string) => void;
  onSaveDraft: (code: string, title: string) => void;
}

export function ScadUploadModal({
  open,
  onOpenChange,
  onCreateConversation,
  onSaveDraft,
}: ScadUploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [code, setCode] = useState('');
  const { compileScad, output, isCompiling, error, isError } = useOpenSCAD();
  const [geometry, setGeometry] = useState<BufferGeometry | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setCode(content);
        compileScad(content);
      };
      reader.readAsText(file);
    } else {
      setCode('');
      setGeometry(null);
    }
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleCreate = () => {
    if (file) {
      onCreateConversation(code, file.name);
      onOpenChange(false);
    }
  };

  const handleSave = () => {
    if (file) {
      onSaveDraft(code, file.name);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-4/5 max-w-4xl flex-col">
        <DialogHeader>
          <DialogTitle>Upload .scad File</DialogTitle>
        </DialogHeader>
        <div className="grid flex-1 grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <h3 className="text-lg">Code</h3>
            {file ? (
              <Textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="h-full w-full resize-none bg-adam-bg-dark font-mono"
              />
            ) : (
              <div
                className="flex h-full cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-gray-500"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="text-center">
                  <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                  <p>Click to browse or drag and drop a .scad file</p>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".scad"
                  className="hidden"
                />
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-lg">Preview</h3>
            <div className="h-full w-full rounded-md bg-adam-neutral-700">
              {isCompiling && !geometry && (
                <div className="flex h-full w-full items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              )}
              {geometry && (
                <ThreeScene geometry={geometry} showControls={false} />
              )}
              {isError && <div className="text-red-500">{error?.message}</div>}
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            onClick={() => file && compileScad(code)}
            disabled={isCompiling || !file}
          >
            Re-compile
          </Button>
          <Button onClick={handleSave} disabled={!file} variant="secondary">
            Save Draft
          </Button>
          <Button onClick={handleCreate} disabled={!file}>
            Create Conversation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
