import { getSessionById, streamChat } from '@/features/chat/api';
import { ChatActionTypes, ChatMessageTypes } from '@/features/chat/constants';
import {
  type ChatActionType,
  type ChatMetadata,
  type ChatMessage,
} from '@/features/chat/types';
import { useState, useRef, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import stringWidth from 'string-width';
import { useProfileStore } from '@/features/profile/store';
import { Roles } from '@/features/profile/constants';
import { useChatStore } from '../store';
import { useLocation, useParams } from 'react-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import rehypeRaw from 'rehype-raw';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import OrderFormPanel from '@/features/orders/components/order-form-panel';
import logo from '@/assets/logo.png';
import { safelyParseToJson } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useNavigationStore } from '@/features/navigation/store';
import EmailPanel from '@/features/notifications/components/email-panel';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

export default function ChatControl() {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [prompt, setPrompt] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [sessionID, setSessionID] = useState<number | null>(null);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [emailId, setEmailId] = useState<number | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const queryClient = useQueryClient();
  const params = useParams();
  const { user } = useProfileStore();
  const { fetchUserSessions, setArtifactPanelOpen, isArtifactPanelOpen } =
    useChatStore();
  const { setOpenSidebar } = useNavigationStore();

  const { data: session } = useQuery({
    queryKey: ['session', params.id],
    queryFn: async () => {
      if (!params.id) {
        return {
          messages: [],
        };
      }

      return await getSessionById(Number(params.id));
    },
    enabled: !!params.id,
  });

  /**
   * Scrolls the chat container to the bottom
   */
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    return () => {
      setChatMessages([]);
      setArtifactPanelOpen(false);
      setOrderId(null);
      setSessionID(null);
      setEmailId(null);
    };
  }, [setArtifactPanelOpen]);

  useEffect(() => {
    if (location.pathname === '/chat') {
      setChatMessages([]);
      setArtifactPanelOpen(false);
      setOrderId(null);
      setSessionID(null);
      setEmailId(null);
    }
  }, [location, setArtifactPanelOpen, setOrderId, setEmailId]);

  /**
   * Sets the chat messages when the session changes
   */
  useEffect(() => {
    if (session) {
      setChatMessages(session.messages);
    }
  }, [session]);

  /**
   * Auto-scroll when messages change or during streaming
   */
  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  /**
   * Handles the action for the chat
   */
  const handleAction = useCallback(
    (action: ChatActionType, id?: number) => {
      switch (action) {
        case ChatActionTypes.VIEW_ORDER_DETAILS:
          if (!id) {
            return;
          }

          setArtifactPanelOpen(true);
          setOrderId(id);
          setOpenSidebar(false);
          setEmailId(null);
          break;
        case ChatActionTypes.WRITE_EMAIL:
          if (!id) {
            return;
          }

          setArtifactPanelOpen(true);
          setEmailId(id);
          setOrderId(null);
          setOpenSidebar(false);
          break;
      }
    },
    [setOpenSidebar, setEmailId, setOrderId, setArtifactPanelOpen],
  );

  /**
   * Streams the chat response from the server.
   */
  const handleStreamChat = useCallback(async () => {
    if (!prompt.trim()) {
      return;
    }

    if (!user?.id) {
      return;
    }

    setIsStreaming(true);
    setPrompt('');
    setChatMessages((prev) => [
      ...prev,
      {
        role: user?.role ? user.role : Roles.USER,
        content: prompt,
      },
    ]);

    let assistantMessageIndex = -1;
    let assistantMessage = '';

    const assistantMessages = [...chatMessages].filter(
      (message) => message.role === Roles.ASSISTANT,
    );

    let context = '';
    const quantityToAppend = Math.min(3, assistantMessages.length);
    const contextMessages = assistantMessages.slice(-quantityToAppend);

    for (const message of contextMessages) {
      if (!message?.metadata) continue;

      const metadata = safelyParseToJson<ChatMetadata>(message.metadata);
      if (metadata?.context) {
        context += `Message log at: ${message.createdAt}\n\n`;
        context += `${metadata.context}\n\n`;
      }

      if (metadata.accountID) {
        context += `Account: ${metadata.accountID}\n`;
      }

      if (metadata.orderID) {
        context += `Order: ${metadata.orderID}\n`;
      }

      if (metadata.emailID) {
        context += `Email: ${metadata.emailID}\n`;
      }

      context += '\n';
    }

    try {
      const response = await streamChat({
        message: prompt,
        context,
        sessionId: sessionID ?? Number(params.id),
      });

      const stream = response.body;

      if (!stream) {
        setChatMessages((prev) => [
          ...prev,
          {
            role: Roles.ASSISTANT,
            content: 'Error: Response body is null',
          },
        ]);
        return;
      }

      // Stream the response
      const reader = stream.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');

        buffer = lines.pop() || '';

        for (const line of lines) {
          try {
            if (!line) {
              continue;
            }

            const data = JSON.parse(line);

            if (data.sessionID) {
              setSessionID(data.sessionID as number);
              window.history.replaceState(null, '', `/chat/${data.sessionID}`);
            }

            switch (data.type) {
              case ChatMessageTypes.STATUS:
                setChatMessages((prev) => {
                  assistantMessageIndex = prev.length;
                  return [
                    ...prev,
                    {
                      role: Roles.ASSISTANT,
                      content: data.content,
                    },
                  ];
                });
                break;
              case ChatMessageTypes.ASSISTANT_START:
                setChatMessages((prev) => {
                  const newMessages = [...prev];
                  if (assistantMessageIndex === -1) {
                    newMessages.push({
                      role: Roles.ASSISTANT,
                      content: data.content,
                    });
                    assistantMessageIndex = newMessages.length - 1;
                  } else {
                    newMessages[newMessages.length - 1].content = data.content;

                    newMessages[newMessages.length - 1].role = Roles.ASSISTANT;
                  }
                  return newMessages;
                });
                assistantMessage = data.content;
                break;
              case ChatMessageTypes.DELTA:
                assistantMessage += data.content;
                setChatMessages((prev) => {
                  const newMessages = [...prev];
                  newMessages[newMessages.length - 1].content =
                    assistantMessage;

                  newMessages[newMessages.length - 1].role = Roles.ASSISTANT;
                  return newMessages;
                });
                break;
              case ChatMessageTypes.METADATA: {
                const messageMetadata = data.content;
                const metadata = JSON.parse(messageMetadata) as Record<
                  string,
                  unknown
                >;

                setChatMessages((prev) => {
                  const newMessages = [...prev];
                  newMessages[newMessages.length - 1].metadata =
                    messageMetadata;

                  newMessages[newMessages.length - 1].role = Roles.ASSISTANT;

                  return newMessages;
                });

                if (
                  metadata?.intent === ChatActionTypes.CREATE_ORDER ||
                  metadata?.intent === ChatActionTypes.UPDATE_ORDER ||
                  metadata?.intent === ChatActionTypes.DELETE_ORDER ||
                  metadata?.intent === ChatActionTypes.VIEW_ORDER_DETAILS
                ) {
                  if (metadata.orderID) {
                    setOrderId(metadata.orderID as number);
                    setArtifactPanelOpen(true);
                    setEmailId(null);
                    setOpenSidebar(false);
                  }
                }

                if (
                  metadata?.intent === ChatActionTypes.ADD_ORDER_ITEM ||
                  metadata?.intent === ChatActionTypes.UPDATE_ORDER ||
                  metadata?.intent === ChatActionTypes.DELETE_ORDER_ITEM ||
                  metadata?.intent === ChatActionTypes.UPDATE_ORDER_ITEM ||
                  metadata?.intent === ChatActionTypes.VIEW_ORDER_DETAILS
                ) {
                  if (metadata.orderID) {
                    await queryClient.invalidateQueries({
                      queryKey: ['order', metadata.orderID],
                    });
                    setOrderId(metadata.orderID as number);
                    setArtifactPanelOpen(true);
                    setEmailId(null);
                    setOpenSidebar(false);
                  }
                }

                if (
                  metadata?.intent === ChatActionTypes.WRITE_EMAIL ||
                  metadata?.intent === ChatActionTypes.SEND_EMAIL
                ) {
                  if (metadata.emailID) {
                    setEmailId(metadata.emailID as number);
                    setArtifactPanelOpen(true);
                    setOrderId(null);
                    setOpenSidebar(false);
                  }
                }
                break;
              }
              case ChatMessageTypes.ERROR:
                setChatMessages((prev) => [
                  ...prev,
                  { role: Roles.ASSISTANT, content: data.content },
                ]);
                break;
              default:
                setChatMessages((prev) => [
                  ...prev,
                  {
                    role: Roles.ASSISTANT,
                    content: `Unknown message type: ${data.type}`,
                  },
                ]);
                break;
            }
          } catch (error) {
            setChatMessages((prev) => [
              ...prev,
              {
                role: Roles.ASSISTANT,
                content: `Error parsing JSON: ${error}`,
              },
            ]);
          }
        }
      }
    } catch (error) {
      console.error('Chat streaming error:', error);
      setChatMessages((prev) => [
        ...prev,
        {
          role: Roles.ASSISTANT,
          content: `Error: ${error}`,
        },
      ]);
    } finally {
      setIsStreaming(false);
      if (!sessionID) {
        await fetchUserSessions();
      }
    }
  }, [
    prompt,
    user?.id,
    user?.role,
    chatMessages,
    sessionID,
    params.id,
    setArtifactPanelOpen,
    setOpenSidebar,
    queryClient,
    fetchUserSessions,
  ]);

  return (
    <div className="flex h-full flex-col items-center justify-center px-20">
      {chatMessages.length > 0 && (
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel
            defaultSize={isArtifactPanelOpen ? 45 : 100}
            className="h-full w-full flex-1 overflow-y-auto"
          >
            {chatMessages.length > 0 && (
              <div
                ref={chatContainerRef}
                className="o h-full w-full flex-1 overflow-x-hidden px-10"
              >
                {chatMessages.map((message, index, a) => {
                  if (
                    message.role === Roles.SALES_REP ||
                    message.role === Roles.USER ||
                    message.role === Roles.ACCOUNT_MANAGER ||
                    message.role === Roles.TRADE_MARKETING ||
                    message.role === Roles.FINANCE ||
                    message.role === Roles.COLLECTIONS ||
                    message.role === Roles.LOGISTICS
                  ) {
                    return (
                      <div
                        key={`${index}-${message.role}`}
                        className="mb-5 flex w-full justify-end gap-2"
                      >
                        <p className="bg-foreground dark:bg-background rounded-lg p-2 text-white">
                          {message.content}
                        </p>
                      </div>
                    );
                  }

                  const metadata = safelyParseToJson<ChatMetadata>(
                    message?.metadata,
                  );

                  return (
                    <div
                      className="overflow-x-auto pb-15 [&_details]:text-xs [&_details]:text-gray-500 [&_h1]:my-2 [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:my-2 [&_h2]:text-xl [&_h2]:font-bold [&_h3]:my-2 [&_h3]:text-lg [&_h3]:font-bold [&_h4]:my-2 [&_h4]:font-bold [&_h5]:my-2 [&_h5]:font-bold [&_h6]:my-2 [&_h6]:font-bold [&_p]:my-2 [&_table]:my-8 [&_table]:w-full [&_td]:border [&_td]:border-gray-300 [&_td]:p-4 [&_td]:text-xs [&_th]:border [&_th]:border-gray-300 [&_th]:p-4 [&_th]:text-xs [&_ul]:list-disc [&_ul]:pl-4"
                      key={`${index}-${message.role}`}
                    >
                      <ReactMarkdown
                        children={(message?.content as string) ?? ''}
                        remarkPlugins={[
                          [remarkGfm, { stringLength: stringWidth }],
                        ]}
                        rehypePlugins={[rehypeRaw]}
                      />

                      <div className="flex flex-col gap-2 pt-4 pb-2">
                        {metadata?.orderID && (
                          <Badge
                            className="cursor-pointer"
                            onClick={() =>
                              handleAction(
                                ChatActionTypes.VIEW_ORDER_DETAILS,
                                metadata.orderID,
                              )
                            }
                          >
                            👀 View order form
                          </Badge>
                        )}
                        {metadata?.emailID &&
                          metadata?.intent === ChatActionTypes.SEND_EMAIL && (
                            <Badge
                              className="cursor-pointer"
                              onClick={() =>
                                handleAction(
                                  ChatActionTypes.WRITE_EMAIL,
                                  metadata.emailID,
                                )
                              }
                            >
                              📫 View email
                            </Badge>
                          )}
                        {metadata?.emailID &&
                          metadata?.intent === ChatActionTypes.WRITE_EMAIL && (
                            <Badge
                              className="cursor-pointer"
                              onClick={() =>
                                handleAction(
                                  ChatActionTypes.WRITE_EMAIL,
                                  metadata.emailID,
                                )
                              }
                            >
                              📫 View email
                            </Badge>
                          )}
                        {(metadata?.actions ?? []).map((action) => (
                          <Badge
                            variant="outline"
                            className="cursor-pointer"
                            key={action.type}
                            onClick={() =>
                              handleAction(
                                action.type as ChatActionType,
                                metadata?.orderID,
                              )
                            }
                          >
                            {action.cta}
                          </Badge>
                        ))}
                      </div>
                      {isStreaming && index === a.length - 1 && (
                        <div className="flex items-center gap-0 py-2 text-sm text-gray-500">
                          <img
                            src={logo}
                            alt="Logo"
                            className="h-8 w-8 animate-bounce object-contain"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </ResizablePanel>
          {isArtifactPanelOpen && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={55}>
                <div className="flex h-full flex-col gap-4">
                  <div className="h-full flex-1">
                    {orderId && <OrderFormPanel orderId={orderId} />}
                    {emailId && <EmailPanel emailId={emailId} />}
                  </div>
                </div>
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      )}
      <div className="flex w-full flex-col items-center gap-4">
        {chatMessages.length === 0 && (
          <div className="flex w-full flex-col items-center gap-4">
            <img src={logo} alt="Logo" className="h-20 w-20" />
            <h2 className="text-2xl font-bold">
              Hi {user?.firstName}, How can I help you today?
            </h2>
            <div className="flex w-full justify-between gap-3">
              <Card
                className="w-full cursor-pointer"
                onClick={() =>
                  setPrompt('Get me the details of all my accounts')
                }
              >
                <CardHeader>
                  <CardTitle>
                    <h3 className="text-lg font-bold">View all my accounts</h3>
                  </CardTitle>
                  <CardDescription>
                    Get me the details of all my accounts
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card
                className="w-full cursor-pointer"
                onClick={() =>
                  setPrompt(
                    'Create a new order for -customer- and add the following products...',
                  )
                }
              >
                <CardHeader>
                  <CardTitle>
                    <h3 className="text-lg font-bold">Create a new order</h3>
                  </CardTitle>
                  <CardDescription>
                    Create a new order for -customer- and add the following
                    products...
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card
                className="w-full cursor-pointer"
                onClick={() =>
                  setPrompt(
                    'Write an email to -customer- about a new promotion that is available.',
                  )
                }
              >
                <CardHeader>
                  <CardTitle>
                    <h3 className="text-lg font-bold">Write an email</h3>
                  </CardTitle>
                  <CardDescription>
                    Write an email to -customer- about a new promotion that is
                    available.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        )}
        <div className="w-full rounded-lg py-4">
          <Card className="p-0">
            <CardContent className="h-20 p-0">
              <Textarea
                value={prompt}
                rows={3}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleStreamChat()}
                placeholder="Ask me anything..."
                className="h-full w-full flex-1 resize-none rounded-lg border-0 px-4 py-4 shadow-none"
                disabled={isStreaming}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
