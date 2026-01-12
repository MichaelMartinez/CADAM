/**
 * Types for STEP export functionality
 */

export type StepJobStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface StepConvertRequest {
  code: string;
  filename?: string;
}

export interface StepConvertResponse {
  jobId: string;
  status: StepJobStatus;
}

export interface StepStatusResponse {
  jobId: string;
  status: StepJobStatus;
  error?: string;
  createdAt: string;
  completedAt?: string;
}

export interface StepExportState {
  isExporting: boolean;
  status: StepJobStatus | null;
  progress: string;
  error: Error | null;
}
