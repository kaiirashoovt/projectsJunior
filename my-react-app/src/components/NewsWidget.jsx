import { Newspaper } from "lucide-react";
import Widget from "./Widget";

const news = [
  { id: 1, title: "Обновление системы 1.2", date: "20.08.2025" },
  { id: 2, title: "Добавлен новый функционал", date: "15.08.2025" },
  { id: 3, title: "Исправлены ошибки в профиле", date: "10.08.2025" },
];

export default function NewsWidget() {
  return (
    <Widget icon={Newspaper} title="Новости">
      <ul className="space-y-3">
        {news.map((item) => (
          <li
            key={item.id}
            className="bg-gray-700/30 p-3 rounded-lg hover:bg-gray-700/50 transition"
          >
            <p className="font-medium text-white">{item.title}</p>
            <span className="text-sm text-gray-400">{item.date}</span>
          </li>
        ))}
      </ul>
    </Widget>
  );
}
