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
  AlertCircle,
  Shield, 
  Database,
  Info,
  ExternalLink,
  Zap
} from 'lucide-react';
import { 
  detectOllama, 
  sendMentorMessage, 
  buildSystemPrompt,
  isHttpsContext,
  generateOfflineKnowledgeAnswer
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
  const isHttps = isHttpsContext();

  // Provider: 'offline' | 'ollama' | 'gemini' | 'claude'
  const [provider, setProvider] = useState(() => {
    const saved = localStorage.getItem('ai_mentor_provider');
    if (saved) return saved;
    // On HTTPS, default to offline DBRE engine so the user never gets mixed-content connection errors
    return isHttps ? 'offline' : 'ollama';
  });

  const [selectedModel, setSelectedModel] = useState(() => localStorage.getItem('ai_mentor_model') || 'qwen2.5:3b');
  const [geminiKey, setGeminiKey] = useState(() => localStorage.getItem('ai_mentor_gemini_key') || '');
  const [geminiModel, setGeminiModel] = useState(() => localStorage.getItem('ai_mentor_gemini_model') || 'gemini-1.5-flash');
  const [claudeKey, setClaudeKey] = useState(() => localStorage.getItem('ai_mentor_claude_key') || '');
  
  // Ollama status
  const [ollamaStatus, setOllamaStatus] = useState({ available: false, models: [], endpoint: null, isHttpsBlocked: false });
  const [isDetectingOllama, setIsDetectingOllama] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showEnvContext, setShowEnvContext] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [keyTestStatus, setKeyTestStatus] = useState(null); // 'testing' | 'success' | 'error'

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
      }
    } catch (e) {
      setOllamaStatus({ available: false, models: [], endpoint: null, isHttpsBlocked: isHttps });
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

  const handleGeminiModelChange = (newModel) => {
    setGeminiModel(newModel);
    localStorage.setItem('ai_mentor_gemini_model', newModel);
  };

  const handleSaveSettings = () => {
    localStorage.setItem('ai_mentor_gemini_key', geminiKey);
    localStorage.setItem('ai_mentor_gemini_model', geminiModel);
    localStorage.setItem('ai_mentor_claude_key', claudeKey);
    setShowSettings(false);
  };

  const handleTestGeminiKey = async () => {
    if (!geminiKey.trim()) {
      setKeyTestStatus({ type: 'error', text: 'Please enter a Gemini API Key first.' });
      return;
    }
    setKeyTestStatus({ type: 'testing', text: 'Testing key connection...' });
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiKey.trim()}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: 'Respond with: PING_OK' }] }] })
      });
      if (res.ok) {
        setKeyTestStatus({ type: 'success', text: '✅ API Key is valid and connected!' });
      } else {
        const err = await res.text();
        setKeyTestStatus({ type: 'error', text: `Key test failed (${res.status}): ${err.slice(0, 80)}` });
      }
    } catch (e) {
      setKeyTestStatus({ type: 'error', text: `Connection error: ${e.message}` });
    }
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
      const activeModelName = provider === 'gemini' ? geminiModel : selectedModel;

      const result = await sendMentorMessage({
        provider,
        model: activeModelName,
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
      // Infallible fallback: If any network failure occurs, fall back to offline DBRE knowledge engine!
      const fallback = generateOfflineKnowledgeAnswer(text, pageContext);
      setMessages(prev => [
        ...prev,
        {
          id: `bot-fallback-${Date.now()}`,
          sender: 'bot',
          isError: false,
          text: `> 💡 **Notice**: Switched to built-in **Offline DBRE Knowledge Engine** (${err.message || 'Connection interrupted'}).
> 
> *Here is production architectural guidance for your query:*

---

${fallback.text}`,
          query: fallback.query
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
            if (processed.startsWith('### ')) {
              return <h4 key={lIdx} className="chat-h4">{processed.replace('### ', '')}</h4>;
            }
            if (processed.startsWith('## ')) {
              return <h3 key={lIdx} className="chat-h3">{processed.replace('## ', '')}</h3>;
            }
            if (processed.startsWith('> ')) {
              return (
                <div key={lIdx} className="chat-blockquote">
                  <span dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(processed.slice(2)) }} />
                </div>
              );
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
                <span className="online-indicator" title="Engine online & ready" />
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
              <option value="offline">⚡ Offline DBRE Engine (Zero-Config, Instant)</option>
              <option value="ollama">
                {ollamaStatus.available ? '🟢 Ollama (Local PC)' : '🖥️ Ollama (Local PC)'}
              </option>
              <option value="gemini">✨ Google Antigravity / Gemini</option>
              <option value="claude">🟣 Anthropic Claude</option>
            </select>
          </div>

          {provider === 'ollama' && (
            <div className="model-select-group">
              <span className="provider-label">Model:</span>
              <select
                value={selectedModel}
                onChange={(e) => handleModelChange(e.target.value)}
                className="provider-dropdown model-dropdown"
                disabled={ollamaStatus.models.length === 0}
              >
                {ollamaStatus.models.length > 0 ? (
                  ollamaStatus.models.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))
                ) : (
                  <>
                    <option value="qwen2.5:3b">qwen2.5:3b (PC)</option>
                    <option value="llama3.2:3b">llama3.2:3b (PC)</option>
                  </>
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

          {provider === 'gemini' && (
            <div className="model-select-group">
              <span className="provider-label">Model:</span>
              <select
                value={geminiModel}
                onChange={(e) => handleGeminiModelChange(e.target.value)}
                className="provider-dropdown model-dropdown"
              >
                <option value="gemini-1.5-flash">gemini-1.5-flash</option>
                <option value="gemini-1.5-pro">gemini-1.5-pro</option>
                <option value="gemini-2.0-flash">gemini-2.0-flash</option>
              </select>
            </div>
          )}
        </div>

        {/* HTTPS Notice Banner (if provider is Ollama on HTTPS) */}
        {isHttps && provider === 'ollama' && (
          <div className="https-warning-banner" style={{
            background: 'rgba(245, 158, 11, 0.12)',
            borderBottom: '1px solid rgba(245, 158, 11, 0.3)',
            padding: '8px 16px',
            fontSize: '0.75rem',
            color: '#fbbf24',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={14} className="flex-shrink-0 text-amber-400" />
            <span>
              <strong>HTTPS Notice:</strong> Browsers restrict direct HTTP localhost calls from GitHub Pages. If Ollama isn't reached, answers are served automatically by the <strong>Offline DBRE Engine</strong>!
            </span>
          </div>
        )}

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
                AI Provider & Model Settings
              </h4>
              <button onClick={() => setShowSettings(false)} className="text-gray-400 hover:text-white">
                <X size={14} />
              </button>
            </div>

            <div className="settings-fields">
              <div className="field-group">
                <div className="flex justify-between items-center mb-1">
                  <label>Google Gemini / Antigravity API Key</label>
                  <a 
                    href="https://aistudio.google.com/app/apikey" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-cyan-400 hover:underline flex items-center gap-0.5"
                  >
                    Get Free Key <ExternalLink size={10} />
                  </a>
                </div>
                <div className="flex gap-2">
                  <input 
                    type="password"
                    placeholder="AIzaSy..."
                    value={geminiKey}
                    onChange={(e) => setGeminiKey(e.target.value)}
                    className="flex-1"
                  />
                  <button 
                    className="btn btn-secondary btn-xs whitespace-nowrap"
                    onClick={handleTestGeminiKey}
                    type="button"
                  >
                    Test Key
                  </button>
                </div>
                {keyTestStatus && (
                  <div className={`mt-1 text-xs ${keyTestStatus.type === 'success' ? 'text-emerald-400' : keyTestStatus.type === 'error' ? 'text-rose-400' : 'text-cyan-400'}`}>
                    {keyTestStatus.text}
                  </div>
                )}
                <span className="field-hint">Used when engine is set to Google Antigravity / Gemini. Works everywhere including GitHub Pages!</span>
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
                <label>Local Ollama on PC (localhost:11434)</label>
                <div className="ollama-status-box">
                  {ollamaStatus.available ? (
                    <span className="text-emerald-400 flex items-center gap-1.5 text-xs font-semibold">
                      <CheckCircle2 size={13} />
                      Ollama Online (Found {ollamaStatus.models.length} local models: {ollamaStatus.models.slice(0, 2).join(', ')})
                    </span>
                  ) : (
                    <span className="text-amber-400 flex items-center gap-1.5 text-xs">
                      <Info size={13} />
                      {isHttps ? 'HTTPS restriction on GitHub Pages. Run locally at http://localhost:5173/ for live Ollama streaming.' : 'Ollama endpoint not reachable on http://localhost:11434.'}
                    </span>
                  )}
                </div>
                <span className="field-hint">Installed models on your PC: qwen2.5:3b, llama3.2:3b.</span>
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
                : provider === 'gemini'
                ? `Ask Gemini about T-SQL, B-Trees, MaharaTech Course 2305...`
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
