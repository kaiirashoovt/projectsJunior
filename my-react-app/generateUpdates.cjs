// generateUpdates.cjs
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Получаем сообщение последнего коммита
let commitMessage = "";
try {
  commitMessage = execSync('git log -1 --pretty=%B', { encoding: "utf8" }).trim();
} catch (err) {
  console.error("Не удалось получить сообщение коммита:", err);
}

const filePath = path.join(__dirname, "src", "updates.jsx");

let releases = [];
if (fs.existsSync(filePath)) {
  const oldFile = fs.readFileSync(filePath, "utf8");
  const match = oldFile.match(/export const updates = (.+);/s);
  if (match) releases = JSON.parse(match[1]);
}

// Авто-номер версии v1.0.0 -> v1.0.1 -> v1.0.2 …
const lastVersion = releases[0]?.version || "v1.0.0";
const [major, minor, patch] = lastVersion.slice(1).split(".").map(Number);
const newVersion = `v${major}.${minor}.${patch + 1}`;

const today = new Date().toISOString().split("T")[0];
releases.unshift({
  date: today,
  version: newVersion,
  changes: [commitMessage || "Изменения"],
});

fs.writeFileSync(
  filePath,
  `export const updates = ${JSON.stringify(releases, null, 2)};`,
  "utf8"
);

console.log("✅ src/updates.jsx обновлён");
