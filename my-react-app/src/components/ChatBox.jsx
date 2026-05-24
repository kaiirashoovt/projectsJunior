import { useState } from "react";
import { Bot, Loader2, Send } from "lucide-react";
import { sendChatMessage } from "../shared/api/chat";

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async (event) => {
    event?.preventDefault();
    const message = input.trim();
    if (!message || loading) return;

    setMessages((prev) => [...prev, { text: message, sender: "user" }]);
    setInput("");
    setLoading(true);

    try {
      const data = await sendChatMessage(message);
      setMessages((prev) => [...prev, { text: data.reply, sender: "bot" }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { text: "Не удалось связаться с сервером.", sender: "system" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex h-full min-h-[28rem] flex-col rounded-lg border border-white/10 bg-white/[0.04] p-5">
      <header className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-cyan-200" />
          <h2 className="text-lg font-semibold text-white">AI чат</h2>
        </div>
        <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs text-cyan-100">
          beta
        </span>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
        {messages.length === 0 ? (
          <div className="flex h-full min-h-48 items-center justify-center text-center text-sm text-slate-500">
            Напиши вопрос, и ответ появится здесь.
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`max-w-[86%] rounded-lg px-3 py-2 text-sm leading-6 ${
                  message.sender === "user"
                    ? "ml-auto bg-cyan-400 text-slate-950"
                    : message.sender === "bot"
                      ? "bg-black/25 text-cyan-100"
                      : "bg-red-500/15 text-red-100"
                }`}
              >
                {message.text}
              </div>
            ))}
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="mt-4 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          className="min-w-0 flex-1 rounded-lg border border-white/10 bg-black/20 px-4 py-2 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-300/50"
          placeholder="Введите сообщение"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-400 text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Отправить сообщение"
          title="Отправить"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </button>
      </form>
    </section>
  );
}
