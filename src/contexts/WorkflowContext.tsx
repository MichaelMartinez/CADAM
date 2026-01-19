/**
 * Workflow Context
 *
 * Centralized state management for the workflow system.
 * Tracks active workflows, streaming events, and inflection points.
 */

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';
import type {
  Workflow,
  WorkflowEvent,
  WorkflowType,
  InflectionPoint,
  WorkflowStep,
  WorkflowConfig,
} from '@shared/workflowTypes';
import {
  useStartWorkflow,
  useResolveInflectionPoint,
  useCancelWorkflow,
  useProvideScreenshot,
} from '@/services/workflowService';
import type { WorkflowMode } from '@/lib/workflowRegistry';
import { workflowLogger } from '@/lib/logger';
import { captureAndUploadViewerScreenshot } from '@/utils/screenshotUtils';

// =============================================================================
// Types
// =============================================================================

export interface ActiveWorkflow {
  id: string;
  workflowType: WorkflowType;
  conversationId: string;
  triggerMessageId: string;
  status:
    | 'starting'
    | 'running'
    | 'awaiting_decision'
    | 'completed'
    | 'failed'
    | 'cancelled';
  events: WorkflowEvent[];
  currentStep?: WorkflowStep;
  inflectionPoint?: InflectionPoint;
  error?: string;
  workflow?: Workflow;
  generatedCode?: string;
}

export interface WorkflowContextValue {
  // Current mode (chat or a workflow type)
  workflowMode: WorkflowMode;
  setWorkflowMode: (mode: WorkflowMode) => void;

  // Active workflow state
  activeWorkflow: ActiveWorkflow | null;
  isWorkflowActive: boolean;

  // Workflow operations
  startWorkflow: (params: {
    conversationId: string;
    triggerMessageId: string;
    workflowType: WorkflowType;
    config?: Partial<WorkflowConfig>;
  }) => Promise<void>;

  resolveInflectionPoint: (
    optionId: string,
    feedback?: string,
  ) => Promise<void>;

  cancelWorkflow: (reason?: string) => Promise<void>;

  provideScreenshot: (params: {
    stepId: string;
    screenshotImageId: string;
  }) => Promise<void>;

  // Reset workflow state
  /** Clears only the active workflow state (after completion), preserves workflowMode */
  clearActiveWorkflow: () => void;
  /** Clears everything including workflowMode (user-initiated full reset) */
  clearWorkflow: () => void;
}

// =============================================================================
// Context
// =============================================================================

const WorkflowContext = createContext<WorkflowContextValue | null>(null);

// =============================================================================
// Provider
// =============================================================================

interface WorkflowProviderProps {
  children: ReactNode;
}

export function WorkflowProvider({ children }: WorkflowProviderProps) {
  // Workflow mode selection
  const [workflowMode, setWorkflowModeInternal] =
    useState<WorkflowMode>('chat');

  // Wrapped setter that logs changes
  const setWorkflowMode = useCallback(
    (mode: WorkflowMode) => {
      workflowLogger.debug('setWorkflowMode called', {
        from: workflowMode,
        to: mode,
      });
      setWorkflowModeInternal(mode);
    },
    [workflowMode],
  );

  // Active workflow state
  const [activeWorkflow, setActiveWorkflow] = useState<ActiveWorkflow | null>(
    null,
  );

  // Service hooks
  const { startWorkflow: startWorkflowService } = useStartWorkflow();
  const { resolveInflectionPoint: resolveInflectionService } =
    useResolveInflectionPoint();
  const { mutateAsync: cancelWorkflowService } = useCancelWorkflow();
  const { provideScreenshot: provideScreenshotService } =
    useProvideScreenshot();

  // Internal event handler for state updates
  const handleWorkflowEventInternal = useCallback((event: WorkflowEvent) => {
    setActiveWorkflow((prev) => {
      if (!prev) return prev;

      const newState = { ...prev, events: [...prev.events, event] };

      switch (event.type) {
        case 'workflow.started':
          newState.status = 'running';
          break;

        case 'workflow.step.started':
          newState.currentStep = event.step;
          break;

        case 'workflow.step.completed':
          newState.currentStep = event.step;
          // Extract generated code from code_generation step output
          if (event.step.step_name === 'code_generation' && event.step.output) {
            const output = event.step.output as { scad_code?: string };
            if (output.scad_code) {
              workflowLogger.info(
                'Code generation step completed, extracting code',
                {
                  codeLength: output.scad_code.length,
                },
              );
              newState.generatedCode = output.scad_code;
            }
          }
          break;

        case 'workflow.inflection_point':
          newState.status = 'awaiting_decision';
          newState.inflectionPoint = event.inflection_point;
          break;

        case 'workflow.completed': {
          newState.status = 'completed';
          newState.workflow = event.workflow;
          // Note: vision-to-scad workflow (which generated code) was removed
          // Other workflows don't generate scad_code directly
          break;
        }

        case 'workflow.failed':
          newState.status = 'failed';
          newState.error = event.error;
          break;

        case 'workflow.cancelled':
          newState.status = 'cancelled';
          break;
      }

      return newState;
    });
  }, []);

  // Handle screenshot capture request from workflow
  const handleScreenshotRequest = useCallback(
    async (workflowId: string, stepId: string) => {
      workflowLogger.info('=== SCREENSHOT REQUEST HANDLER STARTED ===', {
        workflowId,
        stepId,
      });

      try {
        // Capture screenshot from the Three.js viewer
        workflowLogger.info('Calling captureAndUploadViewerScreenshot...');
        const screenshotImageId = await captureAndUploadViewerScreenshot(
          workflowId,
          'verification',
        );

        workflowLogger.info('Screenshot captured successfully', {
          screenshotImageId,
          workflowId,
          stepId,
        });

        // Send the screenshot back to the workflow
        workflowLogger.info('Calling provideScreenshotService...');
        await provideScreenshotService(
          {
            workflowId,
            stepId,
            screenshotImageId,
          },
          handleWorkflowEventInternal,
        );
        workflowLogger.info('=== SCREENSHOT REQUEST HANDLER COMPLETED ===');
      } catch (error) {
        workflowLogger.error('=== SCREENSHOT REQUEST HANDLER FAILED ===', {
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        });
        // Update workflow status to failed
        setActiveWorkflow((prev) =>
          prev
            ? {
                ...prev,
                status: 'failed',
                error: `Screenshot capture failed: ${error instanceof Error ? error.message : String(error)}`,
              }
            : prev,
        );
      }
    },
    [provideScreenshotService, handleWorkflowEventInternal],
  );

  // Handle workflow events - wraps internal handler and adds screenshot handling
  const handleWorkflowEvent = useCallback(
    (event: WorkflowEvent) => {
      workflowLogger.debug('handleWorkflowEvent received', {
        eventType: event.type,
        event,
      });

      // Update state first
      handleWorkflowEventInternal(event);

      // Handle screenshot request asynchronously
      if (event.type === 'workflow.screenshot_requested') {
        workflowLogger.info('Screenshot requested event received', { event });
        const screenshotEvent = event as {
          type: 'workflow.screenshot_requested';
          workflow_id: string;
          step_id: string;
          purpose: string;
        };
        workflowLogger.info('Processing screenshot request', {
          workflow_id: screenshotEvent.workflow_id,
          step_id: screenshotEvent.step_id,
          purpose: screenshotEvent.purpose,
        });
        handleScreenshotRequest(
          screenshotEvent.workflow_id,
          screenshotEvent.step_id,
        );
      }
    },
    [handleWorkflowEventInternal, handleScreenshotRequest],
  );

  // Start a new workflow
  const startWorkflow = useCallback(
    async (params: {
      conversationId: string;
      triggerMessageId: string;
      workflowType: WorkflowType;
      config?: Partial<WorkflowConfig>;
    }) => {
      workflowLogger.info('=== START_WORKFLOW CALLED ===', {
        ...params,
        hasActiveWorkflow: !!activeWorkflow,
        activeWorkflowId: activeWorkflow?.id,
        activeWorkflowStatus: activeWorkflow?.status,
      });

      // Initialize active workflow state
      setActiveWorkflow({
        id: '', // Will be set when workflow.started event arrives
        workflowType: params.workflowType,
        conversationId: params.conversationId,
        triggerMessageId: params.triggerMessageId,
        status: 'starting',
        events: [],
      });

      try {
        await startWorkflowService(
          {
            conversationId: params.conversationId,
            triggerMessageId: params.triggerMessageId,
            workflowType: params.workflowType,
            config: params.config,
          },
          (event) => {
            handleWorkflowEvent(event);

            // Capture workflow ID from started event
            if (event.type === 'workflow.started') {
              setActiveWorkflow((prev) =>
                prev ? { ...prev, id: event.workflow_id } : prev,
              );
            }
          },
        );
      } catch (error) {
        setActiveWorkflow((prev) =>
          prev
            ? {
                ...prev,
                status: 'failed',
                error: error instanceof Error ? error.message : String(error),
              }
            : prev,
        );
        throw error;
      }
    },
    [startWorkflowService, handleWorkflowEvent],
  );

  // Resolve an inflection point
  const resolveInflectionPoint = useCallback(
    async (optionId: string, feedback?: string) => {
      workflowLogger.info('=== RESOLVE_INFLECTION_POINT CALLED ===', {
        optionId,
        feedback,
        workflowId: activeWorkflow?.id,
        inflectionPointId: activeWorkflow?.inflectionPoint?.id,
        inflectionPointTitle: activeWorkflow?.inflectionPoint?.title,
      });

      if (!activeWorkflow?.inflectionPoint) {
        workflowLogger.error('No active inflection point to resolve!');
        throw new Error('No active inflection point to resolve');
      }

      // Clear inflection point and set back to running
      setActiveWorkflow((prev) =>
        prev
          ? { ...prev, status: 'running', inflectionPoint: undefined }
          : prev,
      );

      try {
        await resolveInflectionService(
          {
            inflectionPointId: activeWorkflow.inflectionPoint.id,
            userChoice: optionId,
            userFeedback: feedback,
          },
          activeWorkflow.id,
          handleWorkflowEvent,
        );
      } catch (error) {
        setActiveWorkflow((prev) =>
          prev
            ? {
                ...prev,
                status: 'failed',
                error: error instanceof Error ? error.message : String(error),
              }
            : prev,
        );
        throw error;
      }
    },
    [activeWorkflow, resolveInflectionService, handleWorkflowEvent],
  );

  // Cancel the active workflow
  const cancelWorkflow = useCallback(
    async (reason?: string) => {
      if (!activeWorkflow?.id) {
        throw new Error('No active workflow to cancel');
      }

      try {
        await cancelWorkflowService({
          workflowId: activeWorkflow.id,
          reason,
        });

        setActiveWorkflow((prev) =>
          prev ? { ...prev, status: 'cancelled' } : prev,
        );
      } catch (error) {
        // Even if cancel fails, mark as failed
        setActiveWorkflow((prev) =>
          prev
            ? {
                ...prev,
                status: 'failed',
                error: error instanceof Error ? error.message : String(error),
              }
            : prev,
        );
        throw error;
      }
    },
    [activeWorkflow, cancelWorkflowService],
  );

  // Provide a screenshot to the workflow
  const provideScreenshot = useCallback(
    async (params: { stepId: string; screenshotImageId: string }) => {
      if (!activeWorkflow?.id) {
        throw new Error('No active workflow');
      }

      try {
        await provideScreenshotService(
          {
            workflowId: activeWorkflow.id,
            stepId: params.stepId,
            screenshotImageId: params.screenshotImageId,
          },
          handleWorkflowEvent,
        );
      } catch (error) {
        setActiveWorkflow((prev) =>
          prev
            ? {
                ...prev,
                status: 'failed',
                error: error instanceof Error ? error.message : String(error),
              }
            : prev,
        );
        throw error;
      }
    },
    [activeWorkflow, provideScreenshotService, handleWorkflowEvent],
  );

  // Clear only active workflow state (preserves workflowMode for next submission)
  const clearActiveWorkflow = useCallback(() => {
    workflowLogger.info('Clearing active workflow state (preserving mode)', {
      currentMode: workflowMode,
    });
    setActiveWorkflow(null);
  }, [workflowMode]);

  // Clear all workflow state including mode (full reset)
  const clearWorkflow = useCallback(() => {
    workflowLogger.info('Full workflow reset (clearing mode and active state)');
    setActiveWorkflow(null);
    setWorkflowModeInternal('chat');
  }, []);

  // Check if workflow is active
  const isWorkflowActive = useMemo(() => {
    if (!activeWorkflow) return false;
    return ['starting', 'running', 'awaiting_decision'].includes(
      activeWorkflow.status,
    );
  }, [activeWorkflow]);

  // Context value
  const value = useMemo<WorkflowContextValue>(
    () => ({
      workflowMode,
      setWorkflowMode,
      activeWorkflow,
      isWorkflowActive,
      startWorkflow,
      resolveInflectionPoint,
      cancelWorkflow,
      provideScreenshot,
      clearActiveWorkflow,
      clearWorkflow,
    }),
    [
      workflowMode,
      activeWorkflow,
      isWorkflowActive,
      startWorkflow,
      resolveInflectionPoint,
      cancelWorkflow,
      provideScreenshot,
      clearActiveWorkflow,
      clearWorkflow,
    ],
  );

  return (
    <WorkflowContext.Provider value={value}>
      {children}
    </WorkflowContext.Provider>
  );
}

// =============================================================================
// Hook
// =============================================================================

export function useWorkflowContext(): WorkflowContextValue {
  const context = useContext(WorkflowContext);
  if (!context) {
    throw new Error(
      'useWorkflowContext must be used within a WorkflowProvider',
    );
  }
  return context;
}

export default WorkflowContext;
