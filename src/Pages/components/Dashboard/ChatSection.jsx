import { useState, useEffect, useRef } from "react";
import ChatMessage from "../ChatMessage";
import { Send } from "lucide-react";

const ChatSection = ({ projectId, role, tier, initialMessages }) => {
  const [messages, setMessages] = useState(initialMessages || []);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsSending(true);

    try {
      const res = await fetch(`http://localhost:8000/api/projects/${projectId}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.content, role, tier }),
      });

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          ...data,
          timestamp: new Date(data.timestamp),
        },
      ]);
    } catch (err) {
      console.error("Chat error:", err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Chat area */}
      <div ref={chatRef} className="flex-1 overflow-y-auto space-y-4 pr-2">
        {messages.length === 0 ? (
          <div className="h-full flex justify-center items-center">
            <img
              src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExcDlwNm9hbDhjZWY3aXNhcHd6YndqMXNybjhqNXZ2NG02NTVldmV4aCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/2md3hYn4d0LZUtdc9x/giphy.gif"
              alt="Animated assistant"
              className="w-64 h-64 object-contain opacity-80"
            />
          </div>
        ) : (
          messages.map((m) => (
            <ChatMessage key={m.id} message={m} role={role} />
          ))
        )}
      </div>

      {/* Input area */}
      <div className="border-t border-amber-500/20 pt-2 mt-2">
        <div className="flex items-center gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
            placeholder="Ask your assistant..."
            className="flex-1 resize-none rounded-lg bg-[#0B0B19] border border-amber-500/30 text-white px-3 py-2 text-sm"
          />
          <button
            disabled={!input.trim() || isSending}
            onClick={sendMessage}
            className="bg-gradient-to-r from-amber-500 to-amber-700 hover:to-amber-800 text-white px-4 py-2 rounded-lg"
          >
            <Send size={16} />
          </button>
        </div>
        <p className="text-xs text-center text-amber-500/60 mt-1">
          Role: {role} • Tier: {tier}
        </p>
      </div>
    </div>
  );
};

export default ChatSection;
