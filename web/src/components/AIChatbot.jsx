import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { 
  Bot, 
  Send, 
  Trash2, 
  X, 
  Play, 
  Copy, 
  Check, 
  Settings, 
  Sparkles, 
  User, 
  Terminal, 
  HardDrive, 
  Cpu, 
  RefreshCw, 
  ChevronDown, 
  CheckCircle2, 
  Shield, 
  Database,
  Info
} from 'lucide-react';
import { 
  detectOllama, 
  sendMentorMessage, 
  buildSystemPrompt 
} from '../services/aiMentorService.js';

const QUICK_CHIPS = [
  { label: '📐 3NF ERD Rules', query: 'Explain the 6 Peter Chen ERD mapping rules into 3NF relational tables for Course 2305.' },
  { label: '🔄 Circular FKs', query: 'How do we solve circular foreign keys between Employee and Department in T-SQL?' },
  { label: '⚡ Index Tipping Point', query: 'What is the query optimizer tipping point between Index Seek and Clustered Scan?' },
  { label: '🛡️ ACID & XACT_ABORT', query: 'Why is SET XACT_ABORT ON essential with TRY...CATCH in transactional stored procedures?' },
  { label: '💾 8 KB Page & Files', query: 'Explain the physical 8 KB page, extent math, and multi-filegroup isolation in ITItest.' },
  { label: '🐞 Debug Msg 8115', query: 'How do I debug SQL Server Msg 8115: Arithmetic overflow error converting expression to data type int?' },
  { label: '⭐ Kimball SCD Type 2', query: 'Explain Slowly Changing Dimension (SCD) Type 2 in Kimball Star Schemas with an example.' },
  { label: '🚀 Practice Query', query: 'Give me a challenging practice SQL query testing employee salaries in ITItest.' }
];

export default function AIChatbot({ isOpen, onClose, onRunInPlayground, pageContext = {} }) {
  // Provider: 'ollama' | 'gemini' | 'claude' | 'offline'
  const [provider, setProvider] = useState(() => localStorage.getItem('ai_mentor_provider') || 'ollama');
  const [selectedModel, setSelectedModel] = useState(() => localStorage.getItem('ai_mentor_model') || 'qwen2.5:3b');
  const [geminiKey, setGeminiKey] = useState(() => localStorage.getItem('ai_mentor_gemini_key') || '');
  const [claudeKey, setClaudeKey] = useState(() => localStorage.getItem('ai_mentor_claude_key') || '');
  
  // Ollama status
  const [ollamaStatus, setOllamaStatus] = useState({ available: false, models: [], endpoint: null });
  const [isDetectingOllama, setIsDetectingOllama] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showEnvContext, setShowEnvContext] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  // Messages
  const [messages, setMessages] = useState([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: `👋 **Welcome to your Microsoft SQL Server & DBRE AI Study Mentor!**

I am directly grounded in your workstation setup and **MaharaTech Course 2305** (*Implementing & Developing SQL Server Objects* by Eng. Rami Mohamed Abonagi).

Ask me anything about:
- **Storage Internals**: 8 KB pages, multi-filegroups in \`ITItest\`, and MDF/NDF/LDF layout.
- **Relational Integrity**: Peter Chen ERD rules, circular foreign keys, and CHECK constraints.
- **Indexing Mechanics**: Clustered B-Trees, covering indexes, and the query optimizer tipping point.
- **ACID Transactions**: RCSI snapshot isolation, \`SET XACT_ABORT ON\`, and savepoints.
- **Analytical Warehousing**: Kimball conformed star schemas, SCD Type 2, and paginated SSRS reports.`
    }
  ]);

  const [inputVal, setInputVal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamedResponse, setStreamedResponse] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-detect local Ollama on mount
  const checkOllama = async () => {
    setIsDetectingOllama(true);
    try {
      const res = await detectOllama();
      setOllamaStatus(res);
      if (res.available && res.models.length > 0) {
        if (!res.models.includes(selectedModel)) {
          setSelectedModel(res.models[0]);
          localStorage.setItem('ai_mentor_model', res.models[0]);
        }
      } else if (provider === 'ollama') {
        // If Ollama is not running, gracefully fallback to offline expert engine
        setProvider('offline');
      }
    } catch (e) {
      setOllamaStatus({ available: false, models: [], endpoint: null });
    } finally {
      setIsDetectingOllama(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      checkOllama();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, streamedResponse]);

  const handleProviderChange = (newProvider) => {
    setProvider(newProvider);
    localStorage.setItem('ai_mentor_provider', newProvider);
  };

  const handleModelChange = (newModel) => {
    setSelectedModel(newModel);
    localStorage.setItem('ai_mentor_model', newModel);
  };

  const handleSaveSettings = () => {
    localStorage.setItem('ai_mentor_gemini_key', geminiKey);
    localStorage.setItem('ai_mentor_claude_key', claudeKey);
    setShowSettings(false);
  };

  const handleCopyCode = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSend = async (textToSend) => {
    const text = (textToSend || inputVal).trim();
    if (!text || isLoading) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputVal('');
    setIsLoading(true);
    setStreamedResponse('');

    try {
      const activeApiKey = provider === 'gemini' ? geminiKey : provider === 'claude' ? claudeKey : null;

      const result = await sendMentorMessage({
        provider,
        model: selectedModel,
        messages: newMessages,
        pageContext,
        apiKey: activeApiKey,
        onStream: (chunk) => {
          setStreamedResponse(chunk);
        }
      });

      let botReplyText = '';
      let botQuery = null;

      if (typeof result === 'string') {
        botReplyText = result;
      } else if (result && typeof result === 'object') {
        botReplyText = result.text || result.html || '';
        botQuery = result.query || null;
      }

      // Extract SQL blocks if not explicitly provided
      if (!botQuery) {
        const sqlMatch = botReplyText.match(/```(?:sql|tsql)?\s*([\s\S]*?)```/i);
        if (sqlMatch && sqlMatch[1]) {
          botQuery = sqlMatch[1].trim();
        }
      }

      setMessages(prev => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: botReplyText,
          query: botQuery
        }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          sender: 'bot',
          isError: true,
          text: `⚠️ **Connection Error (${provider.toUpperCase()})**: ${err.message || 'Failed to generate response.'}\n\n*Tip: You can switch to the built-in **Offline DBRE Engine** in the provider selector above to get immediate responses without an API key.*`
        }
      ]);
    } finally {
      setIsLoading(false);
      setStreamedResponse('');
    }
  };

  const handleClear = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'bot',
        text: '🧹 Chat history reset. How can I assist your SQL Server 2022 & DBRE studies?'
      }
    ]);
  };

  // Render markdown text to formatted HTML elements
  const renderMessageContent = (msg) => {
    const text = msg.text || '';
    
    // Split by code blocks
    const parts = text.split(/(```[\s\S]*?```)/g);

    return (
      <div className="msg-rich-content">
        {parts.map((part, pIdx) => {
          if (part.startsWith('```')) {
            const lines = part.slice(3, -3).trim().split('\n');
            const lang = lines[0].trim().toLowerCase();
            const code = (lang === 'sql' || lang === 'tsql') 
              ? lines.slice(1).join('\n') 
              : lines.join('\n');

            const blockId = `${msg.id}-code-${pIdx}`;

            return (
              <div key={pIdx} className="chat-code-card">
                <div className="code-card-header">
                  <span className="code-lang-tag">
                    <Terminal size={12} />
                    {lang || 'sql'}
                  </span>
                  <div className="code-actions">
                    <button 
                      className="code-action-btn"
                      onClick={() => handleCopyCode(code, blockId)}
                      title="Copy SQL code"
                    >
                      {copiedId === blockId ? (
                        <>
                          <Check size={12} className="text-emerald" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy size={12} />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                    {onRunInPlayground && (
                      <button 
                        className="code-action-btn run-btn"
                        onClick={() => {
                          onRunInPlayground(code);
                          onClose();
                        }}
                        title="Run in interactive Query Studio"
                      >
                        <Play size={12} className="fill-current" />
                        <span>Run in Studio</span>
                      </button>
                    )}
                  </div>
                </div>
                <pre className="chat-code-pre">
                  <code>{code}</code>
                </pre>
              </div>
            );
          }

          // Format basic markdown headers and bold
          const formattedLines = part.split('\n').map((line, lIdx) => {
            let processed = line;
            // Headers
            if (processed.startsWith('### ')) {
              return <h4 key={lIdx} className="chat-h4">{processed.replace('### ', '')}</h4>;
            }
            if (processed.startsWith('## ')) {
              return <h3 key={lIdx} className="chat-h3">{processed.replace('## ', '')}</h3>;
            }
            if (processed.startsWith('- ') || processed.startsWith('* ')) {
              return (
                <div key={lIdx} className="chat-bullet">
                  <span className="bullet-dot">•</span>
                  <span dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(processed.slice(2)) }} />
                </div>
              );
            }
            if (!processed.trim()) {
              return <div key={lIdx} className="chat-spacer" />;
            }
            return (
              <p key={lIdx} className="chat-p" dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(processed) }} />
            );
          });

          return <div key={pIdx}>{formattedLines}</div>;
        })}

        {/* Action button if explicit query was returned */}
        {msg.query && !text.includes('```') && (
          <div className="msg-query-action mt-2">
            <button
              className="run-in-studio-btn"
              onClick={() => {
                if (onRunInPlayground) {
                  onRunInPlayground(msg.query);
                  onClose();
                }
              }}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Run in Query Studio</span>
            </button>
          </div>
        )}
      </div>
    );
  };

  if (!isOpen) return null;

  // Render via createPortal directly into document.body to prevent clipping
  return ReactDOM.createPortal(
    <div className="chatbot-drawer-overlay" onClick={onClose}>
      <div 
        className="chatbot-drawer" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="AI Study Mentor"
      >
        {/* Drawer Header */}
        <div className="chatbot-header">
          <div className="flex items-center gap-2.5">
            <div className="bot-avatar">
              <Bot className="w-5 h-5 text-ms-red" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="drawer-heading-title">DBRE Study Mentor</h3>
                <span className="online-indicator" title="Connected and ready" />
              </div>
              <p className="text-xs text-gray-400">MaharaTech Course 2305 & MSSQL 2022 Expert</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button 
              onClick={() => setShowEnvContext(prev => !prev)} 
              className={`drawer-icon-btn ${showEnvContext ? 'active' : ''}`}
              title="Inspect PC & Database Context"
            >
              <Database className="w-4 h-4 text-cyan-400" />
            </button>

            <button 
              onClick={() => setShowSettings(prev => !prev)} 
              className={`drawer-icon-btn ${showSettings ? 'active' : ''}`}
              title="Provider & Model Settings"
            >
              <Settings className="w-4 h-4 text-gray-300" />
            </button>

            <button onClick={handleClear} className="drawer-icon-btn" title="Clear Chat History">
              <Trash2 className="w-4 h-4 text-gray-400 hover:text-rose-400" />
            </button>

            <button onClick={onClose} className="drawer-icon-btn close-btn" title="Close Drawer (Esc)">
              <X className="w-4 h-4 text-gray-300 hover:text-white" />
            </button>
          </div>
        </div>

        {/* Model Selector Bar */}
        <div className="chatbot-provider-bar">
          <div className="provider-select-group">
            <span className="provider-label">Engine:</span>
            <select 
              value={provider} 
              onChange={(e) => handleProviderChange(e.target.value)}
              className="provider-dropdown"
            >
              <option value="ollama">
                {ollamaStatus.available ? '🟢 Ollama (Local PC)' : '⚪ Ollama (Local PC)'}
              </option>
              <option value="gemini">✨ Google Antigravity / Gemini</option>
              <option value="claude">🟣 Anthropic Claude</option>
              <option value="offline">⚡ Offline DBRE Engine (Instant)</option>
            </select>
          </div>

          {provider === 'ollama' && (
            <div className="model-select-group">
              <span className="provider-label">Model:</span>
              <select
                value={selectedModel}
                onChange={(e) => handleModelChange(e.target.value)}
                className="provider-dropdown model-dropdown"
                disabled={!ollamaStatus.available || ollamaStatus.models.length === 0}
              >
                {ollamaStatus.models.length > 0 ? (
                  ollamaStatus.models.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))
                ) : (
                  <option value="qwen2.5:3b">qwen2.5:3b (default)</option>
                )}
              </select>
              <button 
                onClick={checkOllama} 
                className="refresh-model-btn" 
                title="Refresh local Ollama models"
                disabled={isDetectingOllama}
              >
                <RefreshCw size={12} className={isDetectingOllama ? 'animate-spin' : ''} />
              </button>
            </div>
          )}
        </div>

        {/* Environment Telemetry Drawer / Popout */}
        {showEnvContext && (
          <div className="env-telemetry-banner">
            <div className="env-telemetry-header">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400">
                <HardDrive size={13} />
                PC & Database Context Shared with Mentor
              </span>
              <button onClick={() => setShowEnvContext(false)} className="text-gray-400 hover:text-white">
                <X size={13} />
              </button>
            </div>
            <div className="env-grid">
              <div className="env-item">
                <span className="env-k">Host OS:</span>
                <span className="env-v">Windows 11 (64-bit)</span>
              </div>
              <div className="env-item">
                <span className="env-k">SQL Server:</span>
                <span className="env-v">2022 Dev Edition ('.')</span>
              </div>
              <div className="env-item">
                <span className="env-k">Active DB:</span>
                <span className="env-v text-emerald-400 font-bold">ITItest</span>
              </div>
              <div className="env-item">
                <span className="env-k">Storage Path:</span>
                <span className="env-v font-mono text-xs">...\CH01\Mydb\</span>
              </div>
              <div className="env-item">
                <span className="env-k">Verified Tables:</span>
                <span className="env-v font-mono text-xs">dbo.depts, dbo.emp</span>
              </div>
              <div className="env-item">
                <span className="env-k">Active Tab:</span>
                <span className="env-v badge badge-sm badge-cyan">{pageContext.activeTab || 'roadmap'}</span>
              </div>
            </div>
          </div>
        )}

        {/* Settings Panel Modal */}
        {showSettings && (
          <div className="chat-settings-panel">
            <div className="settings-panel-header">
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Settings size={14} className="text-cyan-400" />
                AI Provider Configuration
              </h4>
              <button onClick={() => setShowSettings(false)} className="text-gray-400 hover:text-white">
                <X size={14} />
              </button>
            </div>

            <div className="settings-fields">
              <div className="field-group">
                <label>Google Gemini / Antigravity API Key</label>
                <input 
                  type="password"
                  placeholder="AIzaSy..."
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                />
                <span className="field-hint">Used when engine is set to Google Antigravity / Gemini.</span>
              </div>

              <div className="field-group">
                <label>Anthropic Claude API Key</label>
                <input 
                  type="password"
                  placeholder="sk-ant-..."
                  value={claudeKey}
                  onChange={(e) => setClaudeKey(e.target.value)}
                />
                <span className="field-hint">Used when engine is set to Anthropic Claude.</span>
              </div>

              <div className="field-group">
                <label>Local Ollama Status</label>
                <div className="ollama-status-box">
                  {ollamaStatus.available ? (
                    <span className="text-emerald-400 flex items-center gap-1.5 text-xs font-semibold">
                      <CheckCircle2 size={13} />
                      Ollama Online (Found {ollamaStatus.models.length} local models)
                    </span>
                  ) : (
                    <span className="text-amber-400 flex items-center gap-1.5 text-xs">
                      <Info size={13} />
                      Ollama offline at http://localhost:11434
                    </span>
                  )}
                </div>
              </div>

              <button className="btn btn-primary btn-sm w-full mt-2" onClick={handleSaveSettings}>
                Save & Apply Settings
              </button>
            </div>
          </div>
        )}

        {/* Quick Topic Chips */}
        <div className="chatbot-chips-bar">
          {QUICK_CHIPS.map((chip, idx) => (
            <button
              key={idx}
              className="chat-chip-btn"
              onClick={() => handleSend(chip.query)}
              disabled={isLoading}
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Messages List */}
        <div className="chatbot-messages">
          {messages.map((m) => (
            <div 
              key={m.id} 
              className={`chat-message ${m.sender === 'user' ? 'msg-user' : 'msg-bot'} ${m.isError ? 'msg-error' : ''}`}
            >
              <div className="msg-avatar-col">
                {m.sender === 'user' ? (
                  <div className="user-icon-box"><User className="w-4 h-4" /></div>
                ) : (
                  <div className="bot-icon-box"><Bot className="w-4 h-4 text-ms-red" /></div>
                )}
              </div>
              <div className="msg-content-col">
                <div className="msg-bubble">
                  {renderMessageContent(m)}
                </div>
              </div>
            </div>
          ))}

          {/* Streaming response or typing indicator */}
          {isLoading && (
            <div className="chat-message msg-bot">
              <div className="msg-avatar-col">
                <div className="bot-icon-box"><Bot className="w-4 h-4 text-ms-red animate-pulse" /></div>
              </div>
              <div className="msg-content-col">
                <div className="msg-bubble">
                  {streamedResponse ? (
                    renderMessageContent({ id: 'stream', text: streamedResponse })
                  ) : (
                    <div className="typing-dots">
                      <span /><span /><span />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="chatbot-input-bar">
          <input
            ref={inputRef}
            type="text"
            placeholder={
              provider === 'ollama' 
                ? `Ask ${selectedModel} about SQL Server, ACID, 8 KB storage, ITItest...`
                : "Ask AI Mentor about MaharaTech Course 2305, T-SQL, DBRE..."
            }
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            disabled={isLoading}
          />
          <button
            className="send-btn"
            onClick={() => handleSend()}
            disabled={!inputVal.trim() || isLoading}
            title="Send query (Enter)"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

function formatInlineMarkdown(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>');
}
