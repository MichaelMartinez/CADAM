/**
 * OpenRouter Provider
 *
 * Handles communication with OpenRouter API for multi-model access.
 * Supports vision models, text models, and streaming responses.
 */

import { getModelMetadata } from '../config/modelRegistry.ts';

// =============================================================================
// Types
// =============================================================================

export interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string | OpenRouterContentPart[];
}

export type OpenRouterContentPart =
  | { type: 'text'; text: string }
  | {
      type: 'image_url';
      image_url: { url: string; detail?: 'auto' | 'low' | 'high' };
    };

export interface OpenRouterRequest {
  model: string;
  messages: OpenRouterMessage[];
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  stream?: boolean;
  response_format?: { type: 'json_object' } | { type: 'text' };
  provider?: {
    order?: string[];
    allow_fallbacks?: boolean;
  };
}

export interface OpenRouterResponse {
  id: string;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: 'assistant';
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface OpenRouterStreamChunk {
  id: string;
  model: string;
  choices: Array<{
    index: number;
    delta: {
      role?: 'assistant';
      content?: string;
    };
    finish_reason: string | null;
  }>;
}

export interface CompletionResult {
  content: string;
  model: string;
  tokensUsed: number;
  finishReason: string;
}

export interface StreamCallbacks {
  onToken?: (token: string) => void;
  onComplete?: (result: CompletionResult) => void;
  onError?: (error: Error) => void;
}

// =============================================================================
// Provider Class
// =============================================================================

export class OpenRouterProvider {
  private apiKey: string;
  private baseUrl: string = 'https://openrouter.ai/api/v1';
  private appName: string;
  private appUrl: string;

  constructor(
    apiKey: string,
    options: { appName?: string; appUrl?: string } = {},
  ) {
    this.apiKey = apiKey;
    this.appName = options.appName || 'CADAM';
    this.appUrl = options.appUrl || 'https://cadam.app';
  }

  // ---------------------------------------------------------------------------
  // Core Methods
  // ---------------------------------------------------------------------------

  /**
   * Make a completion request (non-streaming)
   */
  async complete(
    model: string,
    messages: OpenRouterMessage[],
    options: {
      maxTokens?: number;
      temperature?: number;
      jsonMode?: boolean;
    } = {},
  ): Promise<CompletionResult> {
    const modelMeta = getModelMetadata(model);
    const maxTokens = options.maxTokens || modelMeta.capabilities.max_tokens;

    const request: OpenRouterRequest = {
      model,
      messages,
      max_tokens: maxTokens,
      temperature: options.temperature ?? 0.7,
      stream: false,
    };

    if (options.jsonMode && modelMeta.capabilities.structured_output) {
      request.response_format = { type: 'json_object' };
    }

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `OpenRouter API error: ${response.status} - ${errorData.error?.message || response.statusText}`,
      );
    }

    const data: OpenRouterResponse = await response.json();
    const choice = data.choices[0];

    return {
      content: choice.message.content,
      model: data.model,
      tokensUsed: data.usage.total_tokens,
      finishReason: choice.finish_reason,
    };
  }

  /**
   * Make a streaming completion request
   */
  async stream(
    model: string,
    messages: OpenRouterMessage[],
    callbacks: StreamCallbacks,
    options: {
      maxTokens?: number;
      temperature?: number;
    } = {},
  ): Promise<CompletionResult> {
    const modelMeta = getModelMetadata(model);
    const maxTokens = options.maxTokens || modelMeta.capabilities.max_tokens;

    const request: OpenRouterRequest = {
      model,
      messages,
      max_tokens: maxTokens,
      temperature: options.temperature ?? 0.7,
      stream: true,
    };

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error = new Error(
        `OpenRouter API error: ${response.status} - ${errorData.error?.message || response.statusText}`,
      );
      callbacks.onError?.(error);
      throw error;
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response body');
    }

    const decoder = new TextDecoder();
    let fullContent = '';
    let actualModel = model;
    let finishReason = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter((line) => line.trim() !== '');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed: OpenRouterStreamChunk = JSON.parse(data);
              const delta = parsed.choices[0]?.delta;
              actualModel = parsed.model || actualModel;

              if (delta?.content) {
                fullContent += delta.content;
                callbacks.onToken?.(delta.content);
              }

              if (parsed.choices[0]?.finish_reason) {
                finishReason = parsed.choices[0].finish_reason;
              }
            } catch {
              // Skip malformed chunks
            }
          }
        }
      }

      const result: CompletionResult = {
        content: fullContent,
        model: actualModel,
        tokensUsed: 0, // Not available in streaming
        finishReason,
      };

      callbacks.onComplete?.(result);
      return result;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      callbacks.onError?.(err);
      throw err;
    }
  }

  // ---------------------------------------------------------------------------
  // Vision Methods
  // ---------------------------------------------------------------------------

  /**
   * Analyze an image with a vision model
   */
  analyzeImage(
    model: string,
    imageUrl: string,
    prompt: string,
    options: {
      systemPrompt?: string;
      maxTokens?: number;
      jsonMode?: boolean;
    } = {},
  ): Promise<CompletionResult> {
    const messages: OpenRouterMessage[] = [];

    if (options.systemPrompt) {
      messages.push({
        role: 'system',
        content: options.systemPrompt,
      });
    }

    messages.push({
      role: 'user',
      content: [
        { type: 'image_url', image_url: { url: imageUrl, detail: 'high' } },
        { type: 'text', text: prompt },
      ],
    });

    return this.complete(model, messages, {
      maxTokens: options.maxTokens,
      jsonMode: options.jsonMode,
    });
  }

  /**
   * Analyze multiple images with a vision model
   */
  analyzeImages(
    model: string,
    imageUrls: string[],
    prompt: string,
    options: {
      systemPrompt?: string;
      maxTokens?: number;
      jsonMode?: boolean;
    } = {},
  ): Promise<CompletionResult> {
    const messages: OpenRouterMessage[] = [];

    if (options.systemPrompt) {
      messages.push({
        role: 'system',
        content: options.systemPrompt,
      });
    }

    const content: OpenRouterContentPart[] = imageUrls.map((url) => ({
      type: 'image_url' as const,
      image_url: { url, detail: 'high' as const },
    }));

    content.push({ type: 'text', text: prompt });

    messages.push({
      role: 'user',
      content,
    });

    return this.complete(model, messages, {
      maxTokens: options.maxTokens,
      jsonMode: options.jsonMode,
    });
  }

  /**
   * Compare two images (original vs rendered)
   */
  compareImages(
    model: string,
    originalUrl: string,
    renderedUrl: string,
    prompt: string,
    options: {
      systemPrompt?: string;
      maxTokens?: number;
      jsonMode?: boolean;
    } = {},
  ): Promise<CompletionResult> {
    const messages: OpenRouterMessage[] = [];

    if (options.systemPrompt) {
      messages.push({
        role: 'system',
        content: options.systemPrompt,
      });
    }

    messages.push({
      role: 'user',
      content: [
        {
          type: 'image_url',
          image_url: { url: originalUrl, detail: 'high' },
        },
        {
          type: 'image_url',
          image_url: { url: renderedUrl, detail: 'high' },
        },
        { type: 'text', text: prompt },
      ],
    });

    return this.complete(model, messages, {
      maxTokens: options.maxTokens,
      jsonMode: options.jsonMode,
    });
  }

  // ---------------------------------------------------------------------------
  // Text Generation Methods
  // ---------------------------------------------------------------------------

  /**
   * Generate text with a text model
   */
  generateText(
    model: string,
    prompt: string,
    options: {
      systemPrompt?: string;
      maxTokens?: number;
      temperature?: number;
    } = {},
  ): Promise<CompletionResult> {
    const messages: OpenRouterMessage[] = [];

    if (options.systemPrompt) {
      messages.push({
        role: 'system',
        content: options.systemPrompt,
      });
    }

    messages.push({
      role: 'user',
      content: prompt,
    });

    return this.complete(model, messages, {
      maxTokens: options.maxTokens,
      temperature: options.temperature,
    });
  }

  /**
   * Generate JSON with a model that supports structured output
   */
  async generateJson<T = unknown>(
    model: string,
    prompt: string,
    options: {
      systemPrompt?: string;
      maxTokens?: number;
    } = {},
  ): Promise<{ data: T; result: CompletionResult }> {
    const result = await this.complete(
      model,
      [
        ...(options.systemPrompt
          ? [{ role: 'system' as const, content: options.systemPrompt }]
          : []),
        { role: 'user' as const, content: prompt },
      ],
      {
        maxTokens: options.maxTokens,
        jsonMode: true,
      },
    );

    try {
      const data = JSON.parse(result.content) as T;
      return { data, result };
    } catch {
      throw new Error(
        `Failed to parse JSON response: ${result.content.slice(0, 200)}`,
      );
    }
  }

  // ---------------------------------------------------------------------------
  // Helper Methods
  // ---------------------------------------------------------------------------

  private getHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.apiKey}`,
      'HTTP-Referer': this.appUrl,
      'X-Title': this.appName,
    };
  }

  /**
   * Check if a model is available on OpenRouter
   */
  async checkModelAvailability(modelId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/models`, {
        headers: this.getHeaders(),
      });

      if (!response.ok) return false;

      const data = await response.json();
      return data.data.some((m: { id: string }) => m.id === modelId);
    } catch {
      return false;
    }
  }

  /**
   * Get rate limit info from response headers
   */
  parseRateLimitInfo(headers: Headers): {
    limit?: number;
    remaining?: number;
    reset?: Date;
  } {
    const limit = headers.get('x-ratelimit-limit');
    const remaining = headers.get('x-ratelimit-remaining');
    const reset = headers.get('x-ratelimit-reset');

    return {
      limit: limit ? parseInt(limit, 10) : undefined,
      remaining: remaining ? parseInt(remaining, 10) : undefined,
      reset: reset ? new Date(parseInt(reset, 10) * 1000) : undefined,
    };
  }
}

// =============================================================================
// Factory Function
// =============================================================================

/**
 * Create an OpenRouter provider instance from environment
 */
export function createOpenRouterProvider(): OpenRouterProvider {
  const apiKey = Deno.env.get('OPENROUTER_API_KEY');
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY environment variable is required');
  }

  return new OpenRouterProvider(apiKey, {
    appName: 'CADAM',
    appUrl: Deno.env.get('APP_URL') || 'https://cadam.app',
  });
}
