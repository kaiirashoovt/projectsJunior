import { CheckSquare } from "lucide-react";
import { useState } from "react";
import Widget from "./Widget";

export default function TasksWidget() {
  const [tasks, setTasks] = useState([
    { id: 1, text: "Проверить профиль и авторизацию", done: true },
    { id: 2, text: "Причесать главную страницу", done: false },
    { id: 3, text: "Добавить миграции backend", done: false },
  ]);

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, done: !task.done } : task))
    );
  };

  return (
    <Widget icon={CheckSquare} title="Задачи">
      <ul className="space-y-3">
        {tasks.map((task) => (
          <li key={task.id} className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={task.done}
              onChange={() => toggleTask(task.id)}
              className="mt-1 h-4 w-4 accent-cyan-400"
            />
            <span
              className={`text-sm leading-6 ${
                task.done ? "text-slate-500 line-through" : "text-slate-200"
              }`}
            >
              {task.text}
            </span>
          </li>
        ))}
      </ul>
    </Widget>
  );
}
