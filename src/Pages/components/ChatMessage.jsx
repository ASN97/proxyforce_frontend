// ChatMessage.jsx

const ChatMessage = ({ message, role }) => {
    const isAI = message.sender === "ai"
    const formattedTime = new Date(message.timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  
    return (
      <div className={`w-full ${isAI ? "text-left" : "text-right"}`}>
        <div
          className={`inline-block max-w-[80%] px-4 py-2 rounded-xl shadow-md mb-1 text-sm leading-snug whitespace-pre-line ${
            isAI
              ? "bg-blue-900 text-white rounded-bl-none"
              : "bg-amber-600 text-white rounded-br-none"
          }`}
        >
          {message.content}
        </div>
        <div className="text-xs text-gray-400 px-2">{formattedTime}</div>
      </div>
    )
  }
  
  export default ChatMessage