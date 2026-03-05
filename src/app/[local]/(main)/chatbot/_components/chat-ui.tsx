"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sendMessageAction } from "@/lib/actions/chat.action";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
};

export default function ChatUI() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const reply = await sendMessageAction(trimmed);

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: reply ?? "No response, try again.",
        createdAt: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "Something went wrong. Please try again.",
          createdAt: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] max-w-2xl mx-auto border rounded-xl  shadow-sm">
      {/* Header */}
      <div className="px-6 py-4 border-b">
        <h2 className="text-lg font-semibold">AI Assistant</h2>
        <p className="text-sm text-gray-500">Ask anything. Responses support markdown.</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 ">
        {messages.length === 0 && !isLoading && (
          <div className="h-full flex items-center justify-center text-gray-400 text-sm">Start the conversation.</div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-end gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "assistant" && (
              <div className="w-8 h-8 rounded-full bg-blue-600  flex items-center justify-center text-xs font-medium">AI</div>
            )}

            <div className="max-w-xs">
              <div
                className={`px-4 py-2 rounded-2xl break-words text-sm ${
                  msg.role === "user" ? "border  rounded-br-sm" : " border rounded-bl-sm"
                }`}>
                {msg.role === "assistant" ? <ReactMarkdown>{msg.content}</ReactMarkdown> : <ReactMarkdown>{msg.content}</ReactMarkdown>}
              </div>
              <div className="text-[11px] text-gray-400 mt-1">{msg.createdAt.toLocaleTimeString()}</div>
            </div>

            {msg.role === "user" && (
              <div className="w-8 h-8 rounded-full bg-gray-400  flex items-center justify-center text-xs font-medium">U</div>
            )}
          </div>
        ))}

        {/* Typing Indicator */}
        {isLoading && (
          <div className="flex items-end gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600  flex items-center justify-center text-xs font-medium">AI</div>
            <div className="px-4 py-2 rounded-2xl  border text-sm animate-pulse">AI is typing...</div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t  flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Type a message..."
        />
        <Button onClick={handleSend} disabled={isLoading || !input.trim()}>
          Send
        </Button>
      </div>
    </div>
  );
}
