import { useState, useMemo } from 'react';
import {
  CircleAlert,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Wrench,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import OpenSCADError from '@/lib/OpenSCADError';

type ParsedError = {
  severity: 'error' | 'warning';
  message: string;
  line?: number;
  file?: string;
  rawLine: string;
};

interface OpenSCADErrorDisplayProps {
  error: OpenSCADError | Error;
  onFixWithAI?: () => void;
}

// Parse OpenSCAD error messages for structured display
function parseOpenSCADErrors(stdErr: string[]): ParsedError[] {
  const parsed: ParsedError[] = [];

  for (const line of stdErr) {
    // Match ERROR: or WARNING: patterns
    // Examples:
    // ERROR: Parser error in line 10: syntax error
    // WARNING: Deprecated syntax in line 5
    // ERROR: Undefined variable 'foo' at line 15
    const errorMatch = line.match(
      /ERROR:\s*(.+?)(?:(?:\s+in\s+line\s+|,\s*line\s+|at\s+line\s+)(\d+))?(?::\s*(.+))?$/i,
    );
    const warningMatch = line.match(
      /WARNING:\s*(.+?)(?:(?:\s+in\s+line\s+|,\s*line\s+|at\s+line\s+)(\d+))?(?::\s*(.+))?$/i,
    );

    if (errorMatch) {
      parsed.push({
        severity: 'error',
        message: errorMatch[3] || errorMatch[1],
        line: errorMatch[2] ? parseInt(errorMatch[2]) : undefined,
        rawLine: line,
      });
    } else if (warningMatch) {
      parsed.push({
        severity: 'warning',
        message: warningMatch[3] || warningMatch[1],
        line: warningMatch[2] ? parseInt(warningMatch[2]) : undefined,
        rawLine: line,
      });
    }
  }

  return parsed;
}

export function OpenSCADErrorDisplay({
  error,
  onFixWithAI,
}: OpenSCADErrorDisplayProps) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const isOpenSCADError = error.name === 'OpenSCADError';
  const stdErr = isOpenSCADError ? (error as OpenSCADError).stdErr : [];

  const parsedErrors = useMemo(() => parseOpenSCADErrors(stdErr), [stdErr]);

  const handleCopy = async () => {
    const errorText = isOpenSCADError
      ? [
          '=== OpenSCAD Compilation Error ===',
          '',
          ...stdErr,
          '',
          '=== Code ===',
          (error as OpenSCADError).code,
        ].join('\n')
      : error.message;

    await navigator.clipboard.writeText(errorText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-6">
      {/* Error header */}
      <div className="flex flex-col items-center gap-3">
        <div className="relative">
          <div className="absolute inset-0 animate-ping rounded-full bg-red-500/20" />
          <CircleAlert className="h-8 w-8 text-red-500" />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-red-500">Compilation Error</p>
          <p className="mt-1 text-xs text-adam-text-primary/60">
            Adam encountered an error while compiling
          </p>
        </div>
      </div>

      {/* Parsed errors */}
      {parsedErrors.length > 0 && (
        <div className="w-full max-w-lg space-y-2">
          {parsedErrors.slice(0, 5).map((err, idx) => (
            <div
              key={idx}
              className={cn(
                'rounded-lg border p-3',
                err.severity === 'error'
                  ? 'border-red-500/30 bg-red-500/10'
                  : 'border-amber-500/30 bg-amber-500/10',
              )}
            >
              <div className="flex items-start gap-2">
                <span
                  className={cn(
                    'rounded px-1.5 py-0.5 text-xs font-semibold uppercase',
                    err.severity === 'error'
                      ? 'bg-red-500 text-white'
                      : 'bg-amber-500 text-black',
                  )}
                >
                  {err.severity}
                </span>
                {err.line && (
                  <span className="text-xs text-adam-text-primary/60">
                    Line {err.line}
                  </span>
                )}
              </div>
              <p className="mt-2 font-mono text-sm text-adam-text-primary">
                {err.message}
              </p>
            </div>
          ))}
          {parsedErrors.length > 5 && (
            <p className="text-center text-xs text-adam-text-primary/60">
              +{parsedErrors.length - 5} more errors
            </p>
          )}
        </div>
      )}

      {/* Fallback for non-parsed errors */}
      {parsedErrors.length === 0 && (
        <div className="w-full max-w-lg rounded-lg border border-red-500/30 bg-red-500/10 p-3">
          <p className="font-mono text-sm text-adam-text-primary">
            {error.message}
          </p>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-wrap justify-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          className="gap-2 border-adam-neutral-700"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              Copy Error
            </>
          )}
        </Button>

        {onFixWithAI && (
          <Button
            onClick={onFixWithAI}
            className={cn(
              'gap-2 bg-gradient-to-br from-adam-blue/20 to-adam-neutral-800/70',
              'border border-adam-blue/30',
              'transition-all duration-300',
              'hover:border-adam-blue/70 hover:bg-adam-blue/50',
            )}
          >
            <Wrench className="h-4 w-4" />
            Fix with AI
          </Button>
        )}
      </div>

      {/* Expandable full output */}
      {isOpenSCADError && stdErr.length > 0 && (
        <div className="w-full max-w-2xl rounded-lg border border-adam-neutral-700 bg-adam-neutral-950/50">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex w-full items-center justify-between p-3 text-left hover:bg-adam-neutral-900/50"
          >
            <span className="text-sm font-medium text-adam-text-primary">
              Full Compiler Output
            </span>
            {expanded ? (
              <ChevronUp className="h-4 w-4 text-adam-text-primary/60" />
            ) : (
              <ChevronDown className="h-4 w-4 text-adam-text-primary/60" />
            )}
          </button>

          {expanded && (
            <div className="max-h-64 overflow-y-auto border-t border-adam-neutral-700 p-3">
              <pre className="whitespace-pre-wrap break-all font-mono text-xs text-red-400/80">
                {stdErr.join('\n')}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Helpful tips */}
      <div className="w-full max-w-lg rounded-lg border border-adam-neutral-700 bg-adam-neutral-900/30 p-3">
        <h4 className="mb-2 text-sm font-semibold text-adam-text-primary">
          Common Solutions
        </h4>
        <ul className="space-y-1 text-xs text-adam-text-primary/70">
          <li>Check for missing semicolons or brackets</li>
          <li>Verify variable names and module calls</li>
          <li>Ensure library imports are correct</li>
          <li>Review parameter types and values</li>
        </ul>
      </div>
    </div>
  );
}
