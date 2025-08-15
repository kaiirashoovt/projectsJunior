const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "src", "updates.jsx");

// Читаем старый файл
let releases = [];
if (fs.existsSync(filePath)) {
  const oldFile = fs.readFileSync(filePath, "utf8");
  const match = oldFile.match(/export const updates = (.+);/s);
  if (match) releases = JSON.parse(match[1]);
}

// Авто-версия
const lastVersion = releases[0]?.version || "v0.0.0";
const [major, minor, patch] = lastVersion.slice(1).split(".").map(Number);
const newVersion = `v${major}.${minor}.${patch + 1}`;

// В pre-commit мы можем получить сообщение коммита через HUSKY_GIT_PARAMS
const commitMsgFile = process.env.HUSKY_GIT_PARAMS; // путь к файлу с коммит-мессаджем
let commitMessage = "Изменения";
if (commitMsgFile && fs.existsSync(commitMsgFile)) {
  commitMessage = fs.readFileSync(commitMsgFile, "utf8").trim();
}

// Новая запись
const today = new Date().toISOString().split("T")[0];
releases.unshift({
  date: today,
  version: newVersion,
  changes: [commitMessage],
});

// Записываем файл
fs.writeFileSync(filePath, `export const updates = ${JSON.stringify(releases, null, 2)};`, "utf8");
console.log("✅ updates.jsx обновлён");
