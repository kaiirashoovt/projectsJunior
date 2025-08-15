// generateUpdates.cjs
import fs from "fs";
import path from "path";

const updatesFile = path.resolve("src/updates.jsx");

// Получаем сообщение коммита из аргумента
const commitMessage = process.argv[2] || "Без сообщения";

// Читаем старый файл, если есть
let oldData = [];
if (fs.existsSync(updatesFile)) {
  const content = fs.readFileSync(updatesFile, "utf-8");
  try {
    oldData = JSON.parse(content.replace(/export const updates = /, "").replace(/;/, ""));
  } catch {}
}

// Создаём новый блок
const newBlock = {
  date: new Date().toISOString().split("T")[0],
  version: `v1.0.${oldData.length + 1}`,
  changes: [commitMessage]
};

// Добавляем в начало
const newData = [newBlock, ...oldData];

// Записываем обратно
const content = `export const updates = ${JSON.stringify(newData, null, 2)};`;
fs.writeFileSync(updatesFile, content, "utf-8");

console.log("✅ src/updates.jsx обновлён");
