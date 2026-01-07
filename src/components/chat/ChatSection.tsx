import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Message, Model } from '@shared/types';
import TextAreaChat from '@/components/TextAreaChat';
import { AssistantMessage } from '@/components/chat/AssistantMessage';
import { UserMessage } from '@/components/chat/UserMessage';
import { useConversation } from '@/services/conversationService';
import { ChatTitle } from '@/components/chat/ChatTitle';
import { TreeNode } from '@shared/Tree';
import { PARAMETRIC_MODELS } from '@/lib/utils';
import {
  useIsLoading,
  useSendContentMutation,
} from '@/services/messageService';
import { CompilationProgress } from '@/components/chat/CompilationProgress';
import { useOpenSCAD } from '@/hooks/useOpenSCAD';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { AnimatedEllipsis } from '@/components/chat/AnimatedEllipsis';

interface ChatSectionProps {
  messages: TreeNode<Message>[];
}

export function ChatSection({ messages }: ChatSectionProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { conversation } = useConversation();
  const [model, setModel] = useState<Model>(PARAMETRIC_MODELS[0].id);
  const isLoading = useIsLoading();
  const { mutate: sendMessage } = useSendContentMutation({ conversation });
  const { compilationEvents, isCompiling } = useOpenSCAD();

  // Sync model selection with the conversation history (last used model)
  useEffect(() => {
    if (messages.length > 0) {
      const lastAssistantMessage = [...messages]
        .reverse()
        .find((m) => m.role === 'assistant');
      if (lastAssistantMessage?.content?.model) {
        setModel(lastAssistantMessage.content.model);
      }
    }
  }, [messages]);

  const scrollToBottom = useCallback(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        '[data-radix-scroll-area-viewport]',
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Also scroll when generating state changes
  useEffect(() => {
    if (isLoading) {
      scrollToBottom();
    }
  }, [isLoading, scrollToBottom]);

  const lastMessage = useMemo(() => {
    if (conversation.current_message_leaf_id) {
      return messages.find(
        (msg) => msg.id === conversation.current_message_leaf_id,
      );
    }
    return messages[messages.length - 1];
  }, [messages, conversation.current_message_leaf_id]);

  // Get the current version number based on assistant messages only
  const getCurrentVersion = useCallback(
    (index: number) => {
      return messages.slice(0, index + 1).filter((m) => m.role === 'assistant')
        .length;
    },
    [messages],
  );

  return (
    <div className="flex h-full w-full flex-col items-center overflow-hidden border-r border-neutral-700 bg-adam-bg-secondary-dark dark:border-gray-800">
      <div className="flex w-full items-center justify-between bg-transparent p-3 pl-12 dark:border-gray-800">
        <div className="flex min-w-0 flex-1 items-center space-x-2">
          <div className="min-w-0 flex-1">
            <ChatTitle />
          </div>
        </div>
      </div>
      <ScrollArea
        className="relative w-full max-w-xl flex-1 px-2 py-0"
        ref={scrollAreaRef}
      >
        <div className="pointer-events-none sticky left-0 top-0 z-50 mr-4 h-3 bg-gradient-to-b from-adam-bg-secondary-dark/90 to-transparent" />
        <div className="space-y-4 pb-6">
          {messages.map((message, index) => {
            return (
              <div className="p-1" key={message.id}>
                {message.role === 'assistant' ? (
                  <AssistantMessage
                    message={message}
                    currentVersion={getCurrentVersion(index)}
                  />
                ) : (
                  <UserMessage message={message} isLoading={isLoading} />
                )}
              </div>
            );
          })}
          {isLoading && lastMessage?.role !== 'assistant' && (
            <div className="flex w-full p-1">
              <div className="mr-2 mt-1">
                <Avatar className="h-9 w-9 border border-adam-neutral-700 bg-adam-neutral-950 p-1.5">
                  <AvatarImage
                    src={`${import.meta.env.BASE_URL}/adam-logo.svg`}
                    alt="Adam"
                  />
                </Avatar>
              </div>
              <div className="max-w-[80%] rounded-lg bg-adam-neutral-800">
                {isCompiling && compilationEvents.length > 0 ? (
                  <CompilationProgress events={compilationEvents} />
                ) : (
                  <div className="flex flex-col items-center justify-center gap-2 p-3">
                    <AnimatedEllipsis color="adam-neutral" />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="w-full min-w-52 max-w-xl bg-transparent px-4 pb-6">
        <TextAreaChat
          onSubmit={sendMessage}
          placeholder="Keep iterating with Adam..."
          disabled={isLoading}
          model={model}
          setModel={setModel}
          conversation={conversation}
        />
      </div>
    </div>
  );
}
