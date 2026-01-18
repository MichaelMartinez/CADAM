/**
 * Image Preprocessor
 *
 * Handles image preprocessing for optimal VLM input:
 * - Resize to model-specific optimal dimensions
 * - Format conversion (PNG, JPEG, WebP)
 * - Quality optimization
 * - Base64 encoding for API calls
 */

import { SupabaseClient } from 'npm:@supabase/supabase-js@2';
import type { Database } from '../../_shared/database.ts';
import {
  getModelMetadata,
  getImagePreprocessingForModel,
} from '../config/modelRegistry.ts';

// =============================================================================
// Types
// =============================================================================

export interface ImageInfo {
  id: string;
  url: string;
  width?: number;
  height?: number;
  format?: string;
  size?: number;
}

export interface PreprocessingConfig {
  maxDimension: number;
  format: 'jpeg' | 'png' | 'webp';
  quality: number;
  enhance?: boolean;
}

export interface PreprocessedImage {
  originalId: string;
  dataUrl: string;
  width: number;
  height: number;
  format: string;
  sizeBytes: number;
  wasResized: boolean;
  wasConverted: boolean;
}

export interface ValidationResult {
  valid: boolean;
  issues: string[];
  warnings: string[];
  recommendations: string[];
}

// =============================================================================
// Image Preprocessor Class
// =============================================================================

export class ImagePreprocessor {
  private supabase: SupabaseClient<Database>;
  private bucketName: string;

  constructor(
    supabase: SupabaseClient<Database>,
    bucketName: string = 'user-images',
  ) {
    this.supabase = supabase;
    this.bucketName = bucketName;
  }

  // ---------------------------------------------------------------------------
  // Main Methods
  // ---------------------------------------------------------------------------

  /**
   * Preprocess an image for a specific model
   */
  preprocessForModel(
    imageId: string,
    modelId: string,
  ): Promise<PreprocessedImage> {
    const config = getImagePreprocessingForModel(modelId);
    return this.preprocess(imageId, {
      maxDimension: config.maxDimension,
      format: config.format,
      quality: config.quality,
    });
  }

  /**
   * Preprocess an image with custom config
   */
  async preprocess(
    imageId: string,
    config: PreprocessingConfig,
  ): Promise<PreprocessedImage> {
    // Fetch image from storage
    const imageData = await this.fetchImage(imageId);

    // Get image dimensions
    const dimensions = this.getImageDimensions(imageData);

    // Calculate target dimensions
    const targetDimensions = this.calculateTargetDimensions(
      dimensions.width,
      dimensions.height,
      config.maxDimension,
    );

    const needsResize =
      targetDimensions.width !== dimensions.width ||
      targetDimensions.height !== dimensions.height;

    // Process image
    // Note: In Deno/Edge Functions, we don't have full canvas support,
    // so we'll return the image as-is with metadata.
    // For actual resizing, the frontend should handle this before upload,
    // or we can use a dedicated image processing service.

    const base64 = this.arrayBufferToBase64(imageData);
    const mimeType = this.getMimeType(config.format);
    const dataUrl = `data:${mimeType};base64,${base64}`;

    return {
      originalId: imageId,
      dataUrl,
      width: targetDimensions.width,
      height: targetDimensions.height,
      format: config.format,
      sizeBytes: imageData.byteLength,
      wasResized: needsResize,
      wasConverted: false, // No actual conversion in edge function
    };
  }

  /**
   * Validate an image for VLM processing
   */
  async validateImage(
    imageId: string,
    modelId: string,
  ): Promise<ValidationResult> {
    const issues: string[] = [];
    const warnings: string[] = [];
    const recommendations: string[] = [];

    try {
      const imageData = await this.fetchImage(imageId);
      const dimensions = this.getImageDimensions(imageData);
      const modelMeta = getModelMetadata(modelId);
      const maxSize = modelMeta.capabilities.max_image_size || 4096;
      const optimalSize = modelMeta.optimal_image_size || {
        width: 1024,
        height: 1024,
      };

      // Check dimensions
      if (dimensions.width > maxSize || dimensions.height > maxSize) {
        warnings.push(
          `Image dimensions (${dimensions.width}x${dimensions.height}) exceed model maximum (${maxSize}px). Image will be resized.`,
        );
      }

      if (
        dimensions.width > optimalSize.width * 2 ||
        dimensions.height > optimalSize.height * 2
      ) {
        recommendations.push(
          `Consider resizing to ${optimalSize.width}x${optimalSize.height} for optimal processing speed and cost.`,
        );
      }

      // Check file size
      const sizeInMB = imageData.byteLength / (1024 * 1024);
      if (sizeInMB > 20) {
        issues.push(
          `Image file size (${sizeInMB.toFixed(1)}MB) is too large. Maximum is 20MB.`,
        );
      } else if (sizeInMB > 10) {
        warnings.push(
          `Image file size (${sizeInMB.toFixed(1)}MB) is large. Consider compressing for faster uploads.`,
        );
      }

      // Check aspect ratio
      const aspectRatio = dimensions.width / dimensions.height;
      if (aspectRatio > 10 || aspectRatio < 0.1) {
        warnings.push(
          `Extreme aspect ratio (${aspectRatio.toFixed(2)}) may affect analysis quality. Consider cropping to a more standard ratio.`,
        );
      }

      // Check format
      const format = this.detectFormat(imageData);
      const supportedFormats = modelMeta.supported_formats || [
        'jpeg',
        'png',
        'webp',
      ];
      if (!supportedFormats.includes(format)) {
        warnings.push(
          `Image format (${format}) may not be optimal. Consider converting to ${supportedFormats[0]}.`,
        );
      }
    } catch (error) {
      issues.push(
        `Failed to validate image: ${error instanceof Error ? error.message : String(error)}`,
      );
    }

    return {
      valid: issues.length === 0,
      issues,
      warnings,
      recommendations,
    };
  }

  /**
   * Get signed URL for an image
   */
  async getSignedUrl(
    imageId: string,
    expiresIn: number = 3600,
  ): Promise<string> {
    const { data, error } = await this.supabase.storage
      .from(this.bucketName)
      .createSignedUrl(imageId, expiresIn);

    if (error) {
      throw new Error(`Failed to create signed URL: ${error.message}`);
    }

    return data.signedUrl;
  }

  /**
   * Get public URL for an image (if bucket is public)
   */
  getPublicUrl(imageId: string): string {
    const { data } = this.supabase.storage
      .from(this.bucketName)
      .getPublicUrl(imageId);

    return data.publicUrl;
  }

  /**
   * Convert image to base64 data URL for API calls
   */
  async toDataUrl(imageId: string): Promise<string> {
    console.log(
      '[ImagePreprocessor:toDataUrl] Converting image to dataUrl:',
      imageId,
    );
    const imageData = await this.fetchImage(imageId);
    console.log(
      '[ImagePreprocessor:toDataUrl] Image fetched, size:',
      imageData.byteLength,
    );
    const format = this.detectFormat(imageData);
    console.log('[ImagePreprocessor:toDataUrl] Detected format:', format);
    const mimeType = this.getMimeType(format);
    const base64 = this.arrayBufferToBase64(imageData);
    console.log(
      '[ImagePreprocessor:toDataUrl] Converted to base64, length:',
      base64.length,
    );

    return `data:${mimeType};base64,${base64}`;
  }

  // ---------------------------------------------------------------------------
  // Helper Methods
  // ---------------------------------------------------------------------------

  private async fetchImage(imageId: string): Promise<ArrayBuffer> {
    console.log('[ImagePreprocessor:fetchImage] Fetching image:', {
      imageId,
      bucket: this.bucketName,
    });

    // First, try direct download (in case imageId is already a full path)
    console.log('[ImagePreprocessor:fetchImage] Attempting direct download...');
    const { data: directData, error: directError } = await this.supabase.storage
      .from(this.bucketName)
      .download(imageId);

    console.log('[ImagePreprocessor:fetchImage] Direct download result:', {
      success: !directError && !!directData,
      error: directError?.message,
      hasData: !!directData,
    });

    if (!directError && directData) {
      const buffer = await directData.arrayBuffer();
      console.log(
        '[ImagePreprocessor:fetchImage] Direct download succeeded, size:',
        buffer.byteLength,
      );
      return buffer;
    }

    // If direct download fails, search for the file by ID in the path
    // The storage path format is: {user_id}/{conversation_id}/{image_id}
    // We need to find the full path that ends with this image ID
    console.log(
      '[ImagePreprocessor:fetchImage] Direct download failed, searching for image path...',
    );
    const imagePath = await this.findImagePath(imageId);
    console.log('[ImagePreprocessor:fetchImage] Found image path:', imagePath);

    if (!imagePath) {
      console.error(
        '[ImagePreprocessor:fetchImage] Image not found in storage',
      );
      throw new Error(
        `Failed to fetch image: Image not found with ID ${imageId}`,
      );
    }

    console.log(
      '[ImagePreprocessor:fetchImage] Downloading from found path...',
    );
    const { data, error } = await this.supabase.storage
      .from(this.bucketName)
      .download(imagePath);

    if (error) {
      console.error(
        '[ImagePreprocessor:fetchImage] Download from path failed:',
        {
          path: imagePath,
          error: error.message,
        },
      );
      throw new Error(`Failed to fetch image: ${error.message}`);
    }

    const buffer = await data.arrayBuffer();
    console.log(
      '[ImagePreprocessor:fetchImage] Download succeeded, size:',
      buffer.byteLength,
    );
    return buffer;
  }

  /**
   * Find the full storage path for an image by its ID
   * Searches the storage bucket for a file whose path ends with the given ID
   */
  private async findImagePath(imageId: string): Promise<string | null> {
    // Try using RPC to call a custom function if available
    // Otherwise fallback to listing method
    return await this.findImagePathByListing(imageId);
  }

  /**
   * Find image path by listing storage objects
   * Storage path format: {user_id}/{conversation_id}/{image_id}
   */
  private async findImagePathByListing(
    imageId: string,
  ): Promise<string | null> {
    console.log(
      '[ImagePreprocessor:findImagePathByListing] Searching for image:',
      imageId,
    );

    // List root folders (user IDs) in the bucket
    const { data: folders, error: folderError } = await this.supabase.storage
      .from(this.bucketName)
      .list('', { limit: 1000 });

    if (folderError || !folders) {
      console.error(
        '[ImagePreprocessor:findImagePathByListing] Failed to list storage folders:',
        folderError,
      );
      return null;
    }

    console.log(
      '[ImagePreprocessor:findImagePathByListing] Found root folders:',
      folders.length,
    );

    // Search through each user folder
    for (const folder of folders) {
      // Folders have metadata.mimetype as null, files have a mimetype
      // Also check if it looks like a UUID (user_id folder)
      if (!folder.name) continue;

      const { data: subFolders } = await this.supabase.storage
        .from(this.bucketName)
        .list(folder.name, { limit: 1000 });

      if (!subFolders) continue;

      console.log(
        `[ImagePreprocessor:findImagePathByListing] Folder ${folder.name} has ${subFolders.length} subfolders`,
      );

      // Search through conversation folders
      for (const subFolder of subFolders) {
        if (!subFolder.name) continue;

        const { data: files } = await this.supabase.storage
          .from(this.bucketName)
          .list(`${folder.name}/${subFolder.name}`, { limit: 1000 });

        if (!files) continue;

        // Look for the file with matching ID
        const matchingFile = files.find(
          (f) => f.name === imageId || f.name.includes(imageId),
        );

        if (matchingFile) {
          const fullPath = `${folder.name}/${subFolder.name}/${matchingFile.name}`;
          console.log(
            '[ImagePreprocessor:findImagePathByListing] Found matching file:',
            fullPath,
          );
          return fullPath;
        }
      }
    }

    console.log(
      '[ImagePreprocessor:findImagePathByListing] No matching file found',
    );
    return null;
  }

  private getImageDimensions(imageData: ArrayBuffer): {
    width: number;
    height: number;
  } {
    const uint8 = new Uint8Array(imageData);

    // Try to detect from PNG header
    if (this.isPNG(uint8)) {
      return this.getPNGDimensions(uint8);
    }

    // Try to detect from JPEG header
    if (this.isJPEG(uint8)) {
      return this.getJPEGDimensions(uint8);
    }

    // Default dimensions if detection fails
    return { width: 1024, height: 1024 };
  }

  private isPNG(data: Uint8Array): boolean {
    return (
      data[0] === 0x89 &&
      data[1] === 0x50 &&
      data[2] === 0x4e &&
      data[3] === 0x47
    );
  }

  private isJPEG(data: Uint8Array): boolean {
    return data[0] === 0xff && data[1] === 0xd8;
  }

  private getPNGDimensions(data: Uint8Array): {
    width: number;
    height: number;
  } {
    // PNG dimensions are at bytes 16-23 (IHDR chunk)
    const width =
      (data[16] << 24) | (data[17] << 16) | (data[18] << 8) | data[19];
    const height =
      (data[20] << 24) | (data[21] << 16) | (data[22] << 8) | data[23];
    return { width, height };
  }

  private getJPEGDimensions(data: Uint8Array): {
    width: number;
    height: number;
  } {
    // JPEG dimensions are in SOF0 marker
    let i = 2;
    while (i < data.length) {
      if (data[i] !== 0xff) {
        i++;
        continue;
      }

      const marker = data[i + 1];
      if (marker === 0xc0 || marker === 0xc2) {
        // SOF0 or SOF2
        const height = (data[i + 5] << 8) | data[i + 6];
        const width = (data[i + 7] << 8) | data[i + 8];
        return { width, height };
      }

      // Skip to next marker
      const length = (data[i + 2] << 8) | data[i + 3];
      i += 2 + length;
    }

    return { width: 1024, height: 1024 };
  }

  private calculateTargetDimensions(
    width: number,
    height: number,
    maxDimension: number,
  ): { width: number; height: number } {
    if (width <= maxDimension && height <= maxDimension) {
      return { width, height };
    }

    const aspectRatio = width / height;

    if (width > height) {
      return {
        width: maxDimension,
        height: Math.round(maxDimension / aspectRatio),
      };
    } else {
      return {
        width: Math.round(maxDimension * aspectRatio),
        height: maxDimension,
      };
    }
  }

  private detectFormat(data: ArrayBuffer): 'jpeg' | 'png' | 'webp' | 'gif' {
    const uint8 = new Uint8Array(data);

    if (this.isPNG(uint8)) return 'png';
    if (this.isJPEG(uint8)) return 'jpeg';
    if (
      uint8[0] === 0x52 &&
      uint8[1] === 0x49 &&
      uint8[2] === 0x46 &&
      uint8[3] === 0x46
    ) {
      return 'webp';
    }
    if (uint8[0] === 0x47 && uint8[1] === 0x49 && uint8[2] === 0x46) {
      return 'gif';
    }

    return 'jpeg'; // Default
  }

  private getMimeType(format: string): string {
    const mimeTypes: Record<string, string> = {
      jpeg: 'image/jpeg',
      jpg: 'image/jpeg',
      png: 'image/png',
      webp: 'image/webp',
      gif: 'image/gif',
    };

    return mimeTypes[format] || 'image/jpeg';
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const uint8 = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < uint8.length; i++) {
      binary += String.fromCharCode(uint8[i]);
    }
    return btoa(binary);
  }
}

// =============================================================================
// Factory Function
// =============================================================================

/**
 * Create an image preprocessor from Supabase client
 */
export function createImagePreprocessor(
  supabase: SupabaseClient<Database>,
  bucketName?: string,
): ImagePreprocessor {
  return new ImagePreprocessor(supabase, bucketName);
}
