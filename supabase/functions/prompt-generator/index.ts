// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { corsHeaders } from '../_shared/cors.ts';
import 'jsr:@std/dotenv/load';
import { getAnonSupabaseClient } from '../_shared/supabaseClient.ts';

// OpenRouter API configuration
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY') ?? '';

const PARAMETRIC_SYSTEM_PROMPT = `You generate ONE single prompt for an openscad parametric model using BOSL2 library features. Rules:
- Return EXACTLY ONE prompt, never a list or multiple options
- Include specific dimensions (in mm) for key features
- Mention customizable/parametric aspects (e.g. "adjustable width", "configurable holes")
- Describe geometry that is 3D printable (flat bases, reasonable overhangs)
- Return ONLY the prompt text - no introductory phrases, quotes, or explanations
- Vary your sentence structure - don't always start with "a parametric..."
- Leverage BOSL2 advanced features with these patterns:
  • Attachments: "lid attached to TOP using attach(TOP)", "posts at corners using attach(TOP+FWD+RIGHT)"
  • Rounding: "cuboid([50,30,20], rounding=3, edges='Z') for rounded vertical edges", "cyl(h=30, d=20, rounding=2) for rounded cylinder ends"
  • Threading: "M3 threaded hole using threaded_rod(d=3, l=20, pitch=0.5, internal=true)", "M4 screw holes with pitch=0.7", "M5 threads with pitch=0.8"
  • Gears: "spur_gear(mod=2, teeth=24, thickness=8) for 24-tooth gear", "rack(mod=2, teeth=10) for linear rack"
  • Patterns: "grid_copies(spacing=15, n=[3,3]) for 3x3 hole pattern", "arc_copies(n=6, r=30) for circular array"
  • Joiners: "dovetail('male', width=12, slide=30) for sliding dovetail", "snap_pin() for clip assembly"
  • Textures: "texture='knurled', tex_size=[3,1], tex_depth=0.8 on cyl() for grip surface"
  • Sweeps: "path_sweep(circle(d=5), path) for tube along curve", "linear_sweep(region, height=20, twist=45) for twisted extrusion"
- Include library usage like "include <BOSL2/std.scad>", "include <BOSL2/gears.scad>", "include <BOSL2/threading.scad>", "include <BOSL2/joiners.scad>"

Examples of CORRECT responses:
"hex-grid drawer organizer 150x50mm with adjustable wall thickness using cuboid() with rounded edges"
"stackable storage box 100mm cube with attachable slide-on lid positioned on TOP with filleted corners"
"cable clip for 5-10mm cables with M3 threaded mounting holes and knurled grip surface"
"threaded standoff 20mm height with M3 internal threading using BOSL2 threading library"
"parametric spur gear 30mm diameter with configurable tooth count using BOSL2 gears library"
"phone stand with adjustable viewing angle, dovetail joint assembly, and edge_profile() rounded edges"
"container with screw-on lid using M4 threads and textured grip surface"
"mechanical hinge assembly with filleted joints between arms"
"organizer tray with grid_copies() hole pattern and embossed labels"

NEVER return multiple prompts or a list. Only ONE single prompt.`;

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

  const supabaseClient = getAnonSupabaseClient({
    global: {
      headers: { Authorization: req.headers.get('Authorization') ?? '' },
    },
  });

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

  // Parse request body to get existing text if provided
  const { existingText }: { existingText?: string } = await req
    .json()
    .catch(() => ({}));

  try {
    let systemPrompt: string;
    let userPrompt: string;
    let maxTokens: number;

    if (existingText && existingText.length > 0) {
      // Augment existing text for parametric mode
      systemPrompt = `You enhance prompts for 3D printable parametric models using BOSL2 library features. Rules:
- Add specific dimensions (in mm) for all key features
- Include multiple parametric variables (e.g., "customizable height", "variable screw size", "adjustable spacing")
- Add details about geometry, mounting options, and practical features
- Leverage BOSL2 advanced capabilities with concrete patterns:
  • Attachments: "lid attached to TOP using attach(TOP)", "posts at corners using attach(TOP+FWD+RIGHT)", "handle on side with attach(LEFT)"
  • Rounding: "cuboid([50,30,20], rounding=3, edges='Z') for rounded vertical edges", "cyl(h=30, d=20, rounding=2) for rounded ends"
  • Threading: "M3 threaded hole using threaded_rod(d=3, l=20, pitch=0.5, internal=true)", "M4 holes with pitch=0.7", "M5 threads with pitch=0.8"
  • Gears: "spur_gear(mod=2, teeth=24, thickness=8) for gear assembly", "gear_dist() for proper meshing distance"
  • Patterns: "grid_copies(spacing=15, n=[3,3]) for 3x3 hole array", "arc_copies(n=6, r=30) for circular pattern", "xcopies(spacing=20, n=4) for linear array"
  • Joiners: "dovetail('male', width=12, slide=30) for sliding joint", "snap_pin() for tool-free assembly", "knuckle_hinge() for hinged lid"
  • Textures: "texture='knurled', tex_size=[3,1], tex_depth=0.8 for grip", "texture='ribs' for tactile surface"
  • Sweeps: "path_sweep(circle(d=5), path) for curved tube", "linear_sweep(shape, height=20, twist=45) for twisted profile"
  • Masking: "diff() with edge_profile(TOP) mask2d_roundover(r=3) for edge treatment"
- Specify library includes like "include <BOSL2/std.scad>", "include <BOSL2/gears.scad>", "include <BOSL2/threading.scad>", "include <BOSL2/joiners.scad>"
- Ensure the design is 3D printable (flat bottom, stable geometry, proper overhangs)
- Return ONLY the enhanced prompt text - no introductory phrases, explanations, or quotes
- Be thorough and detailed in your enhancements`;

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
        model: 'anthropic/claude-3.5-haiku',
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
        `OpenRouter API error: ${response.statusText} - ${errorText}`,
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
