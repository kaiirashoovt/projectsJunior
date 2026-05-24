import { useState } from "react";
import {Bot} from "lucide-react"
import { sendChatMessage } from "../shared/api/chat";
export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (input.trim() === "") return;

    const newMessage = { text: input, sender: "You" };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setLoading(true);

    try {
      const data = await sendChatMessage(input);
      setMessages((prev) => [...prev, { text: data.reply, sender: "Bot" }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { text: "Ошибка соединения с сервером", sender: "System" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800/40 rounded-2xl p-6 border border-gray-700">
      {/* Заголовок */}
      <div className="text-center mb-3">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
            <Bot className="w-5 h-5" /> AI Чат
        </h2>        
        <p className="text-xs text-gray-400">Попробуй пообщаться с ботом</p>
      </div>

      {/* Сообщения */}
      <div className="flex-1 overflow-y-auto mb-4 max-h-80 pr-1 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
        {messages.length === 0 ? (
          <p className="text-gray-500 text-center italic">Нет сообщений</p>
        ) : (
          messages.map((msg, i) => (
            <div
              key={i}
              className={`p-3 my-2 rounded-xl max-w-[80%] break-words shadow-sm text-sm ${
                msg.sender === "You"
                  ? "bg-cyan-600 text-white ml-auto rounded-br-none"
                  : msg.sender === "Bot"
                  ? "bg-gray-800 text-cyan-200 mr-auto rounded-bl-none"
                  : "bg-red-800/70 text-red-200 mr-auto rounded-bl-none"
              }`}
            >
              {msg.text}
            </div>
          ))
        )}
      </div>

      {/* Поле ввода */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-gray-800 text-gray-200 border border-gray-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
          placeholder="Введите сообщение..."
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="bg-cyan-600 text-white px-4 py-2 rounded-xl text-sm font-medium shadow hover:bg-cyan-500 transition disabled:opacity-50"
        >
          {loading ? "..." : "➤"}
        </button>
      </div>
    </div>
  );
}
