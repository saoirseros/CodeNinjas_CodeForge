import React, { useState, useRef, useEffect } from "react";
// If you're fully on Tailwind, you can remove this next line.
// import "./Chatbot.css";

// ===== CHATBOT ICON (SVG, no material icons) =====
const ChatbotIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#a5b4fc"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="drop-shadow"
  >
    <rect x="3" y="11" width="18" height="10" rx="2" />
    <circle cx="8" cy="16" r="1" />
    <circle cx="16" cy="16" r="1" />
    <path d="M12 2v3" />
    <path d="M17 4H7" />
  </svg>
);

// ===== SINGLE CHAT MESSAGE BUBBLE =====
const ChatMessage = ({ chat, isTyping }) => {
  const isBot = chat.role === "model";

  return (
    <div className={`flex mb-3 ${isBot ? "justify-start" : "justify-end"}`}>
      {/* Bot avatar */}
      {isBot && (
        <div className="mt-auto mr-2 flex h-9 w-9 items-center justify-center rounded-full bg-slate-900/80 border border-indigo-400/40 shadow-[0_0_15px_rgba(129,140,248,0.5)]">
          <ChatbotIcon />
        </div>
      )}

      {/* Bubble */}
      <div
        className={`max-w-xs sm:max-w-sm p-3 rounded-2xl shadow-lg transition-all backdrop-blur-md border text-sm
          ${
            isBot
              ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-400/40 shadow-indigo-500/40"
              : "bg-slate-800/70 text-slate-100 border-slate-700"
          }
        `}
      >
        <div className="text-xs opacity-70 mb-1">
          {isBot ? "Campus Connect Bot" : "You"}
        </div>

        <div className="leading-relaxed">
          {isTyping ? (
            <div className="italic opacity-80 text-xs">typing…</div>
          ) : (
            chat.parts.map((part, i) => <span key={i}>{part.text}</span>)
          )}
        </div>
      </div>
    </div>
  );
};

// ===== INPUT FORM =====
const ChatForm = ({ chatHistory, setChatHistory, setIsLoading, setError }) => {
  const inputRef = useRef();
  const [inputValue, setInputValue] = useState("");

  const systemPrompt = `You are an AI-powered virtual assistant for a college web application called Campus Connect.
Your job is to help students navigate and use all features of the app effectively, including Clubs, Lost & Found, and Marketplace.

Rules:
- Always respond in a friendly, professional, and helpful tone.
- Keep answers short, clear, and actionable.
- Maintain context of the conversation for continuous, natural chat.`;

  const getApiResponse = async (history) => {
    setIsLoading(true);
    setError(null);

    const apiKey = "AIzaSyBrLYjrro6IUDBdP6qKrF1t4va4GRvOSRg"; // TODO: replace with your real Gemini API key
    const apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    

    const payload = {
      contents: history,
      tools: [{ google_search: {} }],
      system_instruction: { parts: [{ text: systemPrompt }] },
    };

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const botMessage = data.candidates?.[0]?.content;

      if (botMessage) {
        // Optional: clean "*Events*" prefix if present
        botMessage.parts.forEach((part) => {
          part.text = part.text.replace(/^(\\?Events\?:?\s*)/i, "").trim();
        });

        setChatHistory((prev) => [...prev, botMessage]);
      } else {
        throw new Error("No response from bot.");
      }
    } catch (error) {
      console.error("Failed to fetch API response:", error);
      setError("Sorry, I'm having trouble connecting. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const userMessage = inputValue.trim();
    if (!userMessage) return;

    const newUserMessage = { role: "user", parts: [{ text: userMessage }] };
    const newHistory = [...chatHistory, newUserMessage];
    setChatHistory(newHistory);
    setInputValue("");
    getApiResponse(newHistory);
  };

  return (
    <form className="flex mt-4 space-x-3" onSubmit={handleFormSubmit}>
      <textarea
        ref={inputRef}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Ask Campus Connect anything…"
        className="flex-1 p-3 rounded-xl bg-slate-900/70 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm resize-none min-h-[48px] max-h-32"
        required
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleFormSubmit(e);
          }
        }}
      />
      <button
        type="submit"
        disabled={!inputValue.trim()}
        className="flex items-center justify-center px-5 py-3 rounded-xl font-semibold text-slate-950
          bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400
          shadow-[0_0_18px_rgba(168,85,247,0.7)]
          hover:shadow-[0_0_26px_rgba(236,72,153,0.9)]
          hover:translate-y-[1px] active:translate-y-[2px]
          transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {/* Real arrow icon, no text name */}
        <span className="text-xl leading-none">➤</span>
      </button>
    </form>
  );
};

// ===== MAIN CHATBOT POPUP =====
const Chatbot = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const chatBodyRef = useRef(null);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [chatHistory, isLoading]);

  const toggleChat = () => setIsChatOpen((prev) => !prev);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Neon blobs behind popup when open */}
      {isChatOpen && (
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-24 -right-10 h-44 w-44 bg-indigo-500/30 blur-3xl rounded-full" />
          <div className="absolute bottom-0 -left-10 h-40 w-40 bg-pink-500/30 blur-3xl rounded-full" />
        </div>
      )}

      {isChatOpen ? (
        <div className="relative w-[350px] sm:w-[380px]">
          <div className="rounded-3xl p-[1px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-[0_0_30px_rgba(168,85,247,0.5)]">
            <div className="bg-slate-950/90 backdrop-blur-xl rounded-[1.5rem] p-4 border border-slate-800 flex flex-col h-[480px]">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900/80 border border-indigo-400/40 shadow-[0_0_15px_rgba(129,140,248,0.5)]">
                    <ChatbotIcon />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-transparent bg-gradient-to-r from-indigo-300 to-pink-300 bg-clip-text drop-shadow-[0_0_14px_rgba(129,140,248,0.6)]">
                      Campus Connect Assistant
                    </h2>
                    <p className="text-[11px] text-slate-400">
                      Ask about clubs, marketplace, lost &amp; found, and more.
                    </p>
                  </div>
                </div>

                {/* Close button – simple X, no material icon */}
                <button
                  onClick={toggleChat}
                  className="text-slate-400 hover:text-slate-100 transition text-lg leading-none px-2"
                >
                  ×
                </button>
              </div>

              {/* Messages area */}
              <div
                className="flex-1 overflow-y-auto space-y-2 p-3 bg-slate-900/40 rounded-xl border border-slate-800 backdrop-blur-sm"
                ref={chatBodyRef}
              >
                {/* Welcome message */}
                <div className="flex justify-start mb-3">
                  <div className="max-w-xs sm:max-w-sm p-3 rounded-2xl shadow-lg bg-slate-800/80 text-slate-100 border border-slate-700 text-sm">
                    <div className="text-xs opacity-70 mb-1">
                      Campus Connect Bot
                    </div>
                    <p>
                      Hi there 👋
                      <br />
                      How can I help you navigate{" "}
                      <span className="font-semibold">Campus Connect</span> today?
                    </p>
                  </div>
                </div>

                {chatHistory.map((chat, index) => (
                  <ChatMessage key={index} chat={chat} />
                ))}

                {isLoading && (
                  <ChatMessage
                    chat={{ role: "model", parts: [{ text: "" }] }}
                    isTyping
                  />
                )}

                {error && (
                  <div className="mt-2 text-xs text-red-400 bg-red-950/40 border border-red-700/60 rounded-lg p-2">
                    {error}
                  </div>
                )}
              </div>

              {/* Input */}
              <ChatForm
                chatHistory={chatHistory}
                setChatHistory={setChatHistory}
                setIsLoading={setIsLoading}
                setError={setError}
              />
            </div>
          </div>
        </div>
      ) : (
        // Floating launcher button
        <button
          onClick={toggleChat}
          className="relative flex items-center justify-center h-14 w-14 rounded-full
            bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
            shadow-[0_0_25px_rgba(168,85,247,0.9)]
            hover:shadow-[0_0_35px_rgba(236,72,153,1)]
            hover:scale-105 active:scale-95
            transition-all duration-200"
        >
          <span className="text-2xl">💬</span>
          <span className="absolute -top-2 -right-2 h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,1)]" />
        </button>
      )}
    </div>
  );
};

export default Chatbot;
