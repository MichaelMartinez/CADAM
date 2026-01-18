import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Content, Message, Model } from '@shared/types';
import TextAreaChat from '@/components/TextAreaChat';
import { AssistantMessage } from '@/components/chat/AssistantMessage';
import { UserMessage } from '@/components/chat/UserMessage';
import { WorkflowMessage } from '@/components/chat/WorkflowMessage';
import { useConversation } from '@/services/conversationService';
import { AssistantLoading } from '@/components/chat/AssistantLoading';
import { ChatTitle } from '@/components/chat/ChatTitle';
import { TreeNode } from '@shared/Tree';
import { PARAMETRIC_MODELS } from '@/lib/utils';
import {
  useIsLoading,
  useSendContentMutation,
  useInsertMessageMutation,
} from '@/services/messageService';
import {
  WorkflowProvider,
  useWorkflowContext,
} from '@/contexts/WorkflowContext';
import { workflowLogger } from '@/lib/logger';
import type { WorkflowIntent } from '@/views/EditorView';

interface ChatSectionProps {
  messages: TreeNode<Message>[];
  workflowIntent?: WorkflowIntent;
}

// Inner component that uses the workflow context
function ChatSectionInner({ messages, workflowIntent }: ChatSectionProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { conversation } = useConversation();
  const [model, setModel] = useState<Model>(PARAMETRIC_MODELS[0].id);
  const isLoading = useIsLoading();
  const { mutate: sendMessage } = useSendContentMutation({ conversation });
  const { mutateAsync: insertMessage } = useInsertMessageMutation();
  const workflowIntentHandledRef = useRef(false);

  // Workflow context
  const {
    workflowMode,
    setWorkflowMode,
    activeWorkflow,
    isWorkflowActive,
    startWorkflow,
    resolveInflectionPoint,
    cancelWorkflow,
  } = useWorkflowContext();

  // Handle workflow intent from navigation state (from PromptView)
  useEffect(() => {
    if (
      workflowIntent &&
      !workflowIntentHandledRef.current &&
      conversation.id
    ) {
      workflowIntentHandledRef.current = true;
      workflowLogger.info(
        'ChatSection: Received workflowIntent from navigation, starting workflow',
        {
          workflowType: workflowIntent.workflowType,
          triggerMessageId: workflowIntent.triggerMessageId,
          conversationId: conversation.id,
        },
      );

      startWorkflow({
        conversationId: conversation.id,
        triggerMessageId: workflowIntent.triggerMessageId,
        workflowType: workflowIntent.workflowType,
      }).catch((error) => {
        workflowLogger.error(
          'ChatSection: Failed to start workflow from intent',
          error,
        );
      });
    }
  }, [workflowIntent, conversation.id, startWorkflow]);

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

  // Also scroll when generating state changes or workflow updates
  useEffect(() => {
    if (isLoading || isWorkflowActive) {
      scrollToBottom();
    }
  }, [isLoading, isWorkflowActive, scrollToBottom]);

  // Scroll when active workflow changes
  useEffect(() => {
    if (activeWorkflow) {
      scrollToBottom();
    }
  }, [activeWorkflow, scrollToBottom]);

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

  // Handle message submission - may trigger workflow or standard chat
  const handleSubmit = useCallback(
    async (content: Content) => {
      // Log the decision point for debugging workflow triggering
      workflowLogger.info('=== ChatSection.handleSubmit ENTRY ===', {
        hasWorkflowMode: !!content.workflowMode,
        workflowMode: content.workflowMode ?? 'none (NOT SET)',
        hasText: !!content.text,
        hasImages: !!content.images?.length,
        imageCount: content.images?.length ?? 0,
        contentKeys: Object.keys(content),
      });

      if (content.workflowMode) {
        workflowLogger.info('Taking WORKFLOW path', {
          workflowType: content.workflowMode,
          conversationId: conversation.id,
        });
        // For workflows: only insert the user message, then start workflow
        // Don't call the chat API - the workflow will handle generation
        try {
          const userMessage = await insertMessage({
            role: 'user',
            content,
            parent_message_id: conversation.current_message_leaf_id ?? null,
            conversation_id: conversation.id,
          });

          workflowLogger.info('User message inserted, starting workflow', {
            userMessageId: userMessage.id,
          });

          // Start the workflow with the newly created message
          await startWorkflow({
            conversationId: conversation.id,
            triggerMessageId: userMessage.id,
            workflowType: content.workflowMode,
          });
        } catch (error) {
          workflowLogger.error('Failed to start workflow', error);
          console.error('Failed to start workflow:', error);
        }
      } else {
        workflowLogger.info('Taking CHAT path (no workflow mode)');
        // Standard chat message - sends message and triggers AI response
        sendMessage(content);
      }
    },
    [sendMessage, insertMessage, startWorkflow, conversation],
  );

  // Handle workflow cancel
  const handleCancelWorkflow = useCallback(async () => {
    try {
      await cancelWorkflow('User cancelled');
    } catch (error) {
      console.error('Failed to cancel workflow:', error);
    }
  }, [cancelWorkflow]);

  // Handle inflection point resolution
  const handleResolveInflection = useCallback(
    async (optionId: string, feedback?: string) => {
      try {
        await resolveInflectionPoint(optionId, feedback);
      } catch (error) {
        console.error('Failed to resolve inflection:', error);
      }
    },
    [resolveInflectionPoint],
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

          {/* Active Workflow Display */}
          {activeWorkflow && (
            <div className="p-1">
              <WorkflowMessage
                workflow={activeWorkflow}
                onResolveInflection={handleResolveInflection}
                onCancel={handleCancelWorkflow}
                isResolving={false}
              />
            </div>
          )}

          {isLoading &&
            lastMessage?.role !== 'assistant' &&
            !isWorkflowActive && <AssistantLoading />}
        </div>
      </ScrollArea>
      <div className="w-full min-w-52 max-w-xl bg-transparent px-4 pb-6">
        <TextAreaChat
          onSubmit={handleSubmit}
          placeholder="Keep iterating with Adam..."
          disabled={isLoading || isWorkflowActive}
          model={model}
          setModel={setModel}
          conversation={conversation}
          workflowMode={workflowMode}
          onWorkflowModeChange={setWorkflowMode}
        />
      </div>
    </div>
  );
}

// Wrapper component that provides the workflow context
export function ChatSection({ messages, workflowIntent }: ChatSectionProps) {
  return (
    <WorkflowProvider>
      <ChatSectionInner messages={messages} workflowIntent={workflowIntent} />
    </WorkflowProvider>
  );
}
