import { useOpenSCAD } from '@/hooks/useOpenSCAD';
import { useEffect, useState } from 'react';
import { ThreeScene } from '@/components/viewer/ThreeScene';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import { BufferGeometry } from 'three';
import { Loader2 } from 'lucide-react';

interface ModelViewerProps {
  scadCode: string;
}

export function ModelViewer({ scadCode }: ModelViewerProps) {
  const { compileScad, output, isCompiling } = useOpenSCAD();
  const [geometry, setGeometry] = useState<BufferGeometry | null>(null);

  useEffect(() => {
    if (scadCode) {
      compileScad(scadCode);
    }
  }, [scadCode, compileScad]);

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

  return (
    <div className="h-48 w-full">
      {isCompiling && !geometry && (
        <div className="flex h-full w-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}
      {geometry && <ThreeScene geometry={geometry} showControls={false} />}
    </div>
  );
}
