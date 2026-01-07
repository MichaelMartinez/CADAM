import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Message } from '@shared/types';
import { ModelCard } from '@/components/history/ModelCard';

export function ConversationGalleryView() {
  const { id: conversationId } = useParams();

  const messagesQuery = useQuery<Message[]>({
    queryKey: ['messages', conversationId],
    enabled: !!conversationId,
    queryFn: async () => {
      if (!conversationId) return [];

      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .not('content', 'is', null)
        .not('content->artifact', 'is', null)
        .not('content->artifact->code', 'is', null)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Message[];
    },
  });

  return (
    <div className="h-full min-w-0 flex-1 flex-col bg-adam-background-1 pt-8 md:pt-0">
      <div className="mx-auto w-full max-w-6xl px-6 pb-4 pt-10 md:px-20 md:py-4">
        <h1 className="flex items-center gap-2 px-2 text-2xl font-medium text-adam-neutral-10">
          Conversation Models
        </h1>
      </div>
      <div className="mx-auto w-full max-w-6xl px-6 md:px-20">
        {messagesQuery.isLoading && <p>Loading...</p>}
        {messagesQuery.isError && <p>Error loading models.</p>}
        {messagesQuery.data && (
          <div className="grid gap-6 py-4 pb-48 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {messagesQuery.data.map((message) => (
              <ModelCard key={message.id} message={message} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
