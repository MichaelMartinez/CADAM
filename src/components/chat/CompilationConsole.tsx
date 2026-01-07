import { useRef, useEffect } from 'react';
import { CompilationEvent, CompilationEventType } from '@/worker/types';
import { cn } from '@/lib/utils';

interface CompilationConsoleProps {
  events: CompilationEvent[];
}

export function CompilationConsole({ events }: CompilationConsoleProps) {
  const consoleRef = useRef<HTMLDivElement>(null);

  const consoleLines = events.filter(
    (e) =>
      e.type === CompilationEventType.STDOUT ||
      e.type === CompilationEventType.STDERR,
  );

  // Auto-scroll to bottom
  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [consoleLines]);

  if (consoleLines.length === 0) return null;

  return (
    <div
      ref={consoleRef}
      className="max-h-32 overflow-y-auto rounded-md bg-adam-neutral-950/50 p-2 font-mono text-xs"
    >
      {consoleLines.map((event, i) => (
        <div
          key={i}
          className={cn(
            'whitespace-pre-wrap',
            event.data?.isError ? 'text-red-400' : 'text-green-400/70',
          )}
        >
          {event.data?.line}
        </div>
      ))}
    </div>
  );
}
