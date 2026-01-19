/**
 * Workflow Type System
 *
 * Comprehensive types for the multi-modal agentic workflow system.
 * Used by both frontend and backend (edge functions).
 */

// =============================================================================
// Core Enums and Discriminators
// =============================================================================

// Note: 'vision-to-scad' was removed - use one-shot chat for image-to-CAD conversion
export type WorkflowType =
  | 'verification-loop'
  | 'assembly-explode'
  | 'multi-angle-optimize';

export type WorkflowStatus =
  | 'pending'
  | 'running'
  | 'awaiting_decision'
  | 'completed'
  | 'failed'
  | 'cancelled';

export type StepType =
  | 'preprocessing'
  | 'ai_call'
  | 'inflection_point'
  | 'postprocessing'
  | 'verification';

export type StepStatus =
  | 'pending'
  | 'running'
  | 'completed'
  | 'failed'
  | 'skipped';

export type ModelTier = 'best' | 'balanced' | 'fast' | 'experimental';

// =============================================================================
// Workflow Entity
// =============================================================================

export interface Workflow {
  id: string;
  conversation_id: string;
  trigger_message_id: string;
  workflow_type: WorkflowType;
  status: WorkflowStatus;
  current_step: string | null;
  state: WorkflowState;
  config: WorkflowConfig;
  error?: string;
  created_at: string;
  updated_at: string;
}

// =============================================================================
// Workflow State (Type-specific)
// =============================================================================

// Note: VisionToScadState was removed - use one-shot chat for image-to-CAD conversion
export type WorkflowState =
  | VerificationLoopState
  | AssemblyExplodeState
  | MultiAngleOptimizeState;

export interface VerificationLoopState {
  type: 'verification-loop';
  target_image_id: string;
  current_scad_code: string;
  render_image_id?: string;
  diff_analysis?: string;
  iteration_count: number;
  max_iterations: number;
}

export interface AssemblyExplodeState {
  type: 'assembly-explode';
  base_scad_code: string;
  part_modules: string[];
  explosion_spacing: number;
  exploded_code?: string;
}

export interface MultiAngleOptimizeState {
  type: 'multi-angle-optimize';
  image_ids: string[];
  angle_analyses: Array<{
    image_id: string;
    angle: string;
    description: string;
  }>;
  combined_description?: string;
}

// =============================================================================
// Workflow Configuration
// =============================================================================

export interface WorkflowConfig {
  models: ModelConfig;
  prompts: PromptConfig;
  preprocessing: PreprocessingConfig;
  inflection_points: InflectionPointsConfig;
  verification?: VerificationConfig;
}

export interface ModelConfig {
  tier: ModelTier;
  vision?: string; // Override for vision model
  code_generation?: string; // Override for code model
  verification?: string; // Override for verification model
}

export interface PromptConfig {
  version: string; // e.g., "v1.2"
  overrides?: Record<string, string>; // Prompt template overrides
}

export interface PreprocessingConfig {
  enabled: boolean;
  max_dimension?: number;
  format?: 'png' | 'jpeg' | 'webp';
  quality?: number; // 1-100
  enhance?: boolean;
}

export interface InflectionPointsConfig {
  enabled: boolean;
  auto_proceed_timeout_ms?: number;
}

export interface VerificationConfig {
  enabled: boolean;
  auto_verify: boolean;
  max_iterations: number;
}

// =============================================================================
// Workflow Step
// =============================================================================

export interface WorkflowStep {
  id: string;
  workflow_id: string;
  step_name: string;
  step_type: StepType;
  input: unknown;
  output: unknown;
  model_used?: string;
  prompt_version?: string;
  tokens_used?: number;
  duration_ms?: number;
  status: StepStatus;
  error?: string;
  created_at: string;
  completed_at?: string;
}

// =============================================================================
// Inflection Point
// =============================================================================

export interface InflectionPoint {
  id: string;
  workflow_id: string;
  step_id: string;
  title: string;
  description?: string;
  context: InflectionPointContext;
  options: InflectionPointOption[];
  user_choice?: string;
  user_feedback?: string;
  created_at: string;
  resolved_at?: string;
}

export interface InflectionPointContext {
  // Images to display
  images?: Array<{
    id: string;
    url?: string;
    label?: string;
  }>;
  // Code preview
  preview_code?: string;
  // Side-by-side comparison
  comparison?: {
    before: { image_id: string; url?: string; label: string };
    after: { image_id: string; url?: string; label: string };
  };
  // VLM analysis to display
  analysis?: VLMStructuredOutput;
  // Verification result
  verification?: VerificationResult;
  // Any additional metadata
  metadata?: Record<string, unknown>;
}

export interface InflectionPointOption {
  id: string;
  label: string;
  description?: string;
  icon?: 'proceed' | 'retry' | 'edit' | 'cancel' | 'verify';
  action: InflectionPointAction;
  variant?: 'default' | 'primary' | 'destructive' | 'outline';
}

export type InflectionPointAction =
  | { type: 'proceed' }
  | { type: 'proceed_with_code'; code: string }
  | { type: 'restart'; from_step?: string }
  | { type: 'modify'; requires_feedback: boolean }
  | { type: 'cancel' }
  | { type: 'verify' }
  | { type: 'use_different_model'; model_tier: ModelTier };

// =============================================================================
// VLM Output Types
// =============================================================================

export interface VLMStructuredOutput {
  image_type:
    | 'technical_drawing'
    | 'sketch'
    | 'photo'
    | 'cad_screenshot'
    | 'unknown';
  description: string;
  geometry: {
    primary_shapes: string[];
    operations: string[];
    features: string[];
  };
  dimensions: {
    overall?: {
      length?: number;
      width?: number;
      height?: number;
    };
    features?: Record<string, number>;
  };
  confidence: 'high' | 'medium' | 'low';
  ambiguities?: string[];
  openscad_vocabulary: string[];
}

// =============================================================================
// Verification Types
// =============================================================================

export interface VerificationResult {
  match_quality: 'excellent' | 'good' | 'fair' | 'poor';
  discrepancies: string[];
  recommendation: 'proceed' | 'minor_adjustment' | 'major_revision';
  similarity_score?: number; // 0-100
  details?: {
    proportions_match: boolean;
    features_match: boolean;
    dimensions_match: boolean;
  };
}

// =============================================================================
// Streaming Events
// =============================================================================

export type WorkflowEvent =
  | WorkflowStartedEvent
  | WorkflowStepStartedEvent
  | WorkflowStepProgressEvent
  | WorkflowStepCompletedEvent
  | WorkflowInflectionPointEvent
  | WorkflowScreenshotRequestedEvent
  | WorkflowCompletedEvent
  | WorkflowFailedEvent
  | WorkflowCancelledEvent;

export interface WorkflowStartedEvent {
  type: 'workflow.started';
  workflow_id: string;
  workflow_type: WorkflowType;
}

export interface WorkflowStepStartedEvent {
  type: 'workflow.step.started';
  step: WorkflowStep;
}

export interface WorkflowStepProgressEvent {
  type: 'workflow.step.progress';
  step_id: string;
  progress: number; // 0-100
  message?: string;
}

export interface WorkflowStepCompletedEvent {
  type: 'workflow.step.completed';
  step: WorkflowStep;
}

export interface WorkflowInflectionPointEvent {
  type: 'workflow.inflection_point';
  inflection_point: InflectionPoint;
}

export interface WorkflowScreenshotRequestedEvent {
  type: 'workflow.screenshot_requested';
  workflow_id: string;
  step_id: string;
  purpose: 'verification' | 'comparison';
  scad_code?: string;
}

export interface WorkflowCompletedEvent {
  type: 'workflow.completed';
  workflow: Workflow;
  output_message_id?: string;
}

export interface WorkflowFailedEvent {
  type: 'workflow.failed';
  workflow_id: string;
  error: string;
  recoverable: boolean;
  recovery_options?: string[];
}

export interface WorkflowCancelledEvent {
  type: 'workflow.cancelled';
  workflow_id: string;
  reason?: string;
}

// =============================================================================
// API Request/Response Types
// =============================================================================

export interface StartWorkflowRequest {
  action: 'start';
  workflow_type: WorkflowType;
  conversation_id: string;
  trigger_message_id: string;
  config?: Partial<WorkflowConfig>;
}

export interface ResumeWorkflowRequest {
  action: 'resume';
  workflow_id: string;
}

export interface ResolveInflectionRequest {
  action: 'resolve_inflection';
  inflection_point_id: string;
  user_choice: string;
  user_feedback?: string;
}

export interface CancelWorkflowRequest {
  action: 'cancel';
  workflow_id: string;
  reason?: string;
}

export interface ProvideScreenshotRequest {
  action: 'provide_screenshot';
  workflow_id: string;
  step_id: string;
  screenshot_image_id: string;
}

export type WorkflowOrchestratorRequest =
  | StartWorkflowRequest
  | ResumeWorkflowRequest
  | ResolveInflectionRequest
  | CancelWorkflowRequest
  | ProvideScreenshotRequest;

// =============================================================================
// Model Registry Types
// =============================================================================

export interface ModelCapabilities {
  vision: boolean;
  tools: boolean;
  thinking: boolean;
  structured_output: boolean;
  max_tokens: number;
  max_image_size?: number;
}

export interface ModelEntry {
  id: string;
  name: string;
  provider: string;
  tier: ModelTier;
  capabilities: ModelCapabilities;
  optimal_image_size?: { width: number; height: number };
  supported_formats?: string[];
  cost_per_1k_input?: number;
  cost_per_1k_output?: number;
}

// =============================================================================
// Default Configuration
// =============================================================================

export const DEFAULT_WORKFLOW_CONFIG: WorkflowConfig = {
  models: {
    tier: 'balanced',
  },
  prompts: {
    version: 'v1.0',
  },
  preprocessing: {
    enabled: true,
    max_dimension: 1568,
    format: 'jpeg',
    quality: 85,
    enhance: false,
  },
  inflection_points: {
    enabled: true,
  },
  verification: {
    enabled: false,
    auto_verify: false,
    max_iterations: 3,
  },
};

// =============================================================================
// Type Guards
// =============================================================================

// Note: isVisionToScadState was removed - use one-shot chat for image-to-CAD conversion

export function isVerificationLoopState(
  state: WorkflowState,
): state is VerificationLoopState {
  return (state as VerificationLoopState).type === 'verification-loop';
}

export function isAssemblyExplodeState(
  state: WorkflowState,
): state is AssemblyExplodeState {
  return (state as AssemblyExplodeState).type === 'assembly-explode';
}

export function isMultiAngleOptimizeState(
  state: WorkflowState,
): state is MultiAngleOptimizeState {
  return (state as MultiAngleOptimizeState).type === 'multi-angle-optimize';
}
