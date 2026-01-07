import { useState } from 'react';
import { Copy, Check, ChevronDown, ChevronUp, Wrench } from 'lucide-react';
import OpenSCADError from '@/lib/OpenSCADError';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface OpenSCADErrorDisplayProps {
  error: OpenSCADError;
  onFixWithAI?: () => void;
}

export function OpenSCADErrorDisplay({
  error,
  onFixWithAI,
}: OpenSCADErrorDisplayProps) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(error.toFormattedString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto p-6">
      {/* Error Summary */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-adam-blue">
            Compilation Error
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="gap-2"
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
        </div>

        {/* Parsed Errors */}
        {error.parsedErrors && error.parsedErrors.length > 0 && (
          <div className="space-y-2">
            {error.parsedErrors.slice(0, 3).map((err, i) => (
              <div
                key={i}
                className={cn(
                  'rounded-lg border p-3',
                  err.type === 'error'
                    ? 'border-red-500/30 bg-red-500/10'
                    : 'border-yellow-500/30 bg-yellow-500/10',
                )}
              >
                <div className="flex items-start gap-2">
                  <span
                    className={cn(
                      'rounded px-1.5 py-0.5 text-xs font-semibold',
                      err.type === 'error'
                        ? 'bg-red-500 text-white'
                        : 'bg-yellow-500 text-black',
                    )}
                  >
                    {err.type.toUpperCase()}
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
          </div>
        )}

        {/* Expandable Full Output */}
        <div className="rounded-lg border border-adam-neutral-700 bg-adam-neutral-950/50">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex w-full items-center justify-between p-3 text-left hover:bg-adam-neutral-900/50"
          >
            <span className="text-sm font-medium text-adam-text-primary">
              Full Compiler Output
            </span>
            {expanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>

          {expanded && (
            <div className="max-h-96 overflow-y-auto border-t border-adam-neutral-700 p-3">
              <div className="space-y-2 font-mono text-xs">
                {error.stdErr && error.stdErr.length > 0 && (
                  <div>
                    <div className="mb-1 font-semibold text-red-400">
                      STDERR:
                    </div>
                    {error.stdErr.map((line, i) => (
                      <div
                        key={i}
                        className="whitespace-pre-wrap text-red-400/80"
                      >
                        {line}
                      </div>
                    ))}
                  </div>
                )}

                {error.stdOut && error.stdOut.length > 0 && (
                  <div className="mt-3">
                    <div className="mb-1 font-semibold text-green-400">
                      STDOUT:
                    </div>
                    {error.stdOut.map((line, i) => (
                      <div
                        key={i}
                        className="whitespace-pre-wrap text-green-400/70"
                      >
                        {line}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fix with AI Button */}
      {onFixWithAI && (
        <Button
          onClick={onFixWithAI}
          className={cn(
            'w-full gap-2 border border-adam-blue/30 bg-gradient-to-br from-adam-blue/20 to-adam-neutral-800/70',
            'hover:border-adam-blue/70 hover:bg-adam-blue/50',
          )}
        >
          <Wrench className="h-4 w-4" />
          Fix with AI
        </Button>
      )}

      {/* Helpful Tips */}
      <div className="rounded-lg border border-adam-neutral-700 bg-adam-neutral-900/30 p-3">
        <h4 className="mb-2 text-sm font-semibold text-adam-text-primary">
          💡 Common Solutions
        </h4>
        <ul className="space-y-1 text-xs text-adam-text-primary/70">
          <li>• Check for missing semicolons or brackets</li>
          <li>• Verify variable names and module calls</li>
          <li>• Ensure library imports are correct</li>
          <li>• Review parameter types and values</li>
        </ul>
      </div>
    </div>
  );
}
