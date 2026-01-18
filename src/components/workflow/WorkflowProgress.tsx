/**
 * Workflow Progress Component
 *
 * Displays the current workflow progress, including:
 * - Overall workflow status
 * - Step-by-step progress indicator
 * - Current step details
 * - Error messages when applicable
 */

import type {
  Workflow,
  WorkflowStep,
  WorkflowStatus,
  StepStatus,
} from '@shared/workflowTypes';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  SkipForward,
  Image,
  Code,
  Eye,
  Cog,
  MessageSquare,
} from 'lucide-react';

// =============================================================================
// Types
// =============================================================================

interface WorkflowProgressProps {
  workflow?: Workflow;
  steps?: WorkflowStep[];
  currentStepName?: string;
  progress?: number;
  message?: string;
  className?: string;
}

interface StepIndicatorProps {
  step: WorkflowStep;
  isActive: boolean;
}

// =============================================================================
// Constants
// =============================================================================

const STEP_ORDER = [
  'preprocess_images',
  'vlm_analysis',
  'vlm_review',
  'code_generation',
  'code_review',
  'verification',
  'verification_review',
];

const STEP_LABELS: Record<string, string> = {
  preprocess_images: 'Preprocessing',
  vlm_analysis: 'Image Analysis',
  vlm_review: 'Review Analysis',
  code_generation: 'Code Generation',
  code_review: 'Review Code',
  verification: 'Verification',
  verification_review: 'Review Results',
};

const STEP_ICONS: Record<string, React.ReactNode> = {
  preprocess_images: <Image className="h-4 w-4" />,
  vlm_analysis: <Eye className="h-4 w-4" />,
  vlm_review: <MessageSquare className="h-4 w-4" />,
  code_generation: <Code className="h-4 w-4" />,
  code_review: <MessageSquare className="h-4 w-4" />,
  verification: <CheckCircle className="h-4 w-4" />,
  verification_review: <MessageSquare className="h-4 w-4" />,
};

// =============================================================================
// Helper Functions
// =============================================================================

function getStatusIcon(
  status: StepStatus | WorkflowStatus,
  isActive: boolean = false,
) {
  if (isActive && status === 'running') {
    return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
  }

  switch (status) {
    case 'pending':
      return <Clock className="h-4 w-4 text-gray-400" />;
    case 'running':
      return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
    case 'completed':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'failed':
      return <XCircle className="h-4 w-4 text-red-500" />;
    case 'skipped':
      return <SkipForward className="h-4 w-4 text-gray-400" />;
    case 'awaiting_decision':
      return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    case 'cancelled':
      return <XCircle className="h-4 w-4 text-gray-400" />;
    default:
      return <Cog className="h-4 w-4 text-gray-400" />;
  }
}

function getStatusColor(status: StepStatus | WorkflowStatus): string {
  switch (status) {
    case 'pending':
      return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
    case 'running':
      return 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400';
    case 'completed':
      return 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400';
    case 'failed':
      return 'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400';
    case 'skipped':
      return 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-500';
    case 'awaiting_decision':
      return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/50 dark:text-yellow-400';
    case 'cancelled':
      return 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-500';
    default:
      return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
  }
}

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${(ms / 60000).toFixed(1)}m`;
}

// =============================================================================
// Sub-Components
// =============================================================================

function StepIndicator({ step, isActive }: StepIndicatorProps) {
  const label = STEP_LABELS[step.step_name] || step.step_name;
  const icon = STEP_ICONS[step.step_name] || <Cog className="h-4 w-4" />;

  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-md px-3 py-2 transition-colors',
        isActive &&
          'border border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/30',
        !isActive &&
          step.status === 'completed' &&
          'bg-green-50 dark:bg-green-900/20',
        !isActive && step.status === 'failed' && 'bg-red-50 dark:bg-red-900/20',
      )}
    >
      <div className="flex-shrink-0">
        {getStatusIcon(step.status, isActive)}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          {icon}
          <span className="truncate text-sm font-medium">{label}</span>
        </div>

        {step.duration_ms && step.status === 'completed' && (
          <span className="text-xs text-muted-foreground">
            {formatDuration(step.duration_ms)}
          </span>
        )}
      </div>

      {step.model_used && (
        <Badge variant="outline" className="text-xs">
          {step.model_used.split('/').pop()}
        </Badge>
      )}
    </div>
  );
}

function WorkflowStatusBadge({ status }: { status: WorkflowStatus }) {
  return (
    <Badge className={cn('capitalize', getStatusColor(status))}>
      {status.replace('_', ' ')}
    </Badge>
  );
}

// =============================================================================
// Main Component
// =============================================================================

export function WorkflowProgress({
  workflow,
  steps = [],
  currentStepName,
  progress,
  message,
  className,
}: WorkflowProgressProps) {
  // Calculate overall progress based on steps
  const completedSteps = steps.filter((s) => s.status === 'completed').length;
  const totalSteps = STEP_ORDER.length;
  const overallProgress =
    progress ?? Math.round((completedSteps / totalSteps) * 100);

  // Sort steps by their position in the workflow
  const sortedSteps = [...steps].sort((a, b) => {
    const aIdx = STEP_ORDER.indexOf(a.step_name);
    const bIdx = STEP_ORDER.indexOf(b.step_name);
    if (aIdx === -1 && bIdx === -1) return 0;
    if (aIdx === -1) return 1;
    if (bIdx === -1) return -1;
    return aIdx - bIdx;
  });

  // Find the active step
  const activeStepName = currentStepName || workflow?.current_step;

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      {workflow && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon(workflow.status)}
            <span className="font-medium">
              {workflow.workflow_type
                .split('-')
                .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                .join(' ')}
            </span>
          </div>
          <WorkflowStatusBadge status={workflow.status} />
        </div>
      )}

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {message || `Step ${completedSteps + 1} of ${totalSteps}`}
          </span>
          <span className="font-medium">{overallProgress}%</span>
        </div>
        <Progress value={overallProgress} className="h-2" />
      </div>

      {/* Step List */}
      {sortedSteps.length > 0 && (
        <div className="space-y-2">
          {sortedSteps.map((step) => (
            <StepIndicator
              key={step.id}
              step={step}
              isActive={step.step_name === activeStepName}
            />
          ))}
        </div>
      )}

      {/* Error Display */}
      {workflow?.error && (
        <div className="flex items-start gap-2 rounded-md border border-red-300 bg-red-50 p-3 dark:border-red-700 dark:bg-red-900/30">
          <XCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600 dark:text-red-400" />
          <div>
            <p className="font-medium text-red-800 dark:text-red-200">Error</p>
            <p className="text-sm text-red-700 dark:text-red-300">
              {workflow.error}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default WorkflowProgress;
