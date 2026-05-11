import { CheckSquare } from "lucide-react";
import { useState } from "react";
import Widget from "./Widget";

export default function TasksWidget() {
  const [tasks, setTasks] = useState([
    { id: 1, text: "Закончить отчёт", done: false },
    { id: 2, text: "Проверить почту", done: true },
    { id: 3, text: "Созвон с клиентом", done: false },
  ]);

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, done: !t.done } : t
      )
    );
  };

  return (
    <Widget icon={CheckSquare} title="Задачи">
      <ul className="space-y-2">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="flex items-center gap-2 bg-gray-700/30 p-2 rounded-lg"
          >
            <input
              type="checkbox"
              checked={task.done}
              onChange={() => toggleTask(task.id)}
              className="accent-blue-500"
            />
            <span className={task.done ? "line-through text-gray-500" : "text-white"}>
              {task.text}
            </span>
          </li>
        ))}
      </ul>
    </Widget>
  );
}
