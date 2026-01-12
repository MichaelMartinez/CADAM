import { supabase } from '@/lib/supabase';
import {
  StepConvertRequest,
  StepConvertResponse,
  StepStatusResponse,
} from '@/types/stepExport';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

async function getAuthHeaders(): Promise<HeadersInit> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${session?.access_token}`,
  };
}

/**
 * Submit OpenSCAD code for STEP conversion
 */
export async function submitStepConversion(
  code: string,
  filename?: string,
): Promise<StepConvertResponse> {
  const request: StepConvertRequest = {
    code,
    filename,
  };

  const response = await fetch(
    `${SUPABASE_URL}/functions/v1/step-converter/convert`,
    {
      method: 'POST',
      headers: await getAuthHeaders(),
      body: JSON.stringify(request),
    },
  );

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: 'Unknown error' }));
    throw new Error(
      error.error || error.detail || 'Failed to submit conversion',
    );
  }

  return response.json();
}

/**
 * Check conversion job status
 */
export async function checkStepJobStatus(
  jobId: string,
): Promise<StepStatusResponse> {
  const response = await fetch(
    `${SUPABASE_URL}/functions/v1/step-converter/status/${jobId}`,
    {
      method: 'GET',
      headers: await getAuthHeaders(),
    },
  );

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || error.detail || 'Failed to check status');
  }

  return response.json();
}

/**
 * Download completed STEP file
 */
export async function downloadStepFile(jobId: string): Promise<Blob> {
  const response = await fetch(
    `${SUPABASE_URL}/functions/v1/step-converter/download/${jobId}`,
    {
      method: 'GET',
      headers: await getAuthHeaders(),
    },
  );

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || error.detail || 'Failed to download file');
  }

  return response.blob();
}
