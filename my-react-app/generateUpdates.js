const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const filePath = path.join(__dirname, "src", "updates.jsx");

// Получаем сообщение будущего коммита (из staging)
const stagedMessage = execSync(
  'git diff --cached --name-only --diff-filter=ACM | findstr /r /v "^$"',
  { encoding: "utf8" }
);

// Если нет изменений — выходим
if (!stagedMessage.trim()) process.exit(0);

// Читаем старый файл
let releases = [];
if (fs.existsSync(filePath)) {
  const oldFile = fs.readFileSync(filePath, "utf8");
  const match = oldFile.match(/export const updates = (.+);/s);
  if (match) releases = JSON.parse(match[1]);
}

// Новая версия
const lastVersion = releases[0]?.version || "v0.0.0";
const [major, minor, patch] = lastVersion.slice(1).split(".").map(Number);
const newVersion = `v${major}.${minor}.${patch + 1}`;

// Сообщение последнего staged коммита
const commitMessage = execSync('git log -1 --pretty=%B', { encoding: "utf8" }).trim();

// Новая запись
const today = new Date().toISOString().split("T")[0];
releases.unshift({
  date: today,
  version: newVersion,
  changes: [commitMessage || "Изменения"]
});

// Записываем файл
fs.writeFileSync(filePath, `export const updates = ${JSON.stringify(releases, null, 2)};`, "utf8");
console.log("✅ updates.jsx обновлён");
