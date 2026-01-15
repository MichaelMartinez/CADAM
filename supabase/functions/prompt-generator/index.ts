// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { corsHeaders } from '../_shared/cors.ts';
import 'jsr:@std/dotenv/load';
import { getAnonSupabaseClient } from '../_shared/supabaseClient.ts';
import {
  buildParametricGeneratorPrompt,
  buildParametricEnhancerPrompt,
} from '../_shared/prompts.ts';

// OpenRouter API configuration
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY') ?? '';

// Use shared prompt module
const PARAMETRIC_SYSTEM_PROMPT = buildParametricGeneratorPrompt();

// Main server function handling incoming requests
Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // Ensure only POST requests are accepted
  if (req.method !== 'POST') {
    return new Response('Method not allowed', {
      status: 405,
      headers: corsHeaders,
    });
  }

  const isGodMode = Deno.env.get('GOD_MODE') === 'true';

  const supabaseClient = getAnonSupabaseClient({
    global: {
      headers: { Authorization: req.headers.get('Authorization') ?? '' },
    },
  });

  // In god mode, skip auth check
  if (!isGodMode) {
    const { data: userData, error: userError } =
      await supabaseClient.auth.getUser();

    if (!userData.user) {
      return new Response(
        JSON.stringify({ error: { message: 'Unauthorized' } }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      );
    }

    if (userError) {
      return new Response(
        JSON.stringify({ error: { message: userError.message } }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      );
    }
  }

  // Parse request body to get existing text if provided
  const { existingText }: { existingText?: string } = await req
    .json()
    .catch(() => ({}));

  try {
    let systemPrompt: string;
    let userPrompt: string;
    let maxTokens: number;

    if (existingText && existingText.length > 0) {
      // Augment existing text for parametric mode (use shared prompt)
      systemPrompt = buildParametricEnhancerPrompt();
      userPrompt = `Enhance this prompt: ${existingText}`;
      maxTokens = 300;
    } else {
      // Generate new prompt for parametric mode
      systemPrompt = PARAMETRIC_SYSTEM_PROMPT;
      userPrompt = 'Generate a parametric modeling prompt.';
      maxTokens = 100;
    }

    // Call OpenRouter API
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://adam-cad.com',
        'X-Title': 'Adam CAD',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3-haiku',
        max_tokens: maxTokens,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `OpenRouter API error: ${response.status} - ${errorText}`,
      );
    }

    const data = await response.json();

    // Extract prompt from response
    let prompt = '';
    if (data.choices && data.choices[0]?.message?.content) {
      prompt = data.choices[0].message.content.trim();
    }

    return new Response(JSON.stringify({ prompt }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error calling OpenRouter:', error);

    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});
