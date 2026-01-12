import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from 'react';
import type { MappedPrimitive, HighlightState } from '@/types/sourceMapping';
import {
  analyzeOpenSCADCode,
  findBestMatchingPrimitive,
  findPrimitiveByLine,
} from '@/services/astService';

type SourceMappingContextType = {
  primitives: MappedPrimitive[];
  highlight: HighlightState;
  highlightFromViewer: (
    faceIndex: number,
    worldPosition: [number, number, number],
    normal: [number, number, number],
    faceVertices: [number, number, number][],
  ) => void;
  highlightFromCode: (lineNumber: number) => void;
  clearHighlight: () => void;
  parseCode: (code: string) => void;
  parsingErrors: string[];
};

export const SourceMappingContext = createContext<SourceMappingContextType>({
  primitives: [],
  highlight: {},
  highlightFromViewer: () => {},
  highlightFromCode: () => {},
  clearHighlight: () => {},
  parseCode: () => {},
  parsingErrors: [],
});

export function SourceMappingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [primitives, setPrimitives] = useState<MappedPrimitive[]>([]);
  const [highlight, setHighlight] = useState<HighlightState>({});
  const [parsingErrors, setParsingErrors] = useState<string[]>([]);

  const parseCode = useCallback((code: string) => {
    const result = analyzeOpenSCADCode(code);
    setPrimitives(result.primitives);
    setParsingErrors(result.errors);
  }, []);

  const highlightFromViewer = useCallback(
    (
      faceIndex: number,
      worldPosition: [number, number, number],
      normal: [number, number, number],
      faceVertices: [number, number, number][],
    ) => {
      const matched = findBestMatchingPrimitive(
        worldPosition,
        normal,
        faceVertices,
        primitives,
      );

      setHighlight({
        fromViewer: {
          faceIndex,
          worldPosition,
          primitiveId: matched?.id,
        },
        highlightedPrimitive: matched || undefined,
      });
    },
    [primitives],
  );

  const highlightFromCode = useCallback(
    (lineNumber: number) => {
      const matched = findPrimitiveByLine(lineNumber, primitives);

      setHighlight({
        fromCode: {
          lineNumber,
          primitiveId: matched?.id,
        },
        highlightedPrimitive: matched || undefined,
      });
    },
    [primitives],
  );

  const clearHighlight = useCallback(() => {
    setHighlight({});
  }, []);

  const value = useMemo(
    () => ({
      primitives,
      highlight,
      highlightFromViewer,
      highlightFromCode,
      clearHighlight,
      parseCode,
      parsingErrors,
    }),
    [
      primitives,
      highlight,
      highlightFromViewer,
      highlightFromCode,
      clearHighlight,
      parseCode,
      parsingErrors,
    ],
  );

  return (
    <SourceMappingContext.Provider value={value}>
      {children}
    </SourceMappingContext.Provider>
  );
}

export const useSourceMapping = () => {
  const context = useContext(SourceMappingContext);
  if (!context) {
    throw new Error(
      'useSourceMapping must be used within a SourceMappingProvider',
    );
  }
  return context;
};
