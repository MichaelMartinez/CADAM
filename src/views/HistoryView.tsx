import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Plus, LayoutGrid, List, Upload } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Content, Conversation } from '@shared/types';
import { HistoryConversation } from '@/types/misc';
import { ConversationCard } from '@/components/history/ConversationCard';
import { VisualCard } from '@/components/history/VisualCard';
import { RenameDialogDrawer } from '@/components/history/RenameDialogDrawer';
import { ScadUploadModal } from '@/components/history/ScadUploadModal';
import { useSendContentMutation } from '@/services/messageService';

export function HistoryView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'visual'>('list');
  const [editingConversation, setEditingConversation] =
    useState<Conversation | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [open, setOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      setEditingConversation(null);
    }
  };

  const conversationQuery = useQuery<HistoryConversation[]>({
    queryKey: ['conversations', viewMode],
    enabled: !!user,
    queryFn: async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let conversationsData: any[] | null = null;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let conversationsError: any = null;

      if (viewMode === 'visual') {
        const { data: messages, error: messagesError } = await supabase
          .from('messages')
          .select('conversation_id')
          .not('content', 'is', null)
          .not('content->artifact', 'is', null)
          .not('content->artifact->code', 'is', null)
          .eq('role', 'assistant');

        if (messagesError) throw messagesError;

        const conversationIds = [
          ...new Set(messages.map((m) => m.conversation_id)),
        ];

        const { data, error } = await supabase
          .from('conversations')
          .select(
            `*, first_message:messages(content), messagesCount:messages(count)`,
          )
          .in('id', conversationIds)
          .eq('user_id', user?.id ?? '')
          .order('updated_at', { ascending: false })
          .order('created_at', { ascending: false })
          .limit(1, { referencedTable: 'first_message' });

        conversationsData = data;
        conversationsError = error;
      } else {
        const { data, error } = await supabase
          .from('conversations')
          .select(
            `*, first_message:messages(content), messagesCount:messages(count)`,
          )
          .eq('user_id', user?.id ?? '')
          .order('updated_at', { ascending: false })
          .order('created_at', { ascending: false })
          .limit(1, { referencedTable: 'first_message' });

        conversationsData = data;
        conversationsError = error;
      }

      if (conversationsError) throw conversationsError;
      if (!conversationsData) return [];

      const formattedConversations = conversationsData.map((conv) => {
        const rawContent = conv.first_message?.[0]?.content;
        const firstMessageContent =
          typeof rawContent === 'object' && rawContent !== null
            ? (rawContent as Content)
            : { text: '' };
        const messageCount = conv.messagesCount?.[0]?.count ?? 0;

        const formattedFirstMessage = {
          text: firstMessageContent.text ?? '',
          images: firstMessageContent.images ?? [],
        };

        return {
          ...conv,
          created_at: conv.created_at || new Date().toISOString(),
          updated_at:
            conv.updated_at || conv.created_at || new Date().toISOString(),
          message_count: messageCount,
          first_message: formattedFirstMessage as Content,
        };
      });

      return formattedConversations;
    },
  });

  const { mutate: sendMessage } = useSendContentMutation({
    conversation: {
      id: '',
      user_id: user?.id ?? '',
      current_message_leaf_id: null,
    },
  });

  const { mutate: handleCreateConversation } = useMutation({
    mutationFn: async ({ code, title }: { code: string; title: string }) => {
      const newConversationId = crypto.randomUUID();
      // Create conversation
      const { data: conversation, error: conversationError } = await supabase
        .from('conversations')
        .insert([
          {
            id: newConversationId,
            user_id: user?.id ?? '',
            title: title,
          },
        ])
        .select()
        .single();

      if (conversationError) throw conversationError;

      const content: Content = {
        text: `Uploaded from ${title}`,
        artifact: {
          code,
          title: title,
          version: '1.0.0',
          parameters: [],
        },
      };

      sendMessage({
        ...content,
        conversation_id: newConversationId,
      } as Content & { conversation_id: string });

      return {
        conversationId: conversation.id,
      };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      navigate(`/editor/${data.conversationId}`);
    },
    onError: (error) => {
      console.error(error);
      toast({
        title: 'Error',
        description:
          error instanceof Error
            ? error.message
            : 'Failed to create conversation',
        variant: 'destructive',
      });
    },
  });

  const { mutate: handleSaveDraft } = useMutation({
    mutationFn: async ({ code, title }: { code: string; title: string }) => {
      const newConversationId = crypto.randomUUID();
      // Create conversation
      const { data: conversation, error: conversationError } = await supabase
        .from('conversations')
        .insert([
          {
            id: newConversationId,
            user_id: user?.id ?? '',
            title: title,
          },
        ])
        .select()
        .single();

      if (conversationError) throw conversationError;

      const content: Content = {
        text: `Uploaded from ${title}`,
        artifact: {
          code,
          title: title,
          version: '1.0.0',
          parameters: [],
        },
      };

      // Create the first message for the conversation
      const { error: messageError } = await supabase.from('messages').insert([
        {
          conversation_id: newConversationId,
          role: 'assistant',
          content: content,
        },
      ]);

      if (messageError) throw messageError;

      return {
        conversationId: conversation.id,
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      toast({
        title: 'Success',
        description: 'Draft saved successfully',
      });
      setIsUploadModalOpen(false);
    },
    onError: (error) => {
      console.error(error);
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Failed to save draft',
        variant: 'destructive',
      });
    },
  });

  useEffect(() => {
    if (conversationQuery.isError) {
      toast({
        title: 'Error',
        description: 'Failed to load conversations',
        variant: 'destructive',
      });
    }
  }, [conversationQuery.isError, toast]);

  const deleteConversation = useMutation({
    mutationFn: async (conversationId: string) => {
      const { error } = await supabase
        .from('conversations')
        .delete()
        .eq('id', conversationId);

      if (error) throw error;

      supabase.storage
        .from('images')
        .list(`${user?.id}/${conversationId}`)
        .then(({ data: list }) => {
          if (list) {
            const filesToRemove = list.map(
              (file) => `${user?.id}/${conversationId}/${file.name}`,
            );
            supabase.storage.from('images').remove(filesToRemove);
          }
        });
    },
    onMutate: async (conversationId) => {
      await queryClient.cancelQueries({
        queryKey: ['conversations', viewMode],
      });
      const previousConversations = queryClient.getQueryData([
        'conversations',
        viewMode,
      ]);
      queryClient.setQueryData(
        ['conversations', viewMode],
        (old: HistoryConversation[] | undefined) =>
          old?.filter((conv) => conv.id !== conversationId) ?? [],
      );
      return { previousConversations };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations', viewMode] });
      toast({
        title: 'Success',
        description: 'Conversation deleted successfully',
      });
    },
    onError: (error: unknown, _conversationId: string, context) => {
      console.error('Error deleting conversation:', error);
      queryClient.setQueryData(
        ['conversations', viewMode],
        context?.previousConversations,
      );
      toast({
        title: 'Error',
        description: 'Failed to delete conversation',
        variant: 'destructive',
      });
    },
  });

  const renameConversation = useMutation({
    mutationFn: async ({
      conversationId,
      newTitle,
    }: {
      conversationId: string;
      newTitle: string;
    }) => {
      const { error } = await supabase
        .from('conversations')
        .update({ title: newTitle })
        .eq('id', conversationId);

      if (error) throw error;
    },
    onMutate: async ({ conversationId, newTitle }) => {
      await queryClient.cancelQueries({
        queryKey: ['conversations', viewMode],
      });
      const previousConversations = queryClient.getQueryData([
        'conversations',
        viewMode,
      ]);
      queryClient.setQueryData(
        ['conversations', viewMode],
        (old: HistoryConversation[] | undefined) =>
          old?.map((conv) =>
            conv.id === conversationId ? { ...conv, title: newTitle } : conv,
          ) ?? [],
      );
      return { previousConversations };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations', viewMode] });
      toast({
        title: 'Success',
        description: 'Conversation renamed successfully',
      });
      setEditingConversation(null);
      setOpen(false);
    },
    onError: (error: unknown, _variables, context) => {
      console.error('Error renaming conversation:', error);
      queryClient.setQueryData(
        ['conversations', viewMode],
        context?.previousConversations,
      );
      toast({
        title: 'Error',
        description: 'Failed to rename conversation',
        variant: 'destructive',
      });
    },
  });

  const handleRename = () => {
    if (!editingConversation) return;
    if (!newTitle.trim()) {
      toast({
        title: 'Title cannot be empty',
        variant: 'default',
      });
      return;
    }
    renameConversation.mutate({
      conversationId: editingConversation.id,
      newTitle: newTitle.trim(),
    });
  };

  const filteredConversations =
    conversationQuery.data?.filter((conv: HistoryConversation) => {
      const messageText = conv.first_message.text ?? '';
      const title = conv.title?.toLowerCase() ?? '';
      const searchTerm = searchQuery.toLowerCase();

      return (
        title.includes(searchTerm) ||
        messageText.toLowerCase().includes(searchTerm)
      );
    }) ?? [];

  const groupConversationsByDate = () => {
    const groups: { [key: string]: HistoryConversation[] } = {};

    filteredConversations.forEach((conv: HistoryConversation) => {
      const localDate = new Date(
        conv.updated_at || conv.created_at,
      ).toLocaleDateString('en-CA');
      if (!groups[localDate]) {
        groups[localDate] = [];
      }
      groups[localDate].push(conv);
    });

    return groups;
  };

  const conversationGroups = groupConversationsByDate();

  return (
    <>
      <div className="flex h-full min-w-0 flex-1 flex-col bg-adam-background-1 pt-8 md:pt-0">
        <div className="mx-auto w-full max-w-6xl px-6 pb-4 pt-10 md:px-20 md:py-4">
          <div className="flex items-center justify-between py-3">
            <h1 className="flex items-center gap-2 px-2 text-2xl font-medium text-adam-neutral-10">
              Past Creations
            </h1>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setIsUploadModalOpen(true)}
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload SCAD
              </Button>
              {/* View Toggle */}
              <div className="flex items-center gap-2 rounded-lg border border-adam-neutral-700 bg-adam-background-2 p-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={`h-8 px-3 ${
                    viewMode === 'list'
                      ? 'bg-adam-neutral-950 text-adam-neutral-50'
                      : 'text-adam-neutral-400 hover:bg-transparent hover:text-adam-neutral-50'
                  }`}
                >
                  <List className="mr-2 h-4 w-4" />
                  List
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('visual')}
                  className={`h-8 px-3 ${
                    viewMode === 'visual'
                      ? 'bg-adam-neutral-950 text-adam-neutral-50'
                      : 'text-adam-neutral-400 hover:bg-transparent hover:text-adam-neutral-50'
                  }`}
                >
                  <LayoutGrid className="mr-2 h-4 w-4" />
                  Visual
                </Button>
              </div>
            </div>
          </div>

          <div className="relative mt-4">
            <Input
              placeholder="Search generations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-0 bg-adam-background-2 pl-6 text-base shadow-[inset_0_0_10px_0_rgba(0,0,0,0.32),0_0_0_2px_rgba(0,0,0,0)] ring-0 transition-shadow duration-300 ease-in-out hover:shadow-[inset_0_0_4px_0_rgba(0,0,0,0.16),0_0_0_2px_rgba(60,60,60,1)] focus:shadow-[inset_0_0_4px_0_rgba(0,0,0,0.16),0_0_0_2px_#00A6FF] focus:outline-none sm:text-sm"
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="mx-auto w-full max-w-6xl px-6 md:px-20">
            {conversationQuery.isLoading ? (
              <div className="space-y-4 py-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center py-8 text-gray-500">
                <MessageSquare className="mb-4 h-12 w-12 opacity-50" />
                {searchQuery ? (
                  <>
                    <p className="mb-2 text-lg font-medium">
                      No matching conversations found
                    </p>
                    <p className="mb-4 text-sm">Try a different search term</p>
                  </>
                ) : (
                  <>
                    <p className="mb-2 text-lg font-medium">
                      No conversations yet
                    </p>
                    <p className="mb-4 text-sm">
                      Start a new chat to begin building CAD
                    </p>
                    <Button onClick={() => navigate('/')}>
                      Start New Chat
                    </Button>
                  </>
                )}
              </div>
            ) : viewMode === 'visual' ? (
              // Visual Grid View
              <div className="grid gap-6 py-4 pb-48 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {filteredConversations.map((conversation) => (
                  <VisualCard
                    key={conversation.id}
                    conversation={conversation}
                    onDelete={(id) => deleteConversation.mutate(id)}
                    onRename={(_id, title) => {
                      setEditingConversation(conversation);
                      setNewTitle(title);
                      setOpen(true);
                    }}
                  />
                ))}
              </div>
            ) : (
              // List View (Original)
              <div className="space-y-8 py-4 pb-48">
                {Object.entries(conversationGroups).map(([date, convs]) => {
                  let dateString;
                  try {
                    const [year, month, day] = date.split('-').map(Number);
                    dateString = format(
                      new Date(year, month - 1, day),
                      'MMMM d, yyyy',
                    );
                  } catch (error) {
                    console.error(error);
                  }

                  return (
                    <div key={date} className="space-y-2">
                      {dateString && (
                        <h2 className="bg-adam-background-1 px-3 py-2 text-sm font-medium text-adam-neutral-100">
                          {dateString}
                        </h2>
                      )}
                      <div className="space-y-2">
                        {convs.map((conversation) => (
                          <ConversationCard
                            key={conversation.id}
                            conversation={conversation}
                            onDelete={(id) => deleteConversation.mutate(id)}
                            onRename={(_id, title) => {
                              setEditingConversation(conversation);
                              setNewTitle(title);
                              setOpen(true);
                            }}
                            isEditing={!!editingConversation}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      <RenameDialogDrawer
        open={open}
        onOpenChange={handleOpenChange}
        newTitle={newTitle}
        onNewTitleChange={setNewTitle}
        onRename={handleRename}
      />
      <ScadUploadModal
        open={isUploadModalOpen}
        onOpenChange={setIsUploadModalOpen}
        onCreateConversation={(code, title) =>
          handleCreateConversation({ code, title })
        }
        onSaveDraft={(code, title) => handleSaveDraft({ code, title })}
      />

      <button
        type="button"
        aria-label="Create new item"
        onClick={() => navigate('/')}
        className="fixed bottom-8 right-8 flex h-14 w-14 items-center justify-center rounded-full bg-adam-neutral-100 text-adam-neutral-950 shadow-[0_4px_32px_rgba(0,0,0,0.48)] md:hidden"
      >
        <Plus className="h-10 w-10 stroke-[2px]" />
      </button>
    </>
  );
}
