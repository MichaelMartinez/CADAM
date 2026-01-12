import { useState, useCallback, useRef } from 'react';
import {
  submitStepConversion,
  checkStepJobStatus,
  downloadStepFile,
} from '@/services/stepExportService';
import { StepJobStatus } from '@/types/stepExport';
import { downloadFile, generateDownloadFilename } from '@/utils/downloadUtils';
import { Message } from '@shared/types';
import { toast } from '@/hooks/use-toast';

interface UseStepExportOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

interface UseStepExportReturn {
  exportToStep: (
    code: string,
    currentMessage?: Message | null,
  ) => Promise<void>;
  isExporting: boolean;
  status: StepJobStatus | null;
  progress: string;
  error: Error | null;
  cancel: () => void;
}

const POLL_INTERVAL_MS = 1500;
const MAX_POLL_ATTEMPTS = 120; // 3 minutes max

export function useStepExport(
  options?: UseStepExportOptions,
): UseStepExportReturn {
  const [isExporting, setIsExporting] = useState(false);
  const [status, setStatus] = useState<StepJobStatus | null>(null);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState<Error | null>(null);

  const cancelledRef = useRef(false);
  const pollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancel = useCallback(() => {
    cancelledRef.current = true;
    if (pollTimeoutRef.current) {
      clearTimeout(pollTimeoutRef.current);
      pollTimeoutRef.current = null;
    }
    setIsExporting(false);
    setStatus(null);
    setProgress('');
  }, []);

  const exportToStep = useCallback(
    async (code: string, currentMessage?: Message | null) => {
      // Reset state
      cancelledRef.current = false;
      setIsExporting(true);
      setError(null);
      setStatus('pending');
      setProgress('Submitting conversion...');

      try {
        // Generate filename
        const baseName = generateDownloadFilename({
          currentMessage,
          extension: 'step',
        }).replace('.step', '');

        // Submit job
        const { jobId } = await submitStepConversion(code, baseName);

        if (cancelledRef.current) return;

        // Poll for completion
        let attempts = 0;
        const poll = async (): Promise<void> => {
          if (cancelledRef.current) return;

          attempts++;
          if (attempts > MAX_POLL_ATTEMPTS) {
            throw new Error('Conversion timed out');
          }

          const statusResponse = await checkStepJobStatus(jobId);
          setStatus(statusResponse.status);

          switch (statusResponse.status) {
            case 'pending':
              setProgress('Waiting in queue...');
              break;
            case 'processing':
              setProgress('Converting to STEP...');
              break;
            case 'completed': {
              setProgress('Downloading...');
              // Download and trigger browser download
              const stepBlob = await downloadStepFile(jobId);
              downloadFile({
                content: stepBlob,
                filename: `${baseName}.step`,
                mimeType: 'application/step',
              });
              setProgress('');
              setIsExporting(false);
              setStatus(null);
              toast({
                title: 'Export Complete',
                description: 'STEP file downloaded successfully.',
              });
              options?.onSuccess?.();
              return;
            }
            case 'failed':
              throw new Error(statusResponse.error || 'Conversion failed');
          }

          // Continue polling
          pollTimeoutRef.current = setTimeout(poll, POLL_INTERVAL_MS);
        };

        await poll();
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        setError(error);
        setIsExporting(false);
        setStatus('failed');
        setProgress('');
        toast({
          title: 'Export Failed',
          description: error.message,
          variant: 'destructive',
        });
        options?.onError?.(error);
      }
    },
    [options],
  );

  return {
    exportToStep,
    isExporting,
    status,
    progress,
    error,
    cancel,
  };
}
