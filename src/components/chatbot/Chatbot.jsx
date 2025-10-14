import React, { useState, useRef, useEffect } from "react";
import "./Chatbot.css";

// ===== CHATBOT ICON =====
const ChatbotIcon = () => (
  <span className="material-symbols-rounded chatbot-icon">smart_toy</span>
);

// ===== CHAT MESSAGE =====
const ChatMessage = ({ chat, isTyping }) => (
  <div
    className={`chatbot-message ${
      chat.role === "model" ? "chatbot-bot-message" : "chatbot-user-message"
    }`}
  >
    {chat.role === "model" && <ChatbotIcon />}
    <div className="chatbot-message-text">
      {isTyping ? (
        <div className="chatbot-typing-indicator">typing...</div>
      ) : (
        chat.parts.map((part, i) => <span key={i}>{part.text}</span>)
      )}
    </div>
  </div>
);

// ===== CHAT FORM =====
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

    const apiKey = "AIzaSyDhXKXT1my5WYvx5tx-fozEgrjtP8VUJC8"; // <-- Replace with your Gemini API key
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

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
        // Remove "*Events*" if present
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
    <form className="chatbot-chat-form" onSubmit={handleFormSubmit}>
      <textarea
        ref={inputRef}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Enter a message..."
        className="chatbot-message-input"
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
        className="material-symbols-rounded"
        disabled={!inputValue.trim()}
      >
        arrow_upward
      </button>
    </form>
  );
};

// ===== MAIN CHATBOT COMPONENT =====
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

  const toggleChat = () => setIsChatOpen(!isChatOpen);

  return (
    <div className="chatbot-wrapper">
      {isChatOpen ? (
        <div className="chatbot-container">
          <div className="chatbot-popup">
            <div className="chatbot-header">
              <div className="chatbot-header-info">
                <ChatbotIcon />
                <h2 className="chatbot-logo-text">Campus Connect</h2>
              </div>
              <button onClick={toggleChat} className="material-symbols-rounded">
                close
              </button>
            </div>

            <div className="chatbot-body" ref={chatBodyRef}>
              <div className="chatbot-message chatbot-bot-message">
                <ChatbotIcon />
                <p className="chatbot-message-text">
                  Hi there! 👋<br />
                  How can I help you navigate Campus Connect today?
                </p>
              </div>

              {chatHistory.map((chat, index) => (
                <ChatMessage key={index} chat={chat} />
              ))}

              {isLoading && <ChatMessage chat={{ role: "model", parts: [{ text: "" }] }} isTyping />}
              {error && <div className="chatbot-error-message">{error}</div>}
            </div>

            <div className="chatbot-footer">
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
        <div className="chatbot-launcher" onClick={toggleChat}>
          <span className="material-symbols-rounded" style={{ fontSize: "32px" }}>
            chat
          </span>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
