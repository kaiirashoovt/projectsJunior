// generateUpdates.cjs
const fs = require("fs");
const path = require("path");

const updatesFile = path.join(__dirname, "src", "updates.jsx");

// Берём сообщение коммита из аргументов
const commitMessage = process.argv[2] || "Обновления";

// Читаем старые обновления
let oldUpdates = [];
if (fs.existsSync(updatesFile)) {
  const content = fs.readFileSync(updatesFile, "utf8");
  try {
    oldUpdates = eval(content.match(/export const updates = (\[.*\]);/s)[1]);
  } catch {}
}

// Авто-генерация версии
const lastVersion = oldUpdates[0]?.version || "v1.0.0";
const [major, minor, patch] = lastVersion.slice(1).split(".").map(Number);
const newVersion = `v${major}.${minor}.${patch + 1}`;

const today = new Date().toISOString().split("T")[0];

const newUpdate = {
  date: today,
  version: newVersion,
  changes: [commitMessage],
};

// Добавляем сверху
const newUpdates = [newUpdate, ...oldUpdates];

const fileContent = `export const updates = ${JSON.stringify(newUpdates, null, 2)};`;

// Сохраняем с LF
fs.writeFileSync(updatesFile, fileContent.replace(/\r\n/g, "\n"));

console.log("✅ src/updates.jsx обновлён");
