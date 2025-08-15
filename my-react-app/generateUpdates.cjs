// generateUpdates.cjs
const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "src/updates.jsx");

// Получаем текст коммита из аргументов
const commitMessage = process.argv[2] || "Изменения";

// Читаем существующий файл, если есть
let updates = [];
if (fs.existsSync(filePath)) {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    updates = JSON.parse(content.replace(/export const updates = /, "").replace(/;$/, ""));
  } catch (e) {
    console.log("⚠️ Не удалось прочитать старый updates.jsx, создаём новый");
  }
}

// Определяем новую версию
let lastVersion = updates[0]?.version || "v0.0.0";
let [major, minor, patch] = lastVersion.slice(1).split(".").map(Number);
patch += 1;
const newVersion = `v${major}.${minor}.${patch}`;

// Добавляем новый блок в начало массива
updates.unshift({
  date: new Date().toISOString().slice(0, 10),
  version: newVersion,
  changes: [commitMessage]
});

// Сохраняем обратно
const content = `export const updates = ${JSON.stringify(updates, null, 2)};`;
fs.writeFileSync(filePath, content);
console.log(`✅ src/updates.jsx обновлён (версия ${newVersion})`);
