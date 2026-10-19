import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  Bot,
  Send,
  Mic,
  MicOff,
  Sparkles,
  User,
  Copy,
  Check,
  RotateCcw,
  Play,
  Lightbulb,
  Code,
  Award,
  Zap,
  HelpCircle,
  Clock,
  ArrowRight,
  ChevronRight,
  RefreshCw,
  Trash2,
  Volume2
} from 'lucide-react';

const SUGGESTED_PROMPTS = [
  'Give me a mock interview.',
  'Ask me JavaScript questions.',
  'Help me improve my introduction.',
  'Explain my interview mistakes.',
  'Give me DSA interview questions.'
];

export const AICoachPage = ({ setActivePage, onStartNew }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState(() => {
    return [
      {
        id: 'welcome-1',
        sender: 'ai',
        text: `### Hello ${user?.name ? user.name.split(' ')[0] : 'Engineer'}! 👋 I'm your AI Interview Coach.

I'm here to mentor you outside of live mock interviews. You can ask me to:
- **Test your knowledge** on specific technologies (*JavaScript, React, Python, SQL, System Design*).
- **Critique your answers** and sharpen your 90-second introduction.
- **Explain interview pitfalls** and optimize your STAR storytelling.
- **Provide algorithmic puzzles** or launch targeted mock rounds.

How can I help you level up your interview readiness today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedPrompts: SUGGESTED_PROMPTS
      }
    ];
  });

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  // Voice Input (Web Speech Recognition)
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(true);
  const recognitionRef = useRef(null);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto-scroll to bottom
  const scrollToBottom = (behavior = 'smooth') => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, isLoading]);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript) {
          setInputMessage((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition notice:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } catch (err) {
      console.warn('Speech recognition setup error:', err);
      setVoiceSupported(false);
    }
  }, []);

  // Toggle Voice Input
  const toggleListening = () => {
    if (!voiceSupported || !recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please type your query.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.warn('Speech restart warning:', err);
      }
    }
  };

  // Typing effect animation streamer for AI reply
  const streamAIResponse = (fullText, messageId, meta = {}) => {
    setIsTyping(true);
    let index = 0;
    const speed = 12; // ms per chunk
    const chunkSize = 4; // characters per frame

    // Temporary placeholder message
    setMessages((prev) => [
      ...prev,
      {
        id: messageId,
        sender: 'ai',
        text: '',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        ...meta
      }
    ]);

    const interval = setInterval(() => {
      index += chunkSize;
      if (index >= fullText.length) {
        clearInterval(interval);
        setMessages((prev) =>
          prev.map((m) => (m.id === messageId ? { ...m, text: fullText } : m))
        );
        setIsTyping(false);
      } else {
        const slice = fullText.slice(0, index);
        setMessages((prev) =>
          prev.map((m) => (m.id === messageId ? { ...m, text: slice } : m))
        );
      }
    }, speed);
  };

  // Send Message Handler
  const handleSendMessage = async (textToSend) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || isLoading || isTyping) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    const userMessageId = `user-${Date.now()}`;
    const userMsg = {
      id: userMessageId,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Build history for backend LLM structure
      const historyPayload = messages.slice(-6).map((m) => ({
        sender: m.sender,
        text: m.text
      }));

      const res = await api.coach.sendMessage(query, historyPayload);

      if (res && res.success && res.reply) {
        const aiMessageId = `ai-${Date.now()}`;
        setIsLoading(false);
        streamAIResponse(res.reply, aiMessageId, {
          suggestedPrompts: res.suggestedPrompts || SUGGESTED_PROMPTS,
          action: res.action || null
        });
      } else {
        throw new Error(res?.message || 'Empty response from coach');
      }
    } catch (err) {
      console.warn('Backend call notice, using local intelligent coach fallback:', err);
      setIsLoading(false);
      // Fallback local response
      const fallbackReply = generateLocalCoachResponse(query, user);
      const aiMessageId = `ai-${Date.now()}`;
      streamAIResponse(fallbackReply.reply, aiMessageId, {
        suggestedPrompts: fallbackReply.suggestedPrompts || SUGGESTED_PROMPTS,
        action: fallbackReply.action || null
      });
    }
  };

  // Local fallback response generator for offline resilience
  const generateLocalCoachResponse = (query, currentUser) => {
    const q = query.toLowerCase();

    if (q.includes('mock interview') || q.includes('give me a mock')) {
      return {
        reply: `### Ready for a Live Mock Session? 🎯

I can calibrate a full mock interview tailored specifically for your target profile as a **${
          currentUser?.role || 'Software Engineer'
        }** (${currentUser?.experienceLevel || 'Mid-Level'}).

**Recommended Focus for Today**:
- **Format**: Technical Architecture & Live Coding
- **Topics**: System Scalability, Async Patterns, and STAR Behavioral
- **Duration**: 20 Minutes (4 questions with instant scoring)

Would you like to launch the full simulator right now?`,
        suggestedPrompts: [
          'Start full simulator interview',
          'Ask me 1 practice question here',
          'Change difficulty to Hard'
        ],
        action: {
          type: 'start_interview',
          label: 'Launch Mock Interview Simulator',
          config: {
            role: currentUser?.role || 'Software Engineer',
            interviewType: 'technical',
            difficulty: 'medium'
          }
        }
      };
    }

    if (q.includes('javascript') || q.includes('js question')) {
      return {
        reply: `### JavaScript Deep-Dive Questions ⚡

Here are 3 high-frequency questions from senior frontend/full-stack rounds:

1. **Event Loop Microtasks**:
   - *"Explain how the Microtask Queue (Promises, queueMicrotask) interacts with the Macrotask Queue (setTimeout, I/O) and browser rendering cycles."*
2. **Closures & Garbage Collection**:
   - *"How do lexical closures work under the hood? In what scenarios do closures cause memory leaks in single-page apps?"*
3. **Prototypal Inheritance vs Classes**:
   - *"Explain the prototype chain and how ES6 classes desugar to constructor functions and Object.create()."*

Type your answer to any question above, and I will evaluate your depth and precision!`,
        suggestedPrompts: [
          'Answer Question 1 (Event Loop)',
          'Explain Closures & Memory Leaks',
          'Ask me React questions instead'
        ]
      };
    }

    if (q.includes('introduction') || q.includes('improve my intro') || q.includes('tell me about yourself')) {
      return {
        reply: `### Mastering the 90-Second Introduction 🚀

Interviewers evaluate **conciseness, technical maturity, and narrative structure**. Follow the **Present → Past → Future framework**:

1. **Present (30 Seconds)**:
   - State your current role, primary stack, and highest-priority daily impact (*"I'm a Full Stack Engineer focusing on React, TypeScript, and distributed Node.js microservices..."*).
2. **Past (45 Seconds)**:
   - Highlight **one quantifiable win** using metrics (*"...I led a monolith decomposition that reduced deployment cycle times by 35% and cut P99 API latency from 400ms to 85ms..."*).
3. **Future (15 Seconds)**:
   - Connect directly to this company (*"...I'm eager to bring that distributed systems experience to your team's real-time data engine."*).

**Try it now!** Type your draft introduction below, and I will provide sentence-by-sentence feedback.`,
        suggestedPrompts: [
          'Review my draft introduction',
          'What are red flags in an intro?',
          'How do I mention career gaps?'
        ]
      };
    }

    if (q.includes('mistake') || q.includes('explain my interview mistakes') || q.includes('feedback')) {
      return {
        reply: `### Top 4 Interview Mistakes to Eliminate 🔍

Here are the highest-impact pitfalls observed across mock evaluations:

1. **Rushing Into Code Before Clarifying Constraints**:
   - *Fix*: Ask 2–3 questions about input bounds, nulls, edge cases, and expected scale before writing a single line.
2. **Omitting Big-O Time & Space Complexity Invariants**:
   - *Fix*: Always state your Big-O plan before implementing: *"My approach will use a Hash Map for O(N) time and O(N) auxiliary space."*
3. **Using "We" Instead of "I" in Behavioral STAR Answers**:
   - *Fix*: Highlight your personal technical ownership, decisions, and problem-solving actions.
4. **Unstructured Architectural Rambling**:
   - *Fix*: Follow standard blueprints (Requirements → High-Level Design → Data Model → Deep Dive → Bottlenecks).`,
        suggestedPrompts: [
          'How to structure System Design answers',
          'Explain the STAR method format',
          'Give me DSA interview questions.'
        ]
      };
    }

    if (q.includes('dsa') || q.includes('data structure') || q.includes('algorithm')) {
      return {
        reply: `### Curated DSA Algorithmic Problems 🧩

Here are 3 standard problems frequently tested in coding rounds:

1. **Two Sum (Hash Map Lookup)** — Easy / Medium
   - *Problem*: Find two indices that sum to \`target\` in **O(N) time**.
   - *Core Concept*: Complement mapping with a Hash Map.
2. **LRU Cache (Least Recently Used)** — Hard
   - *Problem*: Implement an in-memory cache with **O(1)** \`get\` and \`put\` operations.
   - *Core Concept*: Hash Map combined with a Doubly Linked List.
3. **Coin Change (Dynamic Programming)** — Medium
   - *Problem*: Compute fewest coins to make up amount $A$.
   - *Core Concept*: Bottom-up state transition: $dp[i] = \\min(dp[i], dp[i - \\text{coin}] + 1)$.

Would you like to open our dedicated Coding Interview sandbox?`,
        suggestedPrompts: [
          'Solve Two Sum in Code Sandbox',
          'Explain LRU Cache pointers',
          'Give me Binary Tree questions'
        ],
        action: {
          type: 'open_coding',
          label: 'Open Coding Sandbox'
        }
      };
    }

    return {
      reply: `### Coaching Advice & Feedback 💡

Regarding your question: **"${query}"**

- **In Tech Interviews**: Interviewers prioritize structured clarity and systematic trade-off analysis over speed.
- **Key Strategy**: State your assumptions clearly, consider scalability boundaries, and structure verbal answers into concise 90-second chunks.

What specific problem or follow-up question would you like to explore next?`,
      suggestedPrompts: SUGGESTED_PROMPTS
    };
  };

  // Copy AI message
  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Clear chat
  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'ai',
        text: `### Chat Cleared! ✨

Ask me any technical question, request interview practice, or pick one of the recommended prompts below:`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedPrompts: SUGGESTED_PROMPTS
      }
    ]);
  };

  // Handle action buttons generated by the coach
  const handleExecuteAction = (action) => {
    if (!action) return;
    if (action.type === 'start_interview') {
      if (onStartNew) onStartNew();
      else if (setActivePage) setActivePage('setup');
    } else if (action.type === 'open_coding') {
      if (setActivePage) setActivePage('coding');
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex flex-col h-[calc(100vh-5rem)] animate-fadeIn">
      {/* =========================================================================
          1. HEADER BAR
         ========================================================================= */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                AI Interview Coach
              </h1>
              <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Online</span>
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Ask questions, practice problem-solving, and sharpen your delivery outside an interview.
            </p>
          </div>
        </div>

        {/* Clear Chat & Quick Practice */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleClearChat}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors cursor-pointer"
            title="Reset Chat History"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onStartNew || (() => setActivePage && setActivePage('setup'))}
            className="hidden sm:flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all hover:scale-105 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Launch Mock</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          2. CHAT STREAM / MESSAGE HISTORY
         ========================================================================= */}
      <div className="flex-1 overflow-y-auto py-5 space-y-5 pr-1 sm:pr-2 scroll-smooth">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center shadow-md ${
                  isUser
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-900 border border-indigo-500/40 text-indigo-400'
                }`}
              >
                {isUser ? (
                  user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt="User"
                      className="w-full h-full rounded-xl object-cover"
                    />
                  ) : (
                    <User className="w-4 h-4" />
                  )
                ) : (
                  <Bot className="w-4 h-4 text-cyan-400" />
                )}
              </div>

              {/* Message Bubble Container */}
              <div
                className={`max-w-[85%] sm:max-w-[78%] space-y-2.5 ${
                  isUser ? 'items-end' : 'items-start'
                }`}
              >
                {/* Bubble */}
                <div
                  className={`p-4 sm:p-5 rounded-3xl text-xs sm:text-sm leading-relaxed shadow-xl relative group ${
                    isUser
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-tr-sm'
                      : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-sm'
                  }`}
                >
                  {/* Message Text with simple markdown header & bullet formatting */}
                  <div className="whitespace-pre-wrap leading-relaxed space-y-2">
                    {msg.text}
                  </div>

                  {/* Bubble Footer: Timestamp & Copy action */}
                  <div
                    className={`flex items-center justify-between pt-2 mt-2 border-t text-[10px] ${
                      isUser
                        ? 'border-indigo-500/40 text-indigo-200'
                        : 'border-slate-800/80 text-slate-500'
                    }`}
                  >
                    <span>{msg.timestamp}</span>

                    {!isUser && (
                      <button
                        type="button"
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className="text-slate-400 hover:text-white flex items-center space-x-1 cursor-pointer transition-colors"
                        title="Copy to clipboard"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Optional Action Button from AI Coach */}
                {msg.action && (
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => handleExecuteAction(msg.action)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 flex items-center space-x-2 transition-all hover:scale-105 cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>{msg.action.label}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Follow-up Suggested Prompts */}
                {msg.suggestedPrompts && msg.suggestedPrompts.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {msg.suggestedPrompts.map((promptText, pIdx) => (
                      <button
                        key={pIdx}
                        type="button"
                        onClick={() => handleSendMessage(promptText)}
                        className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-indigo-300 border border-slate-800 hover:border-indigo-500/30 text-xs font-medium transition-all cursor-pointer flex items-center space-x-1"
                      >
                        <Sparkles className="w-3 h-3 text-indigo-400 shrink-0" />
                        <span>{promptText}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-900 border border-indigo-500/40 text-cyan-400 flex items-center justify-center shrink-0 shadow-md">
              <Bot className="w-4 h-4 animate-pulse" />
            </div>
            <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 rounded-tl-sm flex items-center space-x-2 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              <span className="text-xs text-slate-400 pl-2">AI Coach is thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* =========================================================================
          3. SUGGESTED PROMPTS BAR (QUICK CHIPS)
         ========================================================================= */}
      <div className="py-2 shrink-0">
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs scrollbar-none">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider shrink-0 flex items-center space-x-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Suggested:</span>
          </span>
          {SUGGESTED_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(prompt)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 transition-colors whitespace-nowrap cursor-pointer shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* =========================================================================
          4. INPUT AREA WITH VOICE BUTTON & SEND
         ========================================================================= */}
      <div className="pt-2 border-t border-slate-800 shrink-0">
        {/* Voice Listening Banner */}
        {isListening && (
          <div className="mb-2 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between animate-pulse">
            <div className="flex items-center space-x-2">
              <Mic className="w-4 h-4 text-rose-400 animate-bounce" />
              <span className="font-semibold">Listening... speak into your microphone</span>
            </div>
            <button
              type="button"
              onClick={toggleListening}
              className="text-xs text-rose-400 hover:text-white font-bold px-2 py-0.5 rounded bg-rose-500/20"
            >
              Stop
            </button>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="relative flex items-center gap-2"
        >
          {/* Voice input button */}
          <button
            type="button"
            onClick={toggleListening}
            className={`p-3 rounded-2xl border transition-all cursor-pointer shrink-0 ${
              isListening
                ? 'bg-rose-600 text-white border-rose-500 shadow-lg shadow-rose-600/30 animate-pulse'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border-slate-800'
            }`}
            title={isListening ? 'Stop voice recording' : 'Speak using microphone'}
          >
            {isListening ? <Mic className="w-5 h-5" /> : <Mic className="w-5 h-5 text-indigo-400" />}
          </button>

          {/* Text Input */}
          <div className="relative flex-1">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask your coach anything (e.g. 'Ask me JavaScript questions' or 'Help me improve my introduction')..."
              disabled={isLoading}
              className="w-full px-4 py-3.5 pr-12 rounded-2xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all disabled:opacity-50"
            />

            {/* Send button inside input */}
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="absolute right-2 top-2 bottom-2 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-md shadow-indigo-600/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AICoachPage;
