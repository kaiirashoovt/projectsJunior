const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "src", "updates.jsx");

// Берём список файлов, добавленных в staging
const changedFiles = execSync(
  `git diff --cached --name-only --diff-filter=ACM`,
  { encoding: "utf8" }
).split("\n").filter(Boolean);

if (changedFiles.length === 0) process.exit(0);

const lastChangeMessage = execSync(
  `git log -1 --pretty=%B`,
  { encoding: "utf8" }
).trim();

// Читаем старый файл
let oldReleases = [];
if (fs.existsSync(filePath)) {
  const oldFile = fs.readFileSync(filePath, "utf8");
  oldReleases = JSON.parse(oldFile.match(/export const updates = (.+);/s)[1]);
}

// Создаём новую запись
const today = new Date().toISOString().split("T")[0];
const version = `v1.${oldReleases.length + 1}.0`;

oldReleases.unshift({
  date: today,
  version,
  changes: [lastChangeMessage]
});

// Записываем файл
const content = `export const updates = ${JSON.stringify(oldReleases, null, 2)};`;
fs.writeFileSync(filePath, content);

console.log(`✅ updates.jsx обновлён`);
