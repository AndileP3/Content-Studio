import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import "./ChatArea.css";

const MODES = [
  { id: "blog",    icon: "📝", label: "Blog" },
  { id: "product", icon: "🛍️", label: "Product" },
  { id: "social",  icon: "📱", label: "Social" },
  { id: "email",   icon: "✉️", label: "Email" },
  { id: "code",    icon: "💻", label: "Code" },
  { id: "image",   icon: "🖼️", label: "Vision" },
  { id: "chat",    icon: "💬", label: "Chat" },
];

const SYSTEM_PROMPTS = {
  blog:    "You are an expert blog writer. Write engaging, SEO-optimised blog posts with a compelling headline, clear sections with subheadings, and a strong conclusion. Use Markdown formatting.",
  product: "You are a conversion-focused copywriter. Write compelling product descriptions that highlight key benefits and unique selling points. Use bullet points and persuasive language. Use Markdown.",
  social:  "You are a social media expert. Write punchy, engaging captions with relevant hashtags and emojis. Provide variations for Instagram, Twitter/X, and LinkedIn.",
  email:   "You are an email marketing specialist. Write professional emails with strong subject lines, clear body copy, and a specific CTA. Format: Subject, Greeting, Body, CTA, Sign-off.",
  code:    "You are a senior software engineer. Write clean, well-commented, production-ready code. Explain what the code does and include usage examples. Use proper code blocks with language tags.",
  image:   "You are a visual analysis expert. Analyse the provided image in detail — describe objects, colors, composition, text, and any relevant context or insights.",
  chat:    "You are a knowledgeable AI assistant specialising in content creation, marketing, and digital strategy. Be clear, concise, and helpful.",
};

const QUICK_PROMPTS = {
  blog:    ["Write a blog post about the future of AI in content marketing", "Top 10 productivity tips for remote workers in 2025"],
  product: ["Write a description for wireless noise-canceling headphones", "Product copy for a premium skincare serum with vitamin C"],
  social:  ["Instagram captions for a new coffee shop opening", "5 LinkedIn posts for a B2B software launch"],
  email:   ["Welcome email for new SaaS subscribers", "Cold outreach email for a digital marketing agency"],
  code:    ["React custom hook for API calls with loading and error states", "Python FastAPI endpoint with JWT authentication"],
  image:   ["Upload an image and I'll describe it in detail", "Attach a screenshot and I'll analyse the UI/UX"],
  chat:    ["What are the best AI content tools in 2025?", "How do I grow a content marketing strategy from scratch?"],
};

export default function ChatArea() {
  const [isOpen, setIsOpen]       = useState(false);
  const [mode, setMode]           = useState("blog");
  const [messages, setMessages]   = useState([]);
  const [input, setInput]         = useState("");
  const [images, setImages]       = useState([]);   // [{dataUrl, base64, type}]
  const [loading, setLoading]     = useState(false);
  const [isListening, setIsListening] = useState(false);

  const bottomRef   = useRef(null);
  const textareaRef = useRef(null);
  const fileRef     = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Reset messages when mode changes
  const handleModeChange = (id) => {
    setMode(id);
    setMessages([]);
    setImages([]);
    setInput("");
  };

  // ── Voice input ──
  const handleVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return alert("Voice recognition is not supported in this browser.");
    const rec = new SR();
    rec.lang = "en-US";
    rec.start();
    setIsListening(true);
    rec.onresult = (e) => {
      const transcript = Array.from(e.results).map(r => r[0].transcript).join("");
      setInput((p) => (p + " " + transcript).trim());
    };
    rec.onend  = () => setIsListening(false);
    rec.onerror = () => setIsListening(false);
  };

  // ── Image attach ──
  const handleImageAttach = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target.result;
        const base64  = dataUrl.split(",")[1];
        setImages((prev) => [...prev, { dataUrl, base64, type: file.type }]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  // ── Call Groq API ──
  const getAIResponse = async (message, history, attachedImages) => {
    const apiKey = process.env.REACT_APP_GROQ_KEY;
    if (!apiKey) return "⚠️ No API key found. Please add REACT_APP_GROQ_KEY to your .env file.";

    try {
      // Build conversation history
      const historyMsgs = history.map((m) => ({
        role: m.sender === "user" ? "user" : "assistant",
        content: m.text,
      }));

      // Build current user message (with images if present)
      let userContent;
      if (attachedImages && attachedImages.length > 0) {
        userContent = [
          ...attachedImages.map((img) => ({
            type: "image_url",
            image_url: { url: `data:${img.type};base64,${img.base64}` },
          })),
          { type: "text", text: message || "Please analyse this image." },
        ];
      } else {
        userContent = message;
      }

      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "meta-llama/llama-4-scout-17b-16e-instruct",
          messages: [
            { role: "system", content: SYSTEM_PROMPTS[mode] },
            ...historyMsgs,
            { role: "user", content: userContent },
          ],
          temperature: 0.75,
          max_tokens: 1024,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || `HTTP ${res.status}`);
      return data.choices?.[0]?.message?.content || "No response received.";
    } catch (err) {
      return `⚠️ **Error:** ${err.message}`;
    }
  };

  // ── Send message ──
  const handleSend = async (text) => {
    const msg = (text || input).trim();
    if ((!msg && images.length === 0) || loading) return;

    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    const capturedImages = [...images];
    setImages([]);

    const userMsg = {
      sender: "user",
      text: msg,
      images: capturedImages.map((i) => i.dataUrl),
      id: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    setMessages((prev) => [...prev, { sender: "bot", text: "...", loading: true, id: Date.now() + 1 }]);

    const history = messages.filter((m) => !m.loading);
    const reply = await getAIResponse(msg, history, capturedImages);

    setMessages((prev) => [
      ...prev.filter((m) => !m.loading),
      { sender: "bot", text: reply, id: Date.now() + 2 },
    ]);
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const currentMode = MODES.find((m) => m.id === mode);

  return (
    <>
      {/* FAB */}
      <button
        className={`chat-fab ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen((o) => !o)}
        aria-label="Toggle chat"
      >
        {isOpen ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
        {!isOpen && <span className="fab-pulse" />}
      </button>

      {/* Chat window */}
      <div className={`chat-window ${isOpen ? "visible" : ""}`}>

        {/* Header */}
        <div className="chat-header">
          <div className="chat-header-info">
            <div className="chat-avatar">✦</div>
            <div>
              <div className="chat-header-name">AI Content Studio</div>
              <div className="chat-header-status">
                <span className="online-dot" />
                {currentMode?.icon} {currentMode?.label} · Llama 4
              </div>
            </div>
          </div>
          <button className="chat-close" onClick={() => setIsOpen(false)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Mode tabs */}
        <div className="mode-tabs">
          {MODES.map((m) => (
            <button
              key={m.id}
              className={`mode-tab ${mode === m.id ? "active" : ""}`}
              onClick={() => handleModeChange(m.id)}
            >
              <span className="mode-tab-icon">{m.icon}</span>
              {m.label}
            </button>
          ))}
        </div>

        {/* Messages */}
        <div className="chat-messages">
          {messages.length === 0 && (
            <div className="chat-welcome">
              <div className="welcome-emoji">{currentMode?.icon}</div>
              <h3>Generate {currentMode?.label}</h3>
              <p>Type a prompt or pick a quick start below.</p>
              <div className="quick-prompts">
                {(QUICK_PROMPTS[mode] || []).map((p) => (
                  <button key={p} className="quick-prompt" onClick={() => handleSend(p)}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div key={msg.id} className={`msg-row ${msg.sender}`}>
              {msg.sender === "bot" && <div className="msg-avatar">✦</div>}
              <div className={`msg-bubble ${msg.loading ? "loading-bubble" : ""}`}>
                {/* Show attached images */}
                {msg.images && msg.images.map((src, i) => (
                  <img key={i} src={src} alt="" className="msg-image" />
                ))}
                {msg.loading ? (
                  <div className="typing-dots"><span /><span /><span /></div>
                ) : msg.sender === "bot" ? (
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                ) : (
                  msg.text
                )}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Image preview */}
        {images.length > 0 && (
          <div className="img-preview-strip">
            {images.map((img, i) => (
              <div key={i} className="img-preview-item">
                <img src={img.dataUrl} alt="" />
                <button className="img-preview-remove" onClick={() => setImages((p) => p.filter((_, idx) => idx !== i))}>✕</button>
              </div>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="chat-input-area">
          <div className="chat-input-box">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = Math.min(e.target.scrollHeight, 130) + "px";
              }}
              onKeyDown={handleKeyDown}
              placeholder={`Generate ${currentMode?.label?.toLowerCase()} content…`}
              rows={1}
              disabled={loading}
            />

            <div className="chat-buttons">
              {/* Image attach */}
              <button className="attach-btn" onClick={() => fileRef.current?.click()} title="Attach image">
                🖼️
              </button>
              <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: "none" }} onChange={handleImageAttach} />

              {/* Mic */}
              <button
                className={`mic-btn ${isListening ? "listening" : ""}`}
                onClick={handleVoice}
                title="Voice input"
              >
                {isListening && <span className="mic-ring" />}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" y1="19" x2="12" y2="23" />
                  <line x1="8" y1="23" x2="16" y2="23" />
                </svg>
              </button>

              {/* Send */}
              <button
                className="send-btn"
                onClick={() => handleSend()}
                disabled={(!input.trim() && images.length === 0) || loading}
                title="Send"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
