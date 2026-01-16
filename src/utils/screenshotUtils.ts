/**
 * Screenshot Utilities
 *
 * Utilities for capturing screenshots from the Three.js viewer
 * for workflow verification purposes.
 */

import { supabase } from '@/lib/supabase';

/**
 * Capture a screenshot from a canvas element
 */
export async function captureCanvasScreenshot(
  canvas: HTMLCanvasElement,
  format: 'png' | 'jpeg' = 'png',
  quality: number = 0.9,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create blob from canvas'));
        }
      },
      `image/${format}`,
      quality,
    );
  });
}

/**
 * Find the Three.js canvas in the DOM
 */
export function findThreeJsCanvas(): HTMLCanvasElement | null {
  // The Three.js canvas is typically inside a Canvas component from @react-three/fiber
  // It's often the only canvas element or can be found by its parent structure
  const canvases = document.querySelectorAll('canvas');

  for (const canvas of canvases) {
    // Check if this canvas is a WebGL canvas (Three.js uses WebGL)
    const context = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (context) {
      return canvas;
    }
  }

  // Fallback: return the first canvas if no WebGL canvas found
  return canvases.length > 0 ? (canvases[0] as HTMLCanvasElement) : null;
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
  const canvas = findThreeJsCanvas();

  if (!canvas) {
    throw new Error('Three.js canvas not found in the DOM');
  }

  // For WebGL canvases, we need to ensure preserveDrawingBuffer is true
  // or capture immediately after a render. Since we can't change the setting
  // after creation, we'll try to force a re-render by dispatching events.

  // Wait a frame to ensure the canvas is rendered
  await new Promise((resolve) => requestAnimationFrame(resolve));

  const blob = await captureCanvasScreenshot(canvas, 'png', 0.95);
  const imageId = await uploadScreenshot(blob, workflowId, purpose);

  return imageId;
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
