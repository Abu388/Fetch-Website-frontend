"use client";

import React, { useState, useEffect, useRef } from "react";

interface AIMessage {
  id: string;
  content: string;
}

export default function AIChat() {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      content: `You: ${input}`,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    const aiMessageId = Date.now().toString() + "-ai";
    setMessages((prev) => [
      ...prev,
      { id: aiMessageId, content: "" }, // empty string, will fill as we stream
    ]);

    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: "Bearer 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",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-r1:free",
          messages: [{ role: "user", content: input }],
          stream: true,
        }),
      });

      const reader = res.body?.getReader();
      const decoder = new TextDecoder("utf-8");

      let partial = "";

      while (reader) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line);

        for (const line of lines) {
          if (line === "data: [DONE]") continue;
          if (line.startsWith("data: ")) {
            const json = JSON.parse(line.replace("data: ", ""));
            const token = json.choices?.[0]?.delta?.content || "";
            partial += token;

            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === aiMessageId ? { ...msg, content: partial } : msg
              )
            );
          }
        }
      }
    } catch (err) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMessageId
            ? { ...msg, content: "Error fetching AI response." }
            : msg
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "80vh",
        backgroundColor: "#f5f5f5",
        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
        border: "1px solid #2196f3",
        padding: 20,
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 20, color: "#333" }}>
        AI Chat
      </h2>

      {/* Messages container */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          borderRadius: 10,
          backgroundColor: "#fff",
          padding: 15,
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          marginBottom: 10,
        }}
      >
        <h1>what can i help you today?</h1>
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              marginBottom: 12,
              padding: 10,
              borderRadius: 8,
              backgroundColor: msg.content.startsWith("You:") ? "#f0f0f0" : "#e8f5e9",
              borderLeft: msg.content.startsWith("You:") ? "none" : "3px solid #4caf50",
              whiteSpace: "pre-wrap",
            }}
          >
            {msg.content || <i>AI is typing...</i>}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input at the bottom */}
      <div style={{ display: "flex", gap: 10 }}>
        <input
          type="text"
          value={input}
          placeholder="Ask something..."
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          style={{
            flex: 1,
            padding: 10,
            borderRadius: 25,
            border: "1px solid #ccc",
            outline: "none",
            fontSize: 16,
          }}
        />
        <button
          onClick={handleSend}
          disabled={loading}
          style={{
            background: "#2196f3",
            color: "#fff",
            border: "none",
            padding: "10px 20px",
            borderRadius: 25,
            cursor: "pointer",
            fontSize: 16,
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}
