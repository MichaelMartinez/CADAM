// Setup type definitions for built-in Supabase Runtime APIs
import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { corsHeaders } from '../_shared/cors.ts';
import 'jsr:@std/dotenv/load';
import { getAnonSupabaseClient } from '../_shared/supabaseClient.ts';

// FreeCAD service configuration
const STEP_CONVERTER_URL =
  Deno.env.get('STEP_CONVERTER_URL') ?? 'http://localhost:8080';
const STEP_CONVERTER_SECRET = Deno.env.get('STEP_CONVERTER_API_SECRET') ?? '';

// Extended CORS headers for GET requests
const extendedCorsHeaders = {
  ...corsHeaders,
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
};

// Request/Response types
interface ConvertRequest {
  code: string;
  filename?: string;
}

interface ConvertResponse {
  jobId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

interface StatusResponse {
  jobId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  error?: string;
  createdAt: string;
  completedAt?: string;
}

// Helper to make authenticated requests to FreeCAD service
function converterRequest(
  path: string,
  options: RequestInit = {},
): Promise<Response> {
  const headers = new Headers(options.headers);
  if (STEP_CONVERTER_SECRET) {
    headers.set('Authorization', `Bearer ${STEP_CONVERTER_SECRET}`);
  }
  headers.set('Content-Type', 'application/json');

  return fetch(`${STEP_CONVERTER_URL}${path}`, {
    ...options,
    headers,
  });
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: extendedCorsHeaders });
  }

  const url = new URL(req.url);
  // Parse path: /step-converter/convert, /step-converter/status/{id}, /step-converter/download/{id}
  const pathParts = url.pathname.split('/').filter(Boolean);
  // pathParts[0] is 'step-converter', pathParts[1] is action, pathParts[2] is jobId (if present)
  const action = pathParts[1]; // 'convert', 'status', or 'download'
  const jobId = pathParts[2];

  const isGodMode = Deno.env.get('GOD_MODE') === 'true';

  // Authenticate user via Supabase
  const supabaseClient = getAnonSupabaseClient({
    global: {
      headers: { Authorization: req.headers.get('Authorization') ?? '' },
    },
  });

  // In god mode, skip auth check
  if (!isGodMode) {
    const { data: userData, error: userError } =
      await supabaseClient.auth.getUser();

    if (!userData.user || userError) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...extendedCorsHeaders, 'Content-Type': 'application/json' },
      });
    }
  }

  try {
    // POST /step-converter/convert - Submit conversion job
    if (req.method === 'POST' && action === 'convert') {
      const body: ConvertRequest = await req.json();

      if (!body.code || !body.code.trim()) {
        return new Response(
          JSON.stringify({ error: 'Missing or empty code field' }),
          {
            status: 400,
            headers: {
              ...extendedCorsHeaders,
              'Content-Type': 'application/json',
            },
          },
        );
      }

      // Forward to FreeCAD service
      const response = await converterRequest('/convert', {
        method: 'POST',
        body: JSON.stringify({
          code: body.code,
          filename: body.filename || 'model',
        }),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ detail: 'Conversion service error' }));
        return new Response(
          JSON.stringify({ error: errorData.detail || 'Conversion failed' }),
          {
            status: response.status,
            headers: {
              ...extendedCorsHeaders,
              'Content-Type': 'application/json',
            },
          },
        );
      }

      const data = await response.json();
      const result: ConvertResponse = {
        jobId: data.jobId,
        status: data.status,
      };

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: {
          ...extendedCorsHeaders,
          'Content-Type': 'application/json',
        },
      });
    }

    // GET /step-converter/status/{jobId} - Check job status
    if (req.method === 'GET' && action === 'status' && jobId) {
      const response = await converterRequest(`/status/${jobId}`);

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ detail: 'Status check failed' }));
        return new Response(
          JSON.stringify({ error: errorData.detail || 'Status check failed' }),
          {
            status: response.status,
            headers: {
              ...extendedCorsHeaders,
              'Content-Type': 'application/json',
            },
          },
        );
      }

      const data = await response.json();
      const result: StatusResponse = {
        jobId: data.jobId,
        status: data.status,
        error: data.error,
        createdAt: data.createdAt,
        completedAt: data.completedAt,
      };

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: {
          ...extendedCorsHeaders,
          'Content-Type': 'application/json',
        },
      });
    }

    // GET /step-converter/download/{jobId} - Download converted file
    if (req.method === 'GET' && action === 'download' && jobId) {
      const response = await converterRequest(`/download/${jobId}`);

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ detail: 'Download failed' }));
        return new Response(
          JSON.stringify({ error: errorData.detail || 'Download failed' }),
          {
            status: response.status,
            headers: {
              ...extendedCorsHeaders,
              'Content-Type': 'application/json',
            },
          },
        );
      }

      // Forward the STEP file with appropriate headers
      const stepContent = await response.arrayBuffer();
      const contentDisposition =
        response.headers.get('Content-Disposition') ||
        'attachment; filename="model.step"';

      return new Response(stepContent, {
        status: 200,
        headers: {
          ...extendedCorsHeaders,
          'Content-Type': 'application/step',
          'Content-Disposition': contentDisposition,
        },
      });
    }

    // POST /step-converter/analyze-mesh - Analyze STL mesh for moldability
    if (req.method === 'POST' && action === 'analyze-mesh') {
      // Forward multipart form data directly to the service
      const formData = await req.formData();

      // Prepare headers for forwarding (no Content-Type - let fetch set it for FormData)
      const headers = new Headers();
      if (STEP_CONVERTER_SECRET) {
        headers.set('Authorization', `Bearer ${STEP_CONVERTER_SECRET}`);
      }

      const response = await fetch(`${STEP_CONVERTER_URL}/analyze-mesh`, {
        method: 'POST',
        headers,
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ detail: 'Analysis failed' }));
        return new Response(
          JSON.stringify({ error: errorData.detail || 'Analysis failed' }),
          {
            status: response.status,
            headers: {
              ...extendedCorsHeaders,
              'Content-Type': 'application/json',
            },
          },
        );
      }

      const data = await response.json();
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: {
          ...extendedCorsHeaders,
          'Content-Type': 'application/json',
        },
      });
    }

    // POST /step-converter/generate-mold - Generate mold from STL
    if (req.method === 'POST' && action === 'generate-mold') {
      const formData = await req.formData();

      const headers = new Headers();
      if (STEP_CONVERTER_SECRET) {
        headers.set('Authorization', `Bearer ${STEP_CONVERTER_SECRET}`);
      }

      const response = await fetch(`${STEP_CONVERTER_URL}/generate-mold`, {
        method: 'POST',
        headers,
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ detail: 'Mold generation failed' }));
        return new Response(
          JSON.stringify({
            error: errorData.detail || 'Mold generation failed',
          }),
          {
            status: response.status,
            headers: {
              ...extendedCorsHeaders,
              'Content-Type': 'application/json',
            },
          },
        );
      }

      const data = await response.json();
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: {
          ...extendedCorsHeaders,
          'Content-Type': 'application/json',
        },
      });
    }

    // POST /step-converter/analyze-and-generate - Combined analysis + generation
    if (req.method === 'POST' && action === 'analyze-and-generate') {
      const formData = await req.formData();

      const headers = new Headers();
      if (STEP_CONVERTER_SECRET) {
        headers.set('Authorization', `Bearer ${STEP_CONVERTER_SECRET}`);
      }

      const response = await fetch(
        `${STEP_CONVERTER_URL}/analyze-and-generate`,
        {
          method: 'POST',
          headers,
          body: formData,
        },
      );

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ detail: 'Analysis and generation failed' }));
        return new Response(
          JSON.stringify({
            error: errorData.detail || 'Analysis and generation failed',
          }),
          {
            status: response.status,
            headers: {
              ...extendedCorsHeaders,
              'Content-Type': 'application/json',
            },
          },
        );
      }

      const data = await response.json();
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: {
          ...extendedCorsHeaders,
          'Content-Type': 'application/json',
        },
      });
    }

    // Unknown route
    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { ...extendedCorsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Step converter error:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        detail: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: {
          ...extendedCorsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );
  }
});
