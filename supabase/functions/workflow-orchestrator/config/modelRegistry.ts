/**
 * Model Registry
 *
 * Maps model tiers to specific OpenRouter models with capability metadata.
 * Can be extended to pull from OpenRouter API for dynamic model discovery.
 */

import type {
  ModelTier,
  ModelEntry,
  ModelCapabilities,
} from '@shared/workflowTypes.ts';

// =============================================================================
// Model Registry
// =============================================================================

/**
 * Static model registry with known capable models.
 * Organized by tier for quick lookup.
 */
const MODEL_REGISTRY: ModelEntry[] = [
  // === BEST TIER ===
  // Highest quality, most expensive, best for complex tasks
  {
    id: 'anthropic/claude-opus-4',
    name: 'Claude Opus 4',
    provider: 'anthropic',
    tier: 'best',
    capabilities: {
      vision: true,
      tools: true,
      thinking: true,
      structured_output: true,
      max_tokens: 32000,
      max_image_size: 8000,
    },
    optimal_image_size: { width: 1568, height: 1568 },
    supported_formats: ['jpeg', 'png', 'webp', 'gif'],
    cost_per_1k_input: 0.015,
    cost_per_1k_output: 0.075,
  },
  {
    id: 'google/gemini-2.5-pro-preview',
    name: 'Gemini 2.5 Pro',
    provider: 'google',
    tier: 'best',
    capabilities: {
      vision: true,
      tools: true,
      thinking: true,
      structured_output: true,
      max_tokens: 65536,
      max_image_size: 4096,
    },
    optimal_image_size: { width: 2048, height: 2048 },
    supported_formats: ['jpeg', 'png', 'webp'],
    cost_per_1k_input: 0.00125,
    cost_per_1k_output: 0.01,
  },

  // === BALANCED TIER ===
  // Good quality, reasonable cost, suitable for most tasks
  {
    id: 'anthropic/claude-sonnet-4',
    name: 'Claude Sonnet 4',
    provider: 'anthropic',
    tier: 'balanced',
    capabilities: {
      vision: true,
      tools: true,
      thinking: true,
      structured_output: true,
      max_tokens: 16000,
      max_image_size: 8000,
    },
    optimal_image_size: { width: 1568, height: 1568 },
    supported_formats: ['jpeg', 'png', 'webp', 'gif'],
    cost_per_1k_input: 0.003,
    cost_per_1k_output: 0.015,
  },
  {
    id: 'openai/gpt-4o',
    name: 'GPT-4o',
    provider: 'openai',
    tier: 'balanced',
    capabilities: {
      vision: true,
      tools: true,
      thinking: false,
      structured_output: true,
      max_tokens: 16384,
      max_image_size: 2048,
    },
    optimal_image_size: { width: 1024, height: 1024 },
    supported_formats: ['jpeg', 'png', 'webp', 'gif'],
    cost_per_1k_input: 0.0025,
    cost_per_1k_output: 0.01,
  },

  // === FAST TIER ===
  // Quick responses, lower cost, good for preprocessing and simple tasks
  {
    id: 'anthropic/claude-3.5-haiku',
    name: 'Claude 3.5 Haiku',
    provider: 'anthropic',
    tier: 'fast',
    capabilities: {
      vision: true,
      tools: true,
      thinking: false,
      structured_output: true,
      max_tokens: 8192,
      max_image_size: 8000,
    },
    optimal_image_size: { width: 1024, height: 1024 },
    supported_formats: ['jpeg', 'png', 'webp', 'gif'],
    cost_per_1k_input: 0.0008,
    cost_per_1k_output: 0.004,
  },
  {
    id: 'google/gemini-2.0-flash',
    name: 'Gemini 2.0 Flash',
    provider: 'google',
    tier: 'fast',
    capabilities: {
      vision: true,
      tools: true,
      thinking: false,
      structured_output: true,
      max_tokens: 8192,
      max_image_size: 4096,
    },
    optimal_image_size: { width: 1024, height: 1024 },
    supported_formats: ['jpeg', 'png', 'webp'],
    cost_per_1k_input: 0.0001,
    cost_per_1k_output: 0.0004,
  },

  // === EXPERIMENTAL TIER ===
  // Newer models, may have cutting-edge capabilities but less tested
  {
    id: 'google/gemini-2.5-flash-preview',
    name: 'Gemini 2.5 Flash Preview',
    provider: 'google',
    tier: 'experimental',
    capabilities: {
      vision: true,
      tools: true,
      thinking: true,
      structured_output: true,
      max_tokens: 65536,
      max_image_size: 4096,
    },
    optimal_image_size: { width: 2048, height: 2048 },
    supported_formats: ['jpeg', 'png', 'webp'],
    cost_per_1k_input: 0.00015,
    cost_per_1k_output: 0.0006,
  },
  {
    id: 'qwen/qwen-2.5-vl-72b-instruct',
    name: 'Qwen 2.5 VL 72B',
    provider: 'qwen',
    tier: 'experimental',
    capabilities: {
      vision: true,
      tools: true,
      thinking: false,
      structured_output: false,
      max_tokens: 8192,
      max_image_size: 2048,
    },
    optimal_image_size: { width: 1024, height: 1024 },
    supported_formats: ['jpeg', 'png', 'webp'],
    cost_per_1k_input: 0.0004,
    cost_per_1k_output: 0.0004,
  },
  {
    id: 'meta-llama/llama-4-maverick',
    name: 'Llama 4 Maverick',
    provider: 'meta',
    tier: 'experimental',
    capabilities: {
      vision: true,
      tools: true,
      thinking: false,
      structured_output: false,
      max_tokens: 16384,
      max_image_size: 2048,
    },
    optimal_image_size: { width: 1024, height: 1024 },
    supported_formats: ['jpeg', 'png', 'webp'],
    cost_per_1k_input: 0.00022,
    cost_per_1k_output: 0.00088,
  },
];

// =============================================================================
// Lookup Functions
// =============================================================================

/**
 * Get all models for a specific tier
 */
export function getModelsForTier(tier: ModelTier): ModelEntry[] {
  return MODEL_REGISTRY.filter((m) => m.tier === tier);
}

/**
 * Get the primary (first) model for a tier, optionally filtered by capability
 */
export function getModelForTier(
  tier: ModelTier,
  requiredCapability?: keyof ModelCapabilities,
): string {
  const candidates = MODEL_REGISTRY.filter(
    (m) =>
      m.tier === tier &&
      (!requiredCapability || m.capabilities[requiredCapability]),
  );

  if (candidates.length === 0) {
    // Fallback to balanced tier if requested tier has no matches
    const fallback = MODEL_REGISTRY.find(
      (m) =>
        m.tier === 'balanced' &&
        (!requiredCapability || m.capabilities[requiredCapability]),
    );
    if (fallback) return fallback.id;
    throw new Error(
      `No model found for tier ${tier}${requiredCapability ? ` with capability ${requiredCapability}` : ''}`,
    );
  }

  return candidates[0].id;
}

/**
 * Get model metadata by ID
 */
export function getModelById(modelId: string): ModelEntry | undefined {
  return MODEL_REGISTRY.find((m) => m.id === modelId);
}

/**
 * Get model metadata, with fallback to default capabilities if not found
 */
export function getModelMetadata(modelId: string): ModelEntry {
  const model = getModelById(modelId);
  if (model) return model;

  // Return default metadata for unknown models
  return {
    id: modelId,
    name: modelId.split('/').pop() || modelId,
    provider: modelId.split('/')[0] || 'unknown',
    tier: 'experimental',
    capabilities: {
      vision: true, // Assume vision since we're in a vision workflow
      tools: false,
      thinking: false,
      structured_output: false,
      max_tokens: 8192,
    },
    optimal_image_size: { width: 1024, height: 1024 },
    supported_formats: ['jpeg', 'png', 'webp'],
  };
}

/**
 * Check if a model supports a specific capability
 */
export function modelSupports(
  modelId: string,
  capability: keyof ModelCapabilities,
): boolean {
  const model = getModelById(modelId);
  if (!model) return false;
  return Boolean(model.capabilities[capability]);
}

/**
 * Get optimal image preprocessing config for a model
 */
export function getImagePreprocessingForModel(modelId: string): {
  maxDimension: number;
  format: 'jpeg' | 'png' | 'webp';
  quality: number;
} {
  const model = getModelMetadata(modelId);

  return {
    maxDimension: model.optimal_image_size?.width || 1024,
    format: model.supported_formats?.includes('webp') ? 'webp' : 'jpeg',
    quality: 85,
  };
}

/**
 * Validate that a model ID exists or is a valid OpenRouter format
 */
export function isValidModelId(modelId: string): boolean {
  // Check if it's in our registry
  if (getModelById(modelId)) return true;

  // Check if it follows OpenRouter format: provider/model-name
  const parts = modelId.split('/');
  if (parts.length !== 2) return false;

  const [provider, name] = parts;
  return provider.length > 0 && name.length > 0;
}

/**
 * Get all models in the registry
 */
export function getAllModels(): ModelEntry[] {
  return [...MODEL_REGISTRY];
}

/**
 * Get tier configuration for workflow default models
 */
export function getTierModelConfig(tier: ModelTier): {
  vision: string;
  code_generation: string;
  verification: string;
} {
  // Vision model: prefer models with best vision capabilities
  const visionModel = getModelForTier(tier, 'vision');

  // Code generation: prefer models with thinking for better reasoning
  let codeModel: string;
  try {
    codeModel = getModelForTier(tier, 'thinking');
  } catch {
    codeModel = getModelForTier(tier, 'vision');
  }

  // Verification: can use faster model since it's comparison
  const verificationModel =
    tier === 'best'
      ? getModelForTier('balanced', 'vision')
      : getModelForTier('fast', 'vision');

  return {
    vision: visionModel,
    code_generation: codeModel,
    verification: verificationModel,
  };
}

// =============================================================================
// OpenRouter API Integration (Future)
// =============================================================================

/**
 * Fetch models from OpenRouter API and update registry
 * Call this periodically to keep model list current
 */
export async function fetchOpenRouterModels(
  apiKey: string,
): Promise<ModelEntry[]> {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/models', {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();

    // Filter and transform to our format
    const visionModels = data.data.filter(
      (model: { architecture?: { input_modalities?: string[] } }) =>
        model.architecture?.input_modalities?.includes('image'),
    );

    return visionModels.map(
      (model: {
        id: string;
        name: string;
        context_length: number;
        architecture?: { input_modalities?: string[] };
        pricing?: { prompt?: string; completion?: string };
      }): ModelEntry => ({
        id: model.id,
        name: model.name,
        provider: model.id.split('/')[0],
        tier: categorizeTier(model),
        capabilities: {
          vision:
            model.architecture?.input_modalities?.includes('image') || false,
          tools: true, // Assume true, validate at runtime
          thinking: false,
          structured_output: true,
          max_tokens: model.context_length || 8192,
        },
        cost_per_1k_input: parseFloat(model.pricing?.prompt || '0') * 1000,
        cost_per_1k_output: parseFloat(model.pricing?.completion || '0') * 1000,
      }),
    );
  } catch (error) {
    console.error('Failed to fetch OpenRouter models:', error);
    return [];
  }
}

/**
 * Categorize a model into a tier based on pricing and capabilities
 */
function categorizeTier(model: {
  id: string;
  pricing?: { prompt?: string; completion?: string };
}): ModelTier {
  const inputCost = parseFloat(model.pricing?.prompt || '0');

  // Categorize based on input cost per token
  if (inputCost > 0.01) return 'best';
  if (inputCost > 0.001) return 'balanced';
  if (inputCost > 0.0001) return 'fast';
  return 'experimental';
}
