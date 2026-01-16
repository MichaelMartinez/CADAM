/**
 * Base Workflow Pipeline
 *
 * Abstract base class for all workflow pipelines. Provides common functionality
 * for step management, state persistence, inflection points, and streaming.
 */

import { SupabaseClient } from 'npm:@supabase/supabase-js@2';
import type { Database } from '@shared/database.ts';
import type {
  Workflow,
  WorkflowState,
  WorkflowStep,
  WorkflowConfig,
  WorkflowStatus,
  StepType,
  InflectionPoint,
  InflectionPointContext,
  InflectionPointOption,
  WorkflowEvent,
} from '@shared/workflowTypes.ts';

// =============================================================================
// Types
// =============================================================================

export interface PipelineContext {
  supabase: SupabaseClient<Database>;
  workflow: Workflow;
  config: WorkflowConfig;
  emit: (event: WorkflowEvent) => void;
}

export interface StepResult<T = unknown> {
  success: boolean;
  output?: T;
  error?: string;
  tokensUsed?: number;
}

export interface InflectionPointRequest {
  title: string;
  description?: string;
  context: InflectionPointContext;
  options: InflectionPointOption[];
}

// =============================================================================
// Base Pipeline Class
// =============================================================================

export abstract class WorkflowPipeline<TState extends WorkflowState> {
  protected ctx: PipelineContext;
  protected currentStep: WorkflowStep | null = null;

  constructor(ctx: PipelineContext) {
    this.ctx = ctx;
  }

  // ---------------------------------------------------------------------------
  // Abstract Methods - Must be implemented by concrete pipelines
  // ---------------------------------------------------------------------------

  /**
   * Execute the pipeline. Called when the workflow starts or resumes.
   */
  abstract execute(): Promise<void>;

  /**
   * Resume from a specific step after an inflection point is resolved.
   */
  abstract resumeFrom(
    stepName: string,
    userChoice: string,
    userFeedback?: string,
  ): Promise<void>;

  /**
   * Get the current state typed correctly
   */
  protected abstract getTypedState(): TState;

  // ---------------------------------------------------------------------------
  // State Management
  // ---------------------------------------------------------------------------

  /**
   * Get workflow state
   */
  protected get state(): WorkflowState {
    return this.ctx.workflow.state;
  }

  /**
   * Update workflow state
   */
  protected async updateState(updates: Partial<TState>): Promise<void> {
    const newState = {
      ...this.ctx.workflow.state,
      ...updates,
    } as WorkflowState;
    this.ctx.workflow.state = newState;

    await this.ctx.supabase
      .from('workflows')
      .update({
        state:
          newState as unknown as Database['public']['Tables']['workflows']['Update']['state'],
        updated_at: new Date().toISOString(),
      })
      .eq('id', this.ctx.workflow.id);
  }

  /**
   * Update workflow status
   */
  protected async updateWorkflowStatus(
    status: WorkflowStatus,
    error?: string,
  ): Promise<void> {
    this.ctx.workflow.status = status;

    await this.ctx.supabase
      .from('workflows')
      .update({
        status,
        error: error || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', this.ctx.workflow.id);
  }

  // ---------------------------------------------------------------------------
  // Step Management
  // ---------------------------------------------------------------------------

  /**
   * Create and start a new step
   */
  protected async startStep(
    stepName: string,
    stepType: StepType,
    input: unknown = null,
  ): Promise<WorkflowStep> {
    const step: Database['public']['Tables']['workflow_steps']['Insert'] = {
      workflow_id: this.ctx.workflow.id,
      step_name: stepName,
      step_type: stepType,
      status: 'running',
      input:
        input as Database['public']['Tables']['workflow_steps']['Insert']['input'],
    };

    const { data, error } = await this.ctx.supabase
      .from('workflow_steps')
      .insert(step)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create step: ${error.message}`);
    }

    this.currentStep = data as unknown as WorkflowStep;

    // Update workflow's current step
    await this.ctx.supabase
      .from('workflows')
      .update({
        current_step: stepName,
        updated_at: new Date().toISOString(),
      })
      .eq('id', this.ctx.workflow.id);

    // Emit step started event
    this.emit({
      type: 'workflow.step.started',
      step: this.currentStep,
    });

    return this.currentStep;
  }

  /**
   * Complete a step with output
   */
  protected async completeStep(
    step: WorkflowStep,
    output: unknown,
    options: {
      modelUsed?: string;
      promptVersion?: string;
      tokensUsed?: number;
    } = {},
  ): Promise<void> {
    const startTime = new Date(step.created_at).getTime();
    const durationMs = Date.now() - startTime;

    const updates: Database['public']['Tables']['workflow_steps']['Update'] = {
      status: 'completed',
      output:
        output as Database['public']['Tables']['workflow_steps']['Update']['output'],
      completed_at: new Date().toISOString(),
      duration_ms: durationMs,
      model_used: options.modelUsed || null,
      prompt_version: options.promptVersion || null,
      tokens_used: options.tokensUsed || null,
    };

    await this.ctx.supabase
      .from('workflow_steps')
      .update(updates)
      .eq('id', step.id);

    // Update local step object
    step.status = 'completed';
    step.output = output;
    step.duration_ms = durationMs;
    step.completed_at = updates.completed_at || undefined;

    // Emit step completed event
    this.emit({
      type: 'workflow.step.completed',
      step,
    });
  }

  /**
   * Fail a step with error
   */
  protected async failStep(step: WorkflowStep, error: string): Promise<void> {
    const startTime = new Date(step.created_at).getTime();
    const durationMs = Date.now() - startTime;

    await this.ctx.supabase
      .from('workflow_steps')
      .update({
        status: 'failed',
        error,
        completed_at: new Date().toISOString(),
        duration_ms: durationMs,
      })
      .eq('id', step.id);

    step.status = 'failed';
    step.error = error;
    step.duration_ms = durationMs;

    this.emit({
      type: 'workflow.step.completed',
      step,
    });
  }

  /**
   * Skip a step
   */
  protected async skipStep(stepName: string, reason: string): Promise<void> {
    const step: Database['public']['Tables']['workflow_steps']['Insert'] = {
      workflow_id: this.ctx.workflow.id,
      step_name: stepName,
      step_type: 'preprocessing',
      status: 'skipped',
      output: {
        reason,
      } as Database['public']['Tables']['workflow_steps']['Insert']['output'],
      completed_at: new Date().toISOString(),
    };

    await this.ctx.supabase.from('workflow_steps').insert(step);
  }

  /**
   * Emit step progress
   */
  protected emitProgress(progress: number, message?: string): void {
    if (!this.currentStep) return;

    this.emit({
      type: 'workflow.step.progress',
      step_id: this.currentStep.id,
      progress,
      message,
    });
  }

  // ---------------------------------------------------------------------------
  // Inflection Points
  // ---------------------------------------------------------------------------

  /**
   * Create an inflection point and wait for user decision
   */
  protected async createInflectionPoint(
    request: InflectionPointRequest,
  ): Promise<InflectionPoint> {
    if (!this.currentStep) {
      throw new Error('Cannot create inflection point without active step');
    }

    // Mark step as an inflection point type
    await this.ctx.supabase
      .from('workflow_steps')
      .update({ step_type: 'inflection_point' })
      .eq('id', this.currentStep.id);

    const inflectionPoint: Database['public']['Tables']['inflection_points']['Insert'] =
      {
        workflow_id: this.ctx.workflow.id,
        step_id: this.currentStep.id,
        title: request.title,
        description: request.description,
        context:
          request.context as Database['public']['Tables']['inflection_points']['Insert']['context'],
        options:
          request.options as unknown as Database['public']['Tables']['inflection_points']['Insert']['options'],
      };

    const { data, error } = await this.ctx.supabase
      .from('inflection_points')
      .insert(inflectionPoint)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create inflection point: ${error.message}`);
    }

    // Update workflow status to awaiting_decision
    await this.updateWorkflowStatus('awaiting_decision');

    const ip = data as unknown as InflectionPoint;

    // Emit inflection point event
    this.emit({
      type: 'workflow.inflection_point',
      inflection_point: ip,
    });

    return ip;
  }

  /**
   * Resolve an inflection point with user's choice
   */
  protected async resolveInflectionPoint(
    inflectionPointId: string,
    userChoice: string,
    userFeedback?: string,
  ): Promise<InflectionPoint> {
    const { data, error } = await this.ctx.supabase
      .from('inflection_points')
      .update({
        user_choice: userChoice,
        user_feedback: userFeedback,
        resolved_at: new Date().toISOString(),
      })
      .eq('id', inflectionPointId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to resolve inflection point: ${error.message}`);
    }

    // Resume workflow
    await this.updateWorkflowStatus('running');

    return data as unknown as InflectionPoint;
  }

  // ---------------------------------------------------------------------------
  // Completion Handlers
  // ---------------------------------------------------------------------------

  /**
   * Complete the workflow successfully
   */
  protected async completeWorkflow(outputMessageId?: string): Promise<void> {
    await this.updateWorkflowStatus('completed');

    if (outputMessageId) {
      // Update state with output_message_id if the state type supports it
      const stateUpdate = { output_message_id: outputMessageId };
      await this.ctx.supabase
        .from('workflows')
        .update({
          state: {
            ...this.ctx.workflow.state,
            ...stateUpdate,
          } as unknown as Database['public']['Tables']['workflows']['Update']['state'],
          updated_at: new Date().toISOString(),
        })
        .eq('id', this.ctx.workflow.id);
    }

    this.emit({
      type: 'workflow.completed',
      workflow: this.ctx.workflow,
      output_message_id: outputMessageId,
    });
  }

  /**
   * Fail the workflow
   */
  protected async failWorkflow(
    error: string,
    recoverable: boolean = false,
    recoveryOptions?: string[],
  ): Promise<void> {
    await this.updateWorkflowStatus('failed', error);

    this.emit({
      type: 'workflow.failed',
      workflow_id: this.ctx.workflow.id,
      error,
      recoverable,
      recovery_options: recoveryOptions,
    });
  }

  /**
   * Cancel the workflow
   */
  protected async cancelWorkflow(reason?: string): Promise<void> {
    await this.updateWorkflowStatus('cancelled', reason);

    this.emit({
      type: 'workflow.cancelled',
      workflow_id: this.ctx.workflow.id,
      reason,
    });
  }

  // ---------------------------------------------------------------------------
  // Utility Methods
  // ---------------------------------------------------------------------------

  /**
   * Emit a workflow event
   */
  protected emit(event: WorkflowEvent): void {
    this.ctx.emit(event);
  }

  /**
   * Get config value with fallback
   */
  protected getConfig<K extends keyof WorkflowConfig>(
    key: K,
  ): WorkflowConfig[K] {
    return this.ctx.config[key];
  }

  /**
   * Check if inflection points are enabled
   */
  protected get inflectionPointsEnabled(): boolean {
    return this.ctx.config.inflection_points.enabled;
  }

  /**
   * Check if verification is enabled
   */
  protected get verificationEnabled(): boolean {
    return this.ctx.config.verification?.enabled ?? false;
  }

  /**
   * Load a pending inflection point for this workflow
   */
  protected async loadPendingInflectionPoint(): Promise<InflectionPoint | null> {
    const { data, error } = await this.ctx.supabase
      .from('inflection_points')
      .select('*')
      .eq('workflow_id', this.ctx.workflow.id)
      .is('resolved_at', null)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      return null;
    }

    return data as unknown as InflectionPoint;
  }

  /**
   * Load completed steps for this workflow
   */
  protected async loadCompletedSteps(): Promise<WorkflowStep[]> {
    const { data, error } = await this.ctx.supabase
      .from('workflow_steps')
      .select('*')
      .eq('workflow_id', this.ctx.workflow.id)
      .eq('status', 'completed')
      .order('created_at', { ascending: true });

    if (error) {
      throw new Error(`Failed to load completed steps: ${error.message}`);
    }

    return (data || []) as unknown as WorkflowStep[];
  }
}
