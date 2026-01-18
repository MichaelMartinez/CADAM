/**
 * Hook for loading images from workflow context
 *
 * Handles both workflow-specific paths (workflow-screenshots/...)
 * and user-uploaded images ({user_id}/{conversation_id}/{image_id})
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

interface UseWorkflowImageOptions {
  imageId: string;
  conversationId?: string;
  enabled?: boolean;
}

interface WorkflowImageResult {
  imageUrl: string | undefined;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Determines if an image ID is a full path (workflow-specific)
 * or needs to be resolved with conversation context
 */
function isFullPath(imageId: string): boolean {
  return (
    imageId.startsWith('workflow-screenshots/') || imageId.includes('/') // Already has path separators
  );
}

/**
 * Downloads an image from Supabase storage and returns it as a data URL
 */
async function downloadImageAsDataUrl(path: string): Promise<string> {
  const { data, error } = await supabase.storage.from('images').download(path);

  if (error) {
    throw new Error(`Failed to download image: ${error.message}`);
  }

  if (!data) {
    throw new Error('No image data received');
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read image data'));
    reader.readAsDataURL(data);
  });
}

/**
 * Fetches the user_id for a conversation to build the full image path
 */
async function getConversationUserId(conversationId: string): Promise<string> {
  const { data, error } = await supabase
    .from('conversations')
    .select('user_id')
    .eq('id', conversationId)
    .single();

  if (error) {
    throw new Error(`Failed to fetch conversation: ${error.message}`);
  }

  return data.user_id;
}

/**
 * Hook to load a workflow-related image
 *
 * @param options.imageId - The image ID or full path
 * @param options.conversationId - Conversation ID (needed for user-uploaded images)
 * @param options.enabled - Whether to enable the query
 */
export function useWorkflowImage({
  imageId,
  conversationId,
  enabled = true,
}: UseWorkflowImageOptions): WorkflowImageResult {
  const query = useQuery({
    queryKey: ['workflow-image', imageId, conversationId],
    enabled: enabled && !!imageId,
    staleTime: Infinity, // Cache forever within session
    queryFn: async () => {
      let fullPath: string;

      if (isFullPath(imageId)) {
        // Already a full path (workflow screenshot)
        fullPath = imageId;
      } else if (conversationId) {
        // Need to resolve with conversation context
        const userId = await getConversationUserId(conversationId);
        fullPath = `${userId}/${conversationId}/${imageId}`;
      } else {
        throw new Error('conversationId is required for user-uploaded images');
      }

      return downloadImageAsDataUrl(fullPath);
    },
  });

  return {
    imageUrl: query.data,
    isLoading: query.isLoading,
    error: query.error,
  };
}

/**
 * Creates an async image URL resolver function for a given conversation
 * This is useful when you need to resolve multiple images in a component
 */
export function createWorkflowImageResolver(conversationId: string) {
  return async (imageId: string): Promise<string> => {
    let fullPath: string;

    if (isFullPath(imageId)) {
      fullPath = imageId;
    } else {
      const userId = await getConversationUserId(conversationId);
      fullPath = `${userId}/${conversationId}/${imageId}`;
    }

    return downloadImageAsDataUrl(fullPath);
  };
}

export default useWorkflowImage;
