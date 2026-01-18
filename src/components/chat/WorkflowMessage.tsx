/**
 * Workflow Message Component
 *
 * Displays a workflow in the chat thread with:
 * - Collapsible progress section
 * - Inline inflection points
 * - Final results or error states
 */

import { useState, useEffect } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Loader2,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { InflectionPointCard } from '@/components/workflow/InflectionPointCard';
import { getWorkflowDefinition } from '@/lib/workflowRegistry';
import { useCurrentMessage } from '@/contexts/CurrentMessageContext';
import type { ActiveWorkflow } from '@/contexts/WorkflowContext';
import type { WorkflowStep, WorkflowEvent } from '@shared/workflowTypes';

// =============================================================================
// Types
// =============================================================================

interface WorkflowMessageProps {
  workflow: ActiveWorkflow;
  onResolveInflection: (optionId: string, feedback?: string) => void;
  onCancel: () => void;
  onRetry?: () => void;
  isResolving?: boolean;
}

interface StepDisplayProps {
  step: WorkflowStep;
  isCurrent: boolean;
}

// =============================================================================
// Sub-Components
// =============================================================================

function StepStatusIcon({ status }: { status: WorkflowStep['status'] }) {
  switch (status) {
    case 'running':
      return <Loader2 className="h-4 w-4 animate-spin text-adam-blue" />;
    case 'completed':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'failed':
      return <XCircle className="h-4 w-4 text-red-500" />;
    case 'skipped':
      return <span className="h-4 w-4 text-gray-400">—</span>;
    default:
      return <span className="h-4 w-4 rounded-full border-2 border-gray-400" />;
  }
}

function StepDisplay({ step, isCurrent }: StepDisplayProps) {
  return (
    <div
      className={cn('flex items-center gap-2 py-1', isCurrent && 'font-medium')}
    >
      <StepStatusIcon status={step.status} />
      <span
        className={cn(
          'text-sm',
          step.status === 'completed' && 'text-muted-foreground',
          step.status === 'failed' && 'text-red-500',
        )}
      >
        {formatStepName(step.step_name)}
      </span>
      {step.duration_ms && step.status === 'completed' && (
        <span className="text-xs text-muted-foreground">
          ({(step.duration_ms / 1000).toFixed(1)}s)
        </span>
      )}
    </div>
  );
}

function formatStepName(name: string): string {
  // Convert snake_case to Title Case
  return name
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function WorkflowStatusBadge({ status }: { status: ActiveWorkflow['status'] }) {
  const config = {
    starting: { label: 'Starting', variant: 'secondary' as const },
    running: { label: 'Running', variant: 'default' as const },
    awaiting_decision: { label: 'Awaiting Input', variant: 'warning' as const },
    completed: { label: 'Completed', variant: 'success' as const },
    failed: { label: 'Failed', variant: 'destructive' as const },
    cancelled: { label: 'Cancelled', variant: 'secondary' as const },
  };

  const { label, variant } = config[status];

  return (
    <Badge
      variant={
        variant === 'success'
          ? 'default'
          : variant === 'warning'
            ? 'outline'
            : variant
      }
      className={cn(
        variant === 'success' && 'bg-green-500/20 text-green-500',
        variant === 'warning' && 'border-yellow-500 text-yellow-500',
      )}
    >
      {label}
    </Badge>
  );
}

// =============================================================================
// Main Component
// =============================================================================

export function WorkflowMessage({
  workflow,
  onResolveInflection,
  onCancel,
  onRetry,
  isResolving = false,
}: WorkflowMessageProps) {
  const [isProgressOpen, setIsProgressOpen] = useState(true);
  const { setCurrentMessage } = useCurrentMessage();

  // Get workflow definition for display
  const workflowDef = getWorkflowDefinition(workflow.workflowType);
  const Icon = workflowDef?.icon;

  // Extract steps from events
  const steps = extractStepsFromEvents(workflow.events);

  // Calculate progress percentage
  const totalSteps = steps.length || 1;
  const completedSteps = steps.filter((s) => s.status === 'completed').length;
  const progressPercent =
    workflow.status === 'completed'
      ? 100
      : Math.round((completedSteps / totalSteps) * 100);

  // Auto-collapse progress when completed
  useEffect(() => {
    if (workflow.status === 'completed' || workflow.status === 'failed') {
      // Give a moment to see the final state before collapsing
      const timer = setTimeout(() => setIsProgressOpen(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [workflow.status]);

  // Auto-render generated code when it becomes available (not just on completion)
  // This ensures the model is rendered when the user is reviewing inflection points
  useEffect(() => {
    if (workflow.generatedCode) {
      console.log(
        '[WorkflowMessage] Generated code available, triggering viewer render',
        {
          workflowId: workflow.id,
          workflowStatus: workflow.status,
          codeLength: workflow.generatedCode.length,
        },
      );
      // Trigger the viewer to render the generated code
      setCurrentMessage({
        id: `workflow-${workflow.id}`,
        role: 'assistant',
        content: {
          artifact: {
            title: 'Generated from Image',
            version: '1.0.0',
            code: workflow.generatedCode,
            parameters: [],
          },
        },
        conversation_id: workflow.conversationId,
        parent_message_id: workflow.triggerMessageId,
        created_at: new Date().toISOString(),
      });
    }
  }, [
    workflow.generatedCode,
    workflow.id,
    workflow.status,
    workflow.conversationId,
    workflow.triggerMessageId,
    setCurrentMessage,
  ]);

  return (
    <div className="flex justify-start">
      <div className="mr-2 mt-1">
        <Avatar className="h-9 w-9 border border-adam-neutral-700 bg-adam-blue/20 p-0">
          <div className="flex h-full w-full items-center justify-center">
            {Icon && <Icon className="h-5 w-5 text-adam-blue" />}
          </div>
        </Avatar>
      </div>

      <div className="flex min-w-0 max-w-[85%] flex-col gap-3">
        {/* Header */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-adam-text-primary">
            {workflowDef?.label || 'Workflow'}
          </span>
          <WorkflowStatusBadge status={workflow.status} />
          {(workflow.status === 'running' ||
            workflow.status === 'awaiting_decision') && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={onCancel}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Progress Section */}
        <Collapsible open={isProgressOpen} onOpenChange={setIsProgressOpen}>
          <CollapsibleTrigger asChild>
            <button className="flex w-full items-center gap-2 rounded-lg bg-adam-neutral-800 p-3 text-left hover:bg-adam-neutral-700">
              {isProgressOpen ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="flex-1 text-sm">Progress</span>
              <Progress value={progressPercent} className="w-20" />
              <span className="text-xs text-muted-foreground">
                {progressPercent}%
              </span>
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="mt-2 space-y-1 rounded-lg border border-adam-neutral-700 bg-adam-neutral-900 p-3">
              {steps.length > 0 ? (
                steps.map((step) => (
                  <StepDisplay
                    key={step.id}
                    step={step}
                    isCurrent={step.id === workflow.currentStep?.id}
                  />
                ))
              ) : (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Initializing workflow...
                </div>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Inflection Point */}
        {workflow.status === 'awaiting_decision' &&
          workflow.inflectionPoint && (
            <div className="mt-2">
              <InflectionPointCard
                inflectionPoint={workflow.inflectionPoint}
                onResolve={onResolveInflection}
                isResolving={isResolving}
                conversationId={workflow.conversationId}
              />
            </div>
          )}

        {/* Completed State */}
        {workflow.status === 'completed' && (
          <div className="flex items-center gap-2 rounded-lg bg-green-500/10 p-3 text-green-500">
            <CheckCircle className="h-5 w-5" />
            <span className="text-sm">
              Workflow completed successfully. The generated model is now
              rendering in the viewport.
            </span>
          </div>
        )}

        {/* Failed State */}
        {workflow.status === 'failed' && (
          <div className="flex flex-col gap-3 rounded-lg bg-red-500/10 p-3">
            <div className="flex items-center gap-2 text-red-500">
              <AlertCircle className="h-5 w-5" />
              <span className="text-sm font-medium">Workflow failed</span>
            </div>
            {workflow.error && (
              <p className="text-sm text-muted-foreground">{workflow.error}</p>
            )}
            {onRetry && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRetry}
                className="w-fit"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Retry
              </Button>
            )}
          </div>
        )}

        {/* Cancelled State */}
        {workflow.status === 'cancelled' && (
          <div className="flex items-center gap-2 rounded-lg bg-adam-neutral-800 p-3 text-muted-foreground">
            <X className="h-5 w-5" />
            <span className="text-sm">Workflow was cancelled</span>
          </div>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// Helpers
// =============================================================================

function extractStepsFromEvents(events: WorkflowEvent[]): WorkflowStep[] {
  const stepsMap = new Map<string, WorkflowStep>();

  for (const event of events) {
    if (event.type === 'workflow.step.started') {
      stepsMap.set(event.step.id, event.step);
    } else if (event.type === 'workflow.step.completed') {
      stepsMap.set(event.step.id, event.step);
    }
  }

  return Array.from(stepsMap.values());
}

export default WorkflowMessage;
