import { CompilationEvent, CompilationEventType } from '@/worker/types';
import { Loader2 } from 'lucide-react';
import { CompilationConsole } from './CompilationConsole';

interface CompilationProgressProps {
  events: CompilationEvent[];
}

export function CompilationProgress({ events }: CompilationProgressProps) {
  const lastEvent = events[events.length - 1];
  const librariesLoading = events.filter(
    (e) => e.type === CompilationEventType.LIBRARY_LOADING,
  ).length;
  const librariesLoaded = events.filter(
    (e) => e.type === CompilationEventType.LIBRARY_LOADED,
  ).length;

  return (
    <div className="flex w-full flex-col gap-2 p-3">
      <div className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin text-adam-blue" />
        <span className="text-sm font-medium text-adam-text-primary">
          {getStatusMessage(lastEvent)}
        </span>
      </div>

      {/* Progress indicators */}
      {librariesLoading > 0 && (
        <div className="text-xs text-adam-text-primary/70">
          Loading libraries: {librariesLoaded}/{librariesLoading}
        </div>
      )}

      {/* Live console output */}
      <CompilationConsole events={events} />
    </div>
  );
}

function getStatusMessage(event?: CompilationEvent): string {
  switch (event?.type) {
    case CompilationEventType.STARTED:
      return 'Starting compilation...';
    case CompilationEventType.PARSING:
      return 'Parsing OpenSCAD code...';
    case CompilationEventType.LIBRARY_LOADING:
      return `Loading ${event.data?.library}...`;
    case CompilationEventType.LIBRARY_LOADED:
      return `Loaded ${event.data?.library}`;
    case CompilationEventType.RENDERING:
      return 'Rendering geometry...';
    case CompilationEventType.EXPORTING:
      return 'Exporting model...';
    case CompilationEventType.COMPLETED:
      return 'Compilation completed!';
    default:
      return 'Compiling...';
  }
}
