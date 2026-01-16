/**
 * Workflow Panel Component
 *
 * Container component that displays the full workflow interface, including:
 * - Progress indicator
 * - Inflection point cards when awaiting decisions
 * - Final results
 */

import { useEffect, useState, useCallback } from 'react';
import type {
  Workflow,
  WorkflowEvent,
  WorkflowScreenshotRequestedEvent,
} from '@shared/workflowTypes';
import {
  useWorkflow,
  useWorkflowSteps,
  usePendingInflectionPoint,
  useResolveInflectionPoint,
  useCancelWorkflow,
  useProvideScreenshot,
} from '@/services/workflowService';
import { WorkflowProgress } from './WorkflowProgress';
import { InflectionPointCard } from './InflectionPointCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, RefreshCw, Loader2, Camera } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { captureAndUploadViewerScreenshot } from '@/utils/screenshotUtils';

// =============================================================================
// Types
// =============================================================================

interface WorkflowPanelProps {
  workflowId: string;
  onComplete?: (workflow: Workflow, code?: string) => void;
  onCancel?: () => void;
  events?: WorkflowEvent[];
  className?: string;
}

// =============================================================================
// Main Component
// =============================================================================

export function WorkflowPanel({
  workflowId,
  onComplete,
  onCancel,
  events = [],
  className,
}: WorkflowPanelProps) {
  const [currentStepName, setCurrentStepName] = useState<string>();
  const [progress, setProgress] = useState<number>();
  const [progressMessage, setProgressMessage] = useState<string>();
  const [isCapturingScreenshot, setIsCapturingScreenshot] = useState(false);
  const [screenshotError, setScreenshotError] = useState<string>();

  // Queries
  const { data: workflow, refetch: refetchWorkflow } = useWorkflow(workflowId);
  const { data: steps = [], refetch: refetchSteps } =
    useWorkflowSteps(workflowId);
  const { data: inflectionPoint, refetch: refetchInflectionPoint } =
    usePendingInflectionPoint(workflowId);

  // Mutations
  const {
    resolveInflectionPoint,
    isStreaming: isResolving,
    events: resolveEvents,
  } = useResolveInflectionPoint();
  const { mutate: cancelWorkflow, isPending: isCancelling } =
    useCancelWorkflow();
  const {
    provideScreenshot,
    isStreaming: isProvidingScreenshot,
    events: screenshotEvents,
  } = useProvideScreenshot();

  // Handle screenshot capture request
  const handleScreenshotRequest = useCallback(
    async (event: WorkflowScreenshotRequestedEvent) => {
      setIsCapturingScreenshot(true);
      setScreenshotError(undefined);

      try {
        // Capture screenshot from the Three.js viewer
        const screenshotImageId = await captureAndUploadViewerScreenshot(
          event.workflow_id,
          event.purpose,
        );

        // Send the screenshot back to the workflow
        await provideScreenshot({
          workflowId: event.workflow_id,
          stepId: event.step_id,
          screenshotImageId,
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        console.error('Failed to capture screenshot:', errorMessage);
        setScreenshotError(errorMessage);
      } finally {
        setIsCapturingScreenshot(false);
      }
    },
    [provideScreenshot],
  );

  // Process incoming events
  useEffect(() => {
    const latestEvents = [...events, ...resolveEvents, ...screenshotEvents];

    for (const event of latestEvents) {
      switch (event.type) {
        case 'workflow.step.started':
          setCurrentStepName(event.step.step_name);
          refetchSteps();
          break;

        case 'workflow.step.progress':
          setProgress(event.progress);
          setProgressMessage(event.message);
          break;

        case 'workflow.step.completed':
          refetchSteps();
          break;

        case 'workflow.inflection_point':
          refetchInflectionPoint();
          break;

        case 'workflow.screenshot_requested':
          // Automatically handle screenshot capture
          handleScreenshotRequest(event);
          break;

        case 'workflow.completed':
          refetchWorkflow();
          if (onComplete) {
            const code = (event.workflow.state as { scad_code?: string })
              .scad_code;
            onComplete(event.workflow, code);
          }
          break;

        case 'workflow.failed':
        case 'workflow.cancelled':
          refetchWorkflow();
          break;
      }
    }
  }, [
    events,
    resolveEvents,
    screenshotEvents,
    refetchSteps,
    refetchInflectionPoint,
    refetchWorkflow,
    onComplete,
    handleScreenshotRequest,
  ]);

  // Handle inflection point resolution
  const handleResolveInflection = (optionId: string, feedback?: string) => {
    if (!inflectionPoint) return;

    resolveInflectionPoint(
      {
        inflectionPointId: inflectionPoint.id,
        userChoice: optionId,
        userFeedback: feedback,
      },
      workflowId,
    );
  };

  // Handle workflow cancellation
  const handleCancel = () => {
    cancelWorkflow(
      { workflowId, reason: 'User cancelled' },
      {
        onSuccess: () => {
          onCancel?.();
        },
      },
    );
  };

  // Image URL resolver using Supabase storage
  const imageUrlResolver = (imageId: string): string => {
    const { data } = supabase.storage.from('images').getPublicUrl(imageId);
    return data.publicUrl;
  };

  // Render based on workflow status
  if (!workflow) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-medium">
          Image to CAD Workflow
        </CardTitle>
        {workflow.status === 'running' ||
        workflow.status === 'awaiting_decision' ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCancel}
            disabled={isCancelling}
          >
            {isCancelling ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <X className="h-4 w-4" />
            )}
          </Button>
        ) : null}
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Progress Section */}
        <WorkflowProgress
          workflow={workflow}
          steps={steps}
          currentStepName={currentStepName}
          progress={progress}
          message={progressMessage}
        />

        {/* Screenshot Capture Section */}
        {(isCapturingScreenshot || isProvidingScreenshot) && (
          <div className="flex items-center gap-3 rounded-lg bg-blue-50 p-4">
            <Camera className="h-5 w-5 animate-pulse text-blue-500" />
            <div>
              <p className="font-medium text-blue-700">
                Capturing screenshot...
              </p>
              <p className="text-sm text-blue-600">
                {isCapturingScreenshot
                  ? 'Taking a screenshot of the 3D viewer'
                  : 'Sending screenshot to workflow'}
              </p>
            </div>
          </div>
        )}

        {/* Screenshot Error Section */}
        {screenshotError && (
          <div className="flex items-center gap-3 rounded-lg bg-red-50 p-4">
            <X className="h-5 w-5 text-red-500" />
            <div>
              <p className="font-medium text-red-700">
                Screenshot capture failed
              </p>
              <p className="text-sm text-red-600">{screenshotError}</p>
            </div>
          </div>
        )}

        {/* Inflection Point Section */}
        {inflectionPoint && workflow.status === 'awaiting_decision' && (
          <InflectionPointCard
            inflectionPoint={inflectionPoint}
            onResolve={handleResolveInflection}
            isResolving={isResolving}
            imageUrlResolver={imageUrlResolver}
          />
        )}

        {/* Completed Section */}
        {workflow.status === 'completed' && (
          <div className="flex items-center justify-center py-4">
            <div className="text-center">
              <p className="font-medium text-green-600">Workflow completed!</p>
              <p className="mt-1 text-sm text-muted-foreground">
                The generated code has been added to your conversation.
              </p>
            </div>
          </div>
        )}

        {/* Failed Section */}
        {workflow.status === 'failed' && (
          <div className="flex flex-col items-center gap-4 py-4">
            <p className="text-red-600">Workflow failed: {workflow.error}</p>
            <Button
              variant="outline"
              onClick={() => {
                // TODO: Implement retry
              }}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default WorkflowPanel;
