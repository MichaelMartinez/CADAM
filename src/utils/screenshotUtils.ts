/**
 * Screenshot Utilities
 *
 * Utilities for capturing screenshots from the Three.js viewer
 * for workflow verification purposes.
 */

import { supabase } from '@/lib/supabase';
import { screenshotLogger as log } from '@/lib/logger';

/**
 * Capture a screenshot from a canvas element
 * Uses toDataURL as a fallback when toBlob fails
 */
export async function captureCanvasScreenshot(
  canvas: HTMLCanvasElement,
  format: 'png' | 'jpeg' = 'png',
  quality: number = 0.9,
): Promise<Blob> {
  // Validate canvas dimensions
  if (canvas.width === 0 || canvas.height === 0) {
    throw new Error(
      `Canvas has invalid dimensions: ${canvas.width}x${canvas.height}`,
    );
  }

  // Try toBlob first
  return new Promise((resolve, reject) => {
    try {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            // Fallback to toDataURL method
            log.warn('toBlob returned null, falling back to toDataURL method');
            try {
              const dataUrl = canvas.toDataURL(`image/${format}`, quality);
              if (!dataUrl || dataUrl === 'data:,') {
                reject(
                  new Error(
                    'Failed to create image from canvas - canvas may be tainted or empty',
                  ),
                );
                return;
              }
              // Convert dataURL to Blob
              const byteString = atob(dataUrl.split(',')[1]);
              const mimeType = dataUrl
                .split(',')[0]
                .split(':')[1]
                .split(';')[0];
              const ab = new ArrayBuffer(byteString.length);
              const ia = new Uint8Array(ab);
              for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
              }
              resolve(new Blob([ab], { type: mimeType }));
            } catch (dataUrlError) {
              reject(
                new Error(
                  `Failed to create blob from canvas: ${dataUrlError instanceof Error ? dataUrlError.message : String(dataUrlError)}`,
                ),
              );
            }
          }
        },
        `image/${format}`,
        quality,
      );
    } catch (error) {
      reject(
        new Error(
          `Canvas toBlob failed: ${error instanceof Error ? error.message : String(error)}`,
        ),
      );
    }
  });
}

/**
 * Find the Three.js canvas in the DOM
 */
export function findThreeJsCanvas(): HTMLCanvasElement | null {
  // The Three.js canvas is typically inside a Canvas component from @react-three/fiber
  // It's often the only canvas element or can be found by its parent structure
  const canvases = document.querySelectorAll('canvas');

  log.debug(`Found ${canvases.length} canvas elements`);

  // First, try to find a WebGL canvas with valid dimensions
  for (const canvas of canvases) {
    const htmlCanvas = canvas as HTMLCanvasElement;

    // Check dimensions first
    if (htmlCanvas.width === 0 || htmlCanvas.height === 0) {
      log.debug(
        `Skipping canvas with zero dimensions: ${htmlCanvas.width}x${htmlCanvas.height}`,
      );
      continue;
    }

    // Try to detect if this is a WebGL canvas by checking for __three__ internals
    // or by checking the data-engine attribute that R3F adds
    const isR3FCanvas =
      htmlCanvas.getAttribute('data-engine') ||
      (htmlCanvas as unknown as { __three__?: unknown }).__three__;

    if (isR3FCanvas) {
      log.info(`Found R3F canvas: ${htmlCanvas.width}x${htmlCanvas.height}`);
      return htmlCanvas;
    }

    // Alternative: check if it's a WebGL canvas by trying to get context info
    // Note: getContext on an existing WebGL canvas returns the existing context
    try {
      const existingContext =
        htmlCanvas.getContext('webgl2') || htmlCanvas.getContext('webgl');
      if (existingContext) {
        log.info(
          `Found WebGL canvas: ${htmlCanvas.width}x${htmlCanvas.height}`,
        );
        return htmlCanvas;
      }
    } catch {
      // Context already exists with different type, skip
      continue;
    }
  }

  // Fallback: return the first canvas with valid dimensions
  for (const canvas of canvases) {
    const htmlCanvas = canvas as HTMLCanvasElement;
    if (htmlCanvas.width > 0 && htmlCanvas.height > 0) {
      log.warn(
        `Using fallback canvas: ${htmlCanvas.width}x${htmlCanvas.height}`,
      );
      return htmlCanvas;
    }
  }

  log.error('No valid canvas found');
  return null;
}

/**
 * Upload a screenshot blob to Supabase storage
 */
export async function uploadScreenshot(
  blob: Blob,
  workflowId: string,
  purpose: string,
): Promise<string> {
  const timestamp = Date.now();
  const extension = blob.type === 'image/png' ? 'png' : 'jpg';
  const fileName = `workflow-screenshots/${workflowId}/${purpose}-${timestamp}.${extension}`;

  const { data, error } = await supabase.storage
    .from('images')
    .upload(fileName, blob, {
      contentType: blob.type,
      upsert: false,
    });

  if (error) {
    throw new Error(`Failed to upload screenshot: ${error.message}`);
  }

  return data.path;
}

/**
 * Capture a screenshot from the Three.js viewer and upload to storage
 */
export async function captureAndUploadViewerScreenshot(
  workflowId: string,
  purpose: string = 'verification',
): Promise<string> {
  log.info(`Starting screenshot capture for workflow: ${workflowId}`);

  const canvas = findThreeJsCanvas();

  if (!canvas) {
    throw new Error('Three.js canvas not found in the DOM');
  }

  log.info('Canvas found:', {
    width: canvas.width,
    height: canvas.height,
    className: canvas.className,
    dataEngine: canvas.getAttribute('data-engine'),
  });

  // Wait for the model to render - OpenSCAD compilation can take a moment
  // First, wait for initial render frames
  log.info('Waiting for initial render frames...');
  await new Promise((resolve) => requestAnimationFrame(resolve));
  await new Promise((resolve) => requestAnimationFrame(resolve));

  // Then wait additional time for OpenSCAD WASM compilation and STL loading
  // This is critical because screenshot request arrives immediately after code is generated,
  // but the model needs time to compile and render
  log.info('Waiting for model compilation and render (1.5s)...');
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Wait a few more frames after the timeout to ensure the scene is stable
  await new Promise((resolve) => requestAnimationFrame(resolve));
  await new Promise((resolve) => requestAnimationFrame(resolve));
  log.info('Wait complete, capturing screenshot...');

  try {
    const blob = await captureCanvasScreenshot(canvas, 'png', 0.95);
    log.info(`Screenshot captured, size: ${blob.size} bytes`);

    const imageId = await uploadScreenshot(blob, workflowId, purpose);
    log.info(`Screenshot uploaded: ${imageId}`);

    return imageId;
  } catch (error) {
    log.error('Failed to capture screenshot:', error);
    throw error;
  }
}

/**
 * Capture screenshot from a specific canvas element by ID or class
 */
export async function captureViewerScreenshotById(
  selector: string,
  workflowId: string,
  purpose: string = 'verification',
): Promise<string> {
  const canvas = document.querySelector(selector) as HTMLCanvasElement | null;

  if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
    throw new Error(`Canvas not found with selector: ${selector}`);
  }

  await new Promise((resolve) => requestAnimationFrame(resolve));

  const blob = await captureCanvasScreenshot(canvas, 'png', 0.95);
  const imageId = await uploadScreenshot(blob, workflowId, purpose);

  return imageId;
}
