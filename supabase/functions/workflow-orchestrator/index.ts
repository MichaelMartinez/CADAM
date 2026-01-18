/**
 * Workflow Orchestrator Edge Function
 *
 * Main entry point for the multi-modal agentic workflow system.
 * Handles workflow lifecycle: start, resume, resolve inflection points, cancel.
 * Streams workflow events using Server-Sent Events (SSE).
 */

import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient, SupabaseClient } from 'npm:@supabase/supabase-js@2';
import type { Database } from '../_shared/database.ts';
import type {
  Workflow,
  WorkflowConfig,
  WorkflowEvent,
  WorkflowOrchestratorRequest,
  StartWorkflowRequest,
  ResumeWorkflowRequest,
  ResolveInflectionRequest,
  CancelWorkflowRequest,
  ProvideScreenshotRequest,
  VisionToScadState,
} from '../_shared/workflowTypes.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { VisionToScadPipeline } from './pipeline/VisionToScadPipeline.ts';
import type { PipelineContext } from './pipeline/WorkflowPipeline.ts';
import { getTierModelConfig } from './config/modelRegistry.ts';

// =============================================================================
// Types
// =============================================================================

interface RequestContext {
  supabase: SupabaseClient<Database>;
  userId: string;
}

// =============================================================================
// Main Handler
// =============================================================================

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  console.log('[WorkflowOrchestrator] Received request:', req.method, req.url);

  try {
    const isGodMode = Deno.env.get('GOD_MODE') === 'true';

    // Create Supabase client with user's auth token
    const authHeader = req.headers.get('Authorization');
    console.log('[WorkflowOrchestrator] Auth check:', {
      hasAuthHeader: !!authHeader,
      isGodMode,
    });

    if (!authHeader && !isGodMode) {
      console.log(
        '[WorkflowOrchestrator] Auth failed: Missing authorization header',
      );
      return errorResponse('Missing authorization header', 401);
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseAnonKey) {
      return errorResponse('Server configuration error', 500);
    }

    // In GOD_MODE, use service role key for full access
    const supabase =
      isGodMode && supabaseServiceRoleKey
        ? createClient<Database>(supabaseUrl, supabaseServiceRoleKey)
        : createClient<Database>(supabaseUrl, supabaseAnonKey, {
            global: {
              headers: { Authorization: authHeader! },
            },
          });

    // Get user from auth (skip in god mode)
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    console.log('[WorkflowOrchestrator] User auth result:', {
      hasUser: !!user,
      userId: user?.id,
      authError: authError?.message,
    });

    if (!isGodMode && (authError || !user)) {
      console.log('[WorkflowOrchestrator] Auth failed: Invalid authentication');
      return errorResponse('Invalid authentication', 401);
    }

    const userId = user?.id ?? 'anonymous';
    const ctx: RequestContext = { supabase, userId };

    // Parse request
    const body: WorkflowOrchestratorRequest = await req.json();

    console.log('[WorkflowOrchestrator] Request body:', {
      action: body.action,
      workflow_type: (body as StartWorkflowRequest).workflow_type,
      conversation_id: (body as StartWorkflowRequest).conversation_id,
      trigger_message_id: (body as StartWorkflowRequest).trigger_message_id,
      workflow_id: (body as ResumeWorkflowRequest).workflow_id,
    });

    // Route to appropriate handler
    switch (body.action) {
      case 'start':
        return handleStart(ctx, body);
      case 'resume':
        return handleResume(ctx, body);
      case 'resolve_inflection':
        return handleResolveInflection(ctx, body);
      case 'cancel':
        return handleCancel(ctx, body);
      case 'provide_screenshot':
        return handleProvideScreenshot(ctx, body);
      default:
        return errorResponse(
          `Unknown action: ${(body as { action: string }).action}`,
          400,
        );
    }
  } catch (error) {
    console.error('[WorkflowOrchestrator] Top-level error:', error);
    console.error(
      '[WorkflowOrchestrator] Error stack:',
      error instanceof Error ? error.stack : 'No stack',
    );
    return errorResponse(
      error instanceof Error ? error.message : 'Internal server error',
      500,
    );
  }
});

// =============================================================================
// Action Handlers
// =============================================================================

/**
 * Start a new workflow
 */
async function handleStart(
  ctx: RequestContext,
  request: StartWorkflowRequest,
): Promise<Response> {
  console.log('[WorkflowOrchestrator:handleStart] Starting workflow:', {
    workflow_type: request.workflow_type,
    conversation_id: request.conversation_id,
    trigger_message_id: request.trigger_message_id,
  });

  const isGodMode = Deno.env.get('GOD_MODE') === 'true';

  // Validate conversation access
  console.log('[WorkflowOrchestrator:handleStart] Validating conversation...');
  const { data: conversation, error: convError } = await ctx.supabase
    .from('conversations')
    .select('id, user_id')
    .eq('id', request.conversation_id)
    .single();

  if (convError || !conversation) {
    console.log('[WorkflowOrchestrator:handleStart] Conversation not found:', {
      error: convError?.message,
      conversation_id: request.conversation_id,
    });
    return errorResponse('Conversation not found', 404);
  }

  console.log('[WorkflowOrchestrator:handleStart] Conversation found:', {
    conversation_id: conversation.id,
    user_id: conversation.user_id,
  });

  if (!isGodMode && conversation.user_id !== ctx.userId) {
    console.log('[WorkflowOrchestrator:handleStart] Access denied:', {
      conversation_user_id: conversation.user_id,
      request_user_id: ctx.userId,
    });
    return errorResponse('Access denied', 403);
  }

  // Validate trigger message exists
  console.log(
    '[WorkflowOrchestrator:handleStart] Validating trigger message...',
  );
  const { data: message, error: msgError } = await ctx.supabase
    .from('messages')
    .select('id, content')
    .eq('id', request.trigger_message_id)
    .eq('conversation_id', request.conversation_id)
    .single();

  if (msgError || !message) {
    console.log(
      '[WorkflowOrchestrator:handleStart] Trigger message not found:',
      {
        error: msgError?.message,
        message_id: request.trigger_message_id,
      },
    );
    return errorResponse('Trigger message not found', 404);
  }

  console.log('[WorkflowOrchestrator:handleStart] Trigger message found:', {
    message_id: message.id,
    content_type: typeof message.content,
    content_preview: JSON.stringify(message.content).slice(0, 200),
  });

  // Build workflow config
  const config = buildWorkflowConfig(request.config);
  console.log('[WorkflowOrchestrator:handleStart] Workflow config built:', {
    tier: config.models.tier,
    vision_model: config.models.vision,
    inflection_points_enabled: config.inflection_points?.enabled,
  });

  // Initialize workflow state based on type
  const state = initializeWorkflowState(request.workflow_type, message.content);
  console.log(
    '[WorkflowOrchestrator:handleStart] Workflow state initialized:',
    {
      type: state.type,
      original_image_ids: state.original_image_ids,
      image_count: state.original_image_ids.length,
    },
  );

  // Create workflow record
  console.log('[WorkflowOrchestrator:handleStart] Creating workflow record...');
  const { data: workflow, error: createError } = await ctx.supabase
    .from('workflows')
    .insert({
      conversation_id: request.conversation_id,
      trigger_message_id: request.trigger_message_id,
      workflow_type: request.workflow_type,
      status: 'running',
      state:
        state as unknown as Database['public']['Tables']['workflows']['Insert']['state'],
      config:
        config as unknown as Database['public']['Tables']['workflows']['Insert']['config'],
    })
    .select()
    .single();

  if (createError || !workflow) {
    console.error(
      '[WorkflowOrchestrator:handleStart] Failed to create workflow:',
      {
        error: createError?.message,
        code: createError?.code,
      },
    );
    return errorResponse(
      `Failed to create workflow: ${createError?.message}`,
      500,
    );
  }

  console.log('[WorkflowOrchestrator:handleStart] Workflow created:', {
    workflow_id: workflow.id,
    status: workflow.status,
  });

  // Execute workflow with SSE streaming
  console.log('[WorkflowOrchestrator:handleStart] Starting SSE streaming...');
  return streamWorkflowExecution(
    ctx.supabase,
    workflow as unknown as Workflow,
    config,
  );
}

/**
 * Resume a paused workflow
 */
async function handleResume(
  ctx: RequestContext,
  request: ResumeWorkflowRequest,
): Promise<Response> {
  const isGodMode = Deno.env.get('GOD_MODE') === 'true';

  // Load workflow
  const { data: workflow, error } = await ctx.supabase
    .from('workflows')
    .select('*, conversations!inner(user_id)')
    .eq('id', request.workflow_id)
    .single();

  if (error || !workflow) {
    return errorResponse('Workflow not found', 404);
  }

  // Check access
  const conv = workflow.conversations as unknown as { user_id: string };
  if (!isGodMode && conv.user_id !== ctx.userId) {
    return errorResponse('Access denied', 403);
  }

  // Check workflow can be resumed
  if (workflow.status !== 'awaiting_decision' && workflow.status !== 'failed') {
    return errorResponse(
      `Workflow cannot be resumed (status: ${workflow.status})`,
      400,
    );
  }

  // Update status to running
  await ctx.supabase
    .from('workflows')
    .update({ status: 'running', updated_at: new Date().toISOString() })
    .eq('id', request.workflow_id);

  const typedWorkflow = workflow as unknown as Workflow;
  const config = typedWorkflow.config;

  return streamWorkflowExecution(ctx.supabase, typedWorkflow, config);
}

/**
 * Resolve an inflection point with user's choice
 */
async function handleResolveInflection(
  ctx: RequestContext,
  request: ResolveInflectionRequest,
): Promise<Response> {
  const isGodMode = Deno.env.get('GOD_MODE') === 'true';

  // Load inflection point with workflow
  const { data: inflectionPoint, error } = await ctx.supabase
    .from('inflection_points')
    .select('*, workflows!inner(*, conversations!inner(user_id))')
    .eq('id', request.inflection_point_id)
    .single();

  if (error || !inflectionPoint) {
    return errorResponse('Inflection point not found', 404);
  }

  // Check access
  const workflow = inflectionPoint.workflows as unknown as Workflow & {
    conversations: { user_id: string };
  };
  if (!isGodMode && workflow.conversations.user_id !== ctx.userId) {
    return errorResponse('Access denied', 403);
  }

  // Check inflection point hasn't been resolved
  if (inflectionPoint.resolved_at) {
    return errorResponse('Inflection point already resolved', 400);
  }

  // Resolve the inflection point
  await ctx.supabase
    .from('inflection_points')
    .update({
      user_choice: request.user_choice,
      user_feedback: request.user_feedback,
      resolved_at: new Date().toISOString(),
    })
    .eq('id', request.inflection_point_id);

  // Update workflow status
  await ctx.supabase
    .from('workflows')
    .update({ status: 'running', updated_at: new Date().toISOString() })
    .eq('id', workflow.id);

  // Resume workflow execution from the inflection point
  const typedWorkflow = workflow as unknown as Workflow;
  return streamWorkflowResume(
    ctx.supabase,
    typedWorkflow,
    typedWorkflow.config,
    inflectionPoint.step_id,
    request.user_choice,
    request.user_feedback,
  );
}

/**
 * Cancel a running workflow
 */
async function handleCancel(
  ctx: RequestContext,
  request: CancelWorkflowRequest,
): Promise<Response> {
  const isGodMode = Deno.env.get('GOD_MODE') === 'true';

  // Load workflow
  const { data: workflow, error } = await ctx.supabase
    .from('workflows')
    .select('*, conversations!inner(user_id)')
    .eq('id', request.workflow_id)
    .single();

  if (error || !workflow) {
    return errorResponse('Workflow not found', 404);
  }

  // Check access
  const conv = workflow.conversations as unknown as { user_id: string };
  if (!isGodMode && conv.user_id !== ctx.userId) {
    return errorResponse('Access denied', 403);
  }

  // Check workflow can be cancelled
  if (workflow.status === 'completed' || workflow.status === 'cancelled') {
    return errorResponse(
      `Workflow cannot be cancelled (status: ${workflow.status})`,
      400,
    );
  }

  // Update status to cancelled
  await ctx.supabase
    .from('workflows')
    .update({
      status: 'cancelled',
      error: request.reason || 'Cancelled by user',
      updated_at: new Date().toISOString(),
    })
    .eq('id', request.workflow_id);

  return jsonResponse({
    success: true,
    workflow_id: request.workflow_id,
    status: 'cancelled',
  });
}

/**
 * Provide a screenshot for workflow verification
 */
async function handleProvideScreenshot(
  ctx: RequestContext,
  request: ProvideScreenshotRequest,
): Promise<Response> {
  console.log(
    '[WorkflowOrchestrator:handleProvideScreenshot] Received screenshot',
    {
      workflow_id: request.workflow_id,
      step_id: request.step_id,
      screenshot_image_id: request.screenshot_image_id,
    },
  );

  const isGodMode = Deno.env.get('GOD_MODE') === 'true';

  // Load workflow
  const { data: workflow, error } = await ctx.supabase
    .from('workflows')
    .select('*, conversations!inner(user_id)')
    .eq('id', request.workflow_id)
    .single();

  if (error || !workflow) {
    console.log(
      '[WorkflowOrchestrator:handleProvideScreenshot] Workflow not found',
      {
        error: error?.message,
        workflow_id: request.workflow_id,
      },
    );
    return errorResponse('Workflow not found', 404);
  }

  console.log(
    '[WorkflowOrchestrator:handleProvideScreenshot] Workflow loaded',
    {
      workflow_id: workflow.id,
      status: workflow.status,
      current_step: workflow.current_step,
    },
  );

  // Check access
  const conv = workflow.conversations as unknown as { user_id: string };
  if (!isGodMode && conv.user_id !== ctx.userId) {
    return errorResponse('Access denied', 403);
  }

  // Update workflow state with the screenshot image ID
  const currentState = workflow.state as unknown as VisionToScadState;
  console.log('[WorkflowOrchestrator:handleProvideScreenshot] Current state:', {
    render_image_ids: currentState.render_image_ids,
    scad_code_length: currentState.scad_code?.length,
  });

  const updatedState: VisionToScadState = {
    ...currentState,
    render_image_ids: [
      ...(currentState.render_image_ids || []),
      request.screenshot_image_id,
    ],
  };

  console.log('[WorkflowOrchestrator:handleProvideScreenshot] Updated state:', {
    render_image_ids: updatedState.render_image_ids,
  });

  await ctx.supabase
    .from('workflows')
    .update({
      state:
        updatedState as unknown as Database['public']['Tables']['workflows']['Update']['state'],
      status: 'running',
      updated_at: new Date().toISOString(),
    })
    .eq('id', request.workflow_id);

  console.log(
    '[WorkflowOrchestrator:handleProvideScreenshot] State persisted, resuming workflow',
  );

  // Resume the workflow to continue verification
  const typedWorkflow: Workflow = {
    ...(workflow as unknown as Workflow),
    state: updatedState,
    status: 'running',
  };

  return streamWorkflowResume(
    ctx.supabase,
    typedWorkflow,
    typedWorkflow.config,
    request.step_id,
    'screenshot_provided',
    undefined,
  );
}

// =============================================================================
// Workflow Execution
// =============================================================================

/**
 * Execute a workflow with SSE streaming
 */
function streamWorkflowExecution(
  supabase: SupabaseClient<Database>,
  workflow: Workflow,
  config: WorkflowConfig,
): Response {
  console.log(
    '[WorkflowOrchestrator:streamWorkflowExecution] Starting stream:',
    {
      workflow_id: workflow.id,
      workflow_type: workflow.workflow_type,
    },
  );

  const stream = new ReadableStream({
    async start(controller) {
      console.log(
        '[WorkflowOrchestrator:streamWorkflowExecution] Stream started',
      );

      const emit = (event: WorkflowEvent) => {
        console.log(
          '[WorkflowOrchestrator:streamWorkflowExecution] Emitting event:',
          event.type,
        );
        const data = `data: ${JSON.stringify(event)}\n\n`;
        controller.enqueue(new TextEncoder().encode(data));
      };

      const pipelineCtx: PipelineContext = {
        supabase,
        workflow,
        config,
        emit,
      };

      try {
        // Create and execute appropriate pipeline
        console.log(
          '[WorkflowOrchestrator:streamWorkflowExecution] Creating pipeline for:',
          workflow.workflow_type,
        );
        switch (workflow.workflow_type) {
          case 'vision-to-scad': {
            const pipeline = new VisionToScadPipeline(pipelineCtx);
            console.log(
              '[WorkflowOrchestrator:streamWorkflowExecution] Executing VisionToScad pipeline...',
            );
            await pipeline.execute();
            console.log(
              '[WorkflowOrchestrator:streamWorkflowExecution] Pipeline execution completed',
            );
            break;
          }
          // Add other workflow types here
          default:
            throw new Error(
              `Unsupported workflow type: ${workflow.workflow_type}`,
            );
        }
      } catch (error) {
        console.error(
          '[WorkflowOrchestrator:streamWorkflowExecution] Pipeline error:',
          error,
        );
        console.error(
          '[WorkflowOrchestrator:streamWorkflowExecution] Error stack:',
          error instanceof Error ? error.stack : 'No stack',
        );
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        emit({
          type: 'workflow.failed',
          workflow_id: workflow.id,
          error: errorMessage,
          recoverable: true,
          recovery_options: ['retry'],
        });
      } finally {
        // Send done marker
        console.log(
          '[WorkflowOrchestrator:streamWorkflowExecution] Sending done marker',
        );
        controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      ...corsHeaders,
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}

/**
 * Resume a workflow from a specific step after inflection point resolution
 */
function streamWorkflowResume(
  supabase: SupabaseClient<Database>,
  workflow: Workflow,
  config: WorkflowConfig,
  stepId: string,
  userChoice: string,
  userFeedback?: string,
): Response {
  console.log('[WorkflowOrchestrator:streamWorkflowResume] Starting resume', {
    workflow_id: workflow.id,
    stepId,
    userChoice,
    userFeedback,
    workflow_state_render_image_ids: (workflow.state as VisionToScadState)
      .render_image_ids,
  });

  const stream = new ReadableStream({
    async start(controller) {
      console.log('[WorkflowOrchestrator:streamWorkflowResume] Stream started');

      const emit = (event: WorkflowEvent) => {
        console.log(
          '[WorkflowOrchestrator:streamWorkflowResume] Emitting event:',
          event.type,
        );
        const data = `data: ${JSON.stringify(event)}\n\n`;
        controller.enqueue(new TextEncoder().encode(data));
      };

      const pipelineCtx: PipelineContext = {
        supabase,
        workflow,
        config,
        emit,
      };

      try {
        // Get step name from step ID
        console.log(
          '[WorkflowOrchestrator:streamWorkflowResume] Fetching step name for:',
          stepId,
        );
        const { data: step, error: stepError } = await supabase
          .from('workflow_steps')
          .select('step_name')
          .eq('id', stepId)
          .single();

        console.log(
          '[WorkflowOrchestrator:streamWorkflowResume] Step lookup result:',
          {
            step_name: step?.step_name,
            error: stepError?.message,
          },
        );

        const stepName = step?.step_name || 'unknown';

        // Create and resume appropriate pipeline
        console.log(
          '[WorkflowOrchestrator:streamWorkflowResume] Creating pipeline for:',
          workflow.workflow_type,
        );
        switch (workflow.workflow_type) {
          case 'vision-to-scad': {
            const pipeline = new VisionToScadPipeline(pipelineCtx);
            console.log(
              '[WorkflowOrchestrator:streamWorkflowResume] Calling resumeFrom:',
              stepName,
            );
            await pipeline.resumeFrom(stepName, userChoice, userFeedback);
            console.log(
              '[WorkflowOrchestrator:streamWorkflowResume] resumeFrom completed',
            );
            break;
          }
          default:
            throw new Error(
              `Unsupported workflow type: ${workflow.workflow_type}`,
            );
        }
      } catch (error) {
        console.error(
          '[WorkflowOrchestrator:streamWorkflowResume] Error:',
          error,
        );
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        emit({
          type: 'workflow.failed',
          workflow_id: workflow.id,
          error: errorMessage,
          recoverable: true,
          recovery_options: ['retry'],
        });
      } finally {
        console.log(
          '[WorkflowOrchestrator:streamWorkflowResume] Closing stream',
        );
        controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      ...corsHeaders,
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Build workflow config with defaults and tier-specific models
 */
function buildWorkflowConfig(
  overrides?: Partial<WorkflowConfig>,
): WorkflowConfig {
  const baseConfig: WorkflowConfig = {
    models: {
      tier: overrides?.models?.tier || 'balanced',
    },
    prompts: {
      version: overrides?.prompts?.version || 'v1.0',
    },
    preprocessing: {
      enabled: true,
      max_dimension: 1568,
      format: 'jpeg',
      quality: 85,
      enhance: false,
      ...overrides?.preprocessing,
    },
    inflection_points: {
      enabled: true,
      ...overrides?.inflection_points,
    },
    verification: {
      enabled: true, // Enable verification by default for image comparison
      auto_verify: false,
      max_iterations: 3,
      ...overrides?.verification,
    },
  };

  // Get tier-specific models
  const tierModels = getTierModelConfig(baseConfig.models.tier);

  // Apply model overrides or use tier defaults
  baseConfig.models.vision = overrides?.models?.vision || tierModels.vision;
  baseConfig.models.code_generation =
    overrides?.models?.code_generation || tierModels.code_generation;
  baseConfig.models.verification =
    overrides?.models?.verification || tierModels.verification;

  return baseConfig;
}

/**
 * Initialize workflow state based on type
 */
function initializeWorkflowState(
  workflowType: string,
  messageContent: unknown,
): VisionToScadState {
  // Extract image IDs from message content
  const imageIds = extractImageIds(messageContent);

  switch (workflowType) {
    case 'vision-to-scad':
      return {
        type: 'vision-to-scad',
        original_image_ids: imageIds,
        verification_attempts: 0,
      };
    default:
      return {
        type: 'vision-to-scad',
        original_image_ids: imageIds,
        verification_attempts: 0,
      };
  }
}

/**
 * Extract image IDs from message content
 */
function extractImageIds(content: unknown): string[] {
  console.log(
    '[WorkflowOrchestrator:extractImageIds] Extracting from content:',
    {
      type: typeof content,
      isArray: Array.isArray(content),
      preview: JSON.stringify(content).slice(0, 500),
    },
  );

  if (!content) {
    console.log('[WorkflowOrchestrator:extractImageIds] Content is empty');
    return [];
  }

  // Handle array of content parts (multimodal message)
  if (Array.isArray(content)) {
    console.log(
      '[WorkflowOrchestrator:extractImageIds] Content is array with',
      content.length,
      'parts',
    );
    const imageIds = content
      .filter(
        (part): part is { type: 'image'; image_id: string } =>
          typeof part === 'object' &&
          part !== null &&
          'type' in part &&
          part.type === 'image' &&
          'image_id' in part,
      )
      .map((part) => part.image_id);
    console.log(
      '[WorkflowOrchestrator:extractImageIds] Extracted image IDs from array:',
      imageIds,
    );
    return imageIds;
  }

  // Handle single content object
  if (typeof content === 'object' && content !== null) {
    const obj = content as Record<string, unknown>;
    console.log(
      '[WorkflowOrchestrator:extractImageIds] Content is object with keys:',
      Object.keys(obj),
    );
    if (obj.type === 'image' && typeof obj.image_id === 'string') {
      console.log(
        '[WorkflowOrchestrator:extractImageIds] Found single image:',
        obj.image_id,
      );
      return [obj.image_id];
    }
    if ('images' in obj && Array.isArray(obj.images)) {
      const imageIds = obj.images.filter(
        (id): id is string => typeof id === 'string',
      );
      console.log(
        '[WorkflowOrchestrator:extractImageIds] Found images array:',
        imageIds,
      );
      return imageIds;
    }
  }

  console.log('[WorkflowOrchestrator:extractImageIds] No images found');
  return [];
}

/**
 * Create error response
 */
function errorResponse(message: string, status: number): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  });
}

/**
 * Create JSON response
 */
function jsonResponse(data: unknown, status: number = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  });
}
