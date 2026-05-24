import { Newspaper } from "lucide-react";
import Widget from "./Widget";

const news = [
  {
    id: 1,
    title: "Главная страница стала рабочим hub",
    date: "Сегодня",
    tag: "UI",
  },
  {
    id: 2,
    title: "API-запросы вынесены в общий клиент",
    date: "Недавно",
    tag: "Frontend",
  },
  {
    id: 3,
    title: "Трекинг посещений работает через /api/track",
    date: "Недавно",
    tag: "Backend",
  },
];

export default function NewsWidget() {
  return (
    <Widget icon={Newspaper} title="Новости">
      <ul className="divide-y divide-white/10">
        {news.map((item) => (
          <li key={item.id} className="py-3 first:pt-0 last:pb-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-medium text-white">{item.title}</p>
                <span className="mt-1 block text-sm text-slate-500">{item.date}</span>
              </div>
              <span className="shrink-0 rounded-full border border-white/10 px-2.5 py-1 text-xs text-slate-300">
                {item.tag}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </Widget>
  );
}
