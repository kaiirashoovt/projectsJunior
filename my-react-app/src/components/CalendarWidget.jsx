import { CalendarDays } from "lucide-react";
import Widget from "./Widget";

export default function CalendarWidget() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.toLocaleString("ru-RU", { month: "long" });

  // считаем дни месяца
  const daysInMonth = new Date(year, today.getMonth() + 1, 0).getDate();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <Widget icon={CalendarDays} title="Календарь">
      <p className="text-gray-300 mb-3 capitalize">{month} {year}</p>
      <div className="grid grid-cols-7 gap-2 text-center text-sm">
        {daysArray.map((day) => (
          <div
            key={day}
            className={`p-2 rounded-lg ${
              day === today.getDate()
                ? "bg-blue-600 text-white"
                : "bg-gray-700/30 text-gray-300"
            }`}
          >
            {day}
          </div>
        ))}
      </div>
    </Widget>
  );
}
