import { CalendarDays } from "lucide-react";
import Widget from "./Widget";

const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

export default function CalendarWidget() {
  const today = new Date();
  const year = today.getFullYear();
  const currentMonth = today.getMonth();
  const month = today.toLocaleString("ru-RU", { month: "long" });
  const daysInMonth = new Date(year, currentMonth + 1, 0).getDate();
  const firstDay = new Date(year, currentMonth, 1).getDay();
  const startOffset = firstDay === 0 ? 6 : firstDay - 1;
  const cells = [
    ...Array.from({ length: startOffset }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];

  return (
    <Widget icon={CalendarDays} title="Календарь">
      <p className="mb-4 capitalize text-slate-300">
        {month} {year}
      </p>
      <div className="grid grid-cols-7 gap-2 text-center text-xs">
        {weekDays.map((day) => (
          <span key={day} className="py-1 text-slate-500">
            {day}
          </span>
        ))}
        {cells.map((day, index) => (
          <span
            key={`${day || "empty"}-${index}`}
            className={`flex aspect-square items-center justify-center rounded-lg ${
              day === today.getDate()
                ? "bg-cyan-400 text-slate-950"
                : day
                  ? "bg-white/[0.04] text-slate-300"
                  : "bg-transparent"
            }`}
          >
            {day}
          </span>
        ))}
      </div>
    </Widget>
  );
}
