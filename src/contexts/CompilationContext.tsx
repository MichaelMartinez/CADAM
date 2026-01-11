import { createContext, useContext, useState, useCallback } from 'react';
import { CompilationEvent } from '@shared/types';

type CompilationContextType = {
  compilationEvents: CompilationEvent[];
  isCompiling: boolean;
  setCompilationEvents: (events: CompilationEvent[]) => void;
  setIsCompiling: (isCompiling: boolean) => void;
  addCompilationEvent: (event: CompilationEvent) => void;
  clearCompilationEvents: () => void;
};

export const CompilationContext = createContext<CompilationContextType>({
  compilationEvents: [],
  isCompiling: false,
  setCompilationEvents: () => {},
  setIsCompiling: () => {},
  addCompilationEvent: () => {},
  clearCompilationEvents: () => {},
});

export function CompilationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [compilationEvents, setCompilationEvents] = useState<
    CompilationEvent[]
  >([]);
  const [isCompiling, setIsCompiling] = useState(false);

  const addCompilationEvent = useCallback((event: CompilationEvent) => {
    setCompilationEvents((prev) => [...prev, event]);
  }, []);

  const clearCompilationEvents = useCallback(() => {
    setCompilationEvents([]);
  }, []);

  return (
    <CompilationContext.Provider
      value={{
        compilationEvents,
        isCompiling,
        setCompilationEvents,
        setIsCompiling,
        addCompilationEvent,
        clearCompilationEvents,
      }}
    >
      {children}
    </CompilationContext.Provider>
  );
}

export const useCompilation = () => {
  const context = useContext(CompilationContext);
  if (!context) {
    throw new Error('useCompilation must be used within a CompilationProvider');
  }
  return context;
};
