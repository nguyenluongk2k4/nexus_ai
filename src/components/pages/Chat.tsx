import { useEffect, useMemo, useRef, useState } from 'react';
import { MessageSquare, Send, Loader2, Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatMessage {
  id: string;
  role: 'user' | 'bot' | 'system';
  text: string;
}

export function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [status, setStatus] = useState<'connecting' | 'idle' | 'thinking' | 'error'>('connecting');
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const wsUrl = useMemo(() => {
    // Simple: point to local backend
    const host = window.location.hostname || 'localhost';
    return `ws://${host}:8000/ws`;
  }, []);

  useEffect(() => {
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setStatus('idle');
      setError(null);
      // Start a session on connect
      ws.send(JSON.stringify({ type: 'new_session' }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        switch (data.type) {
          case 'session_started':
            setSessionId(data.session_id);
            setMessages((prev) => [
              ...prev,
              {
                id: crypto.randomUUID(),
                role: 'system',
                text: `Bắt đầu session: ${data.session_id}`,
              },
            ]);
            break;
          case 'status':
            if (data.status === 'thinking') setStatus('thinking');
            if (data.status === 'idle') setStatus('idle');
            break;
          case 'bot_message':
            setMessages((prev) => [
              ...prev,
              { id: crypto.randomUUID(), role: 'bot', text: data.text },
            ]);
            break;
          case 'error':
            setError(data.message || 'Lỗi không xác định');
            setStatus('error');
            break;
          default:
            // ignore unknown
            break;
        }
      } catch (e) {
        setError('Không đọc được dữ liệu từ máy chủ');
      }
    };

    ws.onerror = () => {
      setStatus('error');
      setError('Không kết nối được tới máy chủ chat');
    };

    ws.onclose = () => {
      setStatus('error');
      if (!error) setError('Kết nối đã đóng');
    };

    return () => {
      ws.close();
    };
  }, [wsUrl]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, status]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      setError('Kết nối chưa sẵn sàng');
      return;
    }

    // Append user message locally
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: 'user', text },
    ]);
    setInput('');

    // Send to server
    wsRef.current.send(
      JSON.stringify({
        type: 'user_message',
        text,
        session_id: sessionId,
      })
    );
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex-1 bg-gradient-to-br from-white via-violet-50/20 to-teal-50/20 p-8 overflow-hidden">
      <div className="max-w-6xl mx-auto h-full flex flex-col">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500 to-teal-500 text-white shadow-lg">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">AI Career Advisor</h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className={`inline-block w-2 h-2 rounded-full ${status === 'idle' ? 'bg-green-500' : status === 'thinking' ? 'bg-yellow-500 animate-pulse' : 'bg-red-500'}`}></span>
                <span>
                  {status === 'connecting' && 'Đang kết nối...'}
                  {status === 'idle' && 'Sẵn sàng trả lời'}
                  {status === 'thinking' && 'Đang phân tích câu hỏi...'}
                  {status === 'error' && 'Lỗi kết nối'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Container */}
        <div className="flex-1 bg-white rounded-2xl border border-border shadow-xl overflow-hidden flex flex-col">
          {/* Messages */}
          <div ref={listRef} className="flex-1 overflow-auto p-6 space-y-4">
            {messages.length === 0 && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center max-w-md">
                  <div className="w-20 h-20 bg-gradient-to-br from-violet-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-10 h-10 text-violet-600" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Chào mừng đến với AI Career Advisor!</h3>
                  <p className="text-muted-foreground mb-4">
                    Hỏi tôi bất cứ điều gì về lộ trình IT, kỹ năng cần học, công nghệ mới...
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {['Lộ trình AI Engineer?', 'Skills cho Cloud Computing?', 'Học gì để làm Data Scientist?'].map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => setInput(suggestion)}
                        className="px-4 py-2 bg-violet-50 hover:bg-violet-100 text-violet-700 rounded-lg text-sm transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                {m.role === 'user' && (
                  <div className="flex items-start gap-3 max-w-[75%]">
                    <div className="flex-1 rounded-2xl rounded-tr-sm px-4 py-3 bg-gradient-to-r from-violet-600 to-teal-600 text-white shadow-md">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.text}</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-violet-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                      U
                    </div>
                  </div>
                )}
                {m.role === 'system' && (
                  <div className="w-full flex justify-center">
                    <div className="px-4 py-2 rounded-full text-xs bg-amber-50 text-amber-700 border border-amber-200">
                      {m.text}
                    </div>
                  </div>
                )}
                {m.role === 'bot' && (
                  <div className="flex items-start gap-3 max-w-[85%]">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-violet-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                      AI
                    </div>
                    <div className="flex-1 relative group rounded-2xl rounded-tl-sm px-4 py-3 bg-gray-50 border border-gray-200 shadow-sm">
                      {/* Copy button */}
                      <button
                        className="absolute -top-2 -right-2 p-2 bg-white rounded-lg shadow-md border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50"
                        onClick={async () => {
                          await navigator.clipboard.writeText(m.text);
                          setCopiedId(m.id);
                          setTimeout(() => setCopiedId(null), 1500);
                        }}
                        title="Copy"
                      >
                        {copiedId === m.id ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-600" />
                        )}
                      </button>

                      {/* Markdown content */}
                      <div className="prose prose-sm max-w-none select-text">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            a: ({ node, ...props }) => (
                              <a {...props} className="text-violet-600 hover:text-violet-700 underline font-medium" target="_blank" rel="noreferrer" />
                            ),
                            p: ({ node, ...props }) => <p {...props} className="mb-3 last:mb-0 leading-relaxed text-gray-700" />,
                            ul: ({ node, ...props }) => <ul {...props} className="my-3 space-y-1 list-disc pl-5 text-gray-700" />,
                            ol: ({ node, ...props }) => <ol {...props} className="my-3 space-y-1 list-decimal pl-5 text-gray-700" />,
                            li: ({ node, ...props }) => <li {...props} className="leading-relaxed" />,
                            h1: ({ node, ...props }) => <h1 {...props} className="text-xl font-bold text-gray-900 mt-4 mb-2 first:mt-0" />,
                            h2: ({ node, ...props }) => <h2 {...props} className="text-lg font-bold text-gray-900 mt-4 mb-2 first:mt-0" />,
                            h3: ({ node, ...props }) => <h3 {...props} className="text-base font-semibold text-gray-900 mt-3 mb-2 first:mt-0" />,
                            strong: ({ node, ...props }) => <strong {...props} className="font-semibold text-gray-900" />,
                            blockquote: ({ node, ...props }) => <blockquote {...props} className="border-l-4 border-violet-400 pl-4 py-2 my-3 bg-violet-50 rounded-r" />,
                            code({ inline, className, children, ...props }) {
                              const content = String(children);
                              if (inline) {
                                return (
                                  <code {...props} className="bg-violet-100 text-violet-800 rounded px-1.5 py-0.5 font-mono text-xs">
                                    {content}
                                  </code>
                                );
                              }
                              return (
                                <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto text-xs my-3 shadow-inner">
                                  <code className={className}>{content}</code>
                                </pre>
                              );
                            },
                            table: ({ node, ...props }) => (
                              <div className="overflow-x-auto my-3">
                                <table {...props} className="min-w-full divide-y divide-gray-200 border" />
                              </div>
                            ),
                            th: ({ node, ...props }) => <th {...props} className="px-3 py-2 bg-gray-50 text-left text-xs font-semibold text-gray-700" />,
                            td: ({ node, ...props }) => <td {...props} className="px-3 py-2 text-sm text-gray-700 border-t" />,
                          }}
                        >
                          {m.text}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {status === 'thinking' && (
              <div className="flex items-start gap-3 animate-in fade-in duration-300">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-violet-600 flex items-center justify-center text-white font-semibold text-sm">
                  AI
                </div>
                <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-2xl rounded-tl-sm border border-gray-200">
                  <Loader2 className="w-4 h-4 animate-spin text-violet-600" />
                  <span className="text-sm text-gray-600">Đang phân tích và tìm kiếm thông tin...</span>
                </div>
              </div>
            )}
            
            {error && (
              <div className="flex justify-center">
                <div className="px-4 py-2 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                  ⚠️ {error}
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-gray-50 border-t border-border">
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <input
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100 transition-all bg-white text-sm"
                  placeholder="Nhập câu hỏi của bạn..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  disabled={status === 'connecting'}
                />
              </div>
              <button
                className="px-5 py-3 bg-gradient-to-r from-violet-600 to-teal-600 hover:from-violet-700 hover:to-teal-700 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                onClick={sendMessage}
                disabled={status === 'connecting' || !input.trim()}
              >
                <Send className="w-4 h-4" />
                <span>Gửi</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
