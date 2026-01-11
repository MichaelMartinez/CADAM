import { useEffect, useRef } from 'react';
import { CompilationEvent } from '@shared/types';
import { Loader2, Download, Check, AlertCircle, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CompilationProgressProps {
  events: CompilationEvent[];
  isCompiling: boolean;
}

export function CompilationProgress({
  events,
  isCompiling,
}: CompilationProgressProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new events arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [events]);

  if (events.length === 0 && !isCompiling) return null;

  // Get the latest status for display
  const lastEvent = events[events.length - 1];
  const isComplete = lastEvent?.type === 'compilation.complete';
  const isError = lastEvent?.type === 'compilation.error';

  // Filter for console output (stdout/stderr)
  const consoleEvents = events.filter(
    (e) => e.type === 'compilation.stdout' || e.type === 'compilation.stderr',
  );

  return (
    <div className="mt-2 space-y-2 rounded-md border border-adam-neutral-700 bg-adam-neutral-900/50 p-3">
      {/* Status header */}
      <div className="flex items-center gap-2">
        {isCompiling && !isComplete && !isError ? (
          <Loader2 className="h-4 w-4 animate-spin text-adam-blue" />
        ) : isComplete ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : isError ? (
          <AlertCircle className="h-4 w-4 text-red-500" />
        ) : (
          <Play className="h-4 w-4 text-adam-blue" />
        )}
        <span
          className={cn(
            'text-sm font-medium',
            isComplete && 'text-green-500',
            isError && 'text-red-500',
            !isComplete && !isError && 'text-adam-text-primary',
          )}
        >
          {getStatusMessage(lastEvent, isCompiling)}
        </span>
      </div>

      {/* Event list */}
      <div className="space-y-1">
        {events
          .filter(
            (e) =>
              e.type !== 'compilation.stdout' &&
              e.type !== 'compilation.stderr',
          )
          .map((event, idx) => (
            <CompilationEventRow key={idx} event={event} />
          ))}
      </div>

      {/* Console output */}
      {consoleEvents.length > 0 && (
        <div
          ref={scrollRef}
          className="max-h-32 overflow-y-auto rounded bg-adam-neutral-950 p-2 font-mono text-xs"
        >
          {consoleEvents.map((event, idx) => (
            <div
              key={idx}
              className={cn(
                'whitespace-pre-wrap break-all',
                event.type === 'compilation.stderr'
                  ? 'text-amber-400/80'
                  : 'text-adam-text-primary/60',
              )}
            >
              {event.message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function getStatusMessage(
  event: CompilationEvent | undefined,
  isCompiling: boolean,
): string {
  if (!event) {
    return isCompiling ? 'Starting compilation...' : 'Ready';
  }

  switch (event.type) {
    case 'compilation.started':
      return 'Starting compilation...';
    case 'library.loading':
      return `Loading ${event.library}...`;
    case 'library.loaded':
      return `Loaded ${event.library}`;
    case 'compilation.rendering':
      return 'Rendering geometry...';
    case 'compilation.complete':
      return event.duration
        ? `Compiled in ${event.duration}ms`
        : 'Compilation complete';
    case 'compilation.error':
      return 'Compilation failed';
    default:
      return isCompiling ? 'Compiling...' : 'Ready';
  }
}

function CompilationEventRow({ event }: { event: CompilationEvent }) {
  const getIcon = () => {
    switch (event.type) {
      case 'compilation.started':
        return <Play className="h-3 w-3 text-adam-blue" />;
      case 'library.loading':
        return <Download className="h-3 w-3 animate-pulse text-adam-blue/60" />;
      case 'library.loaded':
        return <Check className="h-3 w-3 text-green-500/60" />;
      case 'compilation.rendering':
        return <Loader2 className="h-3 w-3 animate-spin text-adam-blue/60" />;
      case 'compilation.complete':
        return <Check className="h-3 w-3 text-green-500" />;
      case 'compilation.error':
        return <AlertCircle className="h-3 w-3 text-red-500" />;
      default:
        return null;
    }
  };

  // Skip stdout/stderr events (they're shown in the console section)
  if (
    event.type === 'compilation.stdout' ||
    event.type === 'compilation.stderr'
  ) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 text-xs text-adam-text-primary/70">
      {getIcon()}
      <span>{event.message}</span>
    </div>
  );
}
