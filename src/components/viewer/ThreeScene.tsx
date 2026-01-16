import { Canvas, ThreeEvent } from '@react-three/fiber';
import {
  OrbitControls,
  GizmoHelper,
  GizmoViewcube,
  Stage,
  Environment,
  OrthographicCamera,
  PerspectiveCamera,
} from '@react-three/drei';
import * as THREE from 'three';
import { useState, useCallback, useRef, useMemo } from 'react';
import { OrthographicPerspectiveToggle } from '@/components/viewer/OrthographicPerspectiveToggle';
import { useColor } from '@/contexts/ColorContext';
import { useSourceMapping } from '@/contexts/SourceMappingContext';

// Separate mesh component to handle click events
function PickableMesh({
  geometry,
  color,
  isHighlighted,
  onFaceClick,
}: {
  geometry: THREE.BufferGeometry;
  color: string;
  isHighlighted: boolean;
  onFaceClick: (event: ThreeEvent<PointerEvent>) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  // Use highlight color when a primitive is selected
  const displayColor = isHighlighted ? '#FFD700' : color;

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0, 0]}
      onClick={onFaceClick}
    >
      <meshStandardMaterial
        color={displayColor}
        metalness={0.6}
        roughness={0.3}
        envMapIntensity={0.3}
      />
    </mesh>
  );
}

export function ThreeScene({ geometry }: { geometry: THREE.BufferGeometry }) {
  const { color } = useColor();
  const { highlight, highlightFromViewer, clearHighlight } = useSourceMapping();
  const [isOrthographic, setIsOrthographic] = useState(true);

  // Check if there's an active highlight
  const isHighlighted = useMemo(() => {
    return !!highlight.highlightedPrimitive;
  }, [highlight.highlightedPrimitive]);

  const handleFaceClick = useCallback(
    (event: ThreeEvent<PointerEvent>) => {
      // Stop propagation to prevent OrbitControls from receiving the event
      event.stopPropagation();

      if (!event.intersections.length) {
        clearHighlight();
        return;
      }

      const intersection = event.intersections[0];
      const faceIndex = intersection.faceIndex;

      if (faceIndex === undefined) {
        clearHighlight();
        return;
      }

      // Get face normal (in world space)
      const normal = intersection.face?.normal;
      if (!normal) {
        clearHighlight();
        return;
      }

      // Transform normal to world space
      const worldNormal = normal.clone();
      if (intersection.object.matrixWorld) {
        const normalMatrix = new THREE.Matrix3().getNormalMatrix(
          intersection.object.matrixWorld,
        );
        worldNormal.applyMatrix3(normalMatrix).normalize();
      }

      // Get world position of click
      const worldPosition = intersection.point.clone();

      // Get face vertices from geometry
      const positions = geometry.getAttribute('position');
      const indices = geometry.index;

      let v0: [number, number, number],
        v1: [number, number, number],
        v2: [number, number, number];

      if (indices) {
        const i0 = indices.getX(faceIndex * 3);
        const i1 = indices.getX(faceIndex * 3 + 1);
        const i2 = indices.getX(faceIndex * 3 + 2);
        v0 = [positions.getX(i0), positions.getY(i0), positions.getZ(i0)];
        v1 = [positions.getX(i1), positions.getY(i1), positions.getZ(i1)];
        v2 = [positions.getX(i2), positions.getY(i2), positions.getZ(i2)];
      } else {
        const baseIndex = faceIndex * 3;
        v0 = [
          positions.getX(baseIndex),
          positions.getY(baseIndex),
          positions.getZ(baseIndex),
        ];
        v1 = [
          positions.getX(baseIndex + 1),
          positions.getY(baseIndex + 1),
          positions.getZ(baseIndex + 1),
        ];
        v2 = [
          positions.getX(baseIndex + 2),
          positions.getY(baseIndex + 2),
          positions.getZ(baseIndex + 2),
        ];
      }

      // Apply mesh rotation to get world coordinates
      // The mesh is rotated -90 degrees around X axis
      const rotateVertex = (
        v: [number, number, number],
      ): [number, number, number] => {
        // Rotate around X: y' = z, z' = -y
        return [v[0], v[2], -v[1]];
      };

      const worldV0 = rotateVertex(v0);
      const worldV1 = rotateVertex(v1);
      const worldV2 = rotateVertex(v2);

      highlightFromViewer(
        faceIndex,
        [worldPosition.x, worldPosition.y, worldPosition.z],
        [worldNormal.x, worldNormal.y, worldNormal.z],
        [worldV0, worldV1, worldV2],
      );
    },
    [geometry, highlightFromViewer, clearHighlight],
  );

  // Handle clicks on empty space to clear highlight
  const handleMissedClick = useCallback(() => {
    clearHighlight();
  }, [clearHighlight]);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <Canvas
        className="block h-full w-full"
        onPointerMissed={handleMissedClick}
        gl={{ preserveDrawingBuffer: true }}
      >
        <color attach="background" args={['#3B3B3B']} />
        {isOrthographic ? (
          <OrthographicCamera
            makeDefault
            position={[-100, 100, 100]}
            zoom={40}
            near={0.1}
            far={1000}
          />
        ) : (
          <PerspectiveCamera
            makeDefault
            position={[-100, 100, 100]}
            fov={45}
            near={0.1}
            far={1000}
            zoom={0.4}
          />
        )}
        <Stage environment={null} intensity={0.6} position={[0, 0, 0]}>
          <Environment files={`${import.meta.env.BASE_URL}/city.hdr`} />
          <ambientLight intensity={0.8} />
          <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />
          <directionalLight position={[-5, 5, 5]} intensity={0.2} />
          <directionalLight position={[-5, 5, -5]} intensity={0.2} />
          <directionalLight position={[0, 5, 0]} intensity={0.2} />
          <directionalLight position={[-5, -5, -5]} intensity={0.6} />
          <PickableMesh
            geometry={geometry}
            color={color}
            isHighlighted={isHighlighted}
            onFaceClick={handleFaceClick}
          />
        </Stage>
        <OrbitControls makeDefault enableDamping={true} dampingFactor={0.05} />
        <GizmoHelper alignment="bottom-right" margin={[80, 90]}>
          <GizmoViewcube />
        </GizmoHelper>
      </Canvas>

      <div className="absolute bottom-2 right-9 flex flex-col items-center">
        <div className="flex items-center gap-2">
          <OrthographicPerspectiveToggle
            isOrthographic={isOrthographic}
            onToggle={setIsOrthographic}
          />
        </div>
      </div>
    </div>
  );
}
