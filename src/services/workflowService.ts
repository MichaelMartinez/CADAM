/**
 * Workflow Service
 *
 * Frontend service for interacting with the workflow orchestrator.
 * Provides React Query hooks for workflow operations and SSE event handling.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase, isGodMode } from '@/lib/supabase';
import type {
  Workflow,
  WorkflowConfig,
  WorkflowEvent,
  WorkflowType,
  InflectionPoint,
  WorkflowStep,
  ModelTier,
} from '@shared/workflowTypes';
import { useCallback, useRef, useState } from 'react';

// =============================================================================
// Types
// =============================================================================

export interface StartWorkflowParams {
  conversationId: string;
  triggerMessageId: string;
  workflowType: WorkflowType;
  config?: Partial<WorkflowConfig>;
}

export interface ResolveInflectionParams {
  inflectionPointId: string;
  userChoice: string;
  userFeedback?: string;
}

export interface WorkflowStreamState {
  isStreaming: boolean;
  events: WorkflowEvent[];
  currentStep?: WorkflowStep;
  inflectionPoint?: InflectionPoint;
  error?: string;
}

export type WorkflowEventHandler = (event: WorkflowEvent) => void;

// =============================================================================
// API Functions
// =============================================================================

async function getAuthHeaders(): Promise<Record<string, string>> {
  // In GOD_MODE, the supabase client already uses service_role key
  // Backend accepts requests without auth header when GOD_MODE is enabled
  if (isGodMode) {
    return {
      'Content-Type': 'application/json',
    };
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.access_token) {
    throw new Error('User must be authenticated');
  }
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${session.access_token}`,
  };
}

async function invokeWorkflowFunction<T>(
  body: Record<string, unknown>,
): Promise<T> {
  const headers = await getAuthHeaders();

  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/workflow-orchestrator`,
    {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    },
  );

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: response.statusText }));
    throw new Error(error.error || 'Workflow operation failed');
  }

  return response.json();
}

async function* streamWorkflowEvents(
  body: Record<string, unknown>,
): AsyncGenerator<WorkflowEvent> {
  const headers = await getAuthHeaders();

  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/workflow-orchestrator`,
    {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    },
  );

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: response.statusText }));
    throw new Error(error.error || 'Workflow operation failed');
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('No response body');
  }

  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6).trim();
          if (data === '[DONE]') return;

          try {
            const event: WorkflowEvent = JSON.parse(data);
            yield event;
          } catch {
            // Skip malformed events
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

// =============================================================================
// Query Hooks
// =============================================================================

/**
 * Hook to fetch a workflow by ID
 */
export function useWorkflow(workflowId: string | undefined) {
  return useQuery({
    queryKey: ['workflow', workflowId],
    enabled: !!workflowId,
    queryFn: async () => {
      if (!workflowId) throw new Error('Workflow ID required');

      const { data, error } = await supabase
        .from('workflows')
        .select('*')
        .eq('id', workflowId)
        .single();

      if (error) throw error;
      return data as unknown as Workflow;
    },
  });
}

/**
 * Hook to fetch workflows for a conversation
 */
export function useConversationWorkflows(conversationId: string | undefined) {
  return useQuery({
    queryKey: ['conversation-workflows', conversationId],
    enabled: !!conversationId,
    queryFn: async () => {
      if (!conversationId) throw new Error('Conversation ID required');

      const { data, error } = await supabase
        .from('workflows')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as unknown as Workflow[];
    },
  });
}

/**
 * Hook to fetch workflow steps
 */
export function useWorkflowSteps(workflowId: string | undefined) {
  return useQuery({
    queryKey: ['workflow-steps', workflowId],
    enabled: !!workflowId,
    queryFn: async () => {
      if (!workflowId) throw new Error('Workflow ID required');

      const { data, error } = await supabase
        .from('workflow_steps')
        .select('*')
        .eq('workflow_id', workflowId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data as unknown as WorkflowStep[];
    },
  });
}

/**
 * Hook to fetch pending inflection point for a workflow
 */
export function usePendingInflectionPoint(workflowId: string | undefined) {
  return useQuery({
    queryKey: ['pending-inflection-point', workflowId],
    enabled: !!workflowId,
    queryFn: async () => {
      if (!workflowId) throw new Error('Workflow ID required');

      const { data, error } = await supabase
        .from('inflection_points')
        .select('*')
        .eq('workflow_id', workflowId)
        .is('resolved_at', null)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data as unknown as InflectionPoint | null;
    },
  });
}

// =============================================================================
// Mutation Hooks
// =============================================================================

/**
 * Hook to start a new workflow with streaming
 */
export function useStartWorkflow() {
  const queryClient = useQueryClient();
  const [streamState, setStreamState] = useState<WorkflowStreamState>({
    isStreaming: false,
    events: [],
  });
  const abortControllerRef = useRef<AbortController | null>(null);

  const startWorkflow = useCallback(
    async (params: StartWorkflowParams, onEvent?: WorkflowEventHandler) => {
      // Cancel any existing stream
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();

      setStreamState({ isStreaming: true, events: [] });

      try {
        for await (const event of streamWorkflowEvents({
          action: 'start',
          workflow_type: params.workflowType,
          conversation_id: params.conversationId,
          trigger_message_id: params.triggerMessageId,
          config: params.config,
        })) {
          // Update local state
          setStreamState((prev) => {
            const newState = { ...prev, events: [...prev.events, event] };

            // Update specific state based on event type
            if (event.type === 'workflow.step.started') {
              newState.currentStep = event.step;
            } else if (event.type === 'workflow.step.completed') {
              newState.currentStep = event.step;
            } else if (event.type === 'workflow.inflection_point') {
              newState.inflectionPoint = event.inflection_point;
            } else if (event.type === 'workflow.failed') {
              newState.error = event.error;
            } else if (event.type === 'workflow.completed') {
              newState.isStreaming = false;
            }

            return newState;
          });

          // Call external handler
          onEvent?.(event);

          // Invalidate relevant queries on completion
          if (event.type === 'workflow.completed') {
            queryClient.invalidateQueries({
              queryKey: ['conversation-workflows', params.conversationId],
            });
          }
        }
      } catch (error) {
        setStreamState((prev) => ({
          ...prev,
          isStreaming: false,
          error: error instanceof Error ? error.message : String(error),
        }));
        throw error;
      } finally {
        setStreamState((prev) => ({ ...prev, isStreaming: false }));
      }
    },
    [queryClient],
  );

  const cancel = useCallback(() => {
    abortControllerRef.current?.abort();
    setStreamState((prev) => ({ ...prev, isStreaming: false }));
  }, []);

  return {
    startWorkflow,
    cancel,
    ...streamState,
  };
}

/**
 * Hook to resolve an inflection point
 */
export function useResolveInflectionPoint() {
  const queryClient = useQueryClient();
  const [streamState, setStreamState] = useState<WorkflowStreamState>({
    isStreaming: false,
    events: [],
  });

  const resolveInflectionPoint = useCallback(
    async (
      params: ResolveInflectionParams,
      workflowId: string,
      onEvent?: WorkflowEventHandler,
    ) => {
      setStreamState({ isStreaming: true, events: [] });

      try {
        for await (const event of streamWorkflowEvents({
          action: 'resolve_inflection',
          inflection_point_id: params.inflectionPointId,
          user_choice: params.userChoice,
          user_feedback: params.userFeedback,
        })) {
          setStreamState((prev) => {
            const newState = { ...prev, events: [...prev.events, event] };

            if (event.type === 'workflow.step.started') {
              newState.currentStep = event.step;
            } else if (event.type === 'workflow.inflection_point') {
              newState.inflectionPoint = event.inflection_point;
            } else if (event.type === 'workflow.failed') {
              newState.error = event.error;
            }

            return newState;
          });

          onEvent?.(event);

          if (
            event.type === 'workflow.completed' ||
            event.type === 'workflow.failed'
          ) {
            queryClient.invalidateQueries({
              queryKey: ['workflow', workflowId],
            });
            queryClient.invalidateQueries({
              queryKey: ['pending-inflection-point', workflowId],
            });
          }
        }
      } catch (error) {
        setStreamState((prev) => ({
          ...prev,
          isStreaming: false,
          error: error instanceof Error ? error.message : String(error),
        }));
        throw error;
      } finally {
        setStreamState((prev) => ({ ...prev, isStreaming: false }));
      }
    },
    [queryClient],
  );

  return {
    resolveInflectionPoint,
    ...streamState,
  };
}

/**
 * Hook to cancel a workflow
 */
export function useCancelWorkflow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      workflowId,
      reason,
    }: {
      workflowId: string;
      reason?: string;
    }) => {
      return invokeWorkflowFunction<{ success: boolean }>({
        action: 'cancel',
        workflow_id: workflowId,
        reason,
      });
    },
    onSuccess: (_, { workflowId }) => {
      queryClient.invalidateQueries({ queryKey: ['workflow', workflowId] });
    },
  });
}

/**
 * Hook to provide a screenshot to a workflow
 */
export function useProvideScreenshot() {
  const queryClient = useQueryClient();
  const [streamState, setStreamState] = useState<WorkflowStreamState>({
    isStreaming: false,
    events: [],
  });

  const provideScreenshot = useCallback(
    async (
      params: {
        workflowId: string;
        stepId: string;
        screenshotImageId: string;
      },
      onEvent?: WorkflowEventHandler,
    ) => {
      console.log('[workflowService:provideScreenshot] Starting', params);
      setStreamState({ isStreaming: true, events: [] });

      try {
        console.log('[workflowService:provideScreenshot] Streaming events...');
        for await (const event of streamWorkflowEvents({
          action: 'provide_screenshot',
          workflow_id: params.workflowId,
          step_id: params.stepId,
          screenshot_image_id: params.screenshotImageId,
        })) {
          console.log(
            '[workflowService:provideScreenshot] Received event:',
            event.type,
          );
          setStreamState((prev) => {
            const newState = { ...prev, events: [...prev.events, event] };

            if (event.type === 'workflow.step.started') {
              newState.currentStep = event.step;
            } else if (event.type === 'workflow.inflection_point') {
              newState.inflectionPoint = event.inflection_point;
            } else if (event.type === 'workflow.failed') {
              newState.error = event.error;
            }

            return newState;
          });

          onEvent?.(event);

          if (
            event.type === 'workflow.completed' ||
            event.type === 'workflow.failed'
          ) {
            queryClient.invalidateQueries({
              queryKey: ['workflow', params.workflowId],
            });
          }
        }
        console.log('[workflowService:provideScreenshot] Streaming completed');
      } catch (error) {
        console.error('[workflowService:provideScreenshot] Error:', error);
        setStreamState((prev) => ({
          ...prev,
          isStreaming: false,
          error: error instanceof Error ? error.message : String(error),
        }));
        throw error;
      } finally {
        setStreamState((prev) => ({ ...prev, isStreaming: false }));
      }
    },
    [queryClient],
  );

  return {
    provideScreenshot,
    ...streamState,
  };
}

/**
 * Hook to resume a paused workflow
 */
export function useResumeWorkflow() {
  const queryClient = useQueryClient();
  const [streamState, setStreamState] = useState<WorkflowStreamState>({
    isStreaming: false,
    events: [],
  });

  const resumeWorkflow = useCallback(
    async (workflowId: string, onEvent?: WorkflowEventHandler) => {
      setStreamState({ isStreaming: true, events: [] });

      try {
        for await (const event of streamWorkflowEvents({
          action: 'resume',
          workflow_id: workflowId,
        })) {
          setStreamState((prev) => {
            const newState = { ...prev, events: [...prev.events, event] };

            if (event.type === 'workflow.step.started') {
              newState.currentStep = event.step;
            } else if (event.type === 'workflow.inflection_point') {
              newState.inflectionPoint = event.inflection_point;
            } else if (event.type === 'workflow.failed') {
              newState.error = event.error;
            }

            return newState;
          });

          onEvent?.(event);

          if (
            event.type === 'workflow.completed' ||
            event.type === 'workflow.failed'
          ) {
            queryClient.invalidateQueries({
              queryKey: ['workflow', workflowId],
            });
          }
        }
      } catch (error) {
        setStreamState((prev) => ({
          ...prev,
          isStreaming: false,
          error: error instanceof Error ? error.message : String(error),
        }));
        throw error;
      } finally {
        setStreamState((prev) => ({ ...prev, isStreaming: false }));
      }
    },
    [queryClient],
  );

  return {
    resumeWorkflow,
    ...streamState,
  };
}

// =============================================================================
// Utility Hooks
// =============================================================================

/**
 * Hook to get workflow status display info
 */
export function useWorkflowStatusDisplay(status: string | undefined) {
  const statusMap: Record<
    string,
    { label: string; color: string; icon: string }
  > = {
    pending: { label: 'Pending', color: 'text-gray-500', icon: 'clock' },
    running: { label: 'Running', color: 'text-blue-500', icon: 'loader' },
    awaiting_decision: {
      label: 'Awaiting Input',
      color: 'text-yellow-500',
      icon: 'alert-circle',
    },
    completed: {
      label: 'Completed',
      color: 'text-green-500',
      icon: 'check-circle',
    },
    failed: { label: 'Failed', color: 'text-red-500', icon: 'x-circle' },
    cancelled: { label: 'Cancelled', color: 'text-gray-400', icon: 'x' },
  };

  return (
    statusMap[status || ''] || {
      label: 'Unknown',
      color: 'text-gray-500',
      icon: 'help-circle',
    }
  );
}

/**
 * Hook to get model tier display info
 */
export function useModelTierDisplay(tier: ModelTier | undefined) {
  const tierMap: Record<
    ModelTier,
    { label: string; description: string; color: string }
  > = {
    best: {
      label: 'Best',
      description: 'Highest quality, most expensive',
      color: 'text-purple-500',
    },
    balanced: {
      label: 'Balanced',
      description: 'Good quality, reasonable cost',
      color: 'text-blue-500',
    },
    fast: {
      label: 'Fast',
      description: 'Quick responses, lower cost',
      color: 'text-green-500',
    },
    experimental: {
      label: 'Experimental',
      description: 'Cutting-edge, less tested',
      color: 'text-orange-500',
    },
  };

  return tierMap[tier || 'balanced'];
}
